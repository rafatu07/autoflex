import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { ProductsPage } from './pages/ProductsPage'
import { RawMaterialsPage } from './pages/RawMaterialsPage'
import { ProductionSuggestionPage } from './pages/ProductionSuggestionPage'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
        <div className="container nav-inner">
          <NavLink to="/" end className="nav-brand" onClick={() => setMenuOpen(false)}>
            Estoque Autoflex
          </NavLink>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
          <ul className="nav-links" onClick={() => setMenuOpen(false)}>
            <li><NavLink to="/products">Produtos</NavLink></li>
            <li><NavLink to="/raw-materials">Matérias-primas</NavLink></li>
            <li><NavLink to="/production-suggestion">Sugestão de produção</NavLink></li>
          </ul>
        </div>
      </nav>
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<ProductionSuggestionPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/raw-materials" element={<RawMaterialsPage />} />
            <Route path="/production-suggestion" element={<ProductionSuggestionPage />} />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App
