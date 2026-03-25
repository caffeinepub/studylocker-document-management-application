import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMyDocuments } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../components/Header';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';
import EmptyState from '../components/EmptyState';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: documents, isLoading } = useGetMyDocuments();
  const [showUpload, setShowUpload] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const hasDocuments = documents && documents.length > 0;

  return (
    <div className="min-h-screen">
      <Header userName={userProfile?.name || 'उपयोगकर्ता'} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              मेरे दस्तावेज़
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isLoading ? 'लोड हो रहा है...' : `कुल ${documents?.length || 0} दस्तावेज़`}
            </p>
          </div>
          <Button
            onClick={() => setShowUpload(true)}
            size="lg"
            className="gap-2"
          >
            <Upload className="h-5 w-5" />
            नया दस्तावेज़ अपलोड करें
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-lg text-muted-foreground">दस्तावेज़ लोड हो रहे हैं...</p>
            </div>
          </div>
        ) : hasDocuments ? (
          <DocumentList documents={documents} />
        ) : (
          <EmptyState onUploadClick={() => setShowUpload(true)} />
        )}
      </main>

      {/* Upload Dialog */}
      {showUpload && (
        <DocumentUpload
          open={showUpload}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-white/20 bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025. Built with ❤️ using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
