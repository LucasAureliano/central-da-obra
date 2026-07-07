-- Central da Obra - Database Schema (PostgreSQL / Supabase)

-- 1. Empresas (Construtoras, Empreiteiros independentes, etc)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    subscription_plan VARCHAR(50) DEFAULT 'FREE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Perfis de Usuários (Extensão do auth.users do Supabase)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    company_id UUID REFERENCES companies(id),
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'ENGENHEIRO', 'PROPRIETARIO', 'FUNCIONARIO')),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Clientes
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Obras Principais
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    client_id UUID REFERENCES clients(id),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    status VARCHAR(50) DEFAULT 'PLANNING' CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'PAUSED', 'FINISHED')),
    start_date DATE,
    estimated_end_date DATE,
    total_budget DECIMAL(15, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Equipe da Obra (Funcionários vinculados à empresa)
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL, -- Ex: Pedreiro, Mestre de Obras
    daily_rate DECIMAL(10, 2),
    phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'AVAILABLE'
);

-- 6. Cronograma (Gráfico de Gantt e Etapas)
CREATE TABLE work_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- Ex: 'Fundação', 'Alvenaria'
    order_index INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    progress_percentage INTEGER DEFAULT 0
);

-- 7. Checklist da Obra (Sugestão de Ouro)
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID REFERENCES work_stages(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL, -- Ex: 'Escavação'
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES user_profiles(id)
);

-- 8. Diário de Obra e Galeria
CREATE TABLE daily_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    author_id UUID REFERENCES user_profiles(id),
    report_date DATE NOT NULL,
    weather_condition VARCHAR(100), -- Ex: 'Ensolarado'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    report_id UUID REFERENCES daily_reports(id),
    image_url TEXT NOT NULL,
    phase VARCHAR(50) CHECK (phase IN ('ANTES', 'DURANTE', 'DEPOIS')),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Financeiro (Orçamentos, Contratos e Movimentações)
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES works(id),
    total_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    validity_date DATE,
    pdf_url TEXT
);

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id),
    type VARCHAR(100),
    signature_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES works(id),
    type VARCHAR(20) CHECK (type IN ('INCOME', 'EXPENSE')),
    category VARCHAR(100), -- Ex: 'Materiais', 'Mão de Obra'
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT
);

-- Row Level Security (RLS) Policies (Examples)
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see works from their company" ON works
    FOR SELECT USING (
        company_id = (SELECT company_id FROM user_profiles WHERE user_profiles.id = auth.uid())
    );
