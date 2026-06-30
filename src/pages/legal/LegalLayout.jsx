import { Link } from 'react-router-dom'
import './LegalLayout.css'

function LegalLayout({ children }) {
  return (
    <div className="legal-layout">
      <header className="legal-layout__header">
        <Link to="/" className="legal-layout__brand">
          Macrio
        </Link>
      </header>
      <main className="legal-layout__content glass-card">{children}</main>
    </div>
  )
}

export default LegalLayout
