-- Yapay zeka eğitim logları için tablo oluştur
CREATE TABLE ai_training_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  model_type VARCHAR NOT NULL CHECK (model_type IN ('chat', 'art', 'video')),
  accuracy FLOAT NOT NULL,
  loss FLOAT NOT NULL,
  epoch_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- İndeksler
  CONSTRAINT idx_training_logs_model_type_created_at UNIQUE (model_type, created_at)
);

-- RLS politikaları
ALTER TABLE ai_training_logs ENABLE ROW LEVEL SECURITY;

-- Okuma politikası - Herkes okuyabilir
CREATE POLICY "Training logs are viewable by everyone" 
ON ai_training_logs FOR SELECT 
TO authenticated
USING (true);

-- Yazma politikası - Sadece servis hesabı yazabilir
CREATE POLICY "Only service account can insert training logs" 
ON ai_training_logs FOR INSERT 
TO authenticated
USING (auth.uid() = service_role());

-- İstatistikler için görünüm
CREATE VIEW training_statistics AS
SELECT 
  model_type,
  AVG(accuracy) as avg_accuracy,
  MIN(accuracy) as min_accuracy,
  MAX(accuracy) as max_accuracy,
  AVG(loss) as avg_loss,
  COUNT(*) as training_count,
  MAX(created_at) as last_training
FROM ai_training_logs
GROUP BY model_type;
