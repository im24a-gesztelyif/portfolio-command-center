import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { missions } from '../data/missions'
import { useCommandCenterStore } from '../store/commandCenterStore'
import type { Mission } from '../types/portfolio'
import PanelFrame from './PanelFrame'

interface MissionQueuePanelProps {
  mode?: 'workspace' | 'route'
}

function MissionCard({
  mission,
  active,
  onSelect,
}: {
  mission: Mission
  active: boolean
  onSelect: () => void
}) {
  return (
    <motion.article
      className={`cursor-pointer border px-3 py-3 transition-colors ${
        active
          ? 'border-[color:var(--line-strong)] bg-white/5'
          : 'border-white/6 bg-black/10 hover:border-white/12 hover:bg-white/[0.03]'
      }`}
      layout
      onClick={onSelect}
    >
      <div className="min-w-0">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--green)]">
            {mission.missionId}
          </p>
          <p className="mt-1.5 text-base uppercase tracking-[0.16em] text-[color:var(--text)]">{mission.codename}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--text-dim)]">{mission.title}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-soft)] line-clamp-2">{mission.objective}</p>
      </div>
    </motion.article>
  )
}

function MissionQueuePanel({ mode = 'workspace' }: MissionQueuePanelProps) {
  const navigate = useNavigate()
  const selectedMissionSlug = useCommandCenterStore((state) => state.selectedMissionSlug)
  const selectMission = useCommandCenterStore((state) => state.selectMission)
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)

  return (
    <PanelFrame
      bodyClassName="min-h-0"
      className="h-full"
      highlighted={focusedPanel === 'missions'}
      panelId="missions"
      title="Operations / missions"
    >
      <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto pr-1">
        {missions.map((mission) => (
          <MissionCard
            active={selectedMissionSlug === mission.slug}
            key={mission.slug}
            mission={mission}
            onSelect={() => {
              selectMission(mission.slug, 'Mission queue')
              if (mode === 'route') {
                navigate(`/missions/${mission.slug}`)
              }
            }}
          />
        ))}
      </div>
    </PanelFrame>
  )
}

export default MissionQueuePanel
