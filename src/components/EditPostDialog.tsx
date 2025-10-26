import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Post } from './PostCard';

interface EditPostDialogProps {
  post: Post | null;
  editTitle: string;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (title: string) => void;
  onSave: () => void;
}

export default function EditPostDialog({
  post,
  editTitle,
  onOpenChange,
  onTitleChange,
  onSave
}: EditPostDialogProps) {
  return (
    <Dialog open={!!post} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Редактировать пост</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Название"
            value={editTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-secondary border-0"
          />
          <div className="flex gap-2">
            <Button 
              onClick={onSave}
              className="flex-1"
            >
              Сохранить
            </Button>
            <Button 
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
