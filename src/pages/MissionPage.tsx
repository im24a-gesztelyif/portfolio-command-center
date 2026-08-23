import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MissionContextPanel from '../components/MissionContextPanel'
import MissionDossier from '../components/MissionDossier'
import MissionQueuePanel from '../components/MissionQueuePanel'
import { missions } from '../data/missions'
import { useCommandCenterStore } from '../store/commandCenterStore'

function MissionPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const selectedMissionSlug = useCommandCenterStore((state) => state.selectedMissionSlug)
  const selectMission = useCommandCenterStore((state) => state.selectMission)
  const mission = missions.find((entry) => entry.slug === slug)

  useEffect(() => {
    if (!slug || !mission) {
      return
    }

    if (slug !== selectedMissionSlug) {
      selectMission(slug, 'Mission route')
    }
  }, [mission, selectMission, selectedMissionSlug, slug])

  if (!mission) {
    return (
      <section className="grid gap-3">
        <MissionDossier mission={undefined} variant="detail" />
        <div className="panel-frame rounded-sm border border-white/6 px-4 py-5">
          <p className="hud-label">Route status</p>
          <p className="mt-2 text-lg uppercase tracking-[0.16em] text-[color:var(--text)]">Mission dossier unavailable</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--text-soft)]">
            The requested mission slug does not exist in the current registry.
          </p>
          <button className="control-button mt-4" onClick={() => navigate('/missions')} type="button">
            Return to missions
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid min-h-0 gap-3 lg:h-full lg:grid-cols-[16rem_minmax(0,1.15fr)_16rem] lg:overflow-hidden">
      <MissionQueuePanel mode="route" />

      <MissionDossier mission={mission} variant="detail" />

      <div className="min-h-0">
        <MissionContextPanel mission={mission} />
      </div>
    </section>
  )
}

export default MissionPage
