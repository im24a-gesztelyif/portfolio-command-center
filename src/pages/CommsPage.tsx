import SecureCommsPanel from '../components/SecureCommsPanel'
import TerminalPanel from '../components/TerminalPanel'

function CommsPage() {
  return (
    <section className="grid min-h-0 gap-3 lg:h-full lg:grid-cols-[minmax(0,1fr)_24rem] lg:overflow-hidden">
      <TerminalPanel />

      <div className="min-h-0">
        <SecureCommsPanel compact />
      </div>
    </section>
  )
}

export default CommsPage
