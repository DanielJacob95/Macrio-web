function SupportPage() {
  return (
    <>
      <h1>Support</h1>
      <p>
        Macrio is built and supported by a single independent developer. For anything not
        covered below, email{' '}
        <a href="mailto:daniel.jacob.95@outlook.com">daniel.jacob.95@outlook.com</a> — I read
        every message.
      </p>

      <h2>Can I log food from the web app?</h2>
      <p>
        Not here — food search and logging only happen in the iOS and Android apps. This web
        app is a read-only companion for viewing your dashboard, diary, and insights, and for
        managing profile settings like your goals, units, and dark mode. Anything you log on
        your phone shows up here automatically.
      </p>

      <h2>How do I delete my data?</h2>
      <p>
        Open Profile → Account → "Delete Account." This permanently removes all of your logged
        food, water, and weight entries and your profile settings, on every platform, since they
        all share the same backend. It doesn't delete your login itself — email us if you'd
        like your account fully removed.
      </p>

      <h2>Why doesn't food search in the app show every product?</h2>
      <p>
        Food search (in the iOS and Android apps) is powered by{' '}
        <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">
          Open Food Facts
        </a>
        , a free, open, community-contributed database. Its coverage is excellent for many
        regions and brands but not exhaustive — if a product is missing or its nutrition data
        looks wrong, that's usually a gap in the underlying database rather than in Macrio.
      </p>

      <h2>Is my data shared between iOS, Android, and web?</h2>
      <p>
        Yes. All three versions of Macrio read and write to the same account and the same
        backend, so logging a meal on your phone shows up on the web dashboard immediately (and
        vice versa). Nothing is shared with a different account or with Open Food Facts beyond
        your search text.
      </p>

      <h2>Is Macrio free?</h2>
      <p>
        Macrio has a free tier, plus optional paid plans available through the iOS and Android
        apps (billed via the App Store or Play Store). The web app doesn't sell anything
        directly — it just reflects whatever plan is on your account.
      </p>

      <h2>Report a bug</h2>
      <p>
        Found something broken? The fastest way to reach me is by email above, or you can{' '}
        <a
          href="https://github.com/DanielJacob95/Macrio-web/issues"
          target="_blank"
          rel="noreferrer"
        >
          open an issue on GitHub
        </a>
        .
      </p>
    </>
  )
}

export default SupportPage
