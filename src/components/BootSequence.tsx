import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCommandCenterStore } from '../store/commandCenterStore'

const bootMessages = [
  'Initializing secure system',
  'Authenticating user',
  'Loading interface modules',
  'Accessing technical dossier',
  'Subject identified',
  'Flavio Gesztelyi',
  'Software Developer',
]

function BootSequenceScreen({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion()
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(
      () => {
        setVisibleCount((current) => {
          if (current >= bootMessages.length) {
            window.clearInterval(interval)
            return current
          }

          return current + 1
        })
      },
      reduceMotion ? 180 : 420,
    )

    return () => window.clearInterval(interval)
  }, [reduceMotion])

  useEffect(() => {
    if (visibleCount < bootMessages.length) {
      return
    }

    const timeout = window.setTimeout(() => {
      onComplete()
    }, reduceMotion ? 220 : 900)

    return () => window.clearTimeout(timeout)
  }, [onComplete, reduceMotion, visibleCount])

  const progressWidth = useMemo(() => `${(visibleCount / bootMessages.length) * 100}%`, [visibleCount])

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(3,6,6,0.94)] px-4"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.18 : 0.45 }}
      >
        <div className="panel-frame relative w-full max-w-3xl overflow-hidden rounded-sm border border-[color:var(--line-strong)] bg-[rgba(7,12,12,0.98)] px-6 py-6 lg:px-10 lg:py-9">
          <div className="screen-noise pointer-events-none absolute inset-0" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="hud-label">Secure initialization</p>
                <p className="mt-2 text-2xl uppercase tracking-[0.24em] text-[color:var(--text)] lg:text-3xl">
                  Command shell startup
                </p>
              </div>
              <button className="control-button" onClick={onComplete} type="button">
                Skip
              </button>
            </div>

            <div className="space-y-3 border border-white/6 bg-black/20 p-4">
              {bootMessages.map((message, index) => {
                const isVisible = index < visibleCount

                return (
                  <motion.div
                    animate={{ opacity: isVisible ? 1 : 0.16 }}
                    className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--text-soft)]"
                    key={message}
                  >
                    <span>{message}</span>
                    <span>{isVisible ? 'OK' : '--'}</span>
                  </motion.div>
                )
              })}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-dim)]">
                <span>Progress</span>
                <span>{Math.round((visibleCount / bootMessages.length) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/6">
                <motion.div
                  animate={{ width: progressWidth }}
                  className="h-full bg-[color:var(--green)]"
                  initial={{ width: 0 }}
                  transition={{ duration: reduceMotion ? 0.16 : 0.35 }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function BootSequence() {
  const bootVisible = useCommandCenterStore((state) => state.bootVisible)
  const completeBoot = useCommandCenterStore((state) => state.completeBoot)

  return (
    <AnimatePresence>
      {bootVisible ? <BootSequenceScreen key="boot-sequence" onComplete={completeBoot} /> : null}
    </AnimatePresence>
  )
}

export default BootSequence
