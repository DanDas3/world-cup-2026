import type { Match, GroupStanding, KnockoutSlot, KnockoutMatchState, ThirdPlaceRank, Language } from '../types'
import { TEAMS, GROUPS_CONFIG, STADIUMS, TEAM_NAMES } from '../data/constants'

export function getTeamName(code: string, lang: Language): string {
  return TEAM_NAMES[code]?.[lang] || TEAMS[code]?.name || code
}

export function simulateMatchScore(homeRank: number, awayRank: number): [number, number] {
  const rankDiff = awayRank - homeRank
  let scaleHome = Math.max(0.4, Math.min(3.8, 1.4 + rankDiff * 0.015))
  let scaleAway = Math.max(0.4, Math.min(3.8, 1.4 - rankDiff * 0.015))

  const simulatePoisson = (lambda: number): number => {
    let L = Math.exp(-lambda), k = 0, p = 1.0
    do { k++; p *= Math.random() } while (p > L)
    return Math.max(0, k - 1)
  }

  let homeScore = simulatePoisson(scaleHome)
  let awayScore = simulatePoisson(scaleAway)
  if (homeScore > 8) homeScore = Math.floor(Math.random() * 3) + 4
  if (awayScore > 8) awayScore = Math.floor(Math.random() * 3) + 4
  return [homeScore, awayScore]
}

export function generateAllMatches(): Record<string, Match> {
  const matches: Record<string, Match> = {}
  const dates = [
    '11/06/2026', '12/06/2026', '13/06/2026', '14/06/2026', '15/06/2026',
    '16/06/2026', '17/06/2026', '18/06/2026', '19/06/2026', '20/06/2026',
    '21/06/2026', '22/06/2026', '23/06/2026', '24/06/2026', '25/06/2026',
    '26/06/2026', '27/06/2026',
  ]
  const times = ['13:00', '16:00', '19:00', '22:00']
  const pairings: [number, number, number][] = [
    [0, 1, 0], [2, 3, 0], [0, 2, 1], [1, 3, 1], [0, 3, 2], [1, 2, 2],
  ]

  Object.entries(GROUPS_CONFIG).forEach(([groupLetter, teams], groupIdx) => {
    pairings.forEach(([t1Idx, t2Idx, roundIdx], mIdx) => {
      const id = `G${groupLetter}-${mIdx + 1}`
      const stadiumObj = STADIUMS[(groupIdx * 3 + mIdx) % STADIUMS.length]
      let dateIdx = roundIdx === 0 ? groupIdx % 5 : roundIdx === 1 ? 5 + groupIdx % 5 : 10 + groupIdx % 7
      matches[id] = {
        id, group: groupLetter,
        home: teams[t1Idx], away: teams[t2Idx],
        homeScore: '', awayScore: '',
        date: dates[dateIdx] || '20/06/2026',
        time: times[(groupIdx + mIdx) % times.length],
        stadium: stadiumObj.stadium,
        stadiumCity: stadiumObj.city,
      }
    })
  })
  return matches
}

export function calculateAllStandings(matchesObj: Record<string, Match>): Record<string, GroupStanding[]> {
  const standings: Record<string, GroupStanding[]> = {}
  Object.keys(GROUPS_CONFIG).forEach(groupLetter => {
    const initial: GroupStanding[] = GROUPS_CONFIG[groupLetter].map(code => ({
      code, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0, pts: 0,
    }))
    Object.values(matchesObj)
      .filter(m => m.group === groupLetter)
      .forEach(m => {
        if (m.homeScore !== '' && m.awayScore !== '') {
          const h = initial.find(t => t.code === m.home)
          const a = initial.find(t => t.code === m.away)
          if (h && a) {
            const hSc = typeof m.homeScore === 'number' ? m.homeScore : 0
            const aSc = typeof m.awayScore === 'number' ? m.awayScore : 0
            h.j++; a.j++
            h.gp += hSc; h.gc += aSc; a.gp += aSc; a.gc += hSc
            if (hSc > aSc) { h.v++; h.pts += 3; a.d++ }
            else if (hSc < aSc) { a.v++; a.pts += 3; h.d++ }
            else { h.e++; a.e++; h.pts++; a.pts++ }
            h.sg = h.gp - h.gc; a.sg = a.gp - a.gc
          }
        }
      })
    standings[groupLetter] = initial.sort((a, b) =>
      b.pts !== a.pts ? b.pts - a.pts :
      b.sg !== a.sg ? b.sg - a.sg :
      b.gp !== a.gp ? b.gp - a.gp :
      a.code.localeCompare(b.code)
    )
  })
  return standings
}

export function calculateBestThirdPlaces(allStandings: Record<string, GroupStanding[]>): ThirdPlaceRank[] {
  const list: ThirdPlaceRank[] = []
  Object.entries(allStandings).forEach(([groupLetter, arr]) => {
    const t3 = arr[2]
    if (t3) list.push({ code: t3.code, group: groupLetter, pts: t3.pts, sg: t3.sg, gp: t3.gp })
  })
  return list.sort((a, b) =>
    b.pts !== a.pts ? b.pts - a.pts :
    b.sg !== a.sg ? b.sg - a.sg :
    b.gp !== a.gp ? b.gp - a.gp :
    a.code.localeCompare(b.code)
  )
}

export function resolveR32Matchups(
  standings: Record<string, GroupStanding[]>,
  thirds: ThirdPlaceRank[],
): Array<{ home?: string; away?: string }> {
  const winners: Record<string, string> = {}
  const runners: Record<string, string> = {}
  Object.entries(standings).forEach(([g, arr]) => {
    winners[g] = arr[0]?.code
    runners[g] = arr[1]?.code
  })
  const get3rd = (i: number) => thirds[i]?.code
  return [
    { home: winners['A'], away: get3rd(0) },
    { home: runners['B'], away: runners['F'] },
    { home: winners['C'], away: get3rd(1) },
    { home: winners['F'], away: runners['C'] },
    { home: winners['E'], away: get3rd(2) },
    { home: winners['I'], away: runners['D'] },
    { home: winners['D'], away: get3rd(3) },
    { home: runners['A'], away: runners['E'] },
    { home: winners['G'], away: get3rd(4) },
    { home: winners['K'], away: runners['L'] },
    { home: winners['H'], away: get3rd(5) },
    { home: winners['J'], away: runners['G'] },
    { home: winners['B'], away: get3rd(6) },
    { home: runners['H'], away: runners['K'] },
    { home: winners['L'], away: get3rd(7) },
    { home: runners['J'], away: runners['I'] },
  ]
}

export function resolveKnockoutSlot(
  matchId: string,
  homeTeam: string | undefined,
  awayTeam: string | undefined,
  scoreState: KnockoutMatchState,
  homeLabel: string,
  awayLabel: string,
  date: string,
  stadiumFull: string,
  time = '20:00',
): KnockoutSlot {
  const { homeScore, awayScore, penaltyWinner } = scoreState
  let winner: string | undefined
  let loser: string | undefined

  if (homeScore !== '' && awayScore !== '' && homeTeam && awayTeam) {
    if (homeScore > awayScore) { winner = homeTeam; loser = awayTeam }
    else if (homeScore < awayScore) { winner = awayTeam; loser = homeTeam }
    else {
      winner = penaltyWinner === 'home' ? homeTeam : penaltyWinner === 'away' ? awayTeam : undefined
      loser  = penaltyWinner === 'home' ? awayTeam : penaltyWinner === 'away' ? homeTeam : undefined
    }
  }

  return {
    matchId, homeLabel, awayLabel,
    home: homeTeam, away: awayTeam,
    homeScore, awayScore, penaltyWinner,
    winner, loser,
    date, time,
    stadium: stadiumFull.split(', ')[0],
    stadiumCity: stadiumFull.split(', ')[1],
  }
}
