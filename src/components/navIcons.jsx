const common = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function DashboardIcon() {
  return (
    <svg {...common}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="11" width="8" height="10" rx="2" />
      <rect x="3" y="14" width="8" height="7" rx="2" />
    </svg>
  )
}

export function DiaryIcon() {
  return (
    <svg {...common}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg {...common}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function InsightsIcon() {
  return (
    <svg {...common}>
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="11" width="3.5" height="7" rx="1" />
      <rect x="13.25" y="6" width="3.5" height="12" rx="1" />
    </svg>
  )
}

export function ProfileIcon() {
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.6-3.6 5-5.5 8-5.5s6.4 1.9 8 5.5" />
    </svg>
  )
}
