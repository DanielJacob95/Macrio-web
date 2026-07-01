import { Link } from 'react-router-dom'

function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="legal-layout__meta">Last updated: 1 July 2026</p>

      <p>
        These terms govern your use of Macrio (the iOS app, Android app, and this web app).
        Macrio is developed and maintained by a single independent developer. By creating an
        account or using Macrio, you agree to these terms.
      </p>

      <h2>Not Medical Advice</h2>
      <p>
        Macrio is a personal nutrition-tracking tool, not a medical device and not a substitute
        for professional medical or dietary advice. Calorie, macro, and other nutrition figures
        shown in the app are informational estimates only — sourced from your own entries and
        the public Open Food Facts database, which is not independently verified for accuracy.
        Always consult a doctor, dietitian, or other qualified professional before making
        decisions about your health, diet, or weight based on data in this app.
      </p>

      <h2>Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use Macrio for any unlawful purpose or in a way that violates any applicable law.</li>
        <li>Attempt to gain unauthorised access to Macrio's systems, other users' data, or the Supabase backend.</li>
        <li>Interfere with or disrupt the operation of the app or its infrastructure (for example, automated scraping or abuse of the Open Food Facts search).</li>
        <li>Impersonate another person or provide false information when creating an account.</li>
      </ul>

      <h2>Subscriptions</h2>
      <p>
        Optional paid subscriptions (available on iOS and Android only) are billed and managed
        by Apple or Google through their respective in-app purchase systems. Cancellations,
        refunds, and billing disputes are handled through your Apple ID or Google Play account
        settings, subject to Apple's and Google's own terms — Macrio does not directly process
        or refund payments.
      </p>

      <h2>Your Account</h2>
      <p>
        You're responsible for keeping your login credentials secure and for the accuracy of
        the data you log. You may stop using Macrio and delete your data at any time via the
        Profile screen — see our <Link to="/privacy">Privacy Policy</Link> for details.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate access to Macrio for any account found to violate these
        terms, without prior notice. You may stop using the app and request account deletion
        at any time, as described in the Privacy Policy.
      </p>

      <h2>Disclaimer &amp; Limitation of Liability</h2>
      <p>
        Macrio is provided "as is," without warranties of any kind, express or implied,
        including fitness for a particular purpose or accuracy of nutrition data. As a
        single-developer project, Macrio cannot guarantee uninterrupted availability. To the
        maximum extent permitted by law, Macrio and its developer are not liable for any
        indirect, incidental, or consequential damages arising from your use of the app,
        including decisions made based on nutrition data shown in it.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continuing to use Macrio after changes
        are posted means you accept the updated terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of England and Wales, without regard to conflict
        of law principles.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{' '}
        <a href="mailto:daniel.jacob.95@outlook.com">daniel.jacob.95@outlook.com</a>.
      </p>
    </>
  )
}

export default TermsPage
