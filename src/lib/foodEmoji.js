// Ported from the iOS FoodEmojiMapper.swift. Checks are lowercase substring
// matches, so order matters where names overlap (e.g. "peanut" contains
// "nut") — keep this in the same sequence as the Swift source.
export function emoji(name) {
  const s = (name || '').toLowerCase()

  // Protein sources
  if (s.includes('chicken')) return '🍗'
  if (s.includes('beef') || s.includes('steak')) return '🥩'
  if (s.includes('pork')) return '🥩'
  if (s.includes('salmon') || s.includes('fish') || s.includes('tuna') || s.includes('cod')) return '🐟'
  if (s.includes('egg')) return '🥚'

  // Dairy
  if (s.includes('milk') || s.includes('yogurt') || s.includes('yoghurt')) return '🥛'
  if (s.includes('cheese')) return '🧀'

  // Grains & carbs
  if (s.includes('rice')) return '🍚'
  if (s.includes('pasta') || s.includes('spaghetti') || s.includes('noodle')) return '🍝'
  if (s.includes('bread') || s.includes('toast')) return '🍞'
  if (s.includes('oat') || s.includes('porridge')) return '🥣'
  if (s.includes('potato')) return '🥔'

  // Fruit
  if (s.includes('banana')) return '🍌'
  if (s.includes('apple')) return '🍎'
  if (s.includes('orange')) return '🍊'
  if (s.includes('strawberr')) return '🍓'
  if (s.includes('avocado')) return '🥑'

  // Vegetables
  if (s.includes('broccoli')) return '🥦'
  if (s.includes('salad') || s.includes('lettuce')) return '🥗'
  if (s.includes('tomato')) return '🍅'

  // Nuts & seeds
  if (s.includes('almond') || s.includes('nut') || s.includes('peanut') || s.includes('cashew')) return '🥜'

  // Prepared / fast food
  if (s.includes('burger')) return '🍔'
  if (s.includes('pizza')) return '🍕'
  if (s.includes('soup')) return '🍲'

  // Sweets
  if (s.includes('chocolate')) return '🍫'

  return '🍽️'
}
