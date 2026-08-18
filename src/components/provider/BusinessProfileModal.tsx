import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Save, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export interface BusinessProfile {
  companyName: string;
  legalName?: string;
  documentNumber?: string; // CPF or CNPJ
  registry?: string; // CREA/CAU
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  website?: string;
  pixKey?: string;
  address?: string;
  logoUrl?: string;
  avatarUrl?: string;
  specialties: string[];
}

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_SPECIALTIES = [
  'Pedreiro / Alvenaria',
  'Pintura Residencial & Comercial',
  'Instalações Elétricas',
  'Hidráulica & Encanamento',
  'Gesso & Drywall',
  'Pisos & Porcelanato',
  'Marcenaria & Móveis',
  'Serralheria & Alumínio',
  'Vidraçaria',
  'Impermeabilização',
  'Telhados & Coberturas',
  'Reformas Gerais'
];

export function BusinessProfileModal({ isOpen, onClose }: BusinessProfileModalProps) {
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [registry, setRegistry] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    if (user && !isGuest) {
      loadBusinessProfile();
    } else {
      // Load from localStorage for guest
      try {
        const local = localStorage.getItem('co_business_profile');
        if (local) {
          const parsed: BusinessProfile = JSON.parse(local);
          setCompanyName(parsed.companyName || '');
          setLegalName(parsed.legalName || '');
          setDocumentNumber(parsed.documentNumber || '');
          setRegistry(parsed.registry || '');
          setPhone(parsed.phone || '');
          setWhatsapp(parsed.whatsapp || '');
          setEmail(parsed.email || '');
          setInstagram(parsed.instagram || '');
          setWebsite(parsed.website || '');
          setPixKey(parsed.pixKey || '');
          setAddress(parsed.address || '');
          setLogoUrl(parsed.logoUrl || '');
          setAvatarUrl(parsed.avatarUrl || '');
          setSelectedSpecialties(parsed.specialties || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user, isGuest]);

  const loadBusinessProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'settings', 'business_profile');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as BusinessProfile;
        setCompanyName(data.companyName || '');
        setLegalName(data.legalName || '');
        setDocumentNumber(data.documentNumber || '');
        setRegistry(data.registry || '');
        setPhone(data.phone || '');
        setWhatsapp(data.whatsapp || '');
        setEmail(data.email || '');
        setInstagram(data.instagram || '');
        setWebsite(data.website || '');
        setPixKey(data.pixKey || '');
        setAddress(data.address || '');
        setLogoUrl(data.logoUrl || '');
        setAvatarUrl(data.avatarUrl || '');
        setSelectedSpecialties(data.specialties || []);
      }
    } catch (e) {
      console.error('Error loading business profile:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error('Informe o Nome Fantasia / Nome Comercial da sua empresa.');
      return;
    }

    setSaving(true);
    const profileData: BusinessProfile = {
      companyName,
      legalName,
      documentNumber,
      registry,
      phone,
      whatsapp,
      email,
      instagram,
      website,
      pixKey,
      address,
      logoUrl,
      avatarUrl,
      specialties: selectedSpecialties,
    };

    try {
      if (user && !isGuest) {
        const docRef = doc(db, 'users', user.uid, 'settings', 'business_profile');
        await setDoc(docRef, { ...profileData, updatedAt: serverTimestamp() }, { merge: true });
        
        // Also sync the first specialty to the main user doc for global insights/assistant usage
        if (selectedSpecialties.length > 0) {
          await setDoc(doc(db, 'users', user.uid), { specialty: selectedSpecialties.join(', ') }, { merge: true });
        }
      } else {
        localStorage.setItem('co_business_profile', JSON.stringify(profileData));
        if (selectedSpecialties.length > 0) {
           const cachedUserStr = localStorage.getItem('co_user_cache');
           if (cachedUserStr) {
             const cachedUser = JSON.parse(cachedUserStr);
             cachedUser.specialty = selectedSpecialties.join(', ');
             localStorage.setItem('co_user_cache', JSON.stringify(cachedUser));
           }
        }
      }
      toast.success('Identidade Profissional salva com sucesso!');
      onClose();
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar perfil profissional.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />

        {/* Sheet / Modal */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="glass-panel modal-content-scroll"
          style={{
            width: '100%',
            maxWidth: 540,
            maxHeight: '88vh',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: '24px 20px 32px 20px',
            position: 'relative',
            zIndex: 1,
            overflowY: 'auto',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'var(--bg-elevated)', border: 'none',
              width: 34, height: 34, borderRadius: 17,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Identidade Profissional</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Dados comerciais para PDFs, Orçamentos e Connect</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dados da empresa...</div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Nome Fantasia */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Nome Fantasia / Nome Comercial *
                </label>
                <input
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Ex: Silva Reformas & Pintura"
                  className="input-premium"
                />
              </div>

              {/* Razão Social & CPF/CNPJ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Razão Social (Opcional)
                  </label>
                  <input
                    value={legalName}
                    onChange={e => setLegalName(e.target.value)}
                    placeholder="Ex: J. Silva Serviços LTDA"
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    CPF ou CNPJ
                  </label>
                  <input
                    value={documentNumber}
                    onChange={e => setDocumentNumber(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="input-premium"
                  />
                </div>
              </div>

              {/* Registro Profissional (CREA/CAU) & PIX */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    CREA / CAU / Reg. Profissional
                  </label>
                  <input
                    value={registry}
                    onChange={e => setRegistry(e.target.value)}
                    placeholder="Ex: CREA 123456/D"
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Chave PIX (Para propostas)
                  </label>
                  <input
                    value={pixKey}
                    onChange={e => setPixKey(e.target.value)}
                    placeholder="E-mail, CPF, CNPJ ou Celular"
                    className="input-premium"
                  />
                </div>
              </div>

              {/* Contato: Telefone & WhatsApp */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Telefone Comercial
                  </label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(11) 3333-4444"
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    WhatsApp para Clientes
                  </label>
                  <input
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-8888"
                    className="input-premium"
                  />
                </div>
              </div>

              {/* E-mail & Instagram */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    E-mail Comercial
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    Instagram (@perfil)
                  </label>
                  <input
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    placeholder="@silvareformas"
                    className="input-premium"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Endereço Físico ou Região de Atendimento
                </label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Ex: São Paulo, SP e Grande ABC"
                  className="input-premium"
                />
              </div>

              {/* URLs da Logo e Foto */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    URL do Logotipo da Empresa
                  </label>
                  <input
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="input-premium"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                    URL da Foto do Responsável
                  </label>
                  <input
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="input-premium"
                  />
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Especialidades Principais
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {AVAILABLE_SPECIALTIES.map(spec => {
                    const isSelected = selectedSpecialties.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        style={{
                          padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                          border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--color-primary-alpha)' : 'var(--bg-elevated)',
                          color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 8, fontSize: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                {saving ? 'Salvação em andamento...' : <><Save size={18} /> Salvar Identidade Profissional</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
