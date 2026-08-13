import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone?: string;
  team?: string;
  specialty?: string;
  linkedWorks?: string[];
  status: 'Ativo' | 'Férias' | 'Afastado' | 'Inativo';
  availability: 'Disponível' | 'Alocado';
  notes?: string;
  photo?: string;
  createdAt?: any;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  cnpj?: string;
  category?: string;
  products?: string;
  deadline?: string;
  notes?: string;
  rating?: number;
  createdAt?: any;
}

export interface Equipment {
  id: string;
  name: string;
  tag?: string; // Missing property for BuilderEquipment.tsx
  category: 'Máquinas' | 'Ferramentas' | 'Veículos' | 'Outros';
  patrimonyNumber?: string;
  workId?: string; // Se está alocado em alguma obra
  linkedWorkId?: string; // Missing property for BuilderEquipment.tsx
  responsible?: string;
  status: 'Disponível' | 'Em Uso' | 'Manutenção' | 'Inativo' | string;
  maintenanceDate?: string;
  nextMaintenance?: string; // Missing property for BuilderEquipment.tsx
  photos?: string[];
  createdAt?: any;
}

export interface Procurement {
  id: string;
  title: string;
  requester?: string; // Missing property for BuilderProcurement.tsx
  supplierId?: string;
  supplierName?: string;
  workId?: string;
  category?: string;
  costCenter?: string;
  status: 'Solicitado' | 'Cotando' | 'Aprovado' | 'Comprado' | 'Recebido' | 'Conferido' | string;
  responsible?: string;
  estimatedValue?: number;
  approvedValue?: number;
  paidValue?: number;
  deadline?: string;
  invoiceUrl?: string;
  createdAt?: any;
}

interface BuilderContextType {
  employees: Employee[];
  suppliers: Supplier[];
  equipments: Equipment[];
  procurements: Procurement[];
  isLoading: boolean;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest } = useAuth();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || isGuest) {
      setEmployees([]);
      setSuppliers([]);
      setEquipments([]);
      setProcurements([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let unsubscribes: (() => void)[] = [];

    try {
      // 1. Employees
      const qEmployees = query(collection(db, 'users', user.uid, 'employees'));
      unsubscribes.push(onSnapshot(qEmployees, (snap) => {
        setEmployees(snap.docs.map(d => ({ id: d.id, ...d.data() } as Employee)));
      }));

      // 2. Suppliers
      const qSuppliers = query(collection(db, 'users', user.uid, 'suppliers'));
      unsubscribes.push(onSnapshot(qSuppliers, (snap) => {
        setSuppliers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Supplier)));
      }));

      // 3. Equipments
      const qEquipments = query(collection(db, 'users', user.uid, 'equipments'));
      unsubscribes.push(onSnapshot(qEquipments, (snap) => {
        setEquipments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Equipment)));
      }));

      // 4. Procurements
      const qProcurements = query(collection(db, 'users', user.uid, 'procurements'));
      unsubscribes.push(onSnapshot(qProcurements, (snap) => {
        setProcurements(snap.docs.map(d => ({ id: d.id, ...d.data() } as Procurement)));
      }));
    } catch (e) {
      console.error("Error setting up builder listeners:", e);
    } finally {
      setIsLoading(false);
    }

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [user, isGuest]);

  return (
    <BuilderContext.Provider value={{ employees, suppliers, equipments, procurements, isLoading }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
