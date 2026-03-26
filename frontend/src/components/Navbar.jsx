import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbarInner">
        <Link className="navBrand" to="/">
          <img className="navLogo" src="/favicon.svg" alt="Vite logo" />
          <span className="navTitle">The Thought Ledger</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
