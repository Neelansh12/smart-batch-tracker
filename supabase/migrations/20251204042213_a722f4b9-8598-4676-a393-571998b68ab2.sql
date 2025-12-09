-- Create enum for batch status
CREATE TYPE public.batch_status AS ENUM ('inbound', 'processing', 'packaging', 'dispatch', 'completed');

-- Create enum for alert severity
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create batches table
CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  batch_id TEXT NOT NULL,
  product TEXT NOT NULL,
  status batch_status NOT NULL DEFAULT 'inbound',
  input_weight DECIMAL(10,2) NOT NULL,
  output_weight DECIMAL(10,2),
  loss_percentage DECIMAL(5,2),
  moisture_loss DECIMAL(5,2) DEFAULT 0,
  trimming_loss DECIMAL(5,2) DEFAULT 0,
  processing_loss DECIMAL(5,2) DEFAULT 0,
  spoilage_loss DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quality_uploads table for AI scoring
CREATE TABLE public.quality_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  quality_score DECIMAL(5,2),
  freshness_score DECIMAL(5,2),
  defect_score DECIMAL(5,2),
  ai_analysis TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_uploads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Batches policies
CREATE POLICY "Users can view own batches" ON public.batches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own batches" ON public.batches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own batches" ON public.batches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own batches" ON public.batches FOR DELETE USING (auth.uid() = user_id);

-- Alerts policies
CREATE POLICY "Users can view own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.alerts FOR DELETE USING (auth.uid() = user_id);

-- Quality uploads policies
CREATE POLICY "Users can view own uploads" ON public.quality_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON public.quality_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own uploads" ON public.quality_uploads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own uploads" ON public.quality_uploads FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for quality images
INSERT INTO storage.buckets (id, name, public) VALUES ('quality-images', 'quality-images', true);

-- Storage policies
CREATE POLICY "Users can upload quality images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'quality-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view quality images" ON storage.objects FOR SELECT USING (bucket_id = 'quality-images');
CREATE POLICY "Users can delete own quality images" ON storage.objects FOR DELETE USING (bucket_id = 'quality-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON public.batches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();