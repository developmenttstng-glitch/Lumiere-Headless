import { useState, useEffect } from 'react'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import CartDrawer      from './components/CartDrawer'
import HomePage        from './pages/HomePage'
import ShopPage        from './pages/ShopPage'
import CollectionsPage from './pages/CollectionsPage'
import ProductPage     from './pages/ProductPage'
import AboutPage       from './pages/AboutPage'
import { useProducts, useCollections } from './hooks/useProducts'
import { useCart }     from './hooks/useCart'

export default function App() {
  const [page,             setPage]           = useState('home')
  const [activeCollection, setActiveCollection] = useState(null)
  const [activeProduct,    setActiveProduct]    = useState(null)
  const [prevPage,         setPrevPage]         = useState('home')
  const [cartOpen,         setCartOpen]         = useState(false)

  const { products, loading: productsLoading } = useProducts(20)
  const { collections, loading: collectionsLoading } = useCollections()
  const {
    lines, totalItems, totalPrice, currency, loading: cartLoading,
    addToCart, updateQuantity, removeLine, goToCheckout
  } = useCart()

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
        <HomePage
          products={products}
          collections={collections}
          loading={productsLoading}
          onNav={navigate}
          {...sharedProps}
        />
      )
      case 'shop': return (
        <ShopPage
          products={products}
          loading={productsLoading}
          {...sharedProps}
        />
      )
      case 'collections': return (
        <CollectionsPage
          collections={collections}
          activeCollection={activeCollection}
          onNav={navigate}
          {...sharedProps}
        />
      )
      case 'product': return (
        <ProductPage
          product={activeProduct}
          onAddToCart={addToCart}
          cartLoading={cartLoading}
          onBack={goBack}
        />
      )
      case 'about': return <AboutPage onNav={navigate}/>
      default: return (
        <HomePage
          products={products}
          collections={collections}
          loading={productsLoading}
          onNav={navigate}
          {...sharedProps}
        />
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
      />

      <main>{renderPage()}</main>

      <Footer onNav={navigate}/>

      {cartOpen && (
        <CartDrawer
          lines={lines}
          totalPrice={totalPrice}
          currency={currency}
          onClose={() => setCartOpen(false)}
          onCheckout={goToCheckout}
          loading={cartLoading}
          onUpdateQuantity={updateQuantity}
          onRemoveLine={removeLine}
        />
      )}
    </div>
  )
}
