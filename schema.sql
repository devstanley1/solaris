-- schema.sql - Solaris Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('cliente', 'engenharia', 'comercial', 'admin');
CREATE TYPE project_status AS ENUM ('Venda', 'Projeto', 'Instalação', 'Homologação', 'Concluído');

-- ==========================================
-- 1. Profiles Table (Linked to auth.users)
-- ==========================================
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'cliente',
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Clientes Table
-- ==========================================
CREATE TABLE clientes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL, -- Se o cliente tiver login
  full_name text NOT NULL,
  documento text NOT NULL UNIQUE, -- CPF/CNPJ
  phone text,
  email text,
  endereco_completo text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES profiles(id) -- Quem cadastrou
);

-- ==========================================
-- 3. Projetos Table (Antiga Solicitacoes)
-- ==========================================
CREATE TABLE projetos (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  responsavel_tecnico_id uuid REFERENCES profiles(id) ON DELETE SET NULL, -- Engenheiro alocado
  vendido_por uuid REFERENCES profiles(id) ON DELETE SET NULL, -- Comercial
  potencia_kwp numeric NOT NULL,
  valor_total numeric,
  endereco_instalacao text NOT NULL,
  concessionaria text NOT NULL,
  status project_status DEFAULT 'Venda' NOT NULL,
  data_previsao_conclusao date,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projetos_modtime
BEFORE UPDATE ON projetos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 4. Documentacoes Table (Antiga Documentos)
-- ==========================================
CREATE TABLE documentacoes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  projeto_id uuid REFERENCES projetos(id) ON DELETE CASCADE NOT NULL,
  tipo text NOT NULL, -- "Conta de Luz", "Projeto Elétrico PDF", "ART", "Parecer de Acesso"
  file_url text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentacoes ENABLE ROW LEVEL SECURITY;

-- Utility Function para checar ROLE
CREATE OR REPLACE FUNCTION user_role() RETURNS text AS $$
  SELECT role::text FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- --- Profiles Policies ---
CREATE POLICY "Public profiles are viewable by all logged in users." 
  ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own profile." 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admin can do everything on profiles
CREATE POLICY "Admins can manage all profiles" 
  ON profiles FOR ALL USING (user_role() = 'admin');

-- --- Clientes Policies ---
CREATE POLICY "Comercial e Admin veem todos os clientes" 
  ON clientes FOR SELECT USING (user_role() IN ('admin', 'comercial', 'engenharia'));

CREATE POLICY "Cliente ve seu proprio cadastro"
  ON clientes FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Comercial e Admin inserem/editam clientes"
  ON clientes FOR ALL USING (user_role() IN ('admin', 'comercial'));

-- --- Projetos Policies ---
-- Admin, Comercial, Engenharia veem projetos (comercial pode ver os seus ou todos, vamos liberar todos para equipe interna)
CREATE POLICY "Equipe interna ve todos os projetos" 
  ON projetos FOR SELECT USING (user_role() IN ('admin', 'comercial', 'engenharia'));

CREATE POLICY "Comercial e Admin criam projetos"
  ON projetos FOR INSERT WITH CHECK (user_role() IN ('admin', 'comercial'));

CREATE POLICY "Comercial, Eng e Admin editam projetos"
  ON projetos FOR UPDATE USING (user_role() IN ('admin', 'comercial', 'engenharia'));

CREATE POLICY "Cliente ve apenas seus projetos"
  ON projetos FOR SELECT USING (
    cliente_id IN (SELECT id FROM clientes WHERE profile_id = auth.uid())
  );

-- --- Documentacoes Policies ---
CREATE POLICY "Equipe ve todos os documentos" 
  ON documentacoes FOR ALL USING (user_role() IN ('admin', 'comercial', 'engenharia'));

CREATE POLICY "Cliente ve documentos do seu projeto"
  ON documentacoes FOR SELECT USING (
    projeto_id IN (SELECT id FROM projetos WHERE cliente_id IN (SELECT id FROM clientes WHERE profile_id = auth.uid()))
  );
