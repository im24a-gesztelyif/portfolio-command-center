import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import TerminalDock from '../components/TerminalDock'
import TopStatusRail from '../components/TopStatusRail'
import TutorialOverlay from '../components/TutorialOverlay'
import { ambientMessages, createSystemEvent } from '../lib/system'
import { useCommandCenterStore } from '../store/commandCenterStore'
import type { ShellPage } from '../types/portfolio'

function getShellPage(pathname: string): ShellPage {
  if (pathname.startsWith('/systems')) {
    return 'systems'
  }

  if (pathname.startsWith('/comms')) {
    return 'comms'
  }

  if (pathname.startsWith('/missions')) {
    return 'missions'
  }

  return 'overview'
}

function ShellLayout() {
  const location = useLocation()
  const appendEvent = useCommandCenterStore((state) => state.appendEvent)
  const bootVisible = useCommandCenterStore((state) => state.bootVisible)
  const setActivePage = useCommandCenterStore((state) => state.setActivePage)

  useEffect(() => {
    if (bootVisible) {
      return
    }

    const interval = window.setInterval(() => {
      const message = ambientMessages[Math.floor(Math.random() * ambientMessages.length)]
      appendEvent(createSystemEvent(message, 'Telemetry'))
    }, 28000)

    return () => window.clearInterval(interval)
  }, [appendEvent, bootVisible])

  useEffect(() => {
    setActivePage(getShellPage(location.pathname))
  }, [location.pathname, setActivePage])

  return (
    <div className="system-shell relative min-h-screen overflow-hidden">
      <div className="screen-noise pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] flex-col px-3 py-3 lg:h-screen lg:max-h-screen lg:overflow-hidden lg:px-4 lg:py-4">
        <TopStatusRail />
        <motion.main
          animate={{ opacity: 1, y: 0 }}
          className="min-h-0 flex-1 lg:overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
        <TerminalDock />
      </div>
      <TutorialOverlay />
    </div>
  )
}

export default ShellLayout
