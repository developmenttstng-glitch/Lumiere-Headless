export default function Footer({ onNav }) {
  return (
    <>
      <style>{`
        .footer {
          background: var(--ink); color: white;
          padding: 64px 0 32px;
        }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px; margin-bottom: 48px;
        }
        .footer-brand {}
        .footer-logo {
          font-family: var(--serif); font-size: 24px; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 16px;
        }
        .footer-logo span { color: var(--gold); }
        .footer-tagline {
          font-size: 13px; color: rgba(255,255,255,0.4);
          line-height: 1.7; max-width: 280px; margin-bottom: 24px;
        }
        .footer-col-title {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(255,255,255,0.4); margin-bottom: 20px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 12px; }
        .footer-link {
          font-size: 13px; color: rgba(255,255,255,0.7);
          background: none; border: none; cursor: pointer;
          text-align: left; padding: 0; transition: color 0.2s;
        }
        .footer-link:hover { color: var(--gold); }
        .footer-divider {
          border: none; border-top: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 24px;
        }
        .footer-bottom {
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-copy { font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.05em; }
        .footer-bottom-links { display: flex; gap: 24px; }
        .footer-bottom-link {
          font-size: 11px; color: rgba(255,255,255,0.3);
          background: none; border: none; cursor: pointer;
          transition: color 0.2s; letter-spacing: 0.05em;
        }
        .footer-bottom-link:hover { color: rgba(255,255,255,0.7); }
        @media(max-width:768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
        @media(max-width:480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">Lumi<span>è</span>re</div>
              <p className="footer-tagline">
                Premium skincare formulated with the finest ingredients. 
                Simple routines. Visible results.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Shop</div>
              <div className="footer-links">
                <button className="footer-link" onClick={() => onNav('shop')}>All Products</button>
                <button className="footer-link" onClick={() => onNav('collections')}>Collections</button>
                <button className="footer-link" onClick={() => onNav('collection','cleanse')}>Cleanse</button>
                <button className="footer-link" onClick={() => onNav('collection','hydrate')}>Hydrate</button>
                <button className="footer-link" onClick={() => onNav('collection','restore')}>Restore</button>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <div className="footer-links">
                <button className="footer-link" onClick={() => onNav('about')}>Our Story</button>
                <button className="footer-link">Ingredients</button>
                <button className="footer-link">Sustainability</button>
                <button className="footer-link">Press</button>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Support</div>
              <div className="footer-links">
                <button className="footer-link">FAQ</button>
                <button className="footer-link">Shipping</button>
                <button className="footer-link">Returns</button>
                <button className="footer-link">Contact Us</button>
              </div>
            </div>
          </div>

          <hr className="footer-divider"/>

          <div className="footer-bottom">
            <div className="footer-copy">© 2025 LUMIÈRE. All rights reserved.</div>
            <div className="footer-bottom-links">
              <button className="footer-bottom-link">Privacy</button>
              <button className="footer-bottom-link">Terms</button>
              <button className="footer-bottom-link">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
