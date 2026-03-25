import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export default function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white/60 p-12 text-center backdrop-blur-sm dark:bg-gray-800/60">
      <div className="mb-6">
        <img
          src="/assets/generated/empty-documents-state.dim_400x300.png"
          alt="No documents"
          className="mx-auto h-48 w-auto opacity-80"
        />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        कोई दस्तावेज़ नहीं मिला
      </h3>
      <p className="mb-6 max-w-md text-muted-foreground">
        अपने शैक्षणिक और व्यक्तिगत दस्तावेज़ों को सुरक्षित रूप से संग्रहीत करने के लिए अपना पहला दस्तावेज़ अपलोड करें
      </p>
      <Button onClick={onUploadClick} size="lg" className="gap-2">
        <Upload className="h-5 w-5" />
        अपना पहला दस्तावेज़ अपलोड करें
      </Button>
    </div>
  );
}
