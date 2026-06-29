import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
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

function ProductRoute({ onAddToCart, cartLoading }) {
  const { handle } = useParams()
  const navigate   = useNavigate()
  const { products } = useProducts(20)
  const product = products.find(p => p.handle === handle)

  if (!product && products.length > 0) {
    navigate('/shop')
    return null
  }

  return (
    <ProductPage
      product={product}
      onAddToCart={onAddToCart}
      cartLoading={cartLoading}
      onBack={() => navigate(-1)}
    />
  )
}

function CollectionRoute({ onAddToCart, cartLoading, onViewProduct }) {
  const { handle } = useParams()
  const navigate   = useNavigate()
  return (
    <CollectionsPage
      collections={[]}
      activeCollection={handle}
      onNav={(p, extra) => {
        if (p === 'collection') navigate(`/collections/${extra}`)
        else navigate(p === 'home' ? '/' : `/${p}`)
      }}
      onAddToCart={onAddToCart}
      cartLoading={cartLoading}
      onViewProduct={onViewProduct}
    />
  )
}

export default function App() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [cartOpen, setCartOpen] = useState(false)

  const { products, loading: productsLoading } = useProducts(20)
  const { collections }                         = useCollections()
  const {
    lines, totalItems, totalPrice, currency, loading: cartLoading,
    addToCart, updateQuantity, removeLine, goToCheckout
  } = useCart()
  const {
    customer, isLoggedIn, error: authError,
    login, logout, handleCallback, fetchOrders
  } = useCustomer()

  useEffect(() => {
    window.scrollTo({ top:0, behavior:'smooth' })
  }, [location.pathname])

  function nav(p, extra) {
    if (p === 'collection') navigate(`/collections/${extra}`)
    else if (p === 'home')  navigate('/')
    else                    navigate(`/${p}`)
  }

  function viewProduct(product) {
    navigate(`/products/${product.handle}`)
  }

  const shared = { onAddToCart:addToCart, cartLoading, onViewProduct:viewProduct }
  const isCallback = location.pathname.includes('/account/callback')

  return (
    <div>
      <Navbar
        page={location.pathname}
        onNav={nav}
        totalItems={totalItems}
        onCartOpen={() => setCartOpen(true)}
        customer={customer}
        onLogin={login}
        onAccount={() => navigate('/account')}
      />

      <main>
        <Routes>
          <Route path="/" element={
            <HomePage products={products} collections={collections}
              loading={productsLoading} onNav={nav} {...shared}/>
          }/>

          <Route path="/shop" element={
            <ShopPage products={products} loading={productsLoading} {...shared}/>
          }/>

          <Route path="/collections" element={
            <CollectionsPage collections={collections} activeCollection={null}
              onNav={nav} {...shared}/>
          }/>

          <Route path="/collections/:handle" element={
            <CollectionRoute {...shared}/>
          }/>

          <Route path="/products/:handle" element={
            <ProductRoute onAddToCart={addToCart} cartLoading={cartLoading}/>
          }/>

          <Route path="/about" element={<AboutPage onNav={nav}/>}/>

          <Route path="/account/callback" element={
            <CallbackPage handleCallback={handleCallback}/>
          }/>

          <Route path="/account" element={
            (() => {
              const c = customer || (() => { try { return JSON.parse(localStorage.getItem('lumiere_customer')) } catch { return null } })()
              const t = localStorage.getItem('lumiere_token')
              return c && t
                ? <AccountPage customer={c} onLogout={() => { logout(); navigate('/') }} fetchOrders={fetchOrders} onNav={nav}/>
                : <LoginPage onLogin={login} error={authError}/>
            })()
          }/>

          <Route path="*" element={
            <HomePage products={products} collections={collections}
              loading={productsLoading} onNav={nav} {...shared}/>
          }/>
        </Routes>
      </main>

      {!isCallback && <Footer onNav={nav}/>}

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
