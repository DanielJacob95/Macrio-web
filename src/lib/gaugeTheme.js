// Maps the data-layer gauge colour names (profiles.gaugeColour, useTheme's
// stored value: 'green' | 'blue' | 'coral' | 'purple') to the CSS variable
// prefixes defined in tokens.css ('forest' | 'ocean' | 'sunset' | 'aurora').
export const GAUGE_THEME = { green: 'forest', blue: 'ocean', coral: 'sunset', purple: 'aurora' }

export function gaugeThemeName(gaugeColour) {
  return GAUGE_THEME[gaugeColour] ?? 'forest'
}
