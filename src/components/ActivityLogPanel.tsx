import { useCommandCenterStore } from '../store/commandCenterStore'
import PanelFrame from './PanelFrame'

interface ActivityLogPanelProps {
  variant?: 'compact' | 'full'
}

function ActivityLogPanel({ variant = 'full' }: ActivityLogPanelProps) {
  const events = useCommandCenterStore((state) => state.events)
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)
  const visibleEvents = variant === 'compact' ? events.slice(0, 4) : events
  const isCompact = variant === 'compact'

  return (
    <PanelFrame
      bodyClassName="min-h-0"
      className="h-full"
      highlighted={focusedPanel === 'log'}
      panelId="log"
      subtitle={isCompact ? 'Short operational feed.' : 'Recent shell activity, state changes, and interface telemetry.'}
      title={isCompact ? 'Live feed' : 'Activity log / system feed'}
    >
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto pr-1">
        {visibleEvents.length === 0 ? (
          <div className="border border-dashed border-white/8 p-3 text-sm text-[color:var(--text-soft)]">
            Awaiting system events.
          </div>
        ) : (
          visibleEvents.map((event) => (
            <article className={isCompact ? 'border-b border-white/6 pb-2.5' : 'border border-white/6 bg-black/15 p-3'} key={event.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-dim)]">
                    {event.source}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--text-soft)]">{event.message}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-dim)]">
                    {event.timestamp}
                  </p>
                  {!isCompact ? (
                    <p
                      className={`mt-1.5 text-[11px] uppercase tracking-[0.16em] ${
                        event.severity === 'critical'
                          ? 'text-[color:var(--danger)]'
                          : event.severity === 'warn'
                            ? 'text-[color:var(--amber)]'
                            : 'text-[color:var(--green)]'
                      }`}
                    >
                      {event.severity}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </PanelFrame>
  )
}

export default ActivityLogPanel
