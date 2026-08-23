import { useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BootSequence from './components/BootSequence'
import ShellLayout from './layouts/ShellLayout'
import CommsPage from './pages/CommsPage'
import MissionPage from './pages/MissionPage'
import MissionsPage from './pages/MissionsPage'
import OverviewPage from './pages/OverviewPage'
import SystemsPage from './pages/SystemsPage'
import { useCommandCenterStore } from './store/commandCenterStore'

function App() {
  const initializeBoot = useCommandCenterStore((state) => state.initializeBoot)
  const didInitRef = useRef(false)

  useEffect(() => {
    if (didInitRef.current) {
      return
    }

    didInitRef.current = true
    initializeBoot(false)
  }, [initializeBoot])

  return (
    <BrowserRouter>
      <BootSequence />
      <Routes>
        <Route element={<ShellLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/missions/:slug" element={<MissionPage />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/comms" element={<CommsPage />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
