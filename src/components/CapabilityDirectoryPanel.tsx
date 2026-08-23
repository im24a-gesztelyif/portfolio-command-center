import { capabilityClusters } from '../data/capabilities'
import { useCommandCenterStore } from '../store/commandCenterStore'
import PanelFrame from './PanelFrame'

function CapabilityDirectoryPanel() {
  const selectedCapabilityCluster = useCommandCenterStore((state) => state.selectedCapabilityCluster)
  const selectCapabilityCluster = useCommandCenterStore((state) => state.selectCapabilityCluster)

  return (
    <PanelFrame
      bodyClassName="min-h-0"
      subtitle="Subsystem registry for readiness diagnostics."
      title="Systems index"
    >
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto pr-1">
        {capabilityClusters.map((cluster) => {
          const isActive = selectedCapabilityCluster === cluster.id

          return (
            <button
              className={`border px-3 py-3 text-left transition-colors ${
                isActive
                  ? 'border-[color:var(--line-strong)] bg-white/5'
                  : 'border-white/6 bg-black/10 hover:border-white/12 hover:bg-white/[0.03]'
              }`}
              key={cluster.id}
              onClick={() => selectCapabilityCluster(cluster.id)}
              type="button"
            >
              <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--text)]">{cluster.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--text-soft)]">{cluster.note}</p>
            </button>
          )
        })}
      </div>
    </PanelFrame>
  )
}

export default CapabilityDirectoryPanel
