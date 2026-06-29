import { formatPrice } from '../lib/currency'
import { useCollection } from '../hooks/useProducts'
import { useState } from 'react'

function CollectionView({ handle, onAddToCart, onViewProduct, onBack }) {
  const { collection, loading } = useCollection(handle)

  if (loading) return (
    <div style={{paddingTop:160,textAlign:'center'}}>
      <div style={{fontFamily:'var(--serif)',fontSize:48,color:'var(--border)',marginBottom:16}}>◎</div>
      <div style={{fontSize:12,letterSpacing:'0.2em',color:'var(--muted)'}}>Loading...</div>
    </div>
  )

  if (!collection) return null

  const products = collection.products?.edges?.map(e => e.node) || []

  return (
    <>
      <style>{`
        .col-view { padding-top: 120px; min-height: 100vh; }
        .col-hero {
          padding: 60px 0 48px; border-bottom: 1px solid var(--border);
          margin-bottom: 48px;
        }
        .col-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); background: none; border: none;
          cursor: pointer; margin-bottom: 24px; transition: color 0.2s;
        }
        .col-back:hover { color: var(--ink); }
        .col-title {
          font-family: var(--serif); font-size: clamp(40px,5vw,72px);
          font-weight: 300; margin-bottom: 12px;
        }
        .col-desc { font-size: 14px; color: var(--muted); max-width: 520px; line-height: 1.7; }
        .col-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 32px;
          margin-bottom: 80px;
        }
        .col-item { cursor: pointer; }
        .col-item-img {
          aspect-ratio: 3/4; background: var(--cream);
          overflow: hidden; margin-bottom: 16px; position: relative;
        }
        .col-item-img img { width:100%;height:100%;object-fit:cover;transition:transform 0.7s var(--slow); }
        .col-item:hover .col-item-img img { transform: scale(1.05); }
        .col-item-overlay {
          position:absolute;inset:0;display:flex;align-items:flex-end;
          padding:20px;opacity:0;transition:opacity 0.3s;
        }
        .col-item:hover .col-item-overlay { opacity:1; }
        .col-item-add {
          width:100%;padding:13px;background:white;border:none;
          font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
          cursor:pointer;color:var(--ink);transition:all 0.2s;
        }
        .col-item-add:hover { background:var(--gold);color:white; }
        .col-item-name { font-size:14px;margin-bottom:6px; }
        .col-item-price { font-size:14px;color:var(--gold); }
        @media(max-width:768px) { .col-grid { grid-template-columns:repeat(2,1fr);gap:16px; } }
      `}</style>

      <div className="col-view">
        <div className="container">
          <div className="col-hero">
            <button className="col-back" onClick={onBack}>← All Collections</button>
            <h1 className="col-title">{collection.title}</h1>
            {collection.description && <p className="col-desc">{collection.description}</p>}
          </div>

          <div className="col-grid">
            {products.map(p => {
              const price     = p.priceRange?.minVariantPrice
              const image     = p.featuredImage?.url || p.images?.edges?.[0]?.node?.url
              const variantId = p.variants?.edges?.[0]?.node?.id
              return (
                <div className="col-item" key={p.id} onClick={() => onViewProduct(p)}>
                  <div className="col-item-img">
                    {image ? <img src={image} alt={p.title}/> : null}
                    <div className="col-item-overlay">
                      <button className="col-item-add"
                        onClick={e=>{ e.stopPropagation(); if(variantId) onAddToCart(variantId) }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="col-item-name">{p.title}</div>
                  {price && <div className="col-item-price">{formatPrice(price.amount, price.currencyCode)}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default function CollectionsPage({ collections, onNav, onAddToCart, onViewProduct, activeCollection }) {
  if (activeCollection) {
    return <CollectionView
      handle={activeCollection}
      onAddToCart={onAddToCart}
      onViewProduct={onViewProduct}
      onBack={() => onNav('collections')}
    />
  }

  const displayCollections = collections.filter(c => c.handle !== 'bestsellers')

  return (
    <>
      <style>{`
        .collections-page { padding-top: 120px; min-height: 100vh; }
        .cp-hero {
          padding: 60px 0 48px; border-bottom: 1px solid var(--border);
          margin-bottom: 80px;
        }
        .cp-title {
          font-family: var(--serif); font-size: clamp(40px,5vw,72px);
          font-weight: 300; margin-bottom: 8px;
        }
        .cp-sub { font-size: 14px; color: var(--muted); }
        .cp-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 2px;
          margin-bottom: 80px;
        }
        .cp-card {
          position: relative; aspect-ratio: 2/3; overflow: hidden;
          cursor: pointer; background: var(--cream);
        }
        .cp-card img {
          width:100%;height:100%;object-fit:cover;
          transition: transform 0.8s var(--slow);
        }
        .cp-card:hover img { transform: scale(1.06); }
        .cp-card-body {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%);
          display: flex; flex-direction: column;
          justify-content: flex-end; padding: 40px;
          transition: background 0.4s;
        }
        .cp-card:hover .cp-card-body {
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 70%);
        }
        .cp-card-num {
          font-family: var(--serif); font-size: 72px; font-weight: 300;
          color: rgba(255,255,255,0.15); line-height: 1;
          margin-bottom: 8px;
        }
        .cp-card-title {
          font-family: var(--serif); font-size: 32px; font-weight: 300;
          color: white; margin-bottom: 6px;
        }
        .cp-card-count {
          font-size: 11px; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
        }
        .cp-card-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: white; border-bottom: 1px solid rgba(255,255,255,0.4);
          padding-bottom: 4px; background: none; border-left: none;
          border-right: none; border-top: none; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .cp-card:hover .cp-card-link { border-color: var(--gold); color: var(--gold-lt); }
        .cp-placeholder {
          width:100%;height:100%;
          display:flex;align-items:center;justify-content:center;
        }
        @media(max-width:768px) {
          .cp-grid { grid-template-columns: 1fr; }
          .cp-card { aspect-ratio: 4/3; }
        }
      `}</style>

      <div className="collections-page">
        <div className="container">
          <div className="cp-hero">
            <h1 className="cp-title">Collections</h1>
            <p className="cp-sub">Discover your perfect skincare ritual</p>
          </div>
        </div>

        <div className="cp-grid">
          {displayCollections.map((col, i) => (
            <div className="cp-card" key={col.id}
              onClick={() => onNav('collection', col.handle)}>
              {col.image
                ? <img src={col.image.url} alt={col.title}/>
                : <div className="cp-placeholder" style={{
                    background: ['linear-gradient(135deg,#e8e0d5,#d5c8b8)','linear-gradient(135deg,#d5e0e8,#c8d5e8)','linear-gradient(135deg,#d5e8d5,#c8e8c8)'][i%3]
                  }}>
                    <span style={{fontFamily:'var(--serif)',fontSize:64,opacity:0.2}}>
                      {['◎','◇','◈'][i%3]}
                    </span>
                  </div>
              }
              <div className="cp-card-body">
                <div className="cp-card-num">0{i+1}</div>
                <div className="cp-card-title">{col.title}</div>
                <div className="cp-card-count">
                  {col.products?.edges?.length || 0} products
                </div>
                <button className="cp-card-link">
                  Explore Collection →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
