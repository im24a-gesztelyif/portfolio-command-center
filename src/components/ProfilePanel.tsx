import { profile } from '../data/profile'
import { useCommandCenterStore } from '../store/commandCenterStore'
import PanelFrame from './PanelFrame'

interface ProfilePanelProps {
  variant?: 'summary' | 'detail'
}

function ProfilePanel({ variant = 'summary' }: ProfilePanelProps) {
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)
  const isSummary = variant === 'summary'

  return (
    <PanelFrame
      bodyClassName="flex h-full min-h-0 flex-col gap-4"
      className="h-full"
      highlighted={focusedPanel === 'profile'}
      panelId="profile"
      title="Subject profile"
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/6 pb-3">
        <div>
          <p className="text-xl uppercase tracking-[0.2em] text-[color:var(--text)] lg:text-2xl">{profile.name}</p>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--green)]">
            {profile.role}
          </p>
        </div>
      </div>

      <p className="text-base leading-relaxed text-[color:var(--text-soft)]">{profile.summary}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="hud-label">Specialties</p>
          <ul className="mt-2.5 space-y-1.5 text-sm text-[color:var(--text-soft)]">
            {(isSummary ? profile.specialties.slice(0, 3) : profile.specialties).map((specialty) => (
              <li className="border-l border-white/10 pl-3 leading-relaxed" key={specialty}>
                {specialty}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="hud-label">Traits</p>
          <ul className="mt-2.5 space-y-1.5 text-sm text-[color:var(--text-soft)]">
            {(isSummary ? profile.traits.slice(0, 3) : profile.traits).map((trait) => (
              <li className="border-l border-white/10 pl-3 leading-relaxed" key={trait}>
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!isSummary ? (
        <div className="space-y-3">
          <p className="hud-label">Stack alignment</p>
          <div className="flex flex-wrap gap-2">
            {profile.stack.map((item) => (
              <span className="status-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-auto border border-white/6 bg-black/15 p-3.5">
        <p className="hud-label">Current focus</p>
        <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--text-soft)]">{profile.currentFocus}</p>
      </div>
    </PanelFrame>
  )
}

export default ProfilePanel
