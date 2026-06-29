export default function AboutPage({ onNav }) {
  return (
    <>
      <style>{`
        .about-page { padding-top: 100px; min-height: 100vh; }
        .about-hero {
          height: 60vh; background: var(--cream); display: flex;
          align-items: center; justify-content: center; text-align: center;
          position: relative; overflow: hidden;
        }
        .about-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--cream) 0%, #e8e0d5 60%, var(--gold-lt) 100%);
        }
        .about-hero-content { position: relative; z-index: 1; padding: 0 20px; }
        .about-hero-eyebrow {
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 16px;
        }
        .about-hero-title {
          font-family: var(--serif); font-size: clamp(40px,6vw,80px);
          font-weight: 300; line-height: 1.1; color: var(--ink);
        }
        .about-hero-title em { font-style: italic; color: var(--gold); }
        .about-section { padding: 80px 0; }
        .about-section:nth-child(even) { background: var(--off); }
        .about-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: center;
        }
        .about-img {
          aspect-ratio: 4/5; background: var(--cream); overflow: hidden;
        }
        .about-img-placeholder {
          width:100%;height:100%;
          display:flex;align-items:center;justify-content:center;
          background: linear-gradient(135deg, var(--cream), var(--gold-lt));
        }
        .about-content-eyebrow {
          font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 16px;
        }
        .about-content-title {
          font-family: var(--serif); font-size: clamp(28px,3vw,44px);
          font-weight: 300; line-height: 1.2; margin-bottom: 24px;
        }
        .about-content-title em { font-style: italic; color: var(--gold); }
        .about-content-text {
          font-size: 14px; color: var(--muted); line-height: 1.9; margin-bottom: 16px;
        }
        .about-values {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1px;
          background: var(--border); margin: 80px 0;
        }
        .about-value {
          background: var(--white); padding: 40px 28px; text-align: center;
        }
        .about-value-icon {
          font-family: var(--serif); font-size: 36px; color: var(--gold);
          margin-bottom: 16px; display: block;
        }
        .about-value-title {
          font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 10px; font-weight: 500;
        }
        .about-value-text { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .about-cta {
          background: var(--ink); padding: 80px 0; text-align: center;
        }
        .about-cta-title {
          font-family: var(--serif); font-size: clamp(28px,4vw,52px);
          font-weight: 300; color: white; margin-bottom: 12px;
        }
        .about-cta-title em { font-style: italic; color: var(--gold-lt); }
        .about-cta-sub {
          font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 32px;
        }
        .about-cta-btn {
          padding: 16px 48px; background: var(--gold); color: white;
          border: none; font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer; transition: background 0.2s;
        }
        .about-cta-btn:hover { background: var(--gold-lt); color: var(--ink); }
        @media(max-width:768px) {
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .about-values { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <div className="about-page">
        <div className="about-hero">
          <div className="about-hero-bg"/>
          <div className="about-hero-content">
            <div className="about-hero-eyebrow">Our Story</div>
            <h1 className="about-hero-title">
              Born from a belief<br/>that <em>less is more</em>
            </h1>
          </div>
        </div>

        <section className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-img">
                <img
                  src="https://cdn.shopify.com/s/files/1/0816/5854/4352/files/lumi-re-our-beginning_9ad07ad5-5a30-4b25-985a-df7e61a0ab7a.png?v=1782704371"
                  alt="LUMIÈRE — Our Beginning"
                  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}
                />
              </div>
              <div>
                <div className="about-content-eyebrow">The Beginning</div>
                <h2 className="about-content-title">
                  Skincare that <em>works</em>,<br/>without the noise
                </h2>
                <p className="about-content-text">
                  LUMIÈRE was founded on a simple frustration — skincare had become 
                  overwhelmingly complex. Ten-step routines, conflicting ingredients, 
                  products promising miracles but delivering confusion.
                </p>
                <p className="about-content-text">
                  We set out to create something different. Working with leading 
                  dermatologists and cosmetic chemists, we distilled decades of 
                  skincare science into a focused collection of essential products.
                </p>
                <p className="about-content-text">
                  Every formula in our range has a singular purpose and uses only 
                  what is necessary to achieve it. Nothing more, nothing less.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-values">
              {[
                { icon:'◎', title:'Transparency', text:'Full ingredient disclosure on every product. No hidden formulas.' },
                { icon:'◇', title:'Efficacy', text:'Every ingredient is clinically proven. We only use what works.' },
                { icon:'◈', title:'Purity', text:'No parabens, sulfates, artificial fragrances or harmful additives.' },
                { icon:'○', title:'Sustainability', text:'Recyclable packaging. Responsible sourcing. Cruelty free always.' },
              ].map(v => (
                <div className="about-value" key={v.title}>
                  <span className="about-value-icon">{v.icon}</span>
                  <div className="about-value-title">{v.title}</div>
                  <div className="about-value-text">{v.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="about-cta">
          <div className="container">
            <div className="about-cta-title">
              Ready to <em>simplify</em> your routine?
            </div>
            <div className="about-cta-sub">Discover the LUMIÈRE collection</div>
            <button className="about-cta-btn" onClick={() => onNav('shop')}>
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
