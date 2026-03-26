import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CheckCircle, AlertCircle, ArrowRight, DollarSign, Clock, HelpCircle, Scale } from 'lucide-react';
import { toast } from 'sonner';

const C = {
  bg: 'var(--background)',
  card: 'var(--card)',
  border: 'var(--border)',
  t1: 'var(--foreground)',
  t2: 'var(--muted-foreground)',
  t3: '#555',
  blue: '#8B5CF6',
  green: '#00C87A',
  orange: '#F59E0B',
  red: '#EF4444',
  f: 'var(--font-sans)',
  m: 'var(--font-mono)',
};

interface EscrowContract {
  id: string;
  buyer: string;
  seller: string;
  amount: string;
  status: 'Funded' | 'Delivered' | 'Disputed' | 'Released' | 'Refunded';
  deliveryDate?: string;
  reviewWindow: string;
  title: string;
}

export default function EscrowMediation() {
  const [contracts, setContracts] = useState<EscrowContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('seller');

  useEffect(() => {
    // Mock data fetching
    setTimeout(() => {
      setContracts([
        {
          id: 'k9-esc-8a2b',
          buyer: '0x71C...d897',
          seller: 'You',
          amount: '1.5 ETH',
          status: 'Funded',
          reviewWindow: '5 Days',
          title: 'Frontend Refactor (React + Tailwind)',
        },
        {
          id: 'k9-esc-3f91',
          buyer: 'You',
          seller: '0x4a1...e221',
          amount: '500 USDC',
          status: 'Delivered',
          deliveryDate: new Date().toISOString(),
          reviewWindow: '3 Days',
          title: 'Logo Design & Branding',
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleCreateEscrow = () => {
    toast.info('Initiating Smart Contract Deployment...', {
      description: 'Please confirm the transaction in your wallet (Base Mainnet).',
    });
  };

  return (
    <div style={{ paddingBottom: 64, fontFamily: C.f }}>
      {/* Header */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 10 }}>
          <Lock style={{ width: 10, height: 10, color: C.blue }} />
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.blue, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Secure Mediation</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: C.t1, margin: '0 0 6px', letterSpacing: '-0.3px' }}>Escrow & Mediation</h1>
            <p style={{ fontSize: 14, color: C.t2, margin: 0, lineHeight: 1.6 }}>Fairness guaranteed by code. Funds release only when both sides are satisfied.</p>
          </div>
          <button onClick={handleCreateEscrow}
            style={{ padding: '10px 18px', background: C.blue, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield style={{ width: 16, height: 16 }} />
            New Escrow
          </button>
        </div>
      </section>

      {/* Trust Banner */}
      <div style={{ background: 'rgba(0,200,122,0.03)', border: `1px solid rgba(0,200,122,0.1)`, borderRadius: 12, padding: '16px 20px', marginBottom: 32, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,200,122,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Scale style={{ width: 20, height: 20, color: C.green }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: '0 0 2px' }}>K9 Trusted Intermediary</p>
          <p style={{ fontSize: 12, color: C.t2, margin: 0 }}>5% platform fee covers multi-sig arbitration and immutable proof generation. Active on <span style={{ fontFamily: C.m, color: C.blue }}>Base Mainnet</span>.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
        <button onClick={() => setUserRole('seller')} style={{ padding: '8px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${userRole === 'seller' ? C.blue : 'transparent'}`, color: userRole === 'seller' ? C.t1 : C.t3, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>My Gigs (Seller)</button>
        <button onClick={() => setUserRole('buyer')} style={{ padding: '8px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${userRole === 'buyer' ? C.blue : 'transparent'}`, color: userRole === 'buyer' ? C.t1 : C.t3, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>My Contracts (Buyer)</button>
      </div>

      {/* Contract List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.t3 }}>Loading active contracts...</div>
        ) : contracts.filter(c => (userRole === 'seller' ? c.seller === 'You' : c.buyer === 'You')).length === 0 ? (
          <div style={{ background: C.card, border: `1px dashed ${C.border}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center', color: C.t3 }}>
            <HelpCircle style={{ width: 32, height: 32, margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: 14, margin: 0 }}>No active escrow contracts found.</p>
          </div>
        ) : (
          contracts.filter(c => (userRole === 'seller' ? c.seller === 'You' : c.buyer === 'You')).map((contract) => (
            <EscrowCard key={contract.id} contract={contract} role={userRole} />
          ))
        )}
      </div>
    </div>
  );
}

function EscrowCard({ contract, role }: { contract: EscrowContract; role: 'buyer' | 'seller' }) {
  const statusColors = {
    Funded: C.blue,
    Delivered: C.orange,
    Disputed: C.red,
    Released: C.green,
    Refunded: C.t3,
  };

  const isActionable = (role === 'seller' && contract.status === 'Funded') || 
                      (role === 'buyer' && contract.status === 'Delivered');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24 }}>
      
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontFamily: C.m, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{contract.id}</span>
          <div style={{ padding: '2px 8px', borderRadius: 20, background: `color-mix(in srgb, ${statusColors[contract.status]} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${statusColors[contract.status]} 30%, transparent)` }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: statusColors[contract.status], textTransform: 'uppercase' }}>{contract.status}</span>
          </div>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: C.t1, margin: '0 0 12px' }}>{contract.title}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign style={{ width: 14, height: 14, color: C.t3 }} />
            <div>
              <p style={{ fontSize: 10, color: C.t3, margin: 0, textTransform: 'uppercase' }}>Contract Value</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>{contract.amount}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock style={{ width: 14, height: 14, color: C.t3 }} />
            <div>
              <p style={{ fontSize: 10, color: C.t3, margin: 0, textTransform: 'uppercase' }}>Review Window</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.t1, margin: 0 }}>{contract.reviewWindow}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `1px solid ${C.border}`, paddingLeft: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        {contract.status === 'Funded' && role === 'seller' && (
          <button onClick={() => toast.success('Work marked as delivered. Buyer has 5 days to review.')}
            style={{ width: '100%', padding: '10px 0', background: C.blue, color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Mark as Delivered
          </button>
        )}
        {contract.status === 'Delivered' && role === 'buyer' && (
          <>
            <button onClick={() => toast.success('Funds released to talent. K9 Pulse updated.')}
              style={{ width: '100%', padding: '10px 0', background: C.green, color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Approve & Release
            </button>
            <button onClick={() => toast.error('Dispute opened. K9 mediator will contact you shortly.')}
              style={{ width: '100%', padding: '10px 0', background: 'transparent', color: C.red, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Raise Dispute
            </button>
          </>
        )}
        {contract.status === 'Funded' && role === 'buyer' && (
          <p style={{ fontSize: 12, color: C.t3, textAlign: 'center', margin: 0, fontStyle: 'italic' }}>Waiting for delivery...</p>
        )}
        {contract.status === 'Delivered' && role === 'seller' && (
          <p style={{ fontSize: 12, color: C.t3, textAlign: 'center', margin: 0, fontStyle: 'italic' }}>Under review by buyer...</p>
        )}
        <button style={{ width: '100%', padding: '8px 0', background: 'none', border: 'none', color: C.t3, fontSize: 11, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          View on Explorer <ArrowRight style={{ width: 10, height: 10 }} />
        </button>
      </div>
    </motion.div>
  );
}
