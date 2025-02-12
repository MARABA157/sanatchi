import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface GenerationButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export function GenerationButton({ onClick, loading, disabled, children }: GenerationButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full"
    >
      {loading ? (
        <>
          <LoadingSpinner className="mr-2" />
          Oluşturuluyor...
        </>
      ) : (
        children
      )}
    </Button>
  );
}