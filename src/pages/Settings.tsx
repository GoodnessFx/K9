import { useState, useRef } from 'react'; 
import { 
  User, Bell, Key, CreditCard, 
  ChevronRight, LogOut, Shield, Send, 
  MessageSquare, 
  Camera, Eye, EyeOff, 
} from 'lucide-react'; 
import { toast } from 'sonner'; 
import { useMutation } from '@tanstack/react-query'; 
import { api } from '../api'; 
 
const C = { 
  bg:    '#1a1a1a', 
  card:  'rgba(255,255,255,0.03)', 
  inset: 'rgba(0,0,0,0.2)', 
  border:     'rgba(255,255,255,0.08)', 
  borderHover: 'rgba(255,255,255,0.14)', 
  t1: '#ececec', t2: '#8a8a8a', t3: '#555', 
  blue:  '#5b8cf5', green: '#22c55e', red: '#ef4444', 
  f: "'Inter', -apple-system, sans-serif", 
  m: "'DM Mono', monospace", 
}; 
 
// ── Shared input style ────────────────────────────────────── 
const INPUT: React.CSSProperties = { 
  width: '100%', 
  padding: '9px 13px', 
  background: 'rgba(255,255,255,0.04)', 
  border: `1px solid ${C.border}`, 
  borderRadius: 7, 
  color: C.t1, 
  fontSize: 13, 
  fontFamily: C.f, 
  outline: 'none', 
  boxSizing: 'border-box', 
  transition: 'border-color 0.1s', 
}; 
 
const LABEL: React.CSSProperties = { 
  fontSize: 10, 
  fontFamily: C.m, 
  color: C.t3, 
  textTransform: 'uppercase', 
  letterSpacing: '0.08em', 
  display: 'block', 
  marginBottom: 6, 
}; 
 
// ── localStorage helpers ──────────────────────────────────── 
function load<T>(key: string, fallback: T): T { 
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } 
  catch { return fallback; } 
} 
function save(key: string, value: any) { 
  try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); } catch {} 
} 
 
// ── Card ──────────────────────────────────────────────────── 
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) { 
  return ( 
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '20px 22px', ...style }}> 
      {children} 
    </div> 
  ); 
} 
 
// ── Section heading ───────────────────────────────────────── 
function SectionHead({ label, Icon }: { label: string; Icon: any }) { 
  return ( 
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingBottom: 14, marginBottom: 16, borderBottom: `1px solid ${C.border}` }}> 
      <Icon style={{ width: 15, height: 15, color: C.t2 }} /> 
      <span style={{ fontSize: 14, fontWeight: 500, color: C.t1, fontFamily: C.f }}>{label}</span> 
    </div> 
  ); 
} 
 
// ══════════════════════════════════════════════════════════════ 
export default function SettingsPage() { 
  const [tab, setTab] = useState('profile'); 
 
  const TABS = [ 
    { id: 'profile',       label: 'My Profile',        Icon: User }, 
    { id: 'notifications', label: 'Alert Preferences', Icon: Bell }, 
    { id: 'security',      label: 'Security',          Icon: Key }, 
    { id: 'billing',       label: 'Billing & Plans',   Icon: CreditCard }, 
  ]; 
 
  function handleLogout() { 
    if (!confirm('Sign out of K9?')) return; 
    ['k9_onboarding_done','k9_user_phone','k9_settings','k9_telegram_connected', 
     'k9_saved','k9_user_interests','k9_user_channel','k9_profile','k9_profile_name','k9_profile_avatar','k9_profile_email'].forEach(k => localStorage.removeItem(k)); 
    window.location.href = '/'; 
  } 
 
  const name = load<string>('k9_profile_name', '') || load<string>('k9_user_phone', ''); 
 
  return ( 
    <div style={{ paddingBottom: 80, fontFamily: C.f }}> 
      {/* Header */} 
      <section style={{ marginBottom: 20 }}> 
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(91,140,245,0.1)', border: '1px solid rgba(91,140,245,0.2)', marginBottom: 10 }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} /> 
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Configuration</span> 
        </div> 
        <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 6px', letterSpacing: '-0.3px' }}>Settings</h1> 
        <p style={{ fontSize: 14, color: C.t2, margin: 0, lineHeight: 1.6 }}> 
          {name ? `Hey ${name} — ` : ''}Manage your profile, alerts, and account preferences. 
        </p> 
      </section> 
 
      {/* Tab bar — scrollable on mobile */} 
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 16, paddingBottom: 2 }}> 
        {TABS.map(({ id, label, Icon }) => { 
          const active = tab === id; 
          return ( 
            <button key={id} onClick={() => setTab(id)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: 6, 
                padding: '7px 14px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0, 
                border: `1px solid ${active ? 'rgba(91,140,245,0.4)' : C.border}`, 
                background: active ? 'rgba(91,140,245,0.1)' : 'transparent', 
                color: active ? C.blue : C.t2, 
                fontSize: 13, fontFamily: C.f, fontWeight: active ? 500 : 400, 
                cursor: 'pointer', transition: 'all 0.1s', 
              }}> 
              <Icon style={{ width: 13, height: 13 }} /> 
              {label} 
            </button> 
          ); 
        })} 
      </div> 
 
      {/* Content */} 
      <div> 
        {tab === 'profile'       && <ProfileTab />} 
        {tab === 'notifications' && <NotificationsTab />} 
        {tab === 'security'      && <SecurityTab />} 
        {tab === 'billing'       && <BillingTab />} 
      </div> 
 
      {/* Sign out — always visible at bottom */} 
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}> 
        <button onClick={handleLogout} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: 9, 
            padding: '9px 14px', borderRadius: 7, border: '1px solid transparent', 
            background: 'transparent', color: C.red, fontSize: 13, fontFamily: C.f, 
            cursor: 'pointer', transition: 'all 0.1s', 
          }} 
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }} 
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }} 
        > 
          <LogOut style={{ width: 14, height: 14 }} /> 
          Sign out 
        </button> 
      </div> 
    </div> 
  ); 
} 
 
// ══════════════════════════════════════════════════════════════ 
// PROFILE TAB 
// ══════════════════════════════════════════════════════════════ 
function ProfileTab() { 
  const [name,   setName]   = useState(() => load('k9_profile_name',   '')); 
  const [phone,  setPhone]  = useState(() => load('k9_user_phone',     '')); 
  const [email,  setEmail]  = useState(() => load('k9_profile_email',  '')); 
  const [channel, setChannel] = useState<'whatsapp'|'telegram'>(() => load('k9_user_channel', 'whatsapp')); 
  const [avatar, setAvatar] = useState<string>(() => load('k9_profile_avatar', '')); 
  const fileRef = useRef<HTMLInputElement>(null); 
 
  function handleAvatarClick() { fileRef.current?.click(); } 
 
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) { 
    const file = e.target.files?.[0]; 
    if (!file) return; 
    if (file.size > 2 * 1024 * 1024) { toast.error('Image too large — max 2MB'); return; } 
    const reader = new FileReader(); 
    reader.onload = ev => { 
      const url = ev.target?.result as string; 
      setAvatar(url); 
      save('k9_profile_avatar', url); 
      toast.success('Photo updated'); 
    }; 
    reader.readAsDataURL(file); 
  } 
 
  function handleSave() { 
    save('k9_profile_name',   name); 
    save('k9_user_phone',     phone); 
    save('k9_profile_email',  email); 
    save('k9_user_channel',   channel); 
    toast.success('Profile saved'); 
  } 
 
  const displayName = name || 'K9 User'; 
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2); 
 
  return ( 
    <Card> 
      <SectionHead label="My Profile" Icon={User} /> 
 
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 24 }}> 
        {/* Avatar */} 
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}> 
          <div 
            onClick={handleAvatarClick} 
            style={{ 
              width: 88, height: 88, borderRadius: '50%', 
              background: avatar ? 'transparent' : 'rgba(91,140,245,0.12)', 
              border: `2px solid ${C.border}`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer', overflow: 'hidden', position: 'relative', flexShrink: 0, 
              transition: 'border-color 0.1s', 
            }} 
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderHover; }} 
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }} 
          > 
            {avatar 
              ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
              : <span style={{ fontSize: 24, fontWeight: 600, color: C.blue }}>{initials}</span> 
            } 
            <div style={{ 
              position: 'absolute', inset: 0, 
              background: 'rgba(0,0,0,0.55)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              opacity: 0, transition: 'opacity 0.15s', 
            }} 
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }} 
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }} 
            > 
              <Camera style={{ width: 18, height: 18, color: '#fff' }} /> 
            </div> 
          </div> 
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} /> 
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textAlign: 'center', lineHeight: 1.4 }}>Click to upload photo</span> 
          {avatar && ( 
            <button onClick={() => { setAvatar(''); save('k9_profile_avatar', ''); }} 
              style={{ fontSize: 11, color: C.red, background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.f }}> 
              Remove 
            </button> 
          )} 
        </div> 
 
        {/* Fields */} 
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}> 
          <div> 
            <label style={LABEL}>Name</label> 
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" 
              style={INPUT} 
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,140,245,0.5)'; }} 
              onBlur={e => { e.currentTarget.style.borderColor = C.border; }} 
            /> 
          </div> 
          <div> 
            <label style={LABEL}>Phone number</label> 
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+234 801 234 5678" 
              style={INPUT} 
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,140,245,0.5)'; }} 
              onBlur={e => { e.currentTarget.style.borderColor = C.border; }} 
            /> 
          </div> 
          <div> 
            <label style={LABEL}>Email (optional)</label> 
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" 
              style={INPUT} 
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,140,245,0.5)'; }} 
              onBlur={e => { e.currentTarget.style.borderColor = C.border; }} 
            /> 
          </div> 
          <div> 
            <label style={LABEL}>Default alert channel</label> 
            <div style={{ display: 'flex', gap: 8 }}> 
              {(['whatsapp', 'telegram'] as const).map(ch => ( 
                <button key={ch} onClick={() => setChannel(ch)} 
                  style={{ 
                    flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13, fontFamily: C.f, 
                    border: `1px solid ${channel === ch ? 'rgba(91,140,245,0.4)' : C.border}`, 
                    background: channel === ch ? 'rgba(91,140,245,0.1)' : 'transparent', 
                    color: channel === ch ? C.blue : C.t2, cursor: 'pointer', transition: 'all 0.1s', 
                  }}> 
                  {ch === 'whatsapp' ? 'WhatsApp' : 'Telegram'} 
                </button> 
              ))} 
            </div> 
          </div> 
          <button onClick={handleSave} 
            style={{ padding: '10px 0', background: C.blue, color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: C.f, marginTop: 4 }}> 
            Save profile 
          </button> 
        </div> 
      </div> 
    </Card> 
  ); 
} 
 
// ══════════════════════════════════════════════════════════════ 
// NOTIFICATIONS TAB 
// ══════════════════════════════════════════════════════════════ 
function NotificationsTab() { 
  return ( 
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}> 
      <Card> 
        <SectionHead label="Alert Preferences" Icon={Bell} /> 
        <p style={{ fontSize: 13, color: C.t2, margin: '0 0 18px', lineHeight: 1.6 }}> 
          Connect WhatsApp or Telegram so K9 can send you alerts the moment it finds something. 
        </p> 
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}> 
          <WhatsAppCard /> 
          <TelegramCard /> 
        </div> 
      </Card> 
    </div> 
  ); 
} 
 
function WhatsAppCard() { 
  const [instanceId, setInstanceId] = useState(''); 
  const [token, setToken]           = useState(''); 
  const [phone, setPhone]           = useState(() => load('k9_user_phone', '')); 
  const [open, setOpen]             = useState(false); 
 
  const connectMutation = useMutation({ 
    mutationFn: api.connectWA, 
    onSuccess: (data: any) => { 
      if (data?.connected) { toast.success('WhatsApp connected!'); } 
      else toast.error('Connection failed', { description: data?.error }); 
    }, 
    onError: () => toast.error('Could not connect — check your Instance ID and Token'), 
  }); 
 
  return ( 
    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', cursor: 'pointer' }} 
        onClick={() => setOpen(o => !o)}> 
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}> 
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> 
            <MessageSquare style={{ width: 14, height: 14, color: C.t2 }} /> 
          </div> 
          <div> 
            <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: '0 0 1px' }}>WhatsApp</p> 
            <p style={{ fontSize: 10, fontFamily: C.m, color: C.red, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Not connected</p> 
          </div> 
        </div> 
        <ChevronRight style={{ width: 14, height: 14, color: C.t3, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} /> 
      </div> 
      {open && ( 
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}> 
          <div style={{ background: C.inset, borderRadius: 7, padding: '11px 14px', margin: '14px 0', border: `1px solid ${C.border}` }}> 
            <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: '0 0 6px' }}>Setup guide</p> 
            <ol style={{ paddingLeft: 16, margin: 0 }}> 
              {['Create an account at greenapi.com', 'Scan the QR code with your WhatsApp', 'Paste the Instance ID and Token below'].map((s, i) => ( 
                <li key={i} style={{ fontSize: 12, color: C.t2, marginBottom: i < 2 ? 4 : 0, lineHeight: 1.5 }}>{s}</li> 
              ))} 
            </ol> 
          </div> 
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}> 
            <div> 
              <label style={LABEL}>Instance ID</label> 
              <input value={instanceId} onChange={e => setInstanceId(e.target.value)} placeholder="1101234567" style={INPUT} 
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,140,245,0.5)'; }} 
                onBlur={e => { e.currentTarget.style.borderColor = C.border; }}/> 
            </div> 
            <div> 
              <label style={LABEL}>API Token</label> 
              <input type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="your_token" style={INPUT} 
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,140,245,0.5)'; }} 
                onBlur={e => { e.currentTarget.style.borderColor = C.border; }}/> 
            </div> 
          </div> 
          <div style={{ marginBottom: 12 }}> 
            <label style={LABEL}>Phone number</label> 
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 801 234 5678" type="tel" style={INPUT} 
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(91,140,245,0.5)'; }} 
              onBlur={e => { e.currentTarget.style.borderColor = C.border; }}/> 
          </div> 
          <button 
            onClick={() => connectMutation.mutate({ instanceId, token, phoneNumber: phone })} 
            disabled={connectMutation.isPending || !instanceId || !token || !phone} 
            style={{ width: '100%', padding: '10px 0', background: !instanceId || !token || !phone ? 'rgba(91,140,245,0.3)' : C.blue, color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: C.f }}> 
            {connectMutation.isPending ? 'Connecting...' : 'Connect WhatsApp'} 
          </button> 
        </div> 
      )} 
    </div> 
  ); 
} 
 
function TelegramCard() { 
  const [open, setOpen] = useState(false); 
 
  const testMutation = useMutation({ 
    mutationFn: api.testTG, 
    onSuccess: (data: any) => { 
      if (data?.sent) toast.success('Test message sent to Telegram!'); 
      else toast.error('Could not send test message'); 
    }, 
  }); 
 
  return ( 
    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}> 
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', cursor: 'pointer' }} 
        onClick={() => setOpen(o => !o)}> 
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}> 
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> 
            <Send style={{ width: 14, height: 14, color: C.t2 }} /> 
          </div> 
          <div> 
            <p style={{ fontSize: 13, fontWeight: 500, color: C.t1, margin: '0 0 1px' }}>Telegram</p> 
            <p style={{ fontSize: 10, fontFamily: C.m, color: C.red, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Not connected</p> 
          </div> 
        </div> 
        <ChevronRight style={{ width: 14, height: 14, color: C.t3, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} /> 
      </div> 
      {open && ( 
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}> 
          <div style={{ background: C.inset, borderRadius: 7, padding: '11px 14px', margin: '14px 0', border: `1px solid ${C.border}` }}> 
            <p style={{ fontSize: 12, fontWeight: 500, color: C.t1, margin: '0 0 6px' }}>How to connect</p> 
            <ol style={{ paddingLeft: 16, margin: 0 }}> 
              {['Message @BotFather on Telegram', 'Send /newbot and follow the prompts', 'Copy the bot token and paste it in your .env file'].map((s, i) => ( 
                <li key={i} style={{ fontSize: 12, color: C.t2, marginBottom: i < 2 ? 4 : 0, lineHeight: 1.5 }}>{s}</li> 
              ))} 
            </ol> 
          </div> 
          <button onClick={() => testMutation.mutate()} 
            style={{ width: '100%', padding: '10px 0', background: 'rgba(255,255,255,0.05)', color: C.t1, border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: C.f }}> 
            {testMutation.isPending ? 'Checking...' : 'Check connection'} 
          </button> 
        </div> 
      )} 
    </div> 
  ); 
} 
 
// ── Security Tab ───────────────────────────────────────────── 
function SecurityTab() { 
  const [show, setShow] = useState(false); 
  const apiKey = '••••••••••••••••••••••••••••••••'; 
 
  return ( 
    <Card> 
      <SectionHead label="Security" Icon={Key} /> 
      <div> 
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}> 
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}> 
            <Shield style={{ width: 12, height: 12, color: C.t3 }} /> 
            <span style={LABEL as any}>Claude AI Engine</span> 
          </div> 
          <button onClick={() => setShow(s => !s)} 
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.f }}> 
            {show ? <EyeOff style={{ width: 12, height: 12 }} /> : <Eye style={{ width: 12, height: 12 }} />} 
            {show ? 'Hide' : 'Show key'} 
          </button> 
        </div> 
        <div style={{ position: 'relative' }}> 
          <input type={show ? 'text' : 'password'} value={apiKey} readOnly 
            style={{ ...INPUT, fontFamily: C.m, paddingRight: 80, opacity: 0.8 }} /> 
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 5 }}> 
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue }} /> 
            <span style={{ fontSize: 9, fontFamily: C.m, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verified</span> 
          </div> 
        </div> 
        <p style={{ fontSize: 11, color: C.t3, marginTop: 10, lineHeight: 1.6, fontStyle: 'italic' }}> 
          Keys are encrypted with AES-256. We never store raw keys. 
        </p> 
      </div> 
    </Card> 
  ); 
} 
 
// ── Billing Tab ────────────────────────────────────────────── 
function BillingTab() { 
  return ( 
    <Card> 
      <SectionHead label="Billing & Plans" Icon={CreditCard} /> 
      <div style={{ textAlign: 'center', padding: '32px 16px' }}> 
        <p style={{ fontSize: 16, fontWeight: 500, color: C.t1, margin: '0 0 10px' }}> 
          I no go bill you yet, calm down. 
        </p> 
        <p style={{ fontSize: 14, color: C.t2, margin: '0 0 24px', lineHeight: 1.65, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}> 
         
        </p> 
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}> 
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} /> 
          <span style={{ fontSize: 11, fontFamily: C.m, color: C.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free Alpha Access</span> 
        </div> 
      </div> 
    </Card> 
  ); 
} 
