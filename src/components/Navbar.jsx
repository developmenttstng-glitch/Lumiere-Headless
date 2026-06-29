import { useState, useEffect, useRef } from 'react'
import { shopifyClient, COUNTRY_CODE } from '../lib/shopify'
import { SEARCH_PRODUCTS } from '../lib/queries'
import { formatPrice } from '../lib/currency'

export default function Navbar({ page, onNav, totalItems, onCartOpen, customer, onLogin, onAccount }) {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [searchResults,setSearchResults]= useState([])
  const [searching,    setSearching]    = useState(false)
  const searchRef  = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await shopifyClient.request(SEARCH_PRODUCTS, {
          variables: { query: searchQuery, country: COUNTRY_CODE }
        })
        setSearchResults(data?.products?.edges?.map(e => e.node) || [])
      } catch { setSearchResults([]) }
      finally { setSearching(false) }
    }, 350)
    return () => clearTimeout(timeoutRef.current)
  }, [searchQuery])

  function closeSearch() {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const links = [
    { id:'home',        path:'/',            label:'Home' },
    { id:'collections', path:'/collections', label:'Collections' },
    { id:'shop',        path:'/shop',        label:'Shop' },
    { id:'about',       path:'/about',       label:'About' },
  ]

  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.4s var(--slow);
        }
        .nav.scrolled {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 1px 20px rgba(0,0,0,0.04);
        }
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px; transition: padding 0.4s var(--slow);
        }
        .nav.scrolled .nav-inner { padding: 14px 48px; }
        .nav-logo {
          font-family: var(--serif); font-size: 22px; font-weight: 300;
          letter-spacing: 0.35em; text-transform: uppercase; cursor: pointer;
          color: var(--ink); flex-shrink: 0;
        }
        .nav-logo span { color: var(--gold); }
        .nav-links { display: flex; gap: 36px; align-items: center; }
        .nav-link {
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); background: none; border: none;
          cursor: pointer; transition: color 0.2s; position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 100%;
          height: 1px; background: var(--gold); transition: right 0.3s var(--slow);
        }
        .nav-link:hover, .nav-link.active { color: var(--ink); }
        .nav-link:hover::after, .nav-link.active::after { right: 0; }
        .nav-right { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
        .nav-icon-btn {
          background: none; border: none; cursor: pointer;
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); transition: color 0.2s; padding: 0;
          display: flex; align-items: center; gap: 6px;
        }
        .nav-icon-btn:hover { color: var(--ink); }
        .nav-icon-btn.active { color: var(--ink); }
        .cart-count {
          width: 17px; height: 17px; background: var(--gold);
          color: white; border-radius: 50%; font-size: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .nav-divider { width: 1px; height: 14px; background: var(--border); }
        .nav-menu-btn {
          display: none; background: none; border: none;
          flex-direction: column; gap: 5px; cursor: pointer; padding: 4px;
        }
        .nav-menu-btn span { display: block; width: 22px; height: 1px; background: var(--ink); }

        /* Search overlay */
        .search-overlay {
          position: fixed; inset: 0; background: rgba(255,255,255,0.98);
          z-index: 200; display: flex; flex-direction: column;
          align-items: center; padding-top: 120px;
          animation: fadeIn 0.25s ease;
        }
        .search-close {
          position: absolute; top: 24px; right: 32px;
          background: none; border: none; font-size: 28px;
          color: var(--muted); cursor: pointer; transition: color 0.2s;
        }
        .search-close:hover { color: var(--ink); }
        .search-input-wrap {
          width: 100%; max-width: 600px; border-bottom: 1px solid var(--ink);
          display: flex; align-items: center; gap: 16px; padding-bottom: 12px;
          margin-bottom: 40px;
        }
        .search-input {
          flex: 1; border: none; outline: none; font-size: 28px;
          font-family: var(--serif); font-weight: 300; background: none;
          color: var(--ink); letter-spacing: 0.02em;
        }
        .search-input::placeholder { color: var(--border); }
        .search-results { width: 100%; max-width: 600px; }
        .search-hint {
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 20px;
        }
        .search-result-item {
          display: flex; gap: 16px; padding: 16px 0;
          border-bottom: 1px solid var(--border); cursor: pointer;
          transition: opacity 0.2s;
        }
        .search-result-item:hover { opacity: 0.7; }
        .search-result-img {
          width: 56px; height: 68px; background: var(--cream); flex-shrink: 0; overflow: hidden;
        }
        .search-result-img img { width:100%;height:100%;object-fit:cover; }
        .search-result-name { font-size: 14px; margin-bottom: 4px; }
        .search-result-price { font-size: 13px; color: var(--gold); }
        .search-no-results {
          font-family: var(--serif); font-size: 18px; color: var(--muted);
          font-weight: 300; font-style: italic;
        }

        /* Mobile */
        .mobile-menu {
          position: fixed; inset: 0; background: var(--white);
          z-index: 200; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 28px;
          animation: fadeIn 0.3s var(--ease);
        }
        .mobile-menu-link {
          font-family: var(--serif); font-size: 36px; font-weight: 300;
          letter-spacing: 0.08em; background: none; border: none;
          cursor: pointer; color: var(--ink); transition: color 0.2s;
        }
        .mobile-menu-link:hover { color: var(--gold); }
        .mobile-close {
          position: absolute; top: 24px; right: 24px;
          background: none; border: none; font-size: 28px;
          cursor: pointer; color: var(--muted);
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-inner { padding: 16px 20px; }
          .nav.scrolled .nav-inner { padding: 12px 20px; }
          .nav-menu-btn { display: flex; }
          .search-overlay { padding-top: 80px; padding-left: 20px; padding-right: 20px; }
          .search-input { font-size: 22px; }
        }
      `}</style>

      <nav className={`nav ${scrolled?'scrolled':''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => onNav('home')}>
            Lumi<span>è</span>re
          </div>

          <div className="nav-links">
            {links.map(l => (
              <button key={l.id}
                className={`nav-link ${page===l.id?'active':''}`}
                onClick={() => onNav(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="nav-right">
            {/* Search */}
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)}>
              Search
            </button>
            <div className="nav-divider"/>
            {/* Account */}
            {customer ? (
              <button className="nav-icon-btn" onClick={onAccount}>
                {customer.firstName || 'Account'}
              </button>
            ) : (
              <button className="nav-icon-btn" onClick={onLogin}>
                Sign In
              </button>
            )}
            <div className="nav-divider"/>
            {/* Cart */}
            <button className="nav-icon-btn" onClick={onCartOpen}>
              Cart {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </button>
            <button className="nav-menu-btn" onClick={() => setMenuOpen(true)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div className="search-overlay">
          <button className="search-close" onClick={closeSearch}>×</button>
          <div className="search-input-wrap">
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && closeSearch()}
            />
            {searching && <span style={{fontSize:12,color:'var(--muted)',letterSpacing:'0.1em'}}>...</span>}
          </div>

          <div className="search-results">
            {searchQuery && !searching && searchResults.length === 0 && (
              <div className="search-no-results">No results for "{searchQuery}"</div>
            )}
            {!searchQuery && (
              <div className="search-hint">Type to search our collection</div>
            )}
            {searchResults.map(p => {
              const price = p.priceRange?.minVariantPrice
              return (
                <div className="search-result-item" key={p.id}
                  onClick={() => { closeSearch(); /* pass to parent */ window._lumiereViewProduct?.(p) }}>
                  <div className="search-result-img">
                    {p.featuredImage
                      ? <img src={p.featuredImage.url} alt={p.title}/>
                      : null
                    }
                  </div>
                  <div>
                    <div className="search-result-name">{p.title}</div>
                    {price && <div className="search-result-price">{formatPrice(price.amount, price.currencyCode)}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>×</button>
          {links.map(l => (
            <button key={l.id} className="mobile-menu-link"
              onClick={() => { onNav(l.id); setMenuOpen(false) }}>
              {l.label}
            </button>
          ))}
          <button className="mobile-menu-link" style={{fontSize:24,color:'var(--muted)'}}
            onClick={() => { customer ? onAccount() : onLogin(); setMenuOpen(false) }}>
            {customer ? customer.firstName : 'Sign In'}
          </button>
        </div>
      )}
    </>
  )
}
