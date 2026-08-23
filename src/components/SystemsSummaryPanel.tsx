import { capabilityClusters } from '../data/capabilities'
import { useCommandCenterStore } from '../store/commandCenterStore'
import PanelFrame from './PanelFrame'

function SystemsSummaryPanel() {
  const selectedCapabilityCluster = useCommandCenterStore((state) => state.selectedCapabilityCluster)
  const cluster =
    capabilityClusters.find((entry) => entry.id === selectedCapabilityCluster) ??
    capabilityClusters[0]

  const stateCounts = cluster.entries.reduce<Record<string, number>>((accumulator, entry) => {
    accumulator[entry.state] = (accumulator[entry.state] ?? 0) + 1
    return accumulator
  }, {})

  return (
    <PanelFrame
      bodyClassName="grid gap-3"
      subtitle="Current diagnostic scope and readiness breakdown."
      title="Systems summary"
    >
      <div className="border border-white/6 bg-black/15 p-3">
        <p className="hud-label">Active scope</p>
        <p className="mt-2 text-lg uppercase tracking-[0.16em] text-[color:var(--text)]">{cluster.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-soft)]">{cluster.note}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(stateCounts).map(([state, count]) => (
          <div className="border border-white/6 bg-black/15 p-3" key={state}>
            <p className="hud-label">{state}</p>
            <p className="mt-2 data-value">{count}</p>
          </div>
        ))}
      </div>
    </PanelFrame>
  )
}

export default SystemsSummaryPanel
