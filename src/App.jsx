import { useState, useEffect } from 'react'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import CartDrawer      from './components/CartDrawer'
import HomePage        from './pages/HomePage'
import ShopPage        from './pages/ShopPage'
import CollectionsPage from './pages/CollectionsPage'
import ProductPage     from './pages/ProductPage'
import AboutPage       from './pages/AboutPage'
import AccountPage     from './pages/AccountPage'
import CallbackPage    from './pages/CallbackPage'
import { useProducts, useCollections } from './hooks/useProducts'
import { useCart }     from './hooks/useCart'
import { useCustomer } from './hooks/useCustomer'

function LoginPage({ onLogin, error }) {
  return (
    <div style={{
      minHeight:'100vh', paddingTop:100, display:'flex',
      alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        maxWidth:400, width:'100%', padding:'48px 40px',
        border:'1px solid var(--border)', textAlign:'center',
      }}>
        <div style={{fontFamily:'var(--serif)',fontSize:32,fontWeight:300,marginBottom:8}}>
          Welcome Back
        </div>
        <p style={{fontSize:13,color:'var(--muted)',lineHeight:1.7,marginBottom:28}}>
          Sign in to view your orders and manage your account.
        </p>
        <button onClick={onLogin} style={{
          width:'100%', padding:16, background:'var(--ink)', color:'white',
          border:'none', fontSize:11, letterSpacing:'0.2em',
          textTransform:'uppercase', cursor:'pointer',
        }}>
          Sign In with Shopify
        </button>
        {error && <div style={{marginTop:12,fontSize:12,color:'#8a4a4a'}}>{error}</div>}
        <p style={{marginTop:16,fontSize:12,color:'var(--muted)'}}>
          New customer? You can create an account on the sign in page.
        </p>
      </div>
    </div>
  )
}

function getInitialPage() {
  const path   = window.location.pathname
  const search = window.location.search
  const hasToken    = !!localStorage.getItem('lumiere_token')
  const hasCustomer = !!localStorage.getItem('lumiere_customer')

  if (path.includes('/account/callback') && search.includes('code=') && search.includes('state=')) {
    if (hasToken && hasCustomer) { window.history.replaceState({},'',' /'); return 'account' }
    return 'callback'
  }
  if (search.includes('account=1')) {
    window.history.replaceState({}, '', '/')
    return 'account'
  }
  return 'home'
}

export default function App() {
  const [page,             setPage]             = useState(getInitialPage)
  const [activeCollection, setActiveCollection]  = useState(null)
  const [activeProduct,    setActiveProduct]     = useState(null)
  const [prevPage,         setPrevPage]          = useState('home')
  const [cartOpen,         setCartOpen]          = useState(false)

  const { products, loading: productsLoading }    = useProducts(20)
  const { collections }                           = useCollections()
  const {
    lines, totalItems, totalPrice, currency, loading: cartLoading,
    addToCart, updateQuantity, removeLine, goToCheckout
  } = useCart()
  const {
    customer, isLoggedIn, error: authError,
    login, logout, handleCallback, fetchOrders
  } = useCustomer()

  // Expose viewProduct globally for search results
  useEffect(() => {
    window._lumiereViewProduct = viewProduct
    return () => { delete window._lumiereViewProduct }
  }, [page])

  useEffect(() => {
    if (page !== 'product') window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.scrollTo({ top: 0 })
  }, [page, activeProduct])

  function navigate(p, extra) {
    if (p === 'collection') {
      setActiveCollection(extra)
      setPage('collections')
    } else {
      setPage(p)
      setActiveCollection(null)
    }
  }

  function viewProduct(product) {
    setPrevPage(page)
    setActiveProduct(product)
    setPage('product')
  }

  function goBack() {
    setPage(prevPage)
    setActiveProduct(null)
  }

  const sharedProps = {
    onAddToCart:   addToCart,
    cartLoading,
    onViewProduct: viewProduct,
  }

  function renderPage() {
    switch(page) {
      case 'home': return (
        <HomePage products={products} collections={collections}
          loading={productsLoading} onNav={navigate} {...sharedProps}/>
      )
      case 'shop': return (
        <ShopPage products={products} loading={productsLoading} {...sharedProps}/>
      )
      case 'collections': return (
        <CollectionsPage collections={collections} activeCollection={activeCollection}
          onNav={navigate} {...sharedProps}/>
      )
      case 'product': return (
        <ProductPage product={activeProduct} onAddToCart={addToCart}
          cartLoading={cartLoading} onBack={goBack}/>
      )
      case 'about': return <AboutPage onNav={navigate}/>
      case 'callback': return <CallbackPage handleCallback={handleCallback}/>
      case 'account': {
        const c = customer || (() => { try { return JSON.parse(localStorage.getItem('lumiere_customer')) } catch { return null } })()
        const t = localStorage.getItem('lumiere_token')
        return c && t
          ? <AccountPage customer={c} onLogout={() => { logout(); navigate('home') }} fetchOrders={fetchOrders} onNav={navigate}/>
          : <LoginPage onLogin={login} error={authError}/>
      }
      default: return (
        <HomePage products={products} collections={collections}
          loading={productsLoading} onNav={navigate} {...sharedProps}/>
      )
    }
  }

  return (
    <div>
      <Navbar
        page={page}
        onNav={navigate}
        totalItems={totalItems}
        onCartOpen={() => setCartOpen(true)}
        customer={customer}
        onLogin={login}
        onAccount={() => navigate('account')}
      />

      <main>{renderPage()}</main>

      {page !== 'callback' && <Footer onNav={navigate}/>}

      {cartOpen && (
        <CartDrawer
          lines={lines} totalPrice={totalPrice} currency={currency}
          onClose={() => setCartOpen(false)} onCheckout={goToCheckout}
          loading={cartLoading} onUpdateQuantity={updateQuantity} onRemoveLine={removeLine}
        />
      )}
    </div>
  )
}
