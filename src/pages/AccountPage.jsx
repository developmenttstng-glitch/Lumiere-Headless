import { useState, useEffect } from 'react'
import { formatPrice } from '../lib/currency'

export default function AccountPage({ customer, onLogout, fetchOrders, onNav }) {
  const [tab,         setTab]         = useState('profile')
  const [orders,      setOrders]      = useState([])
  const [loading,     setLoading]     = useState(false)
  const [activeOrder, setActiveOrder] = useState(null)

  useEffect(() => {
    if (tab === 'orders' && orders.length === 0) {
      setLoading(true)
      fetchOrders().then(o => { setOrders(o); setLoading(false) })
    }
  }, [tab])

  function fmt(d) {
    return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
  }

  function money(obj) {
    if (!obj) return '—'
    return formatPrice(obj.amount, obj.currencyCode)
  }

  function statusColor(s) {
    if (!s) return 'var(--muted)'
    const sl = s.toLowerCase()
    if (sl.includes('paid')||sl.includes('fulfilled')||sl.includes('delivered')) return '#5a8a6a'
    if (sl.includes('pending')||sl.includes('partial')) return '#b8860b'
    if (sl.includes('refund')||sl.includes('cancel')) return '#8a4a4a'
    return 'var(--muted)'
  }

  return (
    <>
      <style>{`
        .account-page { padding-top: 100px; min-height: 100vh; }
        .account-hero {
          padding: 60px 0 40px; border-bottom: 1px solid var(--border);
          background: var(--off);
        }
        .account-eyebrow {
          font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 12px;
        }
        .account-title {
          font-family: var(--serif); font-size: clamp(32px,4vw,52px);
          font-weight: 300; margin-bottom: 4px;
        }
        .account-email { font-size: 13px; color: var(--muted); }
        .account-layout {
          display: grid; grid-template-columns: 220px 1fr; min-height: 60vh;
        }
        .account-sidebar {
          border-right: 1px solid var(--border); padding: 40px 0;
        }
        .sidebar-btn {
          display: block; width: 100%; text-align: left;
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 12px 32px; background: none; border: none;
          color: var(--muted); cursor: pointer; transition: all 0.2s;
          border-left: 2px solid transparent;
        }
        .sidebar-btn:hover { color: var(--ink); }
        .sidebar-btn.active { color: var(--ink); border-left-color: var(--gold); }
        .sidebar-divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
        .sidebar-logout {
          display: block; width: 100%; text-align: left;
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 12px 32px; background: none; border: none;
          color: var(--muted); cursor: pointer; transition: color 0.2s;
        }
        .sidebar-logout:hover { color: var(--ink); }
        .account-content { padding: 40px 48px; }

        /* Profile */
        .profile-avatar {
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--cream); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif); font-size: 24px; color: var(--gold);
          margin-bottom: 16px;
        }
        .profile-name { font-family: var(--serif); font-size: 24px; font-weight: 300; margin-bottom: 4px; }
        .profile-email { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
        .profile-card {
          border: 1px solid var(--border); max-width: 480px;
        }
        .profile-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 20px; border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .profile-row:last-child { border-bottom: none; }
        .profile-lbl {
          font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--muted);
        }
        .profile-val { color: var(--ink); }

        /* Orders */
        .orders-empty { padding: 60px 0; text-align: center; }
        .orders-empty-icon { font-family: var(--serif); font-size: 48px; color: var(--border); margin-bottom: 16px; }
        .orders-empty-text { font-size: 13px; color: var(--muted); letter-spacing: 0.08em; margin-bottom: 24px; }
        .shop-btn {
          padding: 14px 32px; background: var(--ink); color: white;
          border: none; font-size: 11px; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer;
        }
        .order-card { border: 1px solid var(--border); margin-bottom: 12px; }
        .order-card:hover { border-color: var(--gold); }
        .order-header {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px; border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .order-num { font-family: var(--serif); font-size: 18px; font-weight: 300; }
        .order-date { font-size: 12px; color: var(--muted); }
        .order-badge {
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 10px; border: 1px solid;
        }
        .order-total { font-family: var(--serif); font-size: 18px; font-weight: 300; margin-left: auto; }
        .order-items-preview { padding: 12px 20px; }
        .order-item-row { font-size: 12px; color: var(--muted); padding: 2px 0; }
        .order-actions { padding: 12px 20px; border-top: 1px solid var(--border); }
        .order-detail-btn {
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 8px 16px; border: 1px solid var(--border);
          background: none; color: var(--ink); cursor: pointer; transition: all 0.2s;
        }
        .order-detail-btn:hover { border-color: var(--gold); color: var(--gold); }

        /* Order modal */
        .od-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          z-index: 500; display: flex; align-items: center; justify-content: center;
          padding: 20px; backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        .od-modal {
          background: var(--white); width: 100%; max-width: 680px;
          max-height: 90vh; overflow-y: auto; position: relative;
          animation: fadeUp 0.3s ease;
        }
        .od-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none; font-size: 24px;
          color: var(--muted); cursor: pointer; z-index: 1;
          transition: color 0.2s;
        }
        .od-close:hover { color: var(--ink); }
        .od-header { padding: 32px; border-bottom: 1px solid var(--border); }
        .od-title { font-family: var(--serif); font-size: 24px; font-weight: 300; margin-bottom: 4px; }
        .od-date { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
        .od-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .od-body { padding: 28px 32px; display: flex; flex-direction: column; gap: 24px; }
        .od-section-label {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 12px; padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }
        .od-table { width: 100%; border-collapse: collapse; }
        .od-table th {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); padding: 8px 12px; text-align: left;
          border-bottom: 1px solid var(--border); background: var(--off);
        }
        .od-table td {
          font-size: 13px; padding: 12px; border-bottom: 1px solid var(--border);
          vertical-align: top;
        }
        .od-totals { background: var(--off); border: 1px solid var(--border); padding: 16px 20px; }
        .od-total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
        .od-total-lbl { color: var(--muted); }
        .od-total-row.grand { border-top: 1px solid var(--border); margin-top: 8px; padding-top: 10px; }
        .od-total-row.grand .od-total-lbl { color: var(--ink); font-weight: 500; }
        .od-total-row.grand .od-total-val { font-family: var(--serif); font-size: 18px; }
        .od-address { font-size: 13px; color: var(--ink); line-height: 1.8; }
        .od-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .od-fulfillment { background: var(--off); border: 1px solid var(--border); padding: 16px; }
        .od-tracking { display: flex; align-items: center; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
        .od-track-link {
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 12px; border: 1px solid var(--gold); color: var(--gold);
          background: none; cursor: pointer; text-decoration: none; transition: all 0.2s;
        }
        .od-track-link:hover { background: var(--gold); color: white; }

        @media (max-width: 768px) {
          .account-layout { grid-template-columns: 1fr; }
          .account-sidebar { border-right: none; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; padding: 10px 0; }
          .sidebar-btn { width: auto; border-left: none; border-bottom: 2px solid transparent; }
          .sidebar-btn.active { border-bottom-color: var(--gold); border-left-color: transparent; }
          .account-content { padding: 24px 20px; }
          .od-two-col { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="account-page">
        <div className="account-hero">
          <div className="container">
            <div className="account-eyebrow">My Account</div>
            <div className="account-title">Welcome, {customer.firstName || customer.name}</div>
            <div className="account-email">{customer.email}</div>
          </div>
        </div>

        <div className="account-layout">
          <div className="account-sidebar">
            <button className={`sidebar-btn ${tab==='profile'?'active':''}`} onClick={()=>setTab('profile')}>Profile</button>
            <button className={`sidebar-btn ${tab==='orders'?'active':''}`}  onClick={()=>setTab('orders')}>Orders</button>
            <hr className="sidebar-divider"/>
            <button className="sidebar-logout" onClick={onLogout}>Sign Out</button>
          </div>

          <div className="account-content">
            {/* Profile */}
            {tab === 'profile' && (
              <div>
                <div className="profile-avatar">
                  {(customer.firstName||customer.email||'?')[0].toUpperCase()}
                </div>
                <div className="profile-name">{customer.firstName} {customer.lastName}</div>
                <div className="profile-email">{customer.email}</div>
                <div className="profile-card">
                  {[['First Name',customer.firstName||'—'],['Last Name',customer.lastName||'—'],['Email',customer.email||'—'],['Account ID',customer.id?.split('/').pop()||'—']].map(([l,v])=>(
                    <div className="profile-row" key={l}>
                      <span className="profile-lbl">{l}</span>
                      <span className="profile-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div>
                {loading ? (
                  <div style={{padding:'40px 0',textAlign:'center',fontSize:12,letterSpacing:'0.15em',color:'var(--muted)',textTransform:'uppercase'}}>
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="orders-empty">
                    <div className="orders-empty-icon">◎</div>
                    <div className="orders-empty-text">No orders yet</div>
                    <button className="shop-btn" onClick={()=>onNav('shop')}>Start Shopping</button>
                  </div>
                ) : orders.map(order => (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <div>
                        <div className="order-num">{order.name}</div>
                        <div className="order-date">{fmt(order.processedAt)}</div>
                      </div>
                      <span className="order-badge" style={{color:statusColor(order.financialStatus),borderColor:statusColor(order.financialStatus)}}>
                        {order.financialStatus}
                      </span>
                      <span className="order-badge" style={{color:statusColor(order.fulfillmentStatus),borderColor:statusColor(order.fulfillmentStatus)}}>
                        {order.fulfillmentStatus}
                      </span>
                      <div className="order-total">{money(order.totalPrice)}</div>
                    </div>
                    <div className="order-items-preview">
                      {(order.lineItems?.nodes||[]).slice(0,2).map((item,i)=>(
                        <div className="order-item-row" key={i}>{item.title} × {item.quantity}</div>
                      ))}
                      {(order.lineItems?.nodes||[]).length > 2 && (
                        <div className="order-item-row" style={{color:'var(--gold)'}}>
                          +{order.lineItems.nodes.length-2} more
                        </div>
                      )}
                    </div>
                    <div className="order-actions">
                      <button className="order-detail-btn" onClick={()=>setActiveOrder(order)}>
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="od-overlay" onClick={()=>setActiveOrder(null)}>
          <div className="od-modal" onClick={e=>e.stopPropagation()}>
            <button className="od-close" onClick={()=>setActiveOrder(null)}>×</button>
            <div className="od-header">
              <div className="od-title">Order {activeOrder.name}</div>
              <div className="od-date">Placed on {fmt(activeOrder.processedAt)}</div>
              <div className="od-badges">
                <span className="order-badge" style={{color:statusColor(activeOrder.financialStatus),borderColor:statusColor(activeOrder.financialStatus)}}>{activeOrder.financialStatus}</span>
                <span className="order-badge" style={{color:statusColor(activeOrder.fulfillmentStatus),borderColor:statusColor(activeOrder.fulfillmentStatus)}}>{activeOrder.fulfillmentStatus}</span>
              </div>
            </div>
            <div className="od-body">
              {/* Items */}
              <div>
                <div className="od-section-label">Items Ordered</div>
                <table className="od-table">
                  <thead><tr><th>Product</th><th>Qty</th></tr></thead>
                  <tbody>
                    {(activeOrder.lineItems?.nodes||[]).map((item,i)=>(
                      <tr key={i}>
                        <td>
                          <div>{item.title}</div>
                          {item.variantTitle && item.variantTitle!=='Default Title' && (
                            <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{item.variantTitle}</div>
                          )}
                        </td>
                        <td style={{textAlign:'center'}}>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div>
                <div className="od-section-label">Order Total</div>
                <div className="od-totals">
                  {activeOrder.totalShipping && (
                    <div className="od-total-row"><span className="od-total-lbl">Shipping</span><span>{money(activeOrder.totalShipping)}</span></div>
                  )}
                  {activeOrder.totalTax && parseFloat(activeOrder.totalTax.amount)>0 && (
                    <div className="od-total-row"><span className="od-total-lbl">Tax</span><span>{money(activeOrder.totalTax)}</span></div>
                  )}
                  <div className="od-total-row grand">
                    <span className="od-total-lbl">Total</span>
                    <span className="od-total-val">{money(activeOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping + Fulfillment */}
              <div className="od-two-col">
                {activeOrder.shippingAddress && (
                  <div>
                    <div className="od-section-label">Shipping Address</div>
                    <div className="od-address">
                      {activeOrder.shippingAddress.firstName} {activeOrder.shippingAddress.lastName}<br/>
                      {activeOrder.shippingAddress.address1}<br/>
                      {activeOrder.shippingAddress.address2 && <>{activeOrder.shippingAddress.address2}<br/></>}
                      {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.province} {activeOrder.shippingAddress.zip}<br/>
                      {activeOrder.shippingAddress.country}
                    </div>
                  </div>
                )}
                <div>
                  <div className="od-section-label">Fulfillment</div>
                  {(activeOrder.fulfillments?.nodes||[]).length === 0 ? (
                    <div style={{fontSize:13,color:'var(--muted)'}}>Not yet fulfilled</div>
                  ) : activeOrder.fulfillments.nodes.map((f,i)=>(
                    <div className="od-fulfillment" key={i}>
                      <div style={{fontSize:12,letterSpacing:'0.1em',textTransform:'uppercase',color:statusColor(f.status)}}>{f.status}</div>
                      {f.estimatedDeliveryAt && (
                        <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>Est. {fmt(f.estimatedDeliveryAt)}</div>
                      )}
                      {(f.trackingInformation||[]).map((t,j)=>(
                        <div className="od-tracking" key={j}>
                          {t.company && <span style={{fontSize:12,color:'var(--muted)'}}>{t.company}</span>}
                          {t.number && <span style={{fontSize:12}}>{t.number}</span>}
                          {t.url && <a href={t.url} target="_blank" rel="noreferrer" className="od-track-link">Track →</a>}
                        </div>
                      ))}
                      {(!f.trackingInformation||f.trackingInformation.length===0) && (
                        <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>No tracking yet</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
