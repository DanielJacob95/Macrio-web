import { useEffect, useState } from 'react'
import { gaugeThemeName } from '../lib/gaugeTheme'
import './CalorieGauge.css'

const SIZE = 220
const CENTER = 110
const RADIUS = 88
const TRACK_WIDTH = 14
const TICK_OUTER = 84
const TICK_INNER = 74
const DOT_RADIUS = 6

// 0deg = 3 o'clock, increasing clockwise (matches SVG's y-down screen space).
// 140deg/260deg sweep puts the start at ~8 o'clock and the end at ~4
// o'clock, leaving a 100deg gap centred at the bottom — same shape as the
// iOS Tachometer's ArcShape(startAngle: -220, sweepAngle: 260).
const START_DEG = 140
const SWEEP_DEG = 260

const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_LENGTH = CIRCUMFERENCE * (SWEEP_DEG / 360)
const TRACK_DASHOFFSET = CIRCUMFERENCE - ARC_LENGTH

const TICKS = [
  { pct: 0, width: 2.5 },
  { pct: 0.25, width: 1.5 },
  { pct: 0.5, width: 1.5 },
  { pct: 0.75, width: 1.5 },
  { pct: 1, width: 2.5 },
]

function pointOnArc(pct, radius) {
  const angleRad = ((START_DEG + SWEEP_DEG * pct) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  }
}

function CalorieGauge({ consumed, goal, gaugeColour }) {
  const theme = gaugeThemeName(gaugeColour)
  const rawProgress = Math.min(consumed / Math.max(goal, 1), 1)

  // Starts at 0 so the very first render-to-paint already happened before we
  // jump to the real value — without this, the mount-time transition has no
  // "from" state to animate from and the arc would just appear filled.
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(rawProgress))
    return () => cancelAnimationFrame(frame)
  }, [rawProgress])

  const dashoffset = CIRCUMFERENCE - ARC_LENGTH * progress
  const isOver = consumed > goal
  const dot = pointOnArc(progress, RADIUS)
  const gradientId = `gauge-gradient-${theme}`

  return (
    <div className="calorie-gauge">
      <svg className="calorie-gauge__svg" viewBox="0 0 220 220" width={SIZE} height={SIZE}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`var(--gauge-${theme}-light)`} />
            <stop offset="50%" stopColor={`var(--gauge-${theme}-main)`} />
            <stop offset="100%" stopColor={`var(--gauge-${theme}-mid)`} />
          </linearGradient>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="color-mix(in srgb, var(--text-colour) 12%, transparent)"
          strokeWidth={TRACK_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={TRACK_DASHOFFSET}
          transform={`rotate(${START_DEG} ${CENTER} ${CENTER})`}
        />

        <circle
          className="calorie-gauge__progress"
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={TRACK_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashoffset}
          transform={`rotate(${START_DEG} ${CENTER} ${CENTER})`}
          style={{ filter: `drop-shadow(0 0 6px color-mix(in srgb, var(--gauge-${theme}-main) 40%, transparent))` }}
        />

        {TICKS.map(({ pct, width }) => {
          const inner = pointOnArc(pct, TICK_INNER)
          const outer = pointOnArc(pct, TICK_OUTER)
          return (
            <line
              key={pct}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="color-mix(in srgb, var(--text-colour) 25%, transparent)"
              strokeWidth={width}
              strokeLinecap="round"
            />
          )
        })}

        <circle
          className="calorie-gauge__dot"
          cx={dot.x}
          cy={dot.y}
          r={DOT_RADIUS}
          fill={`var(--gauge-${theme}-main)`}
          style={{
            opacity: progress > 0 ? 1 : 0,
            filter: `drop-shadow(0 0 6px var(--gauge-${theme}-main))`,
          }}
        />
      </svg>

      <div className="calorie-gauge__readout">
        <span className="calorie-gauge__value">{Math.round(consumed)}</span>
        <span className="calorie-gauge__label">kcal eaten</span>
        <span
          className="calorie-gauge__status"
          style={{ color: isOver ? 'var(--colour-fat)' : `var(--gauge-${theme}-main)` }}
        >
          {isOver ? `+${Math.round(consumed - goal)} over` : `${Math.round(goal - consumed)} left`}
        </span>
        <span className="calorie-gauge__goal">of {goal} goal</span>
      </div>
    </div>
  )
}

export default CalorieGauge
