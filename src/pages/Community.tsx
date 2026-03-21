import { ExternalLink, MessageCircle, Send } from 'lucide-react'; 
 
const TELEGRAM_LINK  = 'https://t.me/YOUR_GROUP_LINK_HERE'; 
const WHATSAPP_LINK  = 'https://chat.whatsapp.com/YOUR_INVITE_LINK_HERE'; 
 
const RULES = [ 
  'Share verified opportunities only — include source links', 
  'Never share seed phrases, private keys, or wallet passwords', 
  'No spam, referral links, or unsolicited promotions', 
  'Respect every member — no harassment or personal attacks', 
]; 
 
export default function CommunityPage() { 
  return ( 
    <div className="pb-20"> 
      <section className="mb-8"> 
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-intel/10 border border-intel/20 rounded mb-3"> 
          <div className="w-1.5 h-1.5 rounded-full bg-safe" /> 
          <span className="text-[10px] font-mono text-intel tracking-[0.1em] uppercase">Community</span> 
        </div> 
        <h1 className="text-[28px] font-bold text-t1 mb-2 tracking-tight">Community</h1> 
        <p className="text-[14px] text-t2 leading-relaxed"> 
          Share signals, discuss opportunities, and connect with other K9 users. 
        </p> 
      </section> 
 
      <section className="mb-10"> 
        <p className="text-[10px] font-mono text-t3 uppercase tracking-[0.1em] mb-3">Join us</p> 
        {[ 
          { href: TELEGRAM_LINK, label: 'Telegram Group', sub: 'Real-time signals and community alerts', 
            Icon: Send, color: '#29B6F6' }, 
          { href: WHATSAPP_LINK, label: 'WhatsApp Group', sub: 'Opportunity alerts on WhatsApp', 
            Icon: MessageCircle, color: '#00BF72' }, 
        ].map(({ href, label, sub, Icon, color }) => ( 
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" 
            className="block mb-2.5 no-underline group"> 
            <div className="bg-bg-surface border border-line-1 group-hover:border-line-2 rounded-xl p-5 flex items-center gap-4 transition-colors"> 
              <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" 
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}> 
                <Icon style={{ width: 19, height: 19, color }} /> 
              </div> 
              <div className="flex-1"> 
                <p className="text-[14px] font-semibold text-t1 mb-0.5">{label}</p> 
                <p className="text-[12px] text-t2">{sub}</p> 
              </div> 
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" 
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}> 
                <span className="text-[12px] font-medium" style={{ color }}>Join</span> 
                <ExternalLink style={{ width: 11, height: 11, color }} /> 
              </div> 
            </div> 
          </a> 
        ))} 
      </section> 
 
      <section> 
        <p className="text-[10px] font-mono text-t3 uppercase tracking-[0.1em] mb-3">Rules</p> 
        <div className="bg-bg-surface border border-line-1 rounded-xl overflow-hidden"> 
          {RULES.map((rule, i) => ( 
            <div key={i} className={`flex gap-3 items-start p-4 ${i < RULES.length - 1 ? 'border-b border-line-1' : ''}`}> 
              <div className="w-5 h-5 rounded-full bg-bg-elevated border border-line-1 flex items-center justify-center text-[10px] font-mono text-t3 flex-shrink-0 mt-0.5">{i + 1}</div> 
              <p className="text-[13px] text-t2 leading-relaxed m-0">{rule}</p> 
            </div> 
          ))} 
        </div> 
      </section> 
    </div> 
  ); 
} 
