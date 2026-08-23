import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { missions } from '../data/missions'
import { cx } from '../lib/cx'
import { useCommandCenterStore } from '../store/commandCenterStore'
import type { ShellPage } from '../types/portfolio'

function TopStatusRail() {
  const navigate = useNavigate()
  const activePage = useCommandCenterStore((state) => state.activePage)
  const selectedMissionSlug = useCommandCenterStore((state) => state.selectedMissionSlug)
  const selectedMission = missions.find((mission) => mission.slug === selectedMissionSlug) ?? missions[0]

  const replayTutorial = () => {
    window.dispatchEvent(new Event('tutorial:replay'))
  }

  const navItems: Array<{ label: string; page: ShellPage; path: string }> = [
    { label: 'Overview', page: 'overview', path: '/' },
    { label: 'Missions', page: 'missions', path: '/missions' },
    { label: 'Systems', page: 'systems', path: '/systems' },
    { label: 'Comms', page: 'comms', path: '/comms' },
  ]

  const statusGroups = useMemo(
    () => [
      { label: 'State', value: 'Online' },
      { label: 'Mode', value: activePage.charAt(0).toUpperCase() + activePage.slice(1) },
      { label: 'Focus', value: selectedMission?.missionId ?? 'N/A' },
    ],
    [activePage, selectedMission],
  )

  return (
    <header className="panel-frame mb-3 shrink-0 rounded-sm px-3 py-3 lg:mb-3.5 lg:px-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3 lg:gap-5">
          <div>
            <p className="hud-label">Tactical interface</p>
            <p className="mt-1 text-base uppercase tracking-[0.2em] text-[color:var(--text)] lg:text-lg">
              Developer Recon System
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusGroups.map((group) => (
              <div className="status-chip" key={group.label}>
                <span className="text-[color:var(--text-dim)]">{group.label}</span>
                <span className="text-[color:var(--text)]">{group.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <button
              className={cx('control-button', activePage === item.page && 'border-[color:var(--line-strong)] bg-white/[0.05] text-[color:var(--text)]')}
              key={item.page}
              onClick={() => navigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <button
            aria-label="Replay tutorial"
            className="control-button size-8 justify-center p-0 text-xs"
            onClick={replayTutorial}
            title="Replay tutorial"
            type="button"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopStatusRail
