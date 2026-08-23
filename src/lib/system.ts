import type { SystemEvent, TerminalEntry } from '../types/portfolio'

function uniqueId(prefix: string) {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return `${prefix}-${uuid}`
}

export function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function createSystemEvent(
  message: string,
  source = 'System',
  severity: SystemEvent['severity'] = 'info',
): SystemEvent {
  return {
    id: uniqueId('evt'),
    timestamp: formatTimestamp(),
    source,
    severity,
    message,
  }
}

export function createTerminalEntry(
  input: string,
  output: string[],
  status: TerminalEntry['status'],
  commandId?: string,
): TerminalEntry {
  return {
    id: uniqueId('cmd'),
    input,
    output,
    status,
    timestamp: formatTimestamp(),
    commandId,
  }
}

export function normalizeQuery(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ')
}

export const ambientMessages = [
  'Background telemetry synchronized with local state store.',
  'Recon scene geometry refreshed against mission registry.',
  'Interface latency stable across active modules.',
  'Diagnostic surfaces remain within expected render budget.',
]
