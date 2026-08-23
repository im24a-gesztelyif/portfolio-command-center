import { create } from 'zustand'
import { missions } from '../data/missions'
import { createSystemEvent } from '../lib/system'
import type { PanelFocus, ShellPage, SystemEvent, TerminalEntry } from '../types/portfolio'

const MAX_EVENTS = 12
const MAX_TERMINAL_HISTORY = 12
const initialMissionSlug = missions[0]?.slug ?? ''

function capEvents(events: SystemEvent[]) {
  return events.slice(0, MAX_EVENTS)
}

function capTerminal(entries: TerminalEntry[]) {
  return entries.slice(-MAX_TERMINAL_HISTORY)
}

interface CommandCenterState {
  bootVisible: boolean
  activePage: ShellPage
  selectedMissionSlug: string
  focusedMarkerId: string | null
  focusedPanel: PanelFocus
  terminalDockExpanded: boolean
  selectedCapabilityCluster: string | null
  terminalHistory: TerminalEntry[]
  events: SystemEvent[]
  initializeBoot: (hasVisited: boolean) => void
  completeBoot: () => void
  replayBoot: () => void
  setActivePage: (page: ShellPage) => void
  selectMission: (slug: string, source?: string) => void
  focusMarker: (markerId: string, source?: string) => void
  focusPanel: (panel: PanelFocus) => void
  setTerminalDockExpanded: (expanded: boolean) => void
  toggleTerminalDockExpanded: () => void
  selectCapabilityCluster: (clusterId: string) => void
  pushTerminalEntry: (entry: TerminalEntry) => void
  clearTerminalHistory: () => void
  appendEvent: (event: SystemEvent) => void
}

export const useCommandCenterStore = create<CommandCenterState>((set) => ({
  bootVisible: true,
  activePage: 'overview',
  selectedMissionSlug: initialMissionSlug,
  focusedMarkerId: missions[0]?.surveillanceTarget.id ?? null,
  focusedPanel: 'surveillance',
  terminalDockExpanded: false,
  selectedCapabilityCluster: 'languages',
  terminalHistory: [],
  events: [],
  initializeBoot: (hasVisited) =>
    set((state) => {
      if (hasVisited) {
        return {
          ...state,
          bootVisible: false,
          events: capEvents([
            createSystemEvent('Prior session state detected. Command shell restored.', 'Boot'),
            ...state.events,
          ]),
        }
      }

      return state
    }),
  completeBoot: () =>
    set((state) => {
      if (!state.bootVisible) {
        return state
      }

      return {
        ...state,
        bootVisible: false,
        focusedPanel: 'profile',
        events: capEvents([
          createSystemEvent('Initialization sequence complete. Interface online.', 'Boot'),
          ...state.events,
        ]),
      }
    }),
  replayBoot: () =>
    set((state) => ({
      ...state,
      bootVisible: true,
    })),
  setActivePage: (page) =>
    set((state) => ({
      ...state,
      activePage: page,
    })),
  selectMission: (slug, source = 'System') =>
    set((state) => {
      const mission = missions.find((entry) => entry.slug === slug)

      if (!mission) {
        return state
      }

      if (state.selectedMissionSlug === slug) {
        return {
          ...state,
          focusedPanel: 'dossier',
          focusedMarkerId: mission.surveillanceTarget.id,
        }
      }

      return {
        ...state,
        selectedMissionSlug: mission.slug,
        focusedMarkerId: mission.surveillanceTarget.id,
        focusedPanel: 'dossier',
        events: capEvents([
          createSystemEvent(`Mission dossier opened: ${mission.missionId} ${mission.codename}.`, source),
          ...state.events,
        ]),
      }
    }),
  focusMarker: (markerId, source = 'ISR') =>
    set((state) => {
      const mission = missions.find((entry) => entry.surveillanceTarget.id === markerId)

      if (!mission) {
        return state
      }

      return {
        ...state,
        selectedMissionSlug: mission.slug,
        focusedMarkerId: markerId,
        focusedPanel: 'surveillance',
        events: capEvents([
          createSystemEvent(`Target lock updated to ${mission.codename}.`, source),
          ...state.events,
        ]),
      }
    }),
  focusPanel: (panel) =>
    set((state) => ({
      ...state,
      focusedPanel: panel,
    })),
  setTerminalDockExpanded: (expanded) =>
    set((state) => ({
      ...state,
      terminalDockExpanded: expanded,
    })),
  toggleTerminalDockExpanded: () =>
    set((state) => ({
      ...state,
      terminalDockExpanded: !state.terminalDockExpanded,
    })),
  selectCapabilityCluster: (clusterId) =>
    set((state) => ({
      ...state,
      selectedCapabilityCluster: clusterId,
      focusedPanel: 'capabilities',
    })),
  pushTerminalEntry: (entry) =>
    set((state) => ({
      ...state,
      terminalHistory: capTerminal([...state.terminalHistory, entry]),
    })),
  clearTerminalHistory: () =>
    set((state) => ({
      ...state,
      terminalHistory: [],
    })),
  appendEvent: (event) =>
    set((state) => ({
      ...state,
      events: capEvents([event, ...state.events]),
    })),
}))
