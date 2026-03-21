import { ExternalLink, MessageCircle, Send } from 'lucide-react'; 
 
const C = { 
  card: 'rgba(255,255,255,0.03)', 
  border: 'rgba(255,255,255,0.08)', 
  borderHover: 'rgba(255,255,255,0.14)', 
  t1: '#ececec', t2: '#8a8a8a', t3: '#555', 
  blue: '#5b8cf5', green: '#22c55e', 
  f: "'Inter', -apple-system, sans-serif", 
  m: "'DM Mono', monospace", 
}; 
 
const TG = 'https://t.me/YOUR_GROUP'; 
const WA = 'https://chat.whatsapp.com/YOUR_INVITE'; 
 
const RULES = [ 
  'Share verified opportunities only — include source links', 
  'Never share seed phrases, private keys, or wallet passwords', 
  'No spam, referral links, or unsolicited promotions', 
  'Respect every member — no harassment or personal attacks', 
]; 
 
export function CommunityHub() { 
  return ( 
    <div style={{ paddingBottom: 64, fontFamily: C.f }}> 
      <section style={{ marginBottom: 28 }}> 
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(91,140,245,0.1)', border: '1px solid rgba(91,140,245,0.2)', marginBottom: 10 }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} /> 
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Community</span> 
        </div> 
        <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 6px', letterSpacing: '-0.3px' }}>Community</h1> 
        <p style={{ fontSize: 14, color: C.t2, margin: 0, lineHeight: 1.6 }}>Share signals, discuss opportunities, and connect with other K9 users.</p> 
      </section> 
 
      {/* Join cards */} 
      <section style={{ marginBottom: 24 }}> 
        <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Join us</p> 
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}> 
          {[ 
            { href: TG, label: 'Telegram Group', sub: 'Real-time signals and community alerts', Icon: Send, color: C.blue }, 
            { href: WA, label: 'WhatsApp Group', sub: 'Opportunity alerts on WhatsApp', Icon: MessageCircle, color: C.green }, 
          ].map(({ href, label, sub, Icon, color }) => ( 
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}> 
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'border-color 0.1s' }} 
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderHover; }} 
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }}> 
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}> 
                  <Icon style={{ width: 16, height: 16, color }} /> 
                </div> 
                <div style={{ flex: 1 }}> 
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.t1, margin: '0 0 2px' }}>{label}</p> 
                  <p style={{ fontSize: 12, color: C.t2, margin: 0 }}>{sub}</p> 
                </div> 
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.03)' }}> 
                  <span style={{ fontSize: 12, fontWeight: 500, color: C.t2 }}>Join</span> 
                  <ExternalLink style={{ width: 11, height: 11, color: C.t3 }} /> 
                </div> 
              </div> 
            </a> 
          ))} 
        </div> 
      </section> 
 
      {/* Rules */} 
      <section> 
        <p style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Rules</p> 
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
          {RULES.map((rule, i) => ( 
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 18px', borderBottom: i < RULES.length - 1 ? `1px solid ${C.border}` : 'none' }}> 
              <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: C.m, color: C.t3, marginTop: 1 }}>{i + 1}</div> 
              <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.6 }}>{rule}</p> 
            </div> 
          ))} 
        </div> 
      </section> 
    </div> 
  ); 
} 
