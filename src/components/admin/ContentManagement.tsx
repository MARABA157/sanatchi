import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import { Image, FileVideo, MessageSquare, Plus, Edit2, Trash2, Eye } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: 'image' | 'video' | 'post';
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast({
        title: 'Hata',
        description: 'İçerikler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contents')
        .update({ status: newStatus })
        .eq('id', contentId);

      if (error) throw error;

      setContents(contents.map(content => 
        content.id === contentId ? { ...content, status: newStatus as any } : content
      ));

      toast({
        title: 'Başarılı',
        description: 'İçerik durumu güncellendi.',
      });
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: 'Hata',
        description: 'Durum güncellenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Bu içeriği silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      setContents(contents.filter(content => content.id !== contentId));
      toast({
        title: 'Başarılı',
        description: 'İçerik silindi.',
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Hata',
        description: 'İçerik silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <FileVideo className="w-4 h-4" />;
      case 'post':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredContents = contents.filter(content =>
    (filter === 'all' || content.type === filter) &&
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="İçerik ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tür seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="image">Resimler</SelectItem>
              <SelectItem value="video">Videolar</SelectItem>
              <SelectItem value="post">Gönderiler</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni İçerik
        </Button>
      </div>

      <div className="border rounded-lg border-white/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tür</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead>Güncelleme</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContents.map((content) => (
              <TableRow key={content.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getContentIcon(content.type)}
                    {content.title}
                  </div>
                </TableCell>
                <TableCell>{content.type}</TableCell>
                <TableCell>
                  <Select
                    value={content.status}
                    onValueChange={(value) => handleStatusChange(content.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Taslak</SelectItem>
                      <SelectItem value="published">Yayında</SelectItem>
                      <SelectItem value="archived">Arşiv</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(content.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(content.updated_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteContent(content.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
