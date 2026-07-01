export const EMPTY_MACROS = { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, sugar: 0, salt: 0 }

export function sumMacroLogs(logs) {
  return logs.reduce(
    (totals, log) => ({
      kcal: totals.kcal + (log.kcal ?? 0),
      protein: totals.protein + (log.proteinG ?? 0),
      carbs: totals.carbs + (log.carbsG ?? 0),
      fat: totals.fat + (log.fatG ?? 0),
      fibre: totals.fibre + (log.fibreG ?? 0),
      sugar: totals.sugar + (log.sugarG ?? 0),
      salt: totals.salt + (log.saltG ?? 0),
    }),
    { ...EMPTY_MACROS },
  )
}
