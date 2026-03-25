import { useState, useEffect } from 'react';
import type { Document } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentPreviewProps {
  document: Document;
  open: boolean;
  onClose: () => void;
}

export default function DocumentPreview({ document, open, onClose }: DocumentPreviewProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      // Simulate loading time for preview
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleDownload = () => {
    const url = document.storage.getDirectURL();
    const link = window.document.createElement('a');
    link.href = url;
    link.download = document.fileName;
    link.click();
  };

  const isImage = document.fileType.startsWith('image/');
  const isPDF = document.fileType === 'application/pdf';
  const directURL = document.storage.getDirectURL();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="truncate text-lg">{document.fileName}</DialogTitle>
            <Button onClick={handleDownload} size="sm" className="gap-2 flex-shrink-0">
              <Download className="h-4 w-4" />
              डाउनलोड
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="flex items-center justify-center min-h-full py-4">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">लोड हो रहा है...</p>
              </div>
            ) : isImage ? (
              <img
                src={directURL}
                alt={document.fileName}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            ) : isPDF ? (
              <iframe
                src={directURL}
                className="w-full h-[600px] rounded-lg border"
                title={document.fileName}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">पूर्वावलोकन उपलब्ध नहीं है</p>
                  <p className="text-sm text-muted-foreground">
                    इस फ़ाइल प्रकार का पूर्वावलोकन नहीं किया जा सकता
                  </p>
                </div>
                <Button onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  फ़ाइल डाउनलोड करें
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
