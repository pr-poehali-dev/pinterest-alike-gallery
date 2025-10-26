import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { Post } from './PostCard';

interface PostDetailSheetProps {
  post: Post | null;
  commentText: string;
  onClose: () => void;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onCommentChange: (text: string) => void;
  onCommentSubmit: () => void;
}

export default function PostDetailSheet({
  post,
  commentText,
  onClose,
  onLike,
  onSave,
  onCommentChange,
  onCommentSubmit
}: PostDetailSheetProps) {
  if (!post) return null;

  return (
    <Sheet open={!!post} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] p-0 bg-card border-border">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-foreground">
                  {post.author[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-left text-sm">{post.author}</SheetTitle>
                <p className="text-xs text-muted-foreground text-left">{post.title}</p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="bg-black">
              {post.type === 'video' ? (
                <video 
                  src={post.image} 
                  className="w-full max-h-[40vh] object-contain"
                  controls
                  autoPlay
                  loop
                />
              ) : (
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full max-h-[40vh] object-contain"
                />
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(post.id)}
                  className="flex-1"
                >
                  <Icon 
                    name="Heart" 
                    size={22} 
                    className={post.liked ? 'fill-red-500 text-red-500' : ''}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSave(post.id)}
                  className="flex-1"
                >
                  <Icon 
                    name="Bookmark" 
                    size={22}
                    className={post.saved ? 'fill-primary text-primary' : ''}
                  />
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-sm">Комментарии</h3>
                
                {post.comments.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="MessageCircle" size={40} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Будьте первым, кто оставит комментарий</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-secondary text-foreground text-xs">
                            {comment.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-secondary rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-xs">{comment.author}</p>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border flex-shrink-0 bg-card">
            <div className="flex gap-2">
              <Textarea
                placeholder="Добавьте комментарий..."
                value={commentText}
                onChange={(e) => onCommentChange(e.target.value)}
                className="flex-1 min-h-[44px] max-h-[100px] resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onCommentSubmit();
                  }
                }}
              />
              <Button 
                onClick={onCommentSubmit}
                disabled={!commentText.trim()}
                size="icon"
                className="h-11 w-11 flex-shrink-0"
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
