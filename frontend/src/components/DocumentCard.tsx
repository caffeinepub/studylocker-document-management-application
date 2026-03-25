import type { Document } from '../backend';
import { useDeleteDocument } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileText, MoreVertical, Eye, Download, Trash2, File, FileImage } from 'lucide-react';
import { useState } from 'react';

interface DocumentCardProps {
  document: Document;
  onPreview: () => void;
}

export default function DocumentCard({ document, onPreview }: DocumentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: deleteDocument, isPending } = useDeleteDocument();

  const handleDownload = () => {
    const url = document.storage.getDirectURL();
    const link = window.document.createElement('a');
    link.href = url;
    link.download = document.fileName;
    link.click();
  };

  const handleDelete = () => {
    deleteDocument(document.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const getFileIcon = () => {
    if (document.fileType.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-indigo-500" />;
  };

  const formatFileSize = (bytes: bigint) => {
    const kb = Number(bytes) / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
                {getFileIcon()}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onPreview} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    देखें
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    डाउनलोड करें
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="cursor-pointer text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    हटाएं
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* File Info */}
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight" title={document.fileName}>
                {document.fileName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatFileSize(document.fileSize)}</span>
                <span>•</span>
                <span>{formatDate(document.uploadDate)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreview}
                className="flex-1 text-xs"
              >
                <Eye className="mr-1 h-3 w-3" />
                देखें
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex-1 text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                डाउनलोड
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>क्या आप निश्चित हैं?</AlertDialogTitle>
            <AlertDialogDescription>
              यह क्रिया पूर्ववत नहीं की जा सकती। यह दस्तावेज़ स्थायी रूप से हटा दिया जाएगा।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'हटाया जा रहा है...' : 'हटाएं'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
