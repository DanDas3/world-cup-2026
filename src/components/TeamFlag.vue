<script setup lang="ts">
import { computed } from 'vue'
import type { Language } from '../types'
import { TEAMS } from '../data/constants'
import { getTeamName } from '../utils'

const props = withDefaults(defineProps<{
  code: string
  class?: string
  textClass?: string
  flagClass?: string
  hideName?: boolean
  lang?: Language
}>(), {
  textClass: 'font-semibold text-slate-800 dark:text-slate-100',
  flagClass: '',
  hideName: false,
  lang: 'pt',
})

const team = computed(() => TEAMS[props.code])
const translatedName = computed(() => getTeamName(props.code, props.lang ?? 'pt'))
</script>

<template>
  <span
    v-if="!team"
    :class="`inline-flex items-center gap-1.5 ${props.class ?? ''}`"
  >
    <span :class="`text-lg ${flagClass}`" aria-hidden="true">🏳️</span>
    <span v-if="!hideName" :class="`${textClass} text-slate-400 capitalize`">
      {{ code || 'A definir' }}
    </span>
  </span>

  <span
    v-else
    :class="`inline-flex items-center gap-2 ${props.class ?? ''}`"
    :title="translatedName"
  >
    <span :class="`text-xl shadow-sm leading-none ${flagClass}`" aria-hidden="true">{{ team.flag }}</span>
    <span v-if="!hideName" :class="`truncate text-sm ${textClass}`">{{ translatedName }}</span>
  </span>
</template>
