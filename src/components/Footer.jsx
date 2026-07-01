import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="app-footer">
      <nav className="app-footer__links">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/support">Support</Link>
      </nav>
      <p className="app-footer__copyright">© {new Date().getFullYear()} Macrio</p>
    </footer>
  )
}

export default Footer
