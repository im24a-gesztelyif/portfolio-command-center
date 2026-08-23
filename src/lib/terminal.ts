import { capabilityClusters } from '../data/capabilities'
import { commsChannels } from '../data/comms'
import { missions } from '../data/missions'
import { profile } from '../data/profile'
import { useCommandCenterStore } from '../store/commandCenterStore'
import type { ParsedCommand, TerminalCommandDefinition, TerminalEntry } from '../types/portfolio'
import { createSystemEvent, createTerminalEntry, normalizeQuery } from './system'

let pendingNavigationTimeout: number | null = null

const commandRegistry: TerminalCommandDefinition[] = [
  {
    id: 'help',
    patterns: [['help'], ['?']],
    usage: 'help',
    description: 'List supported console commands.',
  },
  {
    id: 'clear',
    patterns: [['clear']],
    usage: 'clear',
    description: 'Clear console history.',
  },
  {
    id: 'replay-boot',
    patterns: [['replayboot'], ['replay', 'boot'], ['boot']],
    usage: 'replayboot',
    description: 'Replay the startup sequence.',
  },
  {
    id: 'open-overview',
    patterns: [['openoverview'], ['open', 'overview']],
    usage: 'openoverview',
    description: 'Navigate to the overview workspace.',
  },
  {
    id: 'open-missions',
    patterns: [['openmissions'], ['open', 'missions']],
    usage: 'openmissions',
    description: 'Navigate to the missions workspace.',
  },
  {
    id: 'open-systems',
    patterns: [['opensystems'], ['open', 'systems'], ['open', 'skills']],
    usage: 'opensystems',
    description: 'Navigate to the systems workspace.',
  },
  {
    id: 'open-comms',
    patterns: [['opencomms'], ['open', 'comms']],
    usage: 'opencomms',
    description: 'Navigate to the communications workspace.',
  },
  {
    id: 'show-comms',
    patterns: [['showcomms'], ['show', 'comms'], ['contact']],
    usage: 'showcomms',
    description: 'Display the communications directory.',
  },
  {
    id: 'whois',
    patterns: [['whoisflavio'], ['whois', 'flavio'], ['whois'], ['profile']],
    usage: 'whois flavio',
    description: 'Load the subject profile summary.',
  },
  {
    id: 'list-missions',
    patterns: [['listmissions'], ['list', 'missions']],
    usage: 'listmissions',
    description: 'Display the current mission registry.',
  },
  {
    id: 'open-mission',
    patterns: [['openmission'], ['open', 'mission'], ['mission']],
    usage: 'openmission [name]',
    description: 'Open a mission dossier by codename, slug, or title.',
  },
]

function tokenize(input: string) {
  const tokens: string[] = []
  const tokenRegex = /"([^"]+)"|(\S+)/g
  let match: RegExpExecArray | null

  while ((match = tokenRegex.exec(input)) !== null) {
    tokens.push(match[1] ?? match[2])
  }

  return tokens
}

export function parseCommand(input: string): ParsedCommand | null {
  const rawInput = input.trim()

  if (!rawInput) {
    return null
  }

  const rawTokens = tokenize(rawInput)
  const tokens = rawTokens.map((token) => token.toLowerCase())
  let bestMatch: { commandId: string; pattern: string[] } | null = null

  for (const command of commandRegistry) {
    for (const pattern of command.patterns) {
      const matches = pattern.every((segment, index) => tokens[index] === segment)

      if (!matches) {
        continue
      }

      if (!bestMatch || pattern.length > bestMatch.pattern.length) {
        bestMatch = { commandId: command.id, pattern }
      }
    }
  }

  if (!bestMatch) {
    return null
  }

  return {
    rawInput,
    commandId: bestMatch.commandId,
    commandPattern: bestMatch.pattern,
    tokens,
    args: rawTokens.slice(bestMatch.pattern.length),
  }
}

function findMissionByQuery(query: string) {
  const normalized = normalizeQuery(query)

  return missions.find((mission) => {
    const searchableFields = [
      mission.slug,
      mission.codename,
      mission.title,
      mission.missionId,
      `${mission.codename} ${mission.title}`,
    ]

    return searchableFields.some((value) => normalizeQuery(value).includes(normalized))
  })
}

function helpResponse() {
  return commandRegistry.map((command) => `${command.usage.padEnd(20, ' ')} ${command.description}`)
}

function navigateWithBriefing(
  navigate: (path: string) => void,
  targetPath: string,
  delay = 1350,
) {
  if (pendingNavigationTimeout !== null) {
    window.clearTimeout(pendingNavigationTimeout)
    pendingNavigationTimeout = null
  }

  navigate('/comms')

  if (targetPath === '/comms') {
    return
  }

  pendingNavigationTimeout = window.setTimeout(() => {
    navigate(targetPath)
    pendingNavigationTimeout = null
  }, delay)
}

export function executeTerminalCommand(
  input: string,
  navigate: (path: string) => void,
): TerminalEntry {
  const store = useCommandCenterStore.getState()
  const parsed = parseCommand(input)

  if (!parsed) {
    store.appendEvent(createSystemEvent('Console rejected an unknown command string.', 'Terminal', 'warn'))
    navigate('/comms')
    return createTerminalEntry(
      input,
      ['Command not recognized.', 'Use "help" to inspect supported commands.'],
      'error',
    )
  }

  switch (parsed.commandId) {
    case 'help':
      store.focusPanel('terminal')
      navigate('/comms')
      return createTerminalEntry(parsed.rawInput, helpResponse(), 'info', parsed.commandId)
    case 'clear':
      store.clearTerminalHistory()
      navigate('/comms')
      return createTerminalEntry(parsed.rawInput, [], 'info', parsed.commandId)
    case 'replay-boot':
      store.replayBoot()
      navigate('/comms')
      return createTerminalEntry(parsed.rawInput, ['Boot sequence reinitialized.'], 'info', parsed.commandId)
    case 'open-overview':
      store.focusPanel('profile')
      store.setTerminalDockExpanded(true)
      navigateWithBriefing(navigate, '/')
      return createTerminalEntry(
        parsed.rawInput,
        ['Overview workspace available.', 'Routing to overview workspace...'],
        'ok',
        parsed.commandId,
      )
    case 'open-missions':
      store.focusPanel('missions')
      store.setTerminalDockExpanded(true)
      navigateWithBriefing(navigate, '/missions')
      return createTerminalEntry(
        parsed.rawInput,
        ['Missions workspace available.', 'Routing to missions workspace...'],
        'ok',
        parsed.commandId,
      )
    case 'open-systems':
      store.focusPanel('capabilities')
      store.setTerminalDockExpanded(true)
      navigateWithBriefing(navigate, '/systems')
      return createTerminalEntry(
        parsed.rawInput,
        [
          ...capabilityClusters.map((cluster) => `${cluster.title}: ${cluster.entries.length} tracked systems`),
          'Routing to systems workspace...',
        ],
        'ok',
        parsed.commandId,
      )
    case 'open-comms':
      store.focusPanel('comms')
      store.setTerminalDockExpanded(true)
      navigate('/comms')
      return createTerminalEntry(
        parsed.rawInput,
        ['Communications workspace available.', 'Opening secure comms...'],
        'ok',
        parsed.commandId,
      )
    case 'show-comms':
      store.focusPanel('comms')
      store.setTerminalDockExpanded(true)
      navigate('/comms')
      return createTerminalEntry(
        parsed.rawInput,
        commsChannels.map((channel) => `${channel.label.padEnd(10, ' ')} ${channel.value}`),
        'ok',
        parsed.commandId,
      )
    case 'whois':
      store.focusPanel('profile')
      store.setTerminalDockExpanded(true)
      navigate('/comms')
      return createTerminalEntry(
        parsed.rawInput,
        [profile.name, profile.role, profile.summary, `Current focus: ${profile.currentFocus}`],
        'ok',
        parsed.commandId,
      )
    case 'list-missions':
      store.focusPanel('missions')
      store.setTerminalDockExpanded(true)
      navigate('/comms')
      return createTerminalEntry(
        parsed.rawInput,
        missions.map(
          (mission) =>
            `${mission.missionId}  ${mission.codename.padEnd(16, ' ')} ${mission.status} / ${mission.classification}`,
        ),
        'ok',
        parsed.commandId,
      )
    case 'open-mission': {
      const query = parsed.args.join(' ').trim()

      if (!query) {
        navigate('/comms')
        return createTerminalEntry(
          parsed.rawInput,
          ['Missing mission identifier.', 'Usage: openmission [name]'],
          'error',
          parsed.commandId,
        )
      }

      const mission = findMissionByQuery(query)

      if (!mission) {
        navigate('/comms')
        return createTerminalEntry(
          parsed.rawInput,
          ['Mission not found in registry.', 'Use "listmissions" to inspect available entries.'],
          'error',
          parsed.commandId,
        )
      }

      store.selectMission(mission.slug, 'Terminal')
      store.setTerminalDockExpanded(true)
      navigateWithBriefing(navigate, `/missions/${mission.slug}`)

      return createTerminalEntry(
        parsed.rawInput,
        [`${mission.missionId} ${mission.codename}`, mission.objective, 'Routing to mission dossier...'],
        'ok',
        parsed.commandId,
      )
    }
    default:
      return createTerminalEntry(parsed.rawInput, ['No command handler available.'], 'error')
  }
}
