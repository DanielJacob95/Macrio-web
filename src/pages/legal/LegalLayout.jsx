import { Link, useLocation } from 'react-router-dom'
import './LegalLayout.css'

const LEGAL_LINKS = [
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
  { path: '/support', label: 'Support' },
]

function LegalLayout({ children }) {
  const location = useLocation()

  return (
    <div className="legal-layout">
      <header className="legal-layout__header">
        <Link to="/" className="legal-layout__brand">
          Macrio
        </Link>
      </header>

      <main className="legal-layout__content glass-card">{children}</main>

      <footer className="legal-layout__footer">
        <nav className="legal-layout__footer-links">
          {LEGAL_LINKS.filter((link) => link.path !== location.pathname).map((link) => (
            <Link key={link.path} to={link.path} className="legal-layout__footer-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="legal-layout__copyright">
          © {new Date().getFullYear()} Macrio. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default LegalLayout
