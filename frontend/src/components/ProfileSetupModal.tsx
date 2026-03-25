import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile({ name: name.trim() });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
            <UserCircle className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">प्रोफाइल सेटअप</DialogTitle>
          <DialogDescription className="text-center">
            कृपया अपना नाम दर्ज करें
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">आपका नाम</Label>
            <Input
              id="name"
              placeholder="अपना नाम दर्ज करें"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !name.trim()}>
            {isPending ? 'सहेजा जा रहा है...' : 'जारी रखें'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
