import os

files = {
    'src/components/connect/public/PublicProfileView.tsx': '''import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { PublicProfile, ProfessionalService, PortfolioItem } from "../../../types/connect";
import { MapPin, Star, Phone, Instagram, Globe, CheckCircle2, ShieldCheck, Mail } from "lucide-react";
import { RequestQuoteModal } from "./RequestQuoteModal";

export function PublicProfileView({ uid, theme }: { uid: string, theme: string }) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [uid]);

  const fetchProfile = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", uid, "public_profile", "info"));
      if (docSnap.exists()) {
        setProfile(docSnap.data() as PublicProfile);
      }
      
      const srvSnap = await getDocs(collection(db, "users", uid, "public_services"));
      setServices(srvSnap.docs.map(d => d.data() as ProfessionalService).filter(s => s.isPublic));

      const portSnap = await getDocs(collection(db, "users", uid, "portfolio"));
      setPortfolio(portSnap.docs.map(d => d.data() as PortfolioItem).filter(p => p.isPublic));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: profile?.name || "Perfil Profissional",
          text: \Conheça o trabalho de \ na CentralObra Connect\,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copiado para a área de transferência!");
      }
    } catch (e) {
      console.error("Error sharing", e);
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}><p>Carregando perfil...</p></div>;
  if (!profile) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}><p>Perfil não encontrado ou não é público.</p></div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", paddingBottom: 100 }}>
      {/* Header Cover */}
      <div style={{ height: 160, background: "linear-gradient(135deg, var(--color-primary), #1E3A8A)", position: "relative" }}>
        <button onClick={handleShare} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", color: "#FFF", padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: "none" }}>
          Compartilhar
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px", marginTop: -60, position: "relative" }}>
        {/* Profile Info Card */}
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "var(--bg-surface)", border: "4px solid var(--bg-base)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: "var(--text-muted)" }}>{profile.name.charAt(0)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-main)" }}>{profile.name}</h1>
            {profile.isVerified && <ShieldCheck size={20} color="#10B981" />}
          </div>
          <p style={{ fontSize: 16, color: "var(--color-primary)", fontWeight: 700, marginBottom: 12 }}>{profile.specialty}</p>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, color: "var(--text-muted)", fontSize: 14, marginBottom: 24, flexWrap: "wrap" }}>
            {profile.city && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={16} /> {profile.city}{profile.state ? \/\\ : ""}</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={16} color="#F59E0B" /> {profile.rating > 0 ? profile.rating.toFixed(1) : "Novo"}</div>
          </div>

          <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 400 }}>
            <button onClick={() => setShowQuoteModal(true)} className="btn-primary" style={{ flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16 }}>
              Solicitar Orçamento
            </button>
          </div>
          
          {profile.bio && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border-subtle)", width: "100%", textAlign: "left" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>Sobre</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Services Section */}
        {services.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", marginBottom: 16 }}>Serviços Realizados</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {services.map(srv => (
                <div key={srv.id} className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>{srv.name}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>{srv.description}</p>
                  {(srv.basePrice || srv.unit) && (
                    <div style={{ display: "inline-flex", padding: "4px 12px", backgroundColor: "rgba(59,130,246,0.1)", color: "var(--color-primary)", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                      {srv.basePrice ? \A partir de R$ \\ : ""} {srv.unit ? \ por \\ : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Section */}
        {portfolio.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", marginBottom: 16 }}>Portfólio de Obras</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {portfolio.map(port => (
                <div key={port.id} onClick={() => window.location.href = \?portfolio=\&uid=\\} className="glass-panel" style={{ padding: 20, borderRadius: 16, cursor: "pointer", transition: "all 0.2s", border: "1px solid transparent" }} onMouseOver={e => e.currentTarget.style.borderColor = "var(--color-primary)"} onMouseOut={e => e.currentTarget.style.borderColor = "transparent"}>
                  <div style={{ height: 160, backgroundColor: "var(--bg-surface)", borderRadius: 8, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "var(--text-muted)" }}>Sem foto de capa</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main)", marginBottom: 4 }}>{port.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 12 }}>
                    <MapPin size={12} /> {port.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Contacts */}
        <div style={{ marginTop: 40, textAlign: "center", padding: "32px 20px", borderTop: "1px solid var(--border-subtle)" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>Entre em contato com {profile.name}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {profile.phone && <a href={\	el:\\} style={{ padding: 12, backgroundColor: "var(--bg-surface)", borderRadius: "50%", color: "var(--text-main)" }}><Phone size={20} /></a>}
            {profile.instagram && <a href={\https://instagram.com/\\} target="_blank" rel="noreferrer" style={{ padding: 12, backgroundColor: "var(--bg-surface)", borderRadius: "50%", color: "var(--text-main)" }}><Instagram size={20} /></a>}
            {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" style={{ padding: 12, backgroundColor: "var(--bg-surface)", borderRadius: "50%", color: "var(--text-main)" }}><Globe size={20} /></a>}
          </div>
        </div>
      </div>

      {showQuoteModal && <RequestQuoteModal uid={uid} profile={profile} onClose={() => setShowQuoteModal(false)} />}
    </div>
  );
}''',
    'src/components/connect/public/PublicPortfolioView.tsx': '''import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { PortfolioItem, PublicProfile } from "../../../types/connect";
import { MapPin, User, ChevronLeft, Calendar } from "lucide-react";

export function PublicPortfolioView({ workId, uid, theme, onBack }: { workId: string, uid: string, theme: string, onBack: () => void }) {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [workId, uid]);

  const fetchData = async () => {
    try {
      const q = query(collection(db, "users", uid, "portfolio"), where("workId", "==", workId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setItem(snap.docs[0].data() as PortfolioItem);
      } else {
        const docSnap = await getDoc(doc(db, "users", uid, "portfolio", workId));
        if (docSnap.exists()) {
          setItem(docSnap.data() as PortfolioItem);
        }
      }

      const pSnap = await getDoc(doc(db, "users", uid, "public_profile", "info"));
      if (pSnap.exists()) {
        setProfile(pSnap.data() as PublicProfile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}><p>Carregando portfólio...</p></div>;
  if (!item || !item.isPublic) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}><p>Esta obra não está disponível publicamente.</p></div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ color: "#FFF", background: "none", border: "none", display: "flex", alignItems: "center" }}>
          <ChevronLeft size={24} />
        </button>
        <span style={{ color: "#FFF", fontWeight: 600, fontSize: 16 }}>Portfólio</span>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px", paddingBottom: 100 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-main)", marginBottom: 8 }}>{item.title}</h1>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24, color: "var(--text-muted)", fontSize: 14 }}>
          {item.city && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={16} /> {item.city}</div>}
          {item.durationDays && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={16} /> {item.durationDays} dias</div>}
          {item.areaSize && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><strong>{item.areaSize}</strong> m²</div>}
        </div>

        {item.description && (
          <div className="glass-panel" style={{ padding: 20, borderRadius: 16, marginBottom: 32 }}>
            <p style={{ color: "var(--text-main)", lineHeight: 1.6 }}>{item.description}</p>
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-main)", marginBottom: 16 }}>Fotos do Projeto</h2>
          <div style={{ height: 240, backgroundColor: "var(--bg-surface)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-subtle)" }}>
            <span style={{ color: "var(--text-muted)" }}>Fotos em breve...</span>
          </div>
        </div>

        {profile && (
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border-subtle)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-muted)", marginBottom: 16 }}>Realizado por</h3>
            <div onClick={() => window.location.href = \?connect=\\} className="card-premium-interactive" style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 16, backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-subtle)", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontWeight: 800, color: "var(--text-muted)" }}>{profile.name.charAt(0)}</span>
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main)" }}>{profile.name}</h4>
                <p style={{ fontSize: 13, color: "var(--color-primary)" }}>{profile.specialty}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}''',
    'src/components/connect/SocialMediaArtGenerator.tsx': '''import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Instagram, Camera } from "lucide-react";
import { PublicProfile } from "../../types/connect";

export function SocialMediaArtGenerator({ profile, workId, beforeImage, afterImage }: { profile: PublicProfile, workId?: string, beforeImage?: string, afterImage?: string }) {
  const artRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    alert("Função de download usando html2canvas será ativada na versão final.");
  };

  const profileUrl = \\\?connect=\\;

  return (
    <div style={{ backgroundColor: "var(--bg-base)", padding: 20, borderRadius: 16, border: "1px solid var(--border-subtle)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginBottom: 16 }}>Gerador de Arte para Redes Sociais</h3>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Crie um post profissional para o Instagram e divulgue seu perfil com um QR Code direto.</p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Preview Area */}
        <div 
          ref={artRef}
          style={{ 
            width: 320, 
            height: 320, 
            backgroundColor: "var(--color-primary)", 
            position: "relative", 
            borderRadius: 16, 
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
          }}
        >
          {/* Top Half / Images */}
          <div style={{ flex: 1, backgroundColor: "#1E293B", display: "flex", position: "relative" }}>
            {beforeImage && afterImage ? (
              <>
                <div style={{ flex: 1, backgroundImage: \url(\)\, backgroundSize: "cover", backgroundPosition: "center", borderRight: "2px solid #FFF" }} />
                <div style={{ flex: 1, backgroundImage: \url(\)\, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", top: 8, left: 8, backgroundColor: "rgba(0,0,0,0.6)", color: "#FFF", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>ANTES</div>
                <div style={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(16,185,129,0.8)", color: "#FFF", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>DEPOIS</div>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: "rgba(255,255,255,0.5)" }}>
                <Camera size={32} />
                <span style={{ fontSize: 12 }}>Adicione fotos da obra</span>
              </div>
            )}
          </div>
          
          {/* Bottom Half / Info */}
          <div style={{ height: 100, backgroundColor: "#FFF", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 16, fontWeight: 900, color: "#1E293B", margin: 0, lineHeight: 1.2 }}>{profile.name}</h4>
              <p style={{ fontSize: 12, color: "var(--color-primary)", fontWeight: 700, margin: "4px 0 0 0" }}>{profile.specialty}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                <Instagram size={12} color="#64748B" />
                <span style={{ fontSize: 10, color: "#64748B" }}>{profile.instagram || "@seuinstagram"}</span>
              </div>
            </div>
            <div style={{ width: 64, height: 64, backgroundColor: "#F8FAFC", padding: 4, borderRadius: 8, border: "1px solid #E2E8F0" }}>
              <QRCodeSVG value={profileUrl} size={54} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="input-group">
            <label>Formato</label>
            <select className="input-field">
              <option value="square">Feed (Quadrado - 1:1)</option>
              <option value="story" disabled>Story (Vertical - 9:16) em breve</option>
            </select>
          </div>
          
          <button onClick={handleDownload} className="btn-primary" style={{ padding: 16, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "auto" }}>
            <Download size={18} /> Baixar Imagem
          </button>
        </div>
      </div>
    </div>
  );
}''',
    'src/components/connect/OwnerConnectDashboard.tsx': '''import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, query, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { PublicProfile } from "../../types/connect";
import { Search, MapPin, Star, ShieldCheck } from "lucide-react";

export function OwnerConnectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [searchService, setSearchService] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [results, setResults] = useState<PublicProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchService && !searchCity) return;
    
    setSearching(true);
    setHasSearched(true);
    try {
      const indexRef = collection(db, "users"); 
      let baseQuery = query(indexRef, limit(20));
      
      const snap = await getDocs(baseQuery);
      let list = [] as PublicProfile[];
      
      for (const d of snap.docs) {
         try {
           const profileSnap = await getDoc(doc(db, "users", d.id, "public_profile", "info"));
           if (profileSnap.exists()) {
              list.push(profileSnap.data() as PublicProfile);
           }
         } catch(err) {}
      }
      
      if (searchCity) {
        const lowerCity = searchCity.toLowerCase();
        list = list.filter(p => p.city?.toLowerCase().includes(lowerCity));
      }
      
      if (searchService) {
        const lowerService = searchService.toLowerCase();
        list = list.filter(p => p.specialty?.toLowerCase().includes(lowerService) || p.name.toLowerCase().includes(lowerService));
      }

      setResults(list);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ padding: "24px 20px 100px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-main)", marginBottom: 8 }}>Encontrar Profissionais</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Busque por pedreiros, arquitetos, encanadores e construtoras para sua obra.</p>
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24, marginBottom: 32 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="input-group">
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>O que você precisa?</label>
            <div style={{ position: "relative" }}>
              <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: 16, top: 16 }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: 44, height: 52 }}
                placeholder="Ex: Eletricista, Pintor, Arquiteto..." 
                value={searchService} 
                onChange={e => setSearchService(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="input-group">
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>Onde?</label>
            <div style={{ position: "relative" }}>
              <MapPin size={18} color="var(--text-muted)" style={{ position: "absolute", left: 16, top: 16 }} />
              <input 
                type="text" 
                className="input-field" 
                style={{ paddingLeft: 44, height: 52 }}
                placeholder="Ex: Bauru" 
                value={searchCity} 
                onChange={e => setSearchCity(e.target.value)} 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16, marginTop: 8 }} disabled={searching}>
            {searching ? "Buscando..." : "Buscar Profissionais"}
          </button>
        </form>
      </div>

      {hasSearched && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginBottom: 16 }}>
            {results.length > 0 ? \Encontrados \ profissionais\ : "Nenhum profissional encontrado"}
          </h3>
          
          <div style={{ display: "grid", gap: 16 }}>
            {results.map(prof => (
              <div key={prof.id} className="glass-panel" style={{ padding: 20, borderRadius: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "var(--bg-surface)", border: "2px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-muted)" }}>{prof.name.charAt(0)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <h4 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)" }}>{prof.name}</h4>
                      {prof.isVerified && <ShieldCheck size={16} color="#10B981" />}
                    </div>
                    <p style={{ color: "var(--color-primary)", fontSize: 14, fontWeight: 600 }}>{prof.specialty}</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--text-muted)", fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={14} color="#F59E0B" /> {prof.rating > 0 ? prof.rating.toFixed(1) : "Novo"}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> {prof.city}</div>
                </div>

                <button className="btn-secondary" onClick={() => window.open(\?connect=\\, "_blank")} style={{ width: "100%", padding: 12, borderRadius: 12, fontWeight: 700, marginTop: 8 }}>
                  Ver Perfil
                </button>
              </div>
            ))}

            {results.length === 0 && !searching && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Search size={40} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
                <p style={{ color: "var(--text-muted)" }}>Tente buscar com outros termos ou cidade.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}''',
    'src/components/connect/ProfessionalConnectDashboard.tsx': '''import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { User, Briefcase, Image as ImageIcon, Star, Mail, Share2 } from "lucide-react";
import { ConnectProfileForm } from "./ConnectProfileForm";
import { ConnectServicesManager } from "./ConnectServicesManager";
import { ConnectPortfolioManager } from "./ConnectPortfolioManager";
import { ConnectRequestsManager } from "./ConnectRequestsManager";
import { ConnectReviewsManager } from "./ConnectReviewsManager";
import { SocialMediaArtGenerator } from "./SocialMediaArtGenerator";

export function ProfessionalConnectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'portfolio' | 'reviews' | 'requests' | 'marketing'>('profile');
  
  return (
    <div className="screen-content animate-fade-in" style={{ padding: "24px 20px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-main)" }}>CentralObra Connect</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sua vitrine profissional pública</p>
        </div>
        <button className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }} onClick={() => window.open("?connect=" + user?.uid, "_blank")}>
          <Share2 size={16} /> Ver Meu Perfil
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16, marginBottom: 24 }} className="hide-scrollbar">
        {[
          { id: "profile", icon: <User size={18} />, label: "Meu Perfil" },
          { id: "services", icon: <Briefcase size={18} />, label: "Meus Serviços" },
          { id: "portfolio", icon: <ImageIcon size={18} />, label: "Portfólio" },
          { id: "requests", icon: <Mail size={18} />, label: "Solicitações" },
          { id: "reviews", icon: <Star size={18} />, label: "Avaliações" },
          { id: "marketing", icon: <Share2 size={18} />, label: "Divulgação" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              padding: "10px 16px",
              borderRadius: 20,
              backgroundColor: activeTab === t.id ? "var(--color-primary)" : "var(--bg-glass)",
              color: activeTab === t.id ? "#FFF" : "var(--text-main)",
              border: "1px solid",
              borderColor: activeTab === t.id ? "var(--color-primary)" : "var(--border-light)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
              transition: "all 0.2s"
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
        {activeTab === 'profile' && <ConnectProfileForm />}
        {activeTab === 'services' && <ConnectServicesManager />}
        {activeTab === 'portfolio' && <ConnectPortfolioManager />}
        {activeTab === 'requests' && <ConnectRequestsManager />}
        {activeTab === 'reviews' && <ConnectReviewsManager />}
        {activeTab === 'marketing' && profile && <SocialMediaArtGenerator profile={profile as any} />}
      </div>
    </div>
  );
}'''
}

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
