import type { Mission } from '../types/portfolio'
import PanelFrame from './PanelFrame'

interface MissionContextPanelProps {
  mission: Mission
}

function MissionContextPanel({ mission }: MissionContextPanelProps) {
  return (
    <PanelFrame
      bodyClassName="grid gap-3"
      subtitle="Compact mission context aligned to the active dossier."
      title="Mission context"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="border border-white/6 bg-black/15 p-3">
          <p className="hud-label">Mission ID</p>
          <p className="mt-2 data-value">{mission.missionId}</p>
        </div>
        <div className="border border-white/6 bg-black/15 p-3">
          <p className="hud-label">Classific.</p>
          <p className="mt-2 data-value">{mission.classification}</p>
        </div>
        <div className="border border-white/6 bg-black/15 p-3">
          <p className="hud-label">Priority</p>
          <p className="mt-2 data-value">{mission.priority}</p>
        </div>
        <div className="border border-white/6 bg-black/15 p-3">
          <p className="hud-label">Marker</p>
          <p className="mt-2 data-value">{mission.surveillanceTarget.label}</p>
        </div>
      </div>

      <div className="border border-white/6 bg-black/15 p-3">
        <p className="hud-label">Stack alignment</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {mission.stack.slice(0, 4).map((item) => (
            <span className="status-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </PanelFrame>
  )
}

export default MissionContextPanel
