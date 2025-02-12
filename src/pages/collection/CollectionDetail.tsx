import { useParams } from 'react-router-dom';

export default function CollectionDetail() {
  const { id } = useParams();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Koleksiyon Detayı</h1>
      <p>Koleksiyon ID: {id}</p>
    </div>
  );
}
