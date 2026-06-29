import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../lib/currency'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function RevealSection({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(32px)',
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

export default function HomePage({ products, collections, loading, onNav, onAddToCart, cartLoading, onViewProduct }) {
  const bestsellers = products.slice(0, 4)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100)
  }, [])

  return (
    <>
      <style>{`
        /* Hero */
        .hero {
          height: 100vh; position: relative; overflow: hidden;
          display: flex; align-items: center;
          background: var(--cream);
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--cream) 0%, #e8e0d5 50%, var(--gold-lt) 100%);
        }
        .hero-pattern {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: repeating-linear-gradient(
            0deg, var(--ink) 0px, var(--ink) 1px, transparent 1px, transparent 60px
          ), repeating-linear-gradient(
            90deg, var(--ink) 0px, var(--ink) 1px, transparent 1px, transparent 60px
          );
        }
        .hero-content {
          position: relative; z-index: 1;
          padding: 0 48px; max-width: 680px;
        }
        .hero-eyebrow {
          font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 24px;
          opacity: 0; animation: fadeUp 0.8s 0.2s var(--slow) forwards;
        }
        .hero-title {
          font-family: var(--serif); font-size: clamp(52px, 7vw, 96px);
          font-weight: 300; line-height: 1.05; letter-spacing: -0.01em;
          color: var(--ink); margin-bottom: 24px;
          opacity: 0; animation: fadeUp 0.8s 0.4s var(--slow) forwards;
        }
        .hero-title em { font-style: italic; color: var(--gold); }
        .hero-sub {
          font-size: 16px; color: var(--muted); line-height: 1.7;
          max-width: 420px; margin-bottom: 40px;
          opacity: 0; animation: fadeUp 0.8s 0.6s var(--slow) forwards;
        }
        .hero-actions {
          display: flex; gap: 16px; align-items: center;
          opacity: 0; animation: fadeUp 0.8s 0.8s var(--slow) forwards;
        }
        .btn-primary {
          padding: 16px 40px; background: var(--ink); color: white;
          border: none; font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: var(--gold); transform: translateX(-100%);
          transition: transform 0.4s var(--slow);
        }
        .btn-primary:hover::before { transform: translateX(0); }
        .btn-primary span { position: relative; z-index: 1; }
        .btn-secondary {
          padding: 16px 40px; background: none; color: var(--ink);
          border: 1px solid var(--ink); font-size: 11px;
          letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s;
        }
        .btn-secondary:hover { background: var(--ink); color: white; }
        .hero-scroll {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%); display: flex;
          flex-direction: column; align-items: center; gap: 8px;
          opacity: 0; animation: fadeIn 1s 1.2s forwards;
        }
        .hero-scroll span {
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted);
        }
        .hero-scroll-line {
          width: 1px; height: 48px; background: var(--border);
          position: relative; overflow: hidden;
        }
        .hero-scroll-line::after {
          content: ''; position: absolute; top: -100%;
          left: 0; right: 0; height: 100%; background: var(--gold);
          animation: scrollLine 1.5s 1.5s infinite;
        }
        @keyframes scrollLine {
          from { top: -100% } to { top: 100% }
        }
        .hero-image-area {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 45%; opacity: 0;
          animation: fadeIn 1.2s 0.3s var(--slow) forwards;
        }
        .hero-image-area img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .hero-image-overlay {
          position: absolute; left: 0; top: 0; bottom: 0; width: 200px;
          background: linear-gradient(to right, var(--cream), transparent);
        }

        /* Collections strip */
        .collections-strip { padding: 80px 0; background: var(--white); }
        .section-header { text-align: center; margin-bottom: 56px; }
        .section-eyebrow {
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 12px;
        }
        .section-title {
          font-family: var(--serif); font-size: clamp(32px,4vw,52px);
          font-weight: 300; letter-spacing: 0.02em;
        }
        .section-sub {
          font-size: 14px; color: var(--muted); margin-top: 12px;
          max-width: 480px; margin-left: auto; margin-right: auto;
          line-height: 1.7;
        }
        .collections-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
        }
        .collection-card {
          position: relative; aspect-ratio: 3/4; overflow: hidden;
          cursor: pointer; background: var(--cream);
        }
        .collection-card img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.8s var(--slow);
        }
        .collection-card:hover img { transform: scale(1.06); }
        .collection-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
          display: flex; flex-direction: column;
          justify-content: flex-end; padding: 32px;
        }
        .collection-card-title {
          font-family: var(--serif); font-size: 28px; font-weight: 300;
          color: white; letter-spacing: 0.05em; margin-bottom: 8px;
        }
        .collection-card-count {
          font-size: 11px; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(255,255,255,0.7);
        }
        .collection-card-btn {
          margin-top: 16px; display: inline-block;
          padding: 10px 24px; border: 1px solid white;
          color: white; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; background: none;
          cursor: pointer; transition: all 0.3s;
          transform: translateY(8px); opacity: 0;
          transition: opacity 0.3s, transform 0.3s, background 0.3s;
        }
        .collection-card:hover .collection-card-btn {
          opacity: 1; transform: translateY(0);
        }
        .collection-card-btn:hover { background: white; color: var(--ink); }

        /* Bestsellers */
        .bestsellers { padding: 100px 0; background: var(--off); }
        .products-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
          margin-top: 0;
        }
        .product-card { cursor: pointer; }
        .product-card-img {
          aspect-ratio: 3/4; background: var(--cream);
          overflow: hidden; margin-bottom: 16px; position: relative;
        }
        .product-card-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s var(--slow);
        }
        .product-card:hover .product-card-img img { transform: scale(1.04); }
        .product-card-overlay {
          position: absolute; inset: 0; display: flex;
          align-items: flex-end; padding: 16px;
          opacity: 0; transition: opacity 0.3s;
        }
        .product-card:hover .product-card-overlay { opacity: 1; }
        .product-card-add {
          width: 100%; padding: 12px; background: var(--ink);
          color: white; border: none; font-size: 10px;
          letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer; transition: background 0.2s;
        }
        .product-card-add:hover { background: var(--gold); }
        .product-card-name {
          font-size: 14px; margin-bottom: 6px; font-weight: 400;
        }
        .product-card-price {
          font-size: 13px; color: var(--gold);
        }

        /* Editorial */
        .editorial { padding: 100px 0; }
        .editorial-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: center;
        }
        .editorial-img {
          aspect-ratio: 4/5; background: var(--cream); overflow: hidden;
        }
        .editorial-img img { width: 100%; height: 100%; object-fit: cover; }
        .editorial-content { padding: 40px 0; }
        .editorial-eyebrow {
          font-size: 10px; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 20px;
        }
        .editorial-title {
          font-family: var(--serif); font-size: clamp(32px,3vw,48px);
          font-weight: 300; line-height: 1.2; margin-bottom: 24px;
        }
        .editorial-title em { font-style: italic; color: var(--gold); }
        .editorial-text {
          font-size: 15px; color: var(--muted); line-height: 1.8;
          margin-bottom: 32px;
        }

        /* Ingredients */
        .ingredients { padding: 80px 0; background: var(--ink); }
        .ingredients-title {
          font-family: var(--serif); font-size: clamp(28px,4vw,48px);
          font-weight: 300; color: white; text-align: center;
          margin-bottom: 12px;
        }
        .ingredients-sub {
          font-size: 13px; color: rgba(255,255,255,0.4);
          text-align: center; letter-spacing: 0.08em; margin-bottom: 56px;
        }
        .ingredients-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
          background: rgba(255,255,255,0.1);
        }
        .ingredient-item {
          background: var(--ink); padding: 40px 32px; text-align: center;
          transition: background 0.3s;
        }
        .ingredient-item:hover { background: rgba(201,169,110,0.1); }
        .ingredient-symbol {
          font-family: var(--serif); font-size: 36px; color: var(--gold);
          margin-bottom: 16px; display: block;
        }
        .ingredient-name {
          font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;
          color: white; margin-bottom: 8px;
        }
        .ingredient-desc { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; }

        /* Footer strip */
        .home-footer-strip {
          padding: 60px 0; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-strip-text {
          font-family: var(--serif); font-size: 24px; font-weight: 300;
          color: var(--ink);
        }
        .footer-strip-text em { font-style: italic; color: var(--gold); }

        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .ingredients-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-content { padding: 0 20px; max-width: 100%; }
          .hero-image-area { display: none; }
          .collections-grid { grid-template-columns: 1fr; }
          .editorial-grid { grid-template-columns: 1fr; gap: 40px; }
          .hero-actions { flex-direction: column; align-items: flex-start; }
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
      `}</style>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-pattern"/>
        <div className="hero-content">
          <div className="hero-eyebrow">Clean Beauty · Science-Backed</div>
          <h1 className="hero-title">
            Skin.<br/><em>Simplified.</em>
          </h1>
          <p className="hero-sub">
            Premium skincare formulated with the finest ingredients. 
            Simple routines. Visible results. Backed by science, inspired by nature.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onNav('shop')}>
              <span>Shop Now</span>
            </button>
            <button className="btn-secondary" onClick={() => onNav('collections')}>
              Our Collections
            </button>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line"/>
        </div>
      </section>

      {/* Collections */}
      <section className="collections-strip">
        <div className="container">
          <RevealSection>
            <div className="section-header">
              <div className="section-eyebrow">Our Collections</div>
              <h2 className="section-title">Curated for Every Skin</h2>
              <p className="section-sub">Three essential rituals for a complete skincare routine</p>
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div className="collections-grid">
              {collections.length > 0 ? collections.filter(c => c.handle !== 'bestsellers').slice(0,3).map((col, i) => (
                <div className="collection-card" key={col.id}
                  onClick={() => onNav('collection', col.handle)}>
                  {col.image
                    ? <img src={col.image.url} alt={col.title}/>
                    : <div style={{
                        width:'100%',height:'100%',
                        background: i===0?'#e8e0d5':i===1?'#d5e0e8':'#d5e8d5',
                        display:'flex',alignItems:'center',justifyContent:'center'
                      }}>
                        <span style={{fontFamily:'var(--serif)',fontSize:'48px',opacity:0.3}}>
                          {['◎','◇','◈'][i]}
                        </span>
                      </div>
                  }
                  <div className="collection-card-overlay">
                    <div className="collection-card-title">{col.title}</div>
                    <div className="collection-card-count">
                      {col.products?.edges?.length || 0} products
                    </div>
                    <button className="collection-card-btn">Explore</button>
                  </div>
                </div>
              )) : [0,1,2].map(i => (
                <div className="collection-card skeleton" key={i}
                  style={{aspectRatio:'3/4'}}/>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bestsellers">
        <div className="container">
          <RevealSection>
            <div className="section-header">
              <div className="section-eyebrow">Bestsellers</div>
              <h2 className="section-title">Most Loved</h2>
              <p className="section-sub">The products our customers can't live without</p>
            </div>
          </RevealSection>

          <div className="products-grid">
            {loading ? [0,1,2,3].map(i => (
              <div key={i}>
                <div className="product-card-img skeleton"/>
                <div className="skeleton" style={{height:16,marginBottom:8,width:'70%'}}/>
                <div className="skeleton" style={{height:14,width:'40%'}}/>
              </div>
            )) : bestsellers.map((p, i) => {
              const price = p.priceRange?.minVariantPrice
              const image = p.featuredImage?.url || p.images?.edges?.[0]?.node?.url
              const variantId = p.variants?.edges?.[0]?.node?.id
              return (
                <RevealSection key={p.id} delay={i * 0.1}>
                  <div className="product-card" onClick={() => onViewProduct(p)}>
                    <div className="product-card-img">
                      {image
                        ? <img src={image} alt={p.title}/>
                        : <div style={{width:'100%',height:'100%',background:'var(--cream)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <span style={{fontFamily:'var(--serif)',fontSize:'32px',color:'var(--border)'}}>◎</span>
                          </div>
                      }
                      <div className="product-card-overlay">
                        <button className="product-card-add"
                          onClick={e => { e.stopPropagation(); if(variantId) onAddToCart(variantId) }}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="product-card-name">{p.title}</div>
                    {price && <div className="product-card-price">{formatPrice(price.amount, price.currencyCode)}</div>}
                  </div>
                </RevealSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Editorial */}
      <section className="editorial">
        <div className="container">
          <div className="editorial-grid">
            <RevealSection>
              <div className="editorial-img">
                <img
                  src="https://cdn.shopify.com/s/files/1/0816/5854/4352/files/lumi-re-our-philosophy_cd742ea7-49ad-4f39-a0d2-185a7f2f1fae.png?v=1782704372"
                  alt="LUMIÈRE Philosophy"
                  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}
                />
              </div>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="editorial-content">
                <div className="editorial-eyebrow">Our Philosophy</div>
                <h2 className="editorial-title">
                  Less is more.<br/><em>Always.</em>
                </h2>
                <p className="editorial-text">
                  We believe skincare shouldn't be complicated. Every LUMIÈRE formula 
                  is distilled to its purest, most effective form — no unnecessary fillers, 
                  no harmful additives. Just what your skin truly needs.
                </p>
                <p className="editorial-text">
                  Each product is developed with dermatologists, tested for all skin types, 
                  and formulated with ingredients sourced from nature's finest suppliers.
                </p>
                <button className="btn-secondary" onClick={() => onNav('about')}>
                  Our Story
                </button>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="ingredients">
        <div className="container">
          <RevealSection>
            <div className="ingredients-title">Powered by Nature</div>
            <div className="ingredients-sub">Key active ingredients in every formula</div>
          </RevealSection>
          <RevealSection delay={0.1}>
            <div className="ingredients-grid">
              {[
                { symbol:'◎', name:'Hyaluronic Acid',  desc:'Draws moisture deep into the dermis for lasting hydration' },
                { symbol:'◇', name:'Vitamin C',         desc:'Brightens, protects, and evens skin tone with antioxidant power' },
                { symbol:'◈', name:'Retinol',           desc:'Accelerates cell turnover and reduces visible signs of ageing' },
                { symbol:'○', name:'Ceramides',         desc:'Strengthen the skin barrier and lock in essential moisture' },
              ].map(ing => (
                <div className="ingredient-item" key={ing.name}>
                  <span className="ingredient-symbol">{ing.symbol}</span>
                  <div className="ingredient-name">{ing.name}</div>
                  <div className="ingredient-desc">{ing.desc}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Footer strip */}
      <section style={{padding:'60px 0',borderTop:'1px solid var(--border)'}}>
        <div className="container">
          <div className="home-footer-strip">
            <div className="footer-strip-text">
              Ready to <em>transform</em> your skin?
            </div>
            <button className="btn-primary" onClick={() => onNav('shop')}>
              <span>Shop All Products</span>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
