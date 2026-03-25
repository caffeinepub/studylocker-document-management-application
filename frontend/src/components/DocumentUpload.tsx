import { useState } from 'react';
import { useUploadDocument } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadProps {
  open: boolean;
  onClose: () => void;
}

export default function DocumentUpload({ open, onClose }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { mutate: uploadDocument, isPending } = useUploadDocument();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('फ़ाइल का आकार 10MB से कम होना चाहिए');
        return;
      }
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const docId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uploadDate = BigInt(Date.now());
      const fileSize = BigInt(selectedFile.size);

      uploadDocument(
        {
          docId,
          fileName: selectedFile.name,
          fileType: selectedFile.type || 'application/octet-stream',
          uploadDate,
          fileSize,
          blob,
        },
        {
          onSuccess: () => {
            setSelectedFile(null);
            setUploadProgress(0);
            onClose();
          },
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('अपलोड करने में त्रुटि हुई');
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setSelectedFile(null);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">दस्तावेज़ अपलोड करें</DialogTitle>
          <DialogDescription>
            अपने शैक्षणिक या व्यक्तिगत दस्तावेज़ अपलोड करें
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file">फ़ाइल चुनें</Label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                onChange={handleFileSelect}
                disabled={isPending}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              समर्थित प्रारूप: PDF, JPG, PNG, DOC, DOCX (अधिकतम 10MB)
            </p>
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                {!isPending && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFile(null)}
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Upload Progress */}
              {isPending && uploadProgress > 0 && (
                <div className="mt-4 space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-center text-xs text-muted-foreground">
                    अपलोड हो रहा है... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1"
            >
              रद्द करें
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isPending}
              className="flex-1 gap-2"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  अपलोड हो रहा है...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  अपलोड करें
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
