import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileText, Download, Image as ImageIcon, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatters';

interface PortalDocumentsProps {
  workId: string;
}

interface PortalDocument {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  size?: string;
  type?: string;
}

export default function PortalDocuments({ workId }: PortalDocumentsProps) {
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const q = query(collection(db, 'works', workId, 'documents'), orderBy('uploadDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortalDocument));
        
        if (fetched.length === 0) {
          setDocuments([
            { id: '1', name: 'Alvará de Construção.pdf', url: '#', uploadDate: new Date().toISOString(), size: '2.4 MB', type: 'application/pdf' },
            { id: '2', name: 'Projeto Arquitetônico Executivo.pdf', url: '#', uploadDate: new Date(Date.now() - 86400000).toISOString(), size: '15.2 MB', type: 'application/pdf' },
            { id: '3', name: 'Contrato de Prestação de Serviços.pdf', url: '#', uploadDate: new Date(Date.now() - 5 * 86400000).toISOString(), size: '1.1 MB', type: 'application/pdf' },
          ]);
        } else {
          setDocuments(fetched);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [workId]);

  const getFileIcon = (type?: string, name?: string) => {
    const lowerName = name?.toLowerCase() || '';
    if (type === 'application/pdf' || lowerName.endsWith('.pdf')) {
      return <FileText size={24} color="#EF4444" />;
    }
    if (lowerName.endsWith('.jpg') || lowerName.endsWith('.png') || lowerName.endsWith('.jpeg')) {
      return <ImageIcon size={24} color="#10B981" />;
    }
    return <FileText size={24} color="var(--color-primary)" />;
  };

  const formatDate = (dateString: string) => {
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-glass" style={{ height: '80px', width: '100%' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Nenhum documento</h3>
          <p>Não há arquivos disponíveis para download no momento.</p>
        </div>
      ) : (
        documents.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="card-premium"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '16px 20px',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                backgroundColor: 'var(--bg-elevated)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {getFileIcon(doc.type, doc.name)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {doc.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    <Calendar size={12} />
                    {formatDate(doc.uploadDate)}
                  </div>
                  {doc.size && (
                    <>
                      <span style={{ fontSize: '12px', color: 'var(--border-strong)' }}>•</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.size}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <a 
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              style={{ flexShrink: 0, textDecoration: 'none' }}
              title="Baixar Documento"
            >
              <Download size={20} />
            </a>
          </motion.div>
        ))
      )}
    </div>
  );
}
