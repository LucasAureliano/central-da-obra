import { useState, useEffect } from 'react';
import { FileUp, File, FileText, Image as ImageIcon, Trash2, Download, Folder } from 'lucide-react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface DocumentsViewProps {
  workId: string;
}

export function DocumentsView({ workId }: DocumentsViewProps) {
  const { profile } = useAuth();
  const isOwner = profile?.role === 'owner';
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Projetos');

  const categories = ['Projetos', 'Contratos', 'ART/RRT', 'Notas Fiscais', 'Garantias', 'Fotos', 'Outros'];

  useEffect(() => {
    const q = query(collection(db, `works/${workId}/documents`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [workId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `works/${workId}/${selectedCategory}/${safeName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      }, 
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
        alert('Erro ao fazer upload. Verifique se o Firebase Storage está ativado e as regras de segurança permitem upload.');
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        await addDoc(collection(db, `works/${workId}/documents`), {
          name: file.name,
          category: selectedCategory,
          url: downloadURL,
          size: file.size,
          type: file.type,
          uploadedAt: serverTimestamp(),
          storagePath: `works/${workId}/${selectedCategory}/${safeName}`
        });
        
        setUploading(false);
        setProgress(0);
      }
    );
  };

  const handleDelete = async (docObj: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o documento ${docObj.name}?`)) return;
    
    try {
      const fileRef = ref(storage, docObj.storagePath);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, `works/${workId}/documents`, docObj.id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir documento.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={20} color="#3B82F6" />;
    if (type === 'application/pdf') return <FileText size={20} color="#EF4444" />;
    return <File size={20} color="#6B7280" />;
  };

  const docsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = documents.filter(d => d.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div style={{ padding: 16 }}>
      
      {/* Upload Panel */}
      {!isOwner && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Novo Documento</h3>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-premium"
            style={{ flex: 1, minWidth: 200 }}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          
          <label className="btn-primary" style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: uploading ? 'wait' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
            <FileUp size={20} />
            {uploading ? `Enviando... ${Math.round(progress)}%` : 'Selecionar Arquivo'}
            <input type="file" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
      )}

      {/* Document Folders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {categories.map(category => {
          const catDocs = docsByCategory[category];
          if (catDocs.length === 0) return null;
          
          return (
            <div key={category} className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Folder size={18} color="var(--text-muted)" />
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {category} ({catDocs.length})
                </h4>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {catDocs.map(doc => (
                  <div key={doc.id} className="card-premium-interactive" style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                      <div style={{ padding: 10, borderRadius: 12, backgroundColor: 'var(--bg-main)' }}>
                        {getIcon(doc.type)}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <h5 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.name}
                        </h5>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatSize(doc.size)}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ padding: 8, borderRadius: 8, color: 'var(--text-main)', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Download size={18} />
                      </a>
                      {!isOwner && (
                        <button onClick={() => handleDelete(doc)} style={{ padding: 8, borderRadius: 8, color: 'var(--color-danger)', backgroundColor: 'var(--bg-main)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {documents.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>Nenhum documento salvo nesta obra.</p>
          </div>
        )}
      </div>

    </div>
  );
}
