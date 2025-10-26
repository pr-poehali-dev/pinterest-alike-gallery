import { useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UploadDialogProps {
  open: boolean;
  uploadTitle: string;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (title: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadDialog({
  open,
  uploadTitle,
  onOpenChange,
  onTitleChange,
  onFileUpload
}: UploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Загрузить контент</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Название"
            value={uploadTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-secondary border-0"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={onFileUpload}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            variant="outline"
          >
            <Icon name="Upload" size={20} className="mr-2" />
            Выбрать фото или видео
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
