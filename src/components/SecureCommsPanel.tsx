import { commsChannels } from '../data/comms'
import { useCommandCenterStore } from '../store/commandCenterStore'
import PanelFrame from './PanelFrame'

interface SecureCommsPanelProps {
  compact?: boolean
}

function SecureCommsPanel({ compact = false }: SecureCommsPanelProps) {
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)

  return (
    <PanelFrame
      className="h-full"
      highlighted={focusedPanel === 'comms'}
      panelId="comms"
      subtitle="Direct communications channels presented as a clean uplink directory."
      title="Contact / secure comms"
    >
      <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto pr-1">
        {commsChannels.map((channel) => (
          <a
            className="flex min-h-[8rem] flex-1 flex-col justify-between border border-white/6 bg-black/15 p-3 transition-colors hover:border-white/12 hover:bg-white/[0.03]"
            href={channel.href}
            key={channel.label}
            rel="noreferrer"
            target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
          >
            <div>
              <p className="hud-label">{channel.label}</p>
              <p className="mt-2 text-base uppercase tracking-[0.16em] text-[color:var(--text)]">{channel.value}</p>
            </div>
            <p className={compact ? 'mt-3 text-sm leading-relaxed text-[color:var(--text-soft)]' : 'mt-4 text-sm leading-relaxed text-[color:var(--text-soft)]'}>
              {channel.note}
            </p>
          </a>
        ))}
      </div>
    </PanelFrame>
  )
}

export default SecureCommsPanel
