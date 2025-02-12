import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Ahmet Yıldız",
    role: "Dijital Sanatçı",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "Bu platform sayesinde eserlerimi global bir kitleye ulaştırabiliyorum. AI özellikleri gerçekten ilham verici!"
  },
  {
    name: "Elif Kara",
    role: "Ressam",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "Sanat Galerisi, geleneksel ve dijital sanatı mükemmel bir şekilde harmanlıyor. Harika bir topluluk!"
  },
  {
    name: "Mehmet Can",
    role: "Koleksiyoner",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Sanat eserlerini keşfetmek ve satın almak hiç bu kadar kolay olmamıştı. Muhteşem bir platform!"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sanatçılarımızın Yorumları</h2>
          <p className="text-muted-foreground">Platformumuzda yer alan sanatçıların deneyimleri</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
