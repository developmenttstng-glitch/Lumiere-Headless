import { formatPrice } from '../lib/currency'

export default function CartDrawer({ lines, totalPrice, currency, onClose, onCheckout, loading, onUpdateQuantity, onRemoveLine }) {
  return (
    <>
      <style>{`
        .cart-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.3);
          z-index: 300; backdrop-filter: blur(4px);
          animation: fadeIn 0.3s var(--ease);
        }
        .cart-drawer {
          position: fixed; right: 0; top: 0; bottom: 0; width: 420px;
          background: var(--white); z-index: 301;
          display: flex; flex-direction: column;
          animation: slideInRight 0.4s var(--slow);
          box-shadow: -20px 0 60px rgba(0,0,0,0.08);
        }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
        .cart-header {
          padding: 28px 32px; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .cart-title {
          font-family: var(--serif); font-size: 22px;
          font-weight: 300; letter-spacing: 0.05em;
        }
        .cart-close {
          background: none; border: none; font-size: 24px;
          color: var(--muted); cursor: pointer; line-height: 1;
          transition: color 0.2s;
        }
        .cart-close:hover { color: var(--ink); }
        .cart-body { flex: 1; overflow-y: auto; padding: 24px 32px; }
        .cart-empty {
          text-align: center; padding: 60px 0;
          font-size: 13px; color: var(--muted); letter-spacing: 0.08em;
        }
        .cart-empty-icon {
          font-family: var(--serif); font-size: 48px;
          color: var(--border); margin-bottom: 16px; display: block;
        }
        .cart-item {
          display: flex; gap: 16px; padding: 20px 0;
          border-bottom: 1px solid var(--border);
        }
        .cart-item-img {
          width: 80px; height: 96px; flex-shrink: 0;
          background: var(--cream); overflow: hidden;
        }
        .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .cart-item-info { flex: 1; }
        .cart-item-name { font-size: 13px; margin-bottom: 4px; font-weight: 400; }
        .cart-item-variant { font-size: 11px; color: var(--muted); letter-spacing: 0.05em; margin-bottom: 8px; }
        .cart-item-price { font-size: 13px; color: var(--gold); }
        .cart-item-controls { display: flex; align-items: center; gap: 0; margin-top: 10px; }
        .qty-btn {
          width: 28px; height: 28px; border: 1px solid var(--border);
          background: none; color: var(--ink); font-size: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .qty-btn:hover { border-color: var(--gold); color: var(--gold); }
        .qty-num {
          width: 36px; height: 28px;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
        }
        .remove-btn {
          margin-left: 10px; background: none; border: none;
          font-size: 18px; color: var(--muted); cursor: pointer;
          transition: color 0.15s; line-height: 1;
        }
        .remove-btn:hover { color: var(--ink); }
        .cart-footer { padding: 24px 32px; border-top: 1px solid var(--border); }
        .cart-total {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 20px;
        }
        .cart-total-label {
          font-size: 11px; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--muted);
        }
        .cart-total-val {
          font-family: var(--serif); font-size: 24px; font-weight: 300;
        }
        .checkout-btn {
          width: 100%; padding: 16px; background: var(--ink); color: white;
          border: none; font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer;
          transition: background 0.2s;
        }
        .checkout-btn:hover { background: var(--gold); }
        .checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 480px) {
          .cart-drawer { width: 100%; }
        }
      `}</style>

      <div className="cart-overlay" onClick={onClose}/>
      <div className="cart-drawer">
        <div className="cart-header">
          <div className="cart-title">Your Cart</div>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-body">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">◦</span>
              Your cart is empty
            </div>
          ) : lines.map(line => (
            <div className="cart-item" key={line.id}>
              <div className="cart-item-img">
                {line.merchandise?.product?.featuredImage
                  ? <img src={line.merchandise.product.featuredImage.url} alt={line.merchandise.product.title}/>
                  : <div style={{width:'100%',height:'100%',background:'var(--cream)'}}/>
                }
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{line.merchandise.product.title}</div>
                {line.merchandise.title !== 'Default Title' && (
                  <div className="cart-item-variant">{line.merchandise.title}</div>
                )}
                <div className="cart-item-price">
                  {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn"
                    onClick={() => line.quantity > 1
                      ? onUpdateQuantity(line.id, line.quantity - 1)
                      : onRemoveLine(line.id)}>−</button>
                  <div className="qty-num">{line.quantity}</div>
                  <button className="qty-btn"
                    onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}>+</button>
                  <button className="remove-btn" onClick={() => onRemoveLine(line.id)}>×</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-val">{formatPrice(totalPrice, currency)}</span>
          </div>
          <button className="checkout-btn"
            onClick={onCheckout}
            disabled={lines.length === 0 || loading}>
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </>
  )
}
