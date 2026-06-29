import { useState, useEffect } from 'react'

export default function Navbar({ page, onNav, totalItems, onCartOpen }) {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { id:'home',        label:'Home' },
    { id:'collections', label:'Collections' },
    { id:'shop',        label:'Shop' },
    { id:'about',       label:'About' },
  ]

  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.4s var(--slow);
        }
        .nav.scrolled {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          transition: padding 0.4s var(--slow);
        }
        .nav.scrolled .nav-inner { padding: 14px 48px; }
        .nav-logo {
          font-family: var(--serif); font-size: 22px; font-weight: 300;
          letter-spacing: 0.35em; text-transform: uppercase; cursor: pointer;
          color: var(--ink);
        }
        .nav-logo span { color: var(--gold); }
        .nav-links { display: flex; gap: 36px; align-items: center; }
        .nav-link {
          font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); background: none; border: none;
          cursor: pointer; transition: color 0.2s; position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 100%;
          height: 1px; background: var(--gold);
          transition: right 0.3s var(--slow);
        }
        .nav-link:hover, .nav-link.active { color: var(--ink); }
        .nav-link:hover::after, .nav-link.active::after { right: 0; }
        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-cart {
          background: none; border: none; font-size: 12px;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--ink); cursor: pointer; display: flex;
          align-items: center; gap: 8px; transition: opacity 0.2s;
        }
        .nav-cart:hover { opacity: 0.6; }
        .cart-count {
          width: 18px; height: 18px; background: var(--gold);
          color: white; border-radius: 50%; font-size: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 500;
        }
        .nav-menu-btn {
          display: none; background: none; border: none;
          flex-direction: column; gap: 5px; cursor: pointer; padding: 4px;
        }
        .nav-menu-btn span {
          display: block; width: 22px; height: 1px;
          background: var(--ink); transition: all 0.3s;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-inner { padding: 16px 20px; }
          .nav.scrolled .nav-inner { padding: 12px 20px; }
          .nav-menu-btn { display: flex; }
        }
        /* Mobile menu */
        .mobile-menu {
          position: fixed; inset: 0; background: var(--white);
          z-index: 200; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 32px;
          animation: fadeIn 0.3s var(--ease);
        }
        .mobile-menu-link {
          font-family: var(--serif); font-size: 36px; font-weight: 300;
          letter-spacing: 0.1em; background: none; border: none;
          cursor: pointer; color: var(--ink); transition: color 0.2s;
        }
        .mobile-menu-link:hover { color: var(--gold); }
        .mobile-close {
          position: absolute; top: 24px; right: 24px;
          background: none; border: none; font-size: 28px;
          cursor: pointer; color: var(--muted);
        }
      `}</style>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => onNav('home')}>
            Lumi<span>è</span>re
          </div>

          <div className="nav-links">
            {links.map(l => (
              <button key={l.id}
                className={`nav-link ${page === l.id ? 'active' : ''}`}
                onClick={() => onNav(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            <button className="nav-cart" onClick={onCartOpen}>
              Cart
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </button>
            <button className="nav-menu-btn" onClick={() => setMenuOpen(true)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>×</button>
          {links.map(l => (
            <button key={l.id} className="mobile-menu-link"
              onClick={() => { onNav(l.id); setMenuOpen(false) }}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
