import { useEffect } from 'react'
import MissionDossier from '../components/MissionDossier'
import MissionQueuePanel from '../components/MissionQueuePanel'
import { missions } from '../data/missions'
import { useCommandCenterStore } from '../store/commandCenterStore'

function MissionsPage() {
  const selectedMissionSlug = useCommandCenterStore((state) => state.selectedMissionSlug)
  const selectMission = useCommandCenterStore((state) => state.selectMission)
  const selectedMission = missions.find((mission) => mission.slug === selectedMissionSlug) ?? missions[0]

  useEffect(() => {
    if (!selectedMissionSlug && missions[0]) {
      selectMission(missions[0].slug)
    }
  }, [selectMission, selectedMissionSlug])

  return (
    <section className="grid min-h-0 gap-3 lg:h-full lg:grid-cols-[17rem_minmax(0,1fr)] lg:overflow-hidden">
      <MissionQueuePanel mode="workspace" />

      <MissionDossier mission={selectedMission} variant="workspace" />
    </section>
  )
}

export default MissionsPage
