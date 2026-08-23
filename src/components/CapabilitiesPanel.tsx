import { capabilityClusters } from '../data/capabilities'
import { useCommandCenterStore } from '../store/commandCenterStore'
import PanelFrame from './PanelFrame'

interface CapabilitiesPanelProps {
  clusterId?: string | null
}

function CapabilitiesPanel({ clusterId }: CapabilitiesPanelProps) {
  const selectedClusterId = useCommandCenterStore((state) => state.selectedCapabilityCluster)
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)
  const cluster =
    capabilityClusters.find((entry) => entry.id === (clusterId ?? selectedClusterId)) ??
    capabilityClusters[0]

  return (
    <PanelFrame
      className="h-full"
      highlighted={focusedPanel === 'capabilities'}
      panelId="capabilities"
      subtitle={cluster.note}
      title={`Capabilities / ${cluster.title}`}
    >
      <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto pr-1">
        {cluster.entries.map((entry) => (
          <article className="border border-white/6 bg-black/15 p-3" key={`${cluster.id}-${entry.label}`}>
            <div className="grid gap-3 lg:grid-cols-[0.8fr_0.5fr_1fr]">
              <div>
                <p className="text-base uppercase tracking-[0.16em] text-[color:var(--text)]">{entry.label}</p>
                {entry.note ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--text-dim)]">{entry.note}</p>
                ) : null}
              </div>
              <div>
                <p className="hud-label">State</p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--green)]">{entry.state}</p>
              </div>
              <div>
                <p className="hud-label">Tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span className="status-chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PanelFrame>
  )
}

export default CapabilitiesPanel
