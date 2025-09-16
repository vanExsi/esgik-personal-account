-- Создание схемы базы данных для личного кабинета Easgik

-- Таблица пользователей (расширение auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  middle_name VARCHAR(100),
  email VARCHAR(255),
  payment_method VARCHAR(50) DEFAULT 'cash', -- cash, bank_transfer, qr_code, requisites
  delivery_method VARCHAR(50) DEFAULT 'office', -- office, courier, yandex, cdek
  is_partner BOOLEAN DEFAULT FALSE,
  crm_id VARCHAR(50), -- ID в CRM системе
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица персональных данных
CREATE TABLE IF NOT EXISTS public.personal_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  passport_series VARCHAR(10),
  passport_number VARCHAR(10),
  passport_issued_by TEXT,
  passport_issued_date DATE,
  passport_registration_address TEXT,
  snils VARCHAR(20),
  document_photos JSONB, -- массив URL фотографий документов
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица услуг
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица объектов
CREATE TABLE IF NOT EXISTS public.objects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  cadastral_number VARCHAR(50),
  status VARCHAR(50) DEFAULT 'new', -- new, in_progress, completed, cancelled
  service_id UUID REFERENCES public.services(id),
  manager_name VARCHAR(255),
  cadastral_engineer VARCHAR(255),
  geodesist VARCHAR(255),
  visit_date TIMESTAMP WITH TIME ZONE,
  total_cost DECIMAL(10,2),
  crm_object_id VARCHAR(50), -- ID объекта в CRM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица промокодов
CREATE TABLE IF NOT EXISTS public.promocodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
  discount_value DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица документов
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  object_id UUID REFERENCES public.objects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  document_type VARCHAR(50), -- for_signature, signed
  is_signed BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица уведомлений
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, warning, success, error
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица чатов
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  object_id UUID REFERENCES public.objects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type VARCHAR(20) NOT NULL, -- client, manager
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Партнерские таблицы
CREATE TABLE IF NOT EXISTS public.partner_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  passport_series VARCHAR(10),
  passport_number VARCHAR(10),
  passport_issued_by TEXT,
  passport_issued_date DATE,
  passport_registration_address TEXT,
  snils VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.partner_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.partner_clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  cadastral_number VARCHAR(50),
  address TEXT NOT NULL,
  comments TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, quoted, accepted, rejected, completed
  quoted_price DECIMAL(10,2),
  partner_commission DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.partner_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code VARCHAR(50),
  commission_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка тестовых услуг
INSERT INTO public.services (name, description, base_price) VALUES
('Технический план', 'Подготовка технического плана объекта недвижимости', 14000.00),
('Межевой план', 'Межевание земельного участка', 14000.00),
('Схема ЗУ на КПТ', 'Подготовка схемы расположения земельного участка', 10000.00),
('Вынос границ', 'Вынос точек в натуру', 800.00),
('Топографическая съемка', 'Топографическая съемка участка', 12000.00),
('Акт обследования', 'Акт обследования объекта', 8000.00);

-- Вставка тестовых промокодов
INSERT INTO public.promocodes (code, discount_type, discount_value, usage_limit) VALUES
('WELCOME10', 'percentage', 10.00, 100),
('SAVE1000', 'fixed', 1000.00, 50),
('PARTNER15', 'percentage', 15.00, NULL);

-- Включение RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own personal data" ON public.personal_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own personal data" ON public.personal_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personal data" ON public.personal_data FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own objects" ON public.objects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own chats" ON public.chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON public.chats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Партнерские политики
CREATE POLICY "Partners can view own clients" ON public.partner_clients FOR SELECT USING (auth.uid() = partner_id);
CREATE POLICY "Partners can manage own clients" ON public.partner_clients FOR ALL USING (auth.uid() = partner_id);
CREATE POLICY "Partners can view own orders" ON public.partner_orders FOR SELECT USING (auth.uid() = partner_id);
CREATE POLICY "Partners can manage own orders" ON public.partner_orders FOR ALL USING (auth.uid() = partner_id);
CREATE POLICY "Partners can view own referrals" ON public.partner_referrals FOR SELECT USING (auth.uid() = partner_id);

-- Функции и триггеры для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_data_updated_at BEFORE UPDATE ON public.personal_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON public.objects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partner_orders_updated_at BEFORE UPDATE ON public.partner_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
