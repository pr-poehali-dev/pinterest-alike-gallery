import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: number;
  image: string;
  title: string;
  author: string;
  liked: boolean;
  saved: boolean;
  type: 'image' | 'video';
  comments: Comment[];
}

interface PostCardProps {
  post: Post;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (post: Post) => void;
  onOpenComments: (post: Post) => void;
}

export default function PostCard({ 
  post, 
  onLike, 
  onSave, 
  onDelete, 
  onEdit,
  onOpenComments 
}: PostCardProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-secondary text-foreground text-sm">
              {post.author[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{post.author}</p>
            <p className="text-xs text-muted-foreground">{post.title}</p>
          </div>
        </div>
        
        {post.author === 'Вы' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon name="MoreVertical" size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => onEdit(post)} className="cursor-pointer">
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(post.id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div 
        className="cursor-pointer"
        onClick={() => onOpenComments(post)}
      >
        {post.type === 'video' ? (
          <video 
            src={post.image} 
            className="w-full aspect-square object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full aspect-square object-cover"
          />
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className="h-9 px-3"
          >
            <Icon 
              name="Heart" 
              size={20} 
              className={post.liked ? 'fill-red-500 text-red-500' : ''}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenComments(post)}
            className="h-9 px-3"
          >
            <Icon name="MessageCircle" size={20} />
            {post.comments.length > 0 && (
              <span className="ml-1 text-xs">{post.comments.length}</span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(post.id)}
            className="h-9 px-3 ml-auto"
          >
            <Icon 
              name="Bookmark" 
              size={20}
              className={post.saved ? 'fill-primary text-primary' : ''}
            />
          </Button>
        </div>

        {post.comments.length > 0 && (
          <button
            onClick={() => onOpenComments(post)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Посмотреть все комментарии ({post.comments.length})
          </button>
        )}
      </div>
    </div>
  );
}
