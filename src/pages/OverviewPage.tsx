import { useEffect } from 'react'
import ActivityLogPanel from '../components/ActivityLogPanel'
import MissionDossier from '../components/MissionDossier'
import ProfilePanel from '../components/ProfilePanel'
import SurveillancePanel from '../components/SurveillancePanel'
import { missions } from '../data/missions'
import { useCommandCenterStore } from '../store/commandCenterStore'

function OverviewPage() {
  const selectedMissionSlug = useCommandCenterStore((state) => state.selectedMissionSlug)
  const selectMission = useCommandCenterStore((state) => state.selectMission)
  const selectedMission = missions.find((mission) => mission.slug === selectedMissionSlug) ?? missions[0]

  useEffect(() => {
    if (!selectedMissionSlug && missions[0]) {
      selectMission(missions[0].slug)
    }
  }, [selectMission, selectedMissionSlug])

  return (
    <section className="grid min-h-0 gap-3 lg:h-full lg:grid-cols-[18rem_minmax(0,1fr)_22rem] lg:overflow-hidden">
      <ProfilePanel variant="summary" />

      <SurveillancePanel interactionMode="select" variant="hero" />

      <div className="grid min-h-0 gap-3 lg:grid-rows-[auto_minmax(0,1fr)]">
        <MissionDossier mission={selectedMission} variant="summary" />
        <ActivityLogPanel variant="compact" />
      </div>
    </section>
  )
}

export default OverviewPage
