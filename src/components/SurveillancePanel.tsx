import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { missions } from '../data/missions'
import { cx } from '../lib/cx'
import { useCommandCenterStore } from '../store/commandCenterStore'
import type { Mission } from '../types/portfolio'
import PanelFrame from './PanelFrame'

const terrainMarks = [
  'M40 180 C178 120 262 160 392 245 C530 335 660 288 792 210 C938 124 1090 138 1240 246',
  'M18 570 C162 460 350 472 520 570 C676 660 842 615 992 520 C1104 450 1186 472 1270 558',
  'M455 332 L616 430 M612 430 L762 330 M430 506 L290 662 M808 66 L762 230 M486 60 L526 226',
]

const structures = [
  { points: '628,374 782,286 868,424 720,498' },
  { points: '432,118 520,164 488,288 388,244' },
  { points: '784,106 926,166 884,276 732,218' },
  { points: '624,494 764,418 844,554 700,636' },
]

const hudTicks = Array.from({ length: 17 }, (_, index) => ({
  x: 512 + index * 16,
  tall: index % 4 === 0,
}))

const leftScaleTicks = Array.from({ length: 8 }, (_, index) => ({
  y: 292 + index * 31,
  label: index === 0 ? '60' : index === 2 ? '0' : index === 7 ? '-120' : '',
}))

const targetDisplayPositions: Record<string, { x: number; y: number }> = {
  'flavflix-showcase': { x: 430, y: 238 },
  'guess-the-word': { x: 334, y: 330 },
  'smash-a-meerkat': { x: 664, y: 402 },
  florenz: { x: 504, y: 424 },
  'react-shop-demo': { x: 756, y: 280 },
  'flask-task-planner': { x: 716, y: 510 },
}

const sensorCenter = { x: 640, y: 360 }
const monthCodes = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function pad(value: number, size: number) {
  return String(Math.round(value)).padStart(size, '0')
}

function formatMeters(value: number) {
  return Math.round(value).toLocaleString('en-US')
}

function formatSlew(value: number) {
  return value >= 0 ? ` ${value}` : String(value)
}

function formatIsrTime(date: Date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((value) => pad(value, 2)).join(':')
}

function formatIsrDate(date: Date) {
  return `${pad(date.getDate(), 2)}${monthCodes[date.getMonth()]}${date.getFullYear()}`
}

function getTargetPosition(mission: Mission) {
  return (
    targetDisplayPositions[mission.slug] ?? {
      x: mission.surveillanceTarget.x * 12.8,
      y: mission.surveillanceTarget.y * 7.2,
    }
  )
}

function getTelemetry(mission: Mission) {
  const marker = getTargetPosition(mission)
  const dx = marker.x - sensorCenter.x
  const dy = marker.y - sensorCenter.y
  const bearing = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360
  const slantRange = clamp(Math.round(Math.hypot(dx, dy) * 22.5 + 3180), 3600, 9200)
  const rangeNm = (slantRange / 1852).toFixed(2)
  const heading = (bearing + 86) % 360
  const aircraftEast = 52702 + Math.round(dx * 1.7)
  const aircraftNorth = 6815 + Math.round(dy * 1.3)
  const targetEast = 54419 + Math.round(marker.x * 1.9)
  const targetNorth = 7671 + Math.round(marker.y * 1.55)
  const elevation = clamp(180 + Math.round((720 - marker.y) * 0.16), 190, 290)
  const fieldOfView = clamp(72 + Math.round(slantRange / 310), 84, 104)
  const footprintWidth = fieldOfView + 36
  const closure = Math.round(dx / 12)
  const slew = Math.round(dy / 18)

  return {
    aircraftGrid: `32U WB ${pad(aircraftEast, 5)}`,
    aircraftHeading: pad(aircraftNorth, 5),
    bearing: pad(bearing, 2),
    closure,
    elevation,
    fieldOfView,
    footprintWidth,
    heading,
    rangeMeters: formatMeters(slantRange),
    rangeNm,
    slew,
    targetGrid: `32U WB ${pad(targetEast, 5)}+`,
    targetNorthing: `${pad(targetNorth, 5)}+`,
  }
}

interface SurveillancePanelProps {
  interactionMode?: 'route' | 'select'
  mission?: Mission
  variant?: 'hero' | 'context'
}

function SurveillancePanel({
  interactionMode = 'route',
  variant = 'hero',
}: SurveillancePanelProps) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const focusedPanel = useCommandCenterStore((state) => state.focusedPanel)
  const selectedMissionSlug = useCommandCenterStore((state) => state.selectedMissionSlug)
  const focusedMarkerId = useCommandCenterStore((state) => state.focusedMarkerId)
  const selectMission = useCommandCenterStore((state) => state.selectMission)

  const isContext = variant === 'context'
  const selectedMission = missions.find((entry) => entry.slug === selectedMissionSlug) ?? missions[0]
  const selectedTargetPosition = selectedMission ? getTargetPosition(selectedMission) : sensorCenter
  const telemetry = selectedMission ? getTelemetry(selectedMission) : null
  const sensorOffset = {
    x: sensorCenter.x - selectedTargetPosition.x,
    y: sensorCenter.y - selectedTargetPosition.y,
  }
  const sensorTransition = {
    duration: reduceMotion ? 0 : 1.45,
    ease: [0.22, 1, 0.36, 1] as const,
  }

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentDate(new Date()), 1000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <PanelFrame
      action={<span className="status-chip">{isContext ? 'Context lock' : 'ISR feed'}</span>}
      bodyClassName="p-0 lg:p-0"
      className={isContext ? 'h-full' : 'self-start'}
      highlighted={focusedPanel === 'surveillance'}
      panelId="surveillance"
      title={isContext ? 'Recon context' : 'Drone / surveillance view'}
    >
      <div
        className={cx(
          'relative min-h-0 overflow-hidden bg-black',
          isContext ? 'h-full min-h-56' : 'aspect-video w-full',
        )}
      >
        <div className="screen-noise pointer-events-none absolute inset-0 z-20" />
          <svg
            aria-label="ISR sensor feed with aircraft and target telemetry"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1280 720"
          >
          <defs>
            <filter id="thermalBlur">
              <feGaussianBlur stdDeviation="1.7" />
            </filter>
            <radialGradient id="thermalField" cx="48%" cy="42%" r="78%">
              <stop offset="0%" stopColor="#8f9491" />
              <stop offset="46%" stopColor="#555957" />
              <stop offset="100%" stopColor="#252827" />
            </radialGradient>
            <linearGradient id="vignette" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </linearGradient>
          </defs>

          <rect fill="#101211" height="720" width="1280" />
          <rect fill="url(#thermalField)" filter="url(#thermalBlur)" height="720" width="1280" opacity="0.82" />

          <motion.g
            animate={{ x: sensorOffset.x, y: sensorOffset.y }}
            initial={false}
            transition={sensorTransition}
          >
            <g fill="none" filter="url(#thermalBlur)" opacity="0.38" stroke="#c6cac6" strokeWidth="16">
              {terrainMarks.map((path) => (
                <path d={path} key={path} />
              ))}
            </g>

            <g fill="#777b78" filter="url(#thermalBlur)" opacity="0.58" stroke="#a5aaa6" strokeWidth="3">
              {structures.map((structure) => (
                <polygon key={structure.points} points={structure.points} />
              ))}
              <rect height="150" transform="rotate(-18 612 528)" width="18" x="603" y="452" />
              <rect height="142" transform="rotate(18 500 174)" width="14" x="493" y="103" />
              <rect height="94" transform="rotate(90 306 350)" width="11" x="300" y="303" />
            </g>
          </motion.g>

          <rect fill="url(#vignette)" height="720" width="1280" />
          <rect fill="none" height="706" stroke="rgba(255,255,255,0.58)" strokeWidth="1.5" width="1266" x="7" y="7" />

          <g
            fill="none"
            stroke="rgba(255,255,255,0.96)"
            strokeLinecap="square"
            strokeWidth="2.4"
          >
            <path d="M542 306 L542 286 L562 286" />
            <path d="M718 286 L738 286 L738 306" />
            <path d="M542 412 L542 432 L562 432" />
            <path d="M718 432 L738 432 L738 412" />
            <path d="M640 330 L640 344 M640 374 L640 390 M616 360 L632 360 M648 360 L664 360" />
          </g>

          <g
            fill="rgba(255,255,255,0.98)"
            fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
            paintOrder="stroke"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.55"
          >
            <text fontSize="24" letterSpacing="2" x="24" y="146">NM</text>
            <text fontSize="24" letterSpacing="2" x="24" y="170">WHT</text>
            <text fontSize="24" letterSpacing="2" x="24" y="195">RATE</text>
            <text fontSize="24" letterSpacing="2" x="24" y="220">{`${pad(Math.abs(telemetry?.slew ?? 41), 3)}/${pad(telemetry?.heading ?? 168, 3)}`}</text>
            <text fontSize="23" letterSpacing="2" x="55" y="246">{pad(((telemetry?.heading ?? 111) + 322) % 360, 3)}</text>
            <text fontSize="23" letterSpacing="2" x="52" y="272">{clamp(12 + Math.round((telemetry?.fieldOfView ?? 88) / 20), 12, 18)}C</text>
          </g>

          <g fill="none" stroke="rgba(255,255,255,0.96)" strokeWidth="2.2">
            <path d="M86 292 L102 292 L102 509 L86 509" />
            {leftScaleTicks.map((tick) => (
              <g key={tick.y}>
                <path d={`M88 ${tick.y} L102 ${tick.y}`} />
                {tick.label ? (
                  <text
                    fill="rgba(255,255,255,0.98)"
                    fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
                    fontSize="23"
                    letterSpacing="1.5"
                    paintOrder="stroke"
                    stroke="rgba(255,255,255,0.72)"
                    strokeWidth="0.55"
                    textAnchor="end"
                    x="72"
                    y={tick.y + 7}
                  >
                    {tick.label}
                  </text>
                ) : null}
              </g>
            ))}
          </g>

          <g fill="none" stroke="rgba(255,255,255,0.98)" strokeWidth="2.4">
            <path d="M512 96 L768 96" />
            {hudTicks.map((tick) => (
              <path d={`M${tick.x} 96 L${tick.x} ${tick.tall ? 72 : 86}`} key={tick.x} />
            ))}
            <path d="M612 31 L668 31 L668 61 L648 61 L640 73 L632 61 L612 61 Z" />
          </g>

          <g
            fill="rgba(255,255,255,0.98)"
            fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
            paintOrder="stroke"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.55"
            textAnchor="middle"
          >
            <text fontSize="28" letterSpacing="1.5" x="640" y="56">{pad(telemetry?.heading ?? 149, 3)}</text>
            <text fontSize="25" letterSpacing="2" x="696" y="55">M</text>
            <text fontSize="22" letterSpacing="2" x="578" y="150">{telemetry ? telemetry.closure : -87}</text>
          </g>

          <g
            fill="rgba(255,255,255,0.98)"
            fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
            paintOrder="stroke"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.55"
          >
            <text fontSize="36" letterSpacing="2" textAnchor="end" x="1222" y="104">21, 963MSL</text>
            <text fontSize="28" letterSpacing="2" textAnchor="end" x="1222" y="136">ACFT</text>
            <text fontSize="24" letterSpacing="1.8" textAnchor="end" x="1222" y="168">{telemetry?.aircraftGrid ?? '32U WB 52702'}</text>
            <text fontSize="24" letterSpacing="1.8" textAnchor="end" x="1222" y="198">{telemetry?.aircraftHeading ?? '06815'}</text>
            <text fontSize="24" letterSpacing="1.8" textAnchor="end" x="1222" y="226">21,963 HAT</text>

            <text fontSize="24" letterSpacing="2" textAnchor="middle" x="1138" y="482">TGT A</text>
            <text fontSize="23" letterSpacing="1.7" textAnchor="end" x="1234" y="508">{telemetry?.targetGrid ?? '32U WB 54419+'}</text>
            <text fontSize="23" letterSpacing="1.7" textAnchor="end" x="1234" y="532">{telemetry?.targetNorthing ?? '07671+'}</text>
            <text fontSize="23" letterSpacing="1.7" textAnchor="end" x="1234" y="556">{`ELV   ${telemetry?.elevation ?? 223} +`}</text>
            <text fontSize="23" letterSpacing="1.7" textAnchor="end" x="1234" y="580">{`BRG    ${telemetry?.bearing ?? '63'} M`}</text>
            <text fontSize="23" letterSpacing="1.7" textAnchor="end" x="1234" y="604">{`RNG  ${telemetry?.rangeMeters ?? '7,683'}M+`}</text>
            <text fontSize="23" letterSpacing="1.7" textAnchor="end" x="1234" y="628">{`RNG  ${telemetry?.rangeNm ?? '4.15'}NM+`}</text>
            <text fontSize="23" letterSpacing="1.7" textAnchor="end" x="1234" y="652">{`FVV    ${telemetry?.fieldOfView ?? 88}M+`}</text>
            <text fontSize="21" letterSpacing="1.5" textAnchor="end" x="1234" y="674">{`FWH   ${telemetry?.footprintWidth ?? 124}M+`}</text>
            <text fontSize="21" letterSpacing="1.5" textAnchor="end" x="1234" y="696">{`C/S ${pad(Math.abs(telemetry?.closure ?? 0), 3)}/${formatSlew(telemetry?.slew ?? 0)}+`}</text>
          </g>

          <g
            fill="rgba(255,255,255,0.98)"
            fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
            paintOrder="stroke"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.55"
          >
            <text fontSize="24" letterSpacing="2" x="470" y="280">H</text>
            <text fontSize="24" letterSpacing="2" x="550" y="424">L</text>
            <text fontSize="24" letterSpacing="2" x="318" y="402">{telemetry && telemetry.closure >= 0 ? `->${telemetry.closure}` : `<${telemetry?.closure ?? -31}`}</text>
            <text fontSize="24" letterSpacing="2" x="26" y="652">ART LRD</text>
          </g>

          <g
            fill="rgba(255,255,255,1)"
            fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
            paintOrder="stroke"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.55"
            textAnchor="middle"
          >
            <text fontSize="42" letterSpacing="2.2" x="640" y="618">{formatIsrTime(currentDate)}</text>
            <text fontSize="42" letterSpacing="2.2" x="640" y="660">{formatIsrDate(currentDate)}</text>
          </g>

          <motion.g
            animate={{ x: sensorOffset.x, y: sensorOffset.y }}
            initial={false}
            transition={sensorTransition}
          >
            {missions.map((entry) => {
              const marker = getTargetPosition(entry)
              const isActive = entry.slug === selectedMission?.slug || entry.surveillanceTarget.id === focusedMarkerId
              const focusMission = () => {
                selectMission(entry.slug, 'ISR target')

                if (interactionMode === 'route') {
                  navigate(`/missions/${entry.slug}`)
                }
              }

              return (
                <motion.g
                  aria-label={`Select ${entry.missionId} ${entry.codename}`}
                  className="cursor-pointer focus:outline-none"
                  key={entry.slug}
                  onClick={focusMission}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      focusMission()
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  transform={`translate(${marker.x} ${marker.y})`}
                >
                  <title>{`${entry.missionId} ${entry.codename}`}</title>
                  <circle fill="transparent" r="28" />
                  <g opacity={isActive ? 1 : 0.72}>
                    {entry.markerType === 'Relay' ? (
                      <path
                        d="M0 -9 L9 0 L0 9 L-9 0 Z"
                        fill="rgba(0,0,0,0.18)"
                        stroke="rgba(255,255,255,0.92)"
                        strokeWidth="1.8"
                      />
                    ) : null}
                    {entry.markerType === 'Node' ? (
                      <rect
                        fill="rgba(0,0,0,0.18)"
                        height="16"
                        stroke="rgba(255,255,255,0.92)"
                        strokeWidth="1.8"
                        width="16"
                        x="-8"
                        y="-8"
                      />
                    ) : null}
                    {entry.markerType === 'Beacon' ? (
                      <circle fill="rgba(0,0,0,0.18)" r="9" stroke="rgba(255,255,255,0.92)" strokeWidth="1.8" />
                    ) : null}
                    {entry.markerType === 'Array' ? (
                      <>
                        <path d="M-11 -11 L-5 -11 M-11 -11 L-11 -5" stroke="rgba(255,255,255,0.92)" strokeWidth="1.8" />
                        <path d="M11 -11 L5 -11 M11 -11 L11 -5" stroke="rgba(255,255,255,0.92)" strokeWidth="1.8" />
                        <path d="M-11 11 L-5 11 M-11 11 L-11 5" stroke="rgba(255,255,255,0.92)" strokeWidth="1.8" />
                        <path d="M11 11 L5 11 M11 11 L11 5" stroke="rgba(255,255,255,0.92)" strokeWidth="1.8" />
                      </>
                    ) : null}
                    <path d="M0 -14 L0 -5 M0 5 L0 14 M-14 0 L-5 0 M5 0 L14 0" stroke="rgba(255,255,255,0.86)" strokeWidth="1.4" />
                    <circle fill="rgba(255,255,255,0.96)" r="2.3" />
                    {!isActive ? (
                      <text
                        fill="rgba(255,255,255,0.92)"
                        fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
                        fontSize="16"
                        letterSpacing="1.1"
                        paintOrder="stroke"
                        stroke="rgba(0,0,0,0.55)"
                        strokeWidth="3"
                        textAnchor="middle"
                        y={entry.markerType === 'Array' ? 30 : 28}
                      >
                        {entry.missionId}
                      </text>
                    ) : null}
                  </g>
                  {isActive ? (
                    <g>
                      <path
                        d="M-24 -24 L-12 -24 M-24 -24 L-24 -12 M24 -24 L12 -24 M24 -24 L24 -12 M-24 24 L-12 24 M-24 24 L-24 12 M24 24 L12 24 M24 24 L24 12"
                        fill="none"
                        stroke="rgba(255,255,255,0.98)"
                        strokeWidth="2"
                      />
                      <text
                        fill="rgba(255,255,255,0.98)"
                        fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
                        fontSize="17"
                        letterSpacing="1.2"
                        paintOrder="stroke"
                        stroke="rgba(0,0,0,0.62)"
                        strokeWidth="3"
                        x="34"
                        y="-12"
                      >
                        {entry.surveillanceTarget.label}
                      </text>
                      <text
                        fill="rgba(255,255,255,0.9)"
                        fontFamily="OCR A Extended, Share Tech Mono, JetBrains Mono, monospace"
                        fontSize="14"
                        letterSpacing="1"
                        paintOrder="stroke"
                        stroke="rgba(0,0,0,0.62)"
                        strokeWidth="3"
                        x="34"
                        y="7"
                      >
                        {entry.missionId}
                      </text>
                    </g>
                  ) : null}
                </motion.g>
              )
            })}
          </motion.g>
        </svg>
      </div>
    </PanelFrame>
  )
}

export default SurveillancePanel
