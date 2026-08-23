export type PanelFocus =
  | 'profile'
  | 'missions'
  | 'dossier'
  | 'surveillance'
  | 'capabilities'
  | 'terminal'
  | 'comms'
  | 'log'
  | null

export type ShellPage = 'overview' | 'missions' | 'systems' | 'comms'

export type MarkerType = 'Node' | 'Relay' | 'Array' | 'Beacon'
export type MissionClassification = 'Personal Project' | 'Learning Project' | 'School Project'
export type MissionPriority = 'Critical' | 'High' | 'Standard'
export type MissionStatus = 'Completed' | 'In Progress' | 'Public Showcase'
export type CapabilityState = 'Primary' | 'Operational' | 'Working' | 'Evaluating'

export interface SurveillanceTarget {
  id: string
  x: number
  y: number
  radius: number
  markerType: MarkerType
  label: string
}

export interface Mission {
  slug: string
  missionId: string
  codename: string
  title: string
  classification: MissionClassification
  priority: MissionPriority
  markerType: MarkerType
  objective: string
  systemRole: string
  stack: string[]
  functionality: string[]
  challenges: string[]
  outcome: string
  status: MissionStatus
  repositoryUrl: string
  demoUrl?: string
  surveillanceTarget: SurveillanceTarget
}

export interface Profile {
  name: string
  role: string
  summary: string
  specialties: string[]
  stack: string[]
  traits: string[]
  currentFocus: string
}

export interface CapabilityEntry {
  label: string
  state: CapabilityState
  tags: string[]
  note?: string
}

export interface CapabilityCluster {
  id: string
  title: string
  note: string
  entries: CapabilityEntry[]
}

export interface CommsChannel {
  label: string
  value: string
  href: string
  note: string
}

export interface TerminalEntry {
  id: string
  input: string
  output: string[]
  status: 'ok' | 'info' | 'error'
  timestamp: string
  commandId?: string
}

export interface SystemEvent {
  id: string
  timestamp: string
  source: string
  severity: 'info' | 'warn' | 'critical'
  message: string
}

export interface ParsedCommand {
  rawInput: string
  commandId: string
  commandPattern: string[]
  tokens: string[]
  args: string[]
}

export interface TerminalCommandDefinition {
  id: string
  patterns: string[][]
  usage: string
  description: string
}
