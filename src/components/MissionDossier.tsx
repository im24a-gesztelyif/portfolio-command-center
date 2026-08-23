import { Link } from 'react-router-dom'
import { useCommandCenterStore } from '../store/commandCenterStore'
import type { Mission } from '../types/portfolio'
import PanelFrame from './PanelFrame'

interface MissionDossierProps {
  mission: Mission | undefined
  variant?: 'summary' | 'workspace' | 'detail'
}

function MissionDossier({ mission, variant = 'workspace' }: MissionDossierProps) {
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)
  const focusPanel = useCommandCenterStore((state) => state.focusPanel)

  if (!mission) {
    return (
      <PanelFrame
        highlighted={focusedPanel === 'dossier'}
        panelId="dossier"
        subtitle="No dossier is currently selected."
        title="Mission dossier"
      >
        <p className="text-sm text-[color:var(--text-soft)]">
          Select a mission from the queue, the ISR panel, or the command terminal.
        </p>
      </PanelFrame>
    )
  }

  const isDetail = variant === 'detail'
  const isSummary = variant === 'summary'

  return (
    <PanelFrame
      className="h-full"
      highlighted={focusedPanel === 'dossier'}
      panelId="dossier"
      title={isDetail ? 'Expanded mission dossier' : isSummary ? 'Active mission' : 'Mission dossier'}
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex flex-col gap-3 border-b border-white/6 pb-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--green)]">
              {mission.missionId} / {mission.classification}
            </p>
            <p className="mt-1.5 text-xl uppercase tracking-[0.18em] text-[color:var(--text)] lg:text-2xl">
              {mission.codename}
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[color:var(--text-soft)]">{mission.title}</p>
          </div>
          {isSummary ? null : (
            <div className="flex flex-wrap gap-2">
              <span className="status-chip">{mission.priority}</span>
              <span className="status-chip">{mission.status}</span>
              <span className="status-chip">{mission.markerType}</span>
            </div>
          )}
        </div>

        {isSummary ? (
          <div className="mt-auto flex items-end justify-start pt-1">
            <Link
              className="control-button inline-flex items-center justify-center"
              onClick={() => focusPanel('dossier')}
              to={`/missions/${mission.slug}`}
            >
              Open mission
            </Link>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className={isDetail ? 'grid gap-5 xl:grid-cols-[1.25fr_0.85fr]' : 'grid gap-4 lg:grid-cols-[1.15fr_0.85fr]'}>
              <div className="space-y-4">
                <div>
                  <p className="hud-label">Objective</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--text-soft)]">{mission.objective}</p>
                </div>

                <div>
                  <p className="hud-label">Core functionality</p>
                  <ul className="mt-2.5 space-y-2 text-sm text-[color:var(--text-soft)]">
                    {(isDetail ? mission.functionality : mission.functionality.slice(0, 3)).map((item) => (
                      <li className="border-l border-white/10 pl-3 leading-relaxed" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="hud-label">Engineering challenges</p>
                  <ul className="mt-2.5 space-y-2 text-sm text-[color:var(--text-soft)]">
                    {(isDetail ? mission.challenges : mission.challenges.slice(0, 2)).map((item) => (
                      <li className="border-l border-white/10 pl-3 leading-relaxed" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-white/6 bg-black/15 p-3">
                  <p className="hud-label">Stack</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {mission.stack.map((item) => (
                      <span className="status-chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-white/6 bg-black/15 p-3">
                  <p className="hud-label">Outcome</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--text-soft)]">{mission.outcome}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a className="control-button" href={mission.repositoryUrl} rel="noreferrer" target="_blank">
                      View repository
                    </a>
                    {mission.demoUrl ? (
                      <a className="control-button" href={mission.demoUrl} rel="noreferrer" target="_blank">
                        Open demo
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="border border-white/6 bg-black/15 p-3">
                  <p className="hud-label">Operational notes</p>
                  <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-dim)]">Marker</p>
                      <p className="mt-1.5 text-sm text-[color:var(--text-soft)]">{mission.surveillanceTarget.label}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-dim)]">Lock state</p>
                      <p className="mt-1.5 text-sm text-[color:var(--text-soft)]">Synchronized with ISR target model</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PanelFrame>
  )
}

export default MissionDossier
