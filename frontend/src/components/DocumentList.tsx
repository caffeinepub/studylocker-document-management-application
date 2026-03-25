import { useState } from 'react';
import type { Document } from '../backend';
import DocumentCard from './DocumentCard';
import DocumentPreview from './DocumentPreview';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const filteredDocuments = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="दस्तावेज़ खोजें..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Document Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground">कोई दस्तावेज़ नहीं मिला</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPreview={() => setPreviewDoc(doc)}
            />
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      {previewDoc && (
        <DocumentPreview
          document={previewDoc}
          open={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
}
