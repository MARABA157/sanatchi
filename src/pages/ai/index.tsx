import { ImageSearch } from '@/components/ai/ImageSearch';
import { ImageGenerator } from '@/components/ai/ImageGenerator';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { TrainingDashboard } from '@/components/ai/TrainingDashboard';

export default function AIFeatures() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Yapay Zeka Özellikleri</h1>
        <p className="text-xl text-muted-foreground">
          Sanat eserlerini yapay zeka ile analiz edin, benzer eserleri bulun ve daha fazlası.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Neler Yapabilirsiniz?</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">🎨 Sanat Eseri Analizi</h3>
              <p className="text-muted-foreground">
                Yapay zeka, sanat eserlerinin stilini, dönemini, tekniğini ve duygusunu analiz eder.
              </p>
            </div>
            <div>
              <h3 className="font-medium">🔍 Benzer Eserler</h3>
              <p className="text-muted-foreground">
                Beğendiğiniz bir esere benzer başka eserleri keşfedin.
              </p>
            </div>
            <div>
              <h3 className="font-medium">🎭 Stil Tanıma</h3>
              <p className="text-muted-foreground">
                Bir eserin hangi sanat stiline ait olduğunu öğrenin.
              </p>
            </div>
            <div>
              <h3 className="font-medium">👩‍🎨 Sanatçı Önerileri</h3>
              <p className="text-muted-foreground">
                Beğenilerinize göre keşfedebileceğiniz yeni sanatçılar bulun.
              </p>
            </div>
            <div>
              <h3 className="font-medium">📷 Görsel Arama</h3>
              <p className="text-muted-foreground">
                Bir görsel yükleyerek benzer sanat eserlerini bulun.
              </p>
            </div>
            <div>
              <h3 className="font-medium">🎯 Resim Üretme</h3>
              <p className="text-muted-foreground">
                Yapay zeka ile istediğiniz tarzda resimler üretin.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <ImageSearch />
          <ImageGenerator />
          <TrainingDashboard />
        </div>
      </div>
    </div>
  );
}
