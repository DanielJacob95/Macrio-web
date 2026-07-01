// Search-a-licious API — the same search backend the iOS/Android apps use.
// NOT the legacy cgi/search.pl endpoint, whose response shape (_source
// wrapper, brands as a single string, etc.) is different and incompatible.

const cache = new Map()

function parseServingGrams(value) {
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? null : parsed
}

function normaliseHit(hit) {
  const nutriments = hit.nutriments || {}

  const kcal =
    nutriments['energy-kcal_100g'] ||
    (nutriments['energy_100g'] ? nutriments['energy_100g'] / 4.184 : 0)

  return {
    id: hit.code,
    name: hit.product_name,
    brand: Array.isArray(hit.brands) ? hit.brands.join(', ') : '',
    // Same MacroSet shape used everywhere else in the app (see
    // useDashboardData's `totals`), matching the mobile apps' per100g model.
    per100g: {
      kcal: kcal || 0,
      protein: nutriments.proteins_100g || 0,
      carbs: nutriments.carbohydrates_100g || 0,
      fat: nutriments.fat_100g || 0,
      fibre: nutriments.fiber_100g || 0,
      sugar: nutriments.sugars_100g || 0,
      salt: nutriments.salt_100g || 0,
    },
    servingGrams: parseServingGrams(hit.serving_quantity),
    servingLabel: hit.serving_size || null,
    // image_thumb_url isn't guaranteed to exist on every Search-a-licious
    // hit — verify the field name still holds when testing against the
    // live API, and don't let a missing image break the result.
    imageUrl: hit.image_thumb_url || null,
  }
}

export async function searchFoods(query) {
  if (cache.has(query)) {
    return cache.get(query)
  }

  const url = `https://search.openfoodfacts.org/search?q=${encodeURIComponent(query)}&page_size=20`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Search failed')

  const data = await res.json()
  const results = (data.hits || []).map(normaliseHit).filter((f) => f.name)

  cache.set(query, results)
  return results
}
