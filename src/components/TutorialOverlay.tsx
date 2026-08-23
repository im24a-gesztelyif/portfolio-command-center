import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCommandCenterStore } from '../store/commandCenterStore'
import type { PanelFocus } from '../types/portfolio'

const TUTORIAL_STORAGE_KEY = 'flavio-command-center-tutorial-complete'

const tutorialSteps: Array<{
  focus: PanelFocus
  path: string
  page: string
  title: string
  body: string
}> = [
  {
    focus: 'profile',
    path: '/',
    page: 'Overview',
    title: 'Profile',
    body: 'This profile introduces me, what I work on, and the kind of development problems I focus on.',
  },
  {
    focus: 'surveillance',
    path: '/',
    page: 'Overview',
    title: 'ISR view',
    body: 'ISR means Intelligence, Surveillance, and Reconnaissance. Here it is a visual way to browse projects, shown as mission targets.',
  },
  {
    focus: 'dossier',
    path: '/',
    page: 'Overview',
    title: 'Active mission',
    body: 'This shows the selected project. "Open mission" takes you to the full project details.',
  },
  {
    focus: 'log',
    path: '/',
    page: 'Overview',
    title: 'Live feed',
    body: 'This small log shows recent actions, like opening a project or changing focus.',
  },
  {
    focus: 'terminal',
    path: '/',
    page: 'Overview',
    title: 'Command box',
    body: 'This command box is for quick navigation. Try help, listmissions, showcomms, or openmission.',
  },
  {
    focus: 'missions',
    path: '/missions',
    page: 'Missions',
    title: 'Mission list',
    body: 'Page changed to Missions. Projects are listed here as mission files; clicking one changes the main details panel.',
  },
  {
    focus: 'dossier',
    path: '/missions',
    page: 'Missions',
    title: 'Mission details',
    body: 'This larger panel is the full project case study: goal, features, tech stack, challenges, and result.',
  },
  {
    focus: 'capabilities',
    path: '/systems',
    page: 'Systems',
    title: 'Skills',
    body: 'Page changed to Systems. This page shows the skills, frameworks, tools, and development areas I work with.',
  },
  {
    focus: 'terminal',
    path: '/comms',
    page: 'Comms',
    title: 'Full command terminal',
    body: 'Page changed to Comms. The larger terminal keeps command history and responses visible.',
  },
  {
    focus: 'comms',
    path: '/comms',
    page: 'Comms',
    title: 'Contact',
    body: 'Direct contact links and public profiles are kept here.',
  },
]

function hasCompletedTutorial() {
  try {
    return window.localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function markTutorialComplete() {
  try {
    window.localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true')
  } catch {
    // Local storage can be unavailable in restricted browsing modes.
  }
}

function intersects(
  first: { left: number; top: number; width: number; height: number },
  second: DOMRect,
) {
  return !(
    first.left + first.width <= second.left ||
    first.left >= second.right ||
    first.top + first.height <= second.top ||
    first.top >= second.bottom
  )
}

function getDialogPosition(rect: DOMRect | null) {
  const preferredWidth = Math.min(360, window.innerWidth - 24)
  const dialogHeight = 230
  const gap = 14
  const margin = 12

  if (!rect) {
    return {
      left: Math.max(margin, (window.innerWidth - preferredWidth) / 2),
      top: Math.max(margin, (window.innerHeight - dialogHeight) / 2),
      width: preferredWidth,
    }
  }

  const rightSpace = window.innerWidth - rect.right
  const leftSpace = rect.left
  const bottomSpace = window.innerHeight - rect.bottom
  const topSpace = rect.top
  const centerY = rect.top + rect.height / 2 - dialogHeight / 2
  const centerX = rect.left + rect.width / 2
  const candidateWidth = (available: number) => Math.min(preferredWidth, Math.max(280, available - gap - margin))
  const clampTop = (top: number) => Math.min(window.innerHeight - dialogHeight - margin, Math.max(margin, top))
  const clampLeft = (left: number, width: number) => Math.min(window.innerWidth - width - margin, Math.max(margin, left))

  const candidates = [
    {
      height: dialogHeight,
      left: rect.right + gap,
      top: clampTop(centerY),
      width: candidateWidth(rightSpace),
    },
    {
      height: dialogHeight,
      left: rect.left - candidateWidth(leftSpace) - gap,
      top: clampTop(centerY),
      width: candidateWidth(leftSpace),
    },
    {
      height: dialogHeight,
      left: clampLeft(centerX - preferredWidth / 2, preferredWidth),
      top: rect.bottom + gap,
      width: preferredWidth,
    },
    {
      height: dialogHeight,
      left: clampLeft(centerX - preferredWidth / 2, preferredWidth),
      top: rect.top - dialogHeight - gap,
      width: preferredWidth,
    },
  ].filter((candidate) => {
    const fitsViewport =
      candidate.left >= margin &&
      candidate.top >= margin &&
      candidate.left + candidate.width <= window.innerWidth - margin &&
      candidate.top + candidate.height <= window.innerHeight - margin

    return fitsViewport && !intersects(candidate, rect)
  })

  const preferredCandidate =
    (rightSpace >= 280 ? candidates[0] : null) ??
    (leftSpace >= 280 ? candidates[1] : null) ??
    (bottomSpace >= dialogHeight + gap ? candidates[2] : null) ??
    (topSpace >= dialogHeight + gap ? candidates[3] : null) ??
    candidates[0]

  if (preferredCandidate) {
    return {
      left: preferredCandidate.left,
      top: preferredCandidate.top,
      width: preferredCandidate.width,
    }
  }

  const fallbackWidth = Math.min(320, window.innerWidth - 24)

  return {
    left: clampLeft(window.innerWidth - fallbackWidth - margin, fallbackWidth),
    top: margin,
    width: fallbackWidth,
  }
}

function TutorialOverlay() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const bootVisible = useCommandCenterStore((state) => state.bootVisible)
  const focusPanel = useCommandCenterStore((state) => state.focusPanel)
  const [mode, setMode] = useState<'idle' | 'prompt' | 'tour'>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null)
  const dialogPosition = getDialogPosition(spotlightRect)
  const currentStep = tutorialSteps[stepIndex]
  const previousStep = tutorialSteps[stepIndex - 1]
  const pageChanged = Boolean(previousStep && previousStep.path !== currentStep.path)
  const isLastStep = stepIndex === tutorialSteps.length - 1

  useEffect(() => {
    if (bootVisible || mode !== 'idle' || hasCompletedTutorial()) {
      return
    }

    const timeout = window.setTimeout(() => setMode('prompt'), reduceMotion ? 120 : 520)

    return () => window.clearTimeout(timeout)
  }, [bootVisible, mode, reduceMotion])

  useEffect(() => {
    const replayTutorial = () => {
      navigate('/')
      setSpotlightRect(null)
      setStepIndex(0)
      setMode('tour')
    }

    window.addEventListener('tutorial:replay', replayTutorial)

    return () => window.removeEventListener('tutorial:replay', replayTutorial)
  }, [navigate])

  useEffect(() => {
    if (mode !== 'tour') {
      return
    }

    navigate(currentStep.path)
    focusPanel(currentStep.focus)
  }, [currentStep.focus, currentStep.path, focusPanel, mode, navigate])

  useEffect(() => {
    if (mode !== 'tour') {
      document.body.classList.remove('tutorial-active')
      document.querySelectorAll('.tutorial-target').forEach((node) => {
        node.classList.remove('tutorial-target')
      })
      return
    }

    document.body.classList.add('tutorial-active')

    const timeout = window.setTimeout(() => {
      document.querySelectorAll('.tutorial-target').forEach((node) => {
        node.classList.remove('tutorial-target')
      })

      const target = document.querySelector(`[data-panel="${currentStep.focus}"]`)
      target?.classList.add('tutorial-target')

      if (target) {
        setSpotlightRect(target.getBoundingClientRect())
      }
    }, reduceMotion ? 20 : 180)

    const updateSpotlight = () => {
      const target = document.querySelector(`[data-panel="${currentStep.focus}"]`)
      setSpotlightRect(target?.getBoundingClientRect() ?? null)
    }

    window.addEventListener('resize', updateSpotlight)

    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('resize', updateSpotlight)
      document.querySelectorAll('.tutorial-target').forEach((node) => {
        node.classList.remove('tutorial-target')
      })
    }
  }, [currentStep.focus, currentStep.path, mode, reduceMotion])

  const progress = useMemo(() => `${stepIndex + 1}/${tutorialSteps.length}`, [stepIndex])

  const dismiss = () => {
    markTutorialComplete()
    setMode('idle')
    focusPanel(null)
    document.body.classList.remove('tutorial-active')
    setSpotlightRect(null)
  }

  const beginTour = () => {
    navigate('/')
    setStepIndex(0)
    setMode('tour')
  }

  const advance = () => {
    if (isLastStep) {
      dismiss()
      return
    }

    setStepIndex((current) => current + 1)
  }

  return (
    <AnimatePresence>
      {mode === 'prompt' ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/[0.88] px-3"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.22 }}
        >
          <motion.aside
            animate={{ opacity: 1, y: 0 }}
            className="panel-frame w-full max-w-sm rounded-sm border-[color:var(--line-strong)] bg-[rgba(7,12,12,0.98)] p-4"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.28 }}
          >
            <p className="hud-label">First access</p>
            <h2 className="mt-2 text-xl uppercase tracking-[0.18em] text-[color:var(--text)]">Quick orientation?</h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-soft)]">
              A quick tour of the main areas. You can skip it.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="control-button" onClick={beginTour} type="button">
                Start
              </button>
              <button className="control-button" onClick={dismiss} type="button">
                Skip
              </button>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}

      {mode === 'tour' ? (
        <>
          {spotlightRect ? (
            <motion.div
              animate={{
                height: spotlightRect.height,
                left: spotlightRect.left,
                opacity: 1,
                top: spotlightRect.top,
                width: spotlightRect.width,
              }}
              className="pointer-events-none fixed z-40 rounded-sm border border-[rgba(159,208,187,0.42)]"
              exit={{ opacity: 0 }}
              initial={{
                height: spotlightRect.height,
                left: spotlightRect.left,
                opacity: 0,
                top: spotlightRect.top,
                width: spotlightRect.width,
              }}
              style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.88), 0 0 0 1px rgba(159, 208, 187, 0.2)' }}
              transition={{ duration: reduceMotion ? 0.08 : 0.22, ease: 'easeOut' }}
            />
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              className="pointer-events-none fixed inset-0 z-40 bg-black/[0.88]"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
            />
          )}
          <motion.aside
            animate={{
              left: dialogPosition.left,
              opacity: 1,
              top: dialogPosition.top,
              width: dialogPosition.width,
            }}
            className="panel-frame pointer-events-auto fixed z-[70] max-w-[24rem] rounded-sm border-[color:var(--line-strong)] bg-[rgba(7,12,12,0.98)] p-4"
            initial={{ opacity: 0 }}
            key={`${currentStep.path}-${currentStep.focus}-${stepIndex}`}
            transition={{ duration: reduceMotion ? 0.12 : 0.24 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="hud-label">Tutorial {progress}</p>
                <h2 className="mt-2 text-xl uppercase tracking-[0.16em] text-[color:var(--text)]">
                  {currentStep.title}
                </h2>
              </div>
              <button className="control-button" onClick={dismiss} type="button">
                Exit
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="status-chip">Page: {currentStep.page}</span>
              {pageChanged ? <span className="status-chip text-[color:var(--amber)]">Page changed</span> : null}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-soft)]">{currentStep.body}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                className="control-button"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                type="button"
              >
                Back
              </button>
              <button className="control-button" onClick={advance} type="button">
                {isLastStep ? 'Finish' : 'Next'}
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default TutorialOverlay
