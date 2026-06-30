// Reference documentation for the Supabase schema shared with the iOS/Android
// apps. Not executable — table/column names live here so every query in this
// app stays consistent with the rest of the codebase. Transcribed from the
// iOS app's Codable models (NourishOS/Models/*.swift), which are the source
// of truth for this schema.
//
// IMPORTANT: table names are snake_case, but every column inside every table
// is camelCase. Always write queries with camelCase column names — never
// snake_case — even though that mixes naming conventions within one query.
//
// e.g. supabase.from('food_logs').select('userId, loggedDate, foodName')
//
// profiles                  (UserProfile.swift; id == auth.users.id)
//   id                uuid
//   name              text
//   dailyCalorieGoal  int4
//   proteinGoalG      int4
//   weightKg          float8, nullable
//   useMetric         bool
//   gaugeColour       text     ('green' | 'blue' | 'coral' | 'purple')
//   darkMode          bool
//   waterGoalMl       int4
//   carbsGoalG        int4
//   fatGoalG          int4
//   fibreGoalG        int4
//   sugarGoalG        int4
//   saltGoalG         float8
//   createdAt         timestamptz, DB default — omit on insert/update
//
// food_logs                 (FoodLog.swift)
//   id            uuid
//   userId        uuid
//   loggedDate    date
//   mealType      text     ('breakfast' | 'lunch' | 'dinner' | 'snacks')
//   foodName      text
//   brand         text, nullable
//   offProductId  text, nullable   (Open Food Facts product id)
//   quantityG     float8
//   kcal          float8
//   proteinG      float8
//   carbsG        float8
//   fatG          float8
//   fibreG        float8
//   sugarG        float8
//   saltG         float8
//   createdAt     timestamptz, DB default — omit on insert
//
// water_logs                (WaterLog.swift)
//   id                uuid
//   userId            uuid
//   loggedDate        date
//   amountMl          int4
//   netHydrationMl    int4
//   drinkTypeId       text
//   drinkName         text
//   drinkEmoji        text
//   sugarLoggedG      float8
//   caffeineLoggedMg  float8
//   isAlcoholic       bool
//   createdAt         timestamptz, DB default — omit on insert
//
// weight_logs                (WeightLog.swift)
//   id          uuid
//   userId      uuid
//   loggedDate  date
//   weightKg    float8
//   weightLbs   float8, generated column — omit on insert/update
//   notes       text, nullable
//   createdAt   timestamptz, DB default — omit on insert
