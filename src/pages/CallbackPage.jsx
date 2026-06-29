import { useEffect, useState, useRef } from 'react'

export default function CallbackPage({ handleCallback }) {
  const [status, setStatus] = useState('processing')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    handleCallback().then(success => {
      if (success) {
        setStatus('success')
        setTimeout(() => window.location.replace('/?account=1'), 800)
      } else {
        setStatus('error')
        setTimeout(() => window.location.replace('/'), 2500)
      }
    }).catch(() => {
      setStatus('error')
      setTimeout(() => window.location.replace('/'), 2500)
    })
  }, [])

  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:20,
      background:'var(--white)', fontFamily:'var(--sans)',
    }}>
      {status === 'processing' && (
        <>
          <div style={{
            width:40, height:40, border:'1px solid var(--border)',
            borderTop:'1px solid var(--gold)', borderRadius:'50%',
            animation:'spin 1s linear infinite',
          }}/>
          <div style={{fontSize:12,letterSpacing:'0.2em',color:'var(--muted)',textTransform:'uppercase'}}>
            Signing you in...
          </div>
        </>
      )}
      {status === 'success' && (
        <>
          <div style={{fontFamily:'var(--serif)',fontSize:48,color:'var(--gold)'}}>✓</div>
          <div style={{fontSize:12,letterSpacing:'0.2em',color:'var(--muted)',textTransform:'uppercase'}}>
            Welcome back
          </div>
        </>
      )}
      {status === 'error' && (
        <>
          <div style={{fontFamily:'var(--serif)',fontSize:48,color:'var(--muted)'}}>✕</div>
          <div style={{fontSize:12,letterSpacing:'0.2em',color:'var(--muted)',textTransform:'uppercase'}}>
            Sign in failed
          </div>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
