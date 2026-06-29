import { useState } from 'react'
import { formatPrice } from '../lib/currency'

export default function ProductPage({ product, onAddToCart, cartLoading, onBack }) {
  const [activeImg, setActiveImg]   = useState(0)
  const [selected,  setSelected]    = useState(null)
  const [qty,       setQty]         = useState(1)
  const [added,     setAdded]       = useState(false)

  if (!product) return null

  const images   = product.images?.edges?.map(e => e.node) || []
  const variants = product.variants?.edges?.map(e => e.node) || []
  const price    = product.priceRange?.minVariantPrice
  const mainImg  = images[activeImg]?.url || product.featuredImage?.url
  const activeVar= selected || variants[0]

  function handleAdd() {
    if (!activeVar?.id) return
    onAddToCart(activeVar.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <style>{`
        .pdp { padding-top: 100px; min-height: 100vh; }
        .pdp-back {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); background: none; border: none;
          cursor: pointer; margin-bottom: 40px; transition: color 0.2s;
          padding: 0;
        }
        .pdp-back:hover { color: var(--ink); }
        .pdp-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: start; margin-bottom: 80px;
        }
        .pdp-images { position: sticky; top: 100px; }
        .pdp-main {
          aspect-ratio: 3/4; background: var(--cream);
          overflow: hidden; margin-bottom: 12px;
          cursor: zoom-in;
        }
        .pdp-main img {
          width:100%;height:100%;object-fit:cover;
          transition: transform 0.5s var(--slow);
        }
        .pdp-main:hover img { transform: scale(1.04); }
        .pdp-thumbs { display: flex; gap: 8px; }
        .pdp-thumb {
          width: 72px; height: 88px; background: var(--cream);
          overflow: hidden; cursor: pointer; border: 2px solid transparent;
          transition: border-color 0.2s; flex-shrink: 0;
        }
        .pdp-thumb.active { border-color: var(--ink); }
        .pdp-thumb img { width:100%;height:100%;object-fit:cover; }
        .pdp-info { padding-top: 8px; }
        .pdp-tag {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 12px;
        }
        .pdp-title {
          font-family: var(--serif); font-size: clamp(28px,3vw,42px);
          font-weight: 300; line-height: 1.2; margin-bottom: 16px;
        }
        .pdp-price {
          font-family: var(--serif); font-size: 28px; font-weight: 300;
          color: var(--gold); margin-bottom: 28px;
        }
        .pdp-divider { border: none; border-top: 1px solid var(--border); margin: 28px 0; }
        .pdp-desc { font-size: 14px; color: var(--muted); line-height: 1.8; margin-bottom: 28px; }
        .pdp-section-label {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 12px;
        }
        .pdp-variants { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .pdp-variant {
          padding: 10px 20px; border: 1px solid var(--border);
          background: none; font-size: 12px; cursor: pointer;
          transition: all 0.2s; color: var(--ink); letter-spacing: 0.05em;
        }
        .pdp-variant.active { border-color: var(--ink); background: var(--ink); color: white; }
        .pdp-variant:hover:not(.active) { border-color: var(--muted); }
        .pdp-variant:disabled { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }
        .pdp-qty { display: flex; align-items: center; gap: 0; margin-bottom: 24px; }
        .pdp-qty-btn {
          width: 40px; height: 40px; border: 1px solid var(--border);
          background: none; font-size: 18px; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .pdp-qty-btn:hover { border-color: var(--ink); }
        .pdp-qty-num {
          width: 56px; height: 40px;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .pdp-add {
          width: 100%; padding: 18px; background: var(--ink); color: white;
          border: none; font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer; transition: all 0.3s;
          margin-bottom: 12px; position: relative; overflow: hidden;
        }
        .pdp-add::before {
          content: ''; position: absolute; inset: 0; background: var(--gold);
          transform: translateX(-100%); transition: transform 0.4s var(--slow);
        }
        .pdp-add:hover::before { transform: translateX(0); }
        .pdp-add span { position: relative; z-index: 1; }
        .pdp-add:disabled { opacity: 0.6; cursor: not-allowed; }
        .pdp-features {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px;
        }
        .pdp-feature {
          padding: 20px; background: var(--off); border: 1px solid var(--border);
        }
        .pdp-feature-icon { font-size: 20px; margin-bottom: 8px; }
        .pdp-feature-title {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 4px; font-weight: 500;
        }
        .pdp-feature-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
        @media (max-width: 768px) {
          .pdp-grid { grid-template-columns: 1fr; gap: 32px; }
          .pdp-images { position: static; }
          .pdp-features { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pdp">
        <div className="container">
          <button className="pdp-back" onClick={onBack}>← Back</button>

          <div className="pdp-grid">
            {/* Images */}
            <div className="pdp-images">
              <div className="pdp-main">
                {mainImg
                  ? <img src={mainImg} alt={product.title}/>
                  : <div style={{width:'100%',height:'100%',background:'var(--cream)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{fontFamily:'var(--serif)',fontSize:64,color:'var(--border)'}}>◎</span>
                    </div>
                }
              </div>
              {images.length > 1 && (
                <div className="pdp-thumbs">
                  {images.map((img, i) => (
                    <div key={i}
                      className={`pdp-thumb ${activeImg===i?'active':''}`}
                      onClick={() => setActiveImg(i)}>
                      <img src={img.url} alt={`${product.title} ${i+1}`}/>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="pdp-info">
              {product.tags?.[0] && <div className="pdp-tag">{product.tags[0]}</div>}
              <h1 className="pdp-title">{product.title}</h1>
              {price && <div className="pdp-price">{formatPrice(price.amount, price.currencyCode)}</div>}

              <hr className="pdp-divider"/>

              {product.description && (
                <p className="pdp-desc">{product.description}</p>
              )}

              {/* Variants */}
              {variants.length > 1 && (
                <div>
                  <div className="pdp-section-label">// Select variant</div>
                  <div className="pdp-variants">
                    {variants.map(v => (
                      <button key={v.id}
                        className={`pdp-variant ${activeVar?.id===v.id?'active':''}`}
                        onClick={() => setSelected(v)}
                        disabled={!v.availableForSale}>
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="pdp-section-label">// Quantity</div>
              <div className="pdp-qty">
                <button className="pdp-qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                <div className="pdp-qty-num">{qty}</div>
                <button className="pdp-qty-btn" onClick={() => setQty(q => q+1)}>+</button>
              </div>

              <button className="pdp-add" onClick={handleAdd}
                disabled={cartLoading || !activeVar?.availableForSale}>
                <span>
                  {!activeVar?.availableForSale ? 'Sold Out'
                    : added ? '✓ Added to Cart'
                    : cartLoading ? 'Adding...'
                    : 'Add to Cart'}
                </span>
              </button>

              <hr className="pdp-divider"/>

              {/* Features */}
              <div className="pdp-features">
                {[
                  { icon:'◎', title:'Dermatologist Tested', text:'Safe for all skin types including sensitive' },
                  { icon:'◇', title:'Clean Formula', text:'No parabens, sulfates or harmful additives' },
                  { icon:'◈', title:'Cruelty Free', text:'Never tested on animals. Always.' },
                  { icon:'○', title:'Free Shipping', text:'On all orders over ₱3,000' },
                ].map(f => (
                  <div className="pdp-feature" key={f.title}>
                    <div className="pdp-feature-icon">{f.icon}</div>
                    <div className="pdp-feature-title">{f.title}</div>
                    <div className="pdp-feature-text">{f.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
