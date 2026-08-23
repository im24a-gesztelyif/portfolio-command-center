import CapabilitiesPanel from '../components/CapabilitiesPanel'
import CapabilityDirectoryPanel from '../components/CapabilityDirectoryPanel'
import SystemsSummaryPanel from '../components/SystemsSummaryPanel'

function SystemsPage() {
  return (
    <section className="grid min-h-0 gap-3 lg:h-full lg:grid-cols-[17rem_minmax(0,1fr)_18rem] lg:overflow-hidden">
      <CapabilityDirectoryPanel />
      <CapabilitiesPanel />
      <SystemsSummaryPanel />
    </section>
  )
}

export default SystemsPage
