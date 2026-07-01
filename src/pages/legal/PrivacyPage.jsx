function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="legal-layout__meta">Last updated: 1 July 2026</p>

      <p>
        Macrio is built and run by a single independent developer, not a company with a
        dedicated legal or privacy team. This policy explains, in plain terms, what data
        Macrio collects, why, and how you can control it.
      </p>

      <h2>Information We Collect</h2>
      <p>When you create a Macrio account and use the app, we collect:</p>
      <ul>
        <li>Your account email address (used for sign-in) and, if you provide one, a display name.</li>
        <li>
          Food, water, and weight entries you log — including food names, brands, quantities,
          and the nutrition values attached to them.
        </li>
        <li>
          Your goals and preferences: daily calorie and macro targets, water goal, unit
          preference (metric/imperial), gauge colour, and light/dark theme preference.
        </li>
      </ul>
      <p>
        We do not collect location data, contacts, photos, or any device identifiers beyond
        what's needed to keep you signed in.
      </p>

      <h2>Food Search &amp; Open Food Facts</h2>
      <p>
        When you search for a food, Macrio sends only your search text to the free, public{' '}
        <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer">
          Open Food Facts
        </a>{' '}
        database to find matching products. No personal data — not your email, name, or logs —
        is ever sent to Open Food Facts. The nutrition data returned is publicly contributed and
        not verified by Macrio.
      </p>

      <h2>Where Your Data Is Stored</h2>
      <p>
        Your account and logged data are stored in a managed Postgres database hosted by{' '}
        <a href="https://supabase.com" target="_blank" rel="noreferrer">
          Supabase
        </a>
        , which itself runs on Amazon Web Services (AWS) infrastructure. We don't run our own
        servers to store your data — we rely on Supabase's hosting and security practices.
      </p>

      <h2>Syncing Across iOS, Android &amp; Web</h2>
      <p>
        Macrio is available on iOS, Android, and this web app. Signing in with the same account
        on any of them syncs your logs, goals, and preferences through the same Supabase
        backend — there's no separate "web account."
      </p>

      <h2>Subscriptions &amp; Payments</h2>
      <p>
        Paid subscriptions are only available through the iOS and Android apps, and are billed
        entirely by Apple (App Store) or Google (Play Store) using their own in-app purchase
        systems. Macrio never sees or stores your payment card details on any platform — Apple
        and Google handle billing directly, and Macrio only stores whether your account
        currently has an active plan (e.g. Free, Pro, or Founders Edition) so the right features
        unlock. This web app does not process payments and does not gate any features behind a
        paywall.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        Macrio is not directed at children under 13, and we don't knowingly collect data from
        anyone under that age. If you believe a child has created an account, please contact us
        using the email below and we'll delete it.
      </p>

      <h2>Your Rights &amp; Data Deletion</h2>
      <p>You can, at any time:</p>
      <ul>
        <li>
          Use "Delete Account" in the Profile screen (on any platform) to permanently delete all
          of your logged food, water, and weight entries and your profile settings.
        </li>
        <li>
          Email us to request full deletion of your login/account itself, or to ask what data
          we hold about you.
        </li>
      </ul>
      <p>
        Because Macrio is a single-developer project, account-deletion requests handled by email
        are processed manually and may take a few days.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        If this policy changes in a meaningful way — for example, if we start sharing data with
        a new third party — we'll update the date at the top of this page.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data? Email{' '}
        <a href="mailto:daniel.jacob.95@outlook.com">daniel.jacob.95@outlook.com</a>.
      </p>
    </>
  )
}

export default PrivacyPage
