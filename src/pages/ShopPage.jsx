import { useState } from 'react'
import { formatPrice } from '../lib/currency'

export default function ShopPage({ products, loading, onAddToCart, cartLoading, onViewProduct }) {
  const [activeTag, setActiveTag] = useState('all')

  const allTags = ['all', ...new Set(products.flatMap(p => p.tags || []))]
  const filtered = activeTag === 'all' ? products : products.filter(p => p.tags?.includes(activeTag))

  return (
    <>
      <style>{`
        .shop-page { padding-top: 120px; min-height: 100vh; }
        .shop-hero {
          padding: 60px 0 48px; border-bottom: 1px solid var(--border);
          margin-bottom: 48px;
        }
        .shop-title {
          font-family: var(--serif); font-size: clamp(40px,5vw,72px);
          font-weight: 300; letter-spacing: 0.02em; margin-bottom: 8px;
        }
        .shop-sub { font-size: 14px; color: var(--muted); }
        .shop-filters {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 48px;
        }
        .filter-btn {
          padding: 8px 20px; border: 1px solid var(--border);
          background: none; font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer; transition: all 0.2s;
          color: var(--muted);
        }
        .filter-btn.active, .filter-btn:hover {
          border-color: var(--ink); background: var(--ink); color: white;
        }
        .shop-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
          margin-bottom: 80px;
        }
        .shop-item { cursor: pointer; }
        .shop-item-img {
          aspect-ratio: 3/4; background: var(--cream);
          overflow: hidden; margin-bottom: 16px; position: relative;
        }
        .shop-item-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.7s var(--slow);
        }
        .shop-item:hover .shop-item-img img { transform: scale(1.05); }
        .shop-item-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.15);
          display: flex; align-items: flex-end; padding: 20px;
          opacity: 0; transition: opacity 0.3s;
        }
        .shop-item:hover .shop-item-overlay { opacity: 1; }
        .shop-item-add {
          width: 100%; padding: 13px; background: white;
          border: none; font-size: 10px; letter-spacing: 0.18em;
          text-transform: uppercase; cursor: pointer; transition: all 0.2s;
          color: var(--ink);
        }
        .shop-item-add:hover { background: var(--gold); color: white; }
        .shop-item-tag {
          position: absolute; top: 16px; left: 16px;
          background: white; padding: 4px 10px;
          font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted);
        }
        .shop-item-name { font-size: 14px; margin-bottom: 6px; }
        .shop-item-desc {
          font-size: 12px; color: var(--muted); line-height: 1.5;
          margin-bottom: 8px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .shop-item-price { font-size: 14px; color: var(--gold); }
        .shop-count {
          font-size: 12px; color: var(--muted); margin-bottom: 32px;
          letter-spacing: 0.05em;
        }
        @media (max-width: 1024px) { .shop-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px)  { .shop-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="shop-page">
        <div className="container">
          <div className="shop-hero">
            <h1 className="shop-title">All Products</h1>
            <p className="shop-sub">Science-backed formulas for every skin concern</p>
          </div>

          <div className="shop-filters">
            {allTags.map(tag => (
              <button key={tag}
                className={`filter-btn ${activeTag===tag?'active':''}`}
                onClick={() => setActiveTag(tag)}>
                {tag}
              </button>
            ))}
          </div>

          <div className="shop-count">{filtered.length} products</div>

          <div className="shop-grid">
            {loading ? [0,1,2,3,4,5].map(i => (
              <div key={i}>
                <div className="shop-item-img skeleton"/>
                <div className="skeleton" style={{height:16,marginBottom:8,width:'60%'}}/>
                <div className="skeleton" style={{height:12,width:'40%'}}/>
              </div>
            )) : filtered.map(p => {
              const price    = p.priceRange?.minVariantPrice
              const image    = p.featuredImage?.url || p.images?.edges?.[0]?.node?.url
              const variantId= p.variants?.edges?.[0]?.node?.id
              const tag      = p.tags?.[0]

              return (
                <div className="shop-item" key={p.id} onClick={() => onViewProduct(p)}>
                  <div className="shop-item-img">
                    {image
                      ? <img src={image} alt={p.title}/>
                      : <div style={{width:'100%',height:'100%',background:'var(--cream)'}}/>
                    }
                    {tag && <div className="shop-item-tag">{tag}</div>}
                    <div className="shop-item-overlay">
                      <button className="shop-item-add"
                        onClick={e => { e.stopPropagation(); if(variantId) onAddToCart(variantId) }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="shop-item-name">{p.title}</div>
                  {p.description && <div className="shop-item-desc">{p.description}</div>}
                  {price && <div className="shop-item-price">{formatPrice(price.amount, price.currencyCode)}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
