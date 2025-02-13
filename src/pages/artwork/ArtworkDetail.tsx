import { useParams } from 'react-router-dom';

export default function ArtworkDetail() {
  const { id } = useParams();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Eser Detayı</h1>
      <p>Eser ID: {id}</p>
    </div>
  );
}
