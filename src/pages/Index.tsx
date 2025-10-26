import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: number;
  image: string;
  title: string;
  author: string;
  liked: boolean;
  saved: boolean;
  type: 'image' | 'video';
  comments: Comment[];
}

const initialPosts: Post[] = [
  {
    id: 1,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/2f845b11-8a2e-4dcc-a4fe-66ca7b82c306.jpg',
    title: 'Mountain Serenity',
    author: 'Alex M.',
    liked: false,
    saved: false,
    type: 'image',
    comments: []
  },
  {
    id: 2,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/08d3fc9d-2f9e-4972-a4a7-ed3436825f0c.jpg',
    title: 'Urban Lines',
    author: 'Sarah K.',
    liked: false,
    saved: false,
    type: 'image',
    comments: []
  },
  {
    id: 3,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/8fa240a2-beeb-42fb-b0ce-224a39780c7f.jpg',
    title: 'Coffee Moments',
    author: 'Mike R.',
    liked: false,
    saved: false,
    type: 'image',
    comments: []
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'saved'>('home');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, liked: !post.liked } : post
    ));
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost({ ...selectedPost, liked: !selectedPost.liked });
    }
  };

  const toggleSave = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, saved: !post.saved } : post
    ));
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost({ ...selectedPost, saved: !selectedPost.saved });
    }
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
    if (selectedPost?.id === id) {
      setSelectedPost(null);
    }
    toast({
      title: "Пост удалён",
      description: "Ваш пост успешно удалён"
    });
  };

  const startEditPost = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
  };

  const saveEditPost = () => {
    if (!editingPost) return;
    
    setPosts(posts.map(post => 
      post.id === editingPost.id ? { ...post, title: editTitle } : post
    ));
    
    if (selectedPost?.id === editingPost.id) {
      setSelectedPost({ ...selectedPost, title: editTitle });
    }
    
    setEditingPost(null);
    toast({
      title: "Пост обновлён",
      description: "Изменения сохранены"
    });
  };

  const addComment = () => {
    if (!selectedPost || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: 'Вы',
      text: commentText,
      timestamp: 'только что'
    };

    const updatedPost = {
      ...selectedPost,
      comments: [...selectedPost.comments, newComment]
    };

    setPosts(posts.map(post => 
      post.id === selectedPost.id ? updatedPost : post
    ));
    setSelectedPost(updatedPost);
    setCommentText('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast({
        title: "Ошибка",
        description: "Загружайте только фото или видео",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newPost: Post = {
        id: Date.now(),
        image: e.target?.result as string,
        title: uploadTitle || 'Без названия',
        author: 'Вы',
        liked: false,
        saved: false,
        type: isVideo ? 'video' : 'image',
        comments: []
      };

      setPosts([newPost, ...posts]);
      setShowUploadDialog(false);
      setUploadTitle('');
      toast({
        title: "Загружено!",
        description: "Ваш контент добавлен в ленту"
      });
    };
    reader.readAsDataURL(file);
  };

  const savedPosts = posts.filter(post => post.saved);
  const displayPosts = activeTab === 'saved' ? savedPosts : posts;

  const filteredPosts = activeTab === 'search' && searchQuery
    ? displayPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayPosts;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6 flex-1">
            <h1 className="text-lg md:text-xl font-semibold text-foreground">Pix</h1>
            
            {activeTab === 'search' && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-0 h-9 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowUploadDialog(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Plus" size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveTab('home')}
              className={activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
            >
              <Icon name="Home" size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveTab('search')}
              className={activeTab === 'search' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
            >
              <Icon name="Search" size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setActiveTab('saved')}
              className={activeTab === 'saved' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
            >
              <Icon name="Bookmark" size={24} />
            </Button>
            <Avatar className="ml-2 h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-secondary text-foreground text-sm">Я</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-2xl">
        {activeTab === 'saved' && savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Icon name="Bookmark" size={48} className="text-muted-foreground mb-3" />
            <h2 className="text-lg font-semibold mb-2">Нет сохранённых постов</h2>
            <p className="text-muted-foreground text-sm">Сохраняйте посты, которые вам нравятся</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-card rounded-lg overflow-hidden border border-border">
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
                        <DropdownMenuItem onClick={() => startEditPost(post)} className="cursor-pointer">
                          <Icon name="Edit" size={16} className="mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deletePost(post.id)}
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
                  onClick={() => setSelectedPost(post)}
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
                      onClick={() => toggleLike(post.id)}
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
                      onClick={() => setSelectedPost(post)}
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
                      onClick={() => toggleSave(post.id)}
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
                      onClick={() => setSelectedPost(post)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Посмотреть все комментарии ({post.comments.length})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'search' && searchQuery && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mb-3" />
            <h2 className="text-lg font-semibold mb-2">Ничего не найдено</h2>
            <p className="text-muted-foreground text-sm">Попробуйте изменить запрос</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50">
        <div className="flex items-center justify-around h-14">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setActiveTab('home')}
            className={activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}
          >
            <Icon name="Home" size={24} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setActiveTab('search')}
            className={activeTab === 'search' ? 'text-primary' : 'text-muted-foreground'}
          >
            <Icon name="Search" size={24} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowUploadDialog(true)}
            className="text-muted-foreground"
          >
            <Icon name="Plus" size={24} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setActiveTab('saved')}
            className={activeTab === 'saved' ? 'text-primary' : 'text-muted-foreground'}
          >
            <Icon name="Bookmark" size={24} />
          </Button>
          <Avatar className="h-7 w-7 cursor-pointer">
            <AvatarFallback className="bg-secondary text-foreground text-xs">Я</AvatarFallback>
          </Avatar>
        </div>
      </nav>

      <Sheet open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <SheetContent side="bottom" className="h-[85vh] p-0 bg-card border-border">
          {selectedPost && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground">
                      {selectedPost.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-left text-sm">{selectedPost.author}</SheetTitle>
                    <p className="text-xs text-muted-foreground text-left">{selectedPost.title}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="bg-black">
                  {selectedPost.type === 'video' ? (
                    <video 
                      src={selectedPost.image} 
                      className="w-full max-h-[40vh] object-contain"
                      controls
                      autoPlay
                      loop
                    />
                  ) : (
                    <img 
                      src={selectedPost.image} 
                      alt={selectedPost.title}
                      className="w-full max-h-[40vh] object-contain"
                    />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(selectedPost.id)}
                      className="flex-1"
                    >
                      <Icon 
                        name="Heart" 
                        size={22} 
                        className={selectedPost.liked ? 'fill-red-500 text-red-500' : ''}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(selectedPost.id)}
                      className="flex-1"
                    >
                      <Icon 
                        name="Bookmark" 
                        size={22}
                        className={selectedPost.saved ? 'fill-primary text-primary' : ''}
                      />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-4">
                    <h3 className="font-semibold text-sm">Комментарии</h3>
                    
                    {selectedPost.comments.length === 0 ? (
                      <div className="text-center py-8">
                        <Icon name="MessageCircle" size={40} className="text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Будьте первым, кто оставит комментарий</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedPost.comments.map((comment) => (
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
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 min-h-[44px] max-h-[100px] resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        addComment();
                      }
                    }}
                  />
                  <Button 
                    onClick={addComment}
                    disabled={!commentText.trim()}
                    size="icon"
                    className="h-11 w-11 flex-shrink-0"
                  >
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Загрузить контент</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Название"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="bg-secondary border-0"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
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

      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Редактировать пост</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Название"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-secondary border-0"
            />
            <div className="flex gap-2">
              <Button 
                onClick={saveEditPost}
                className="flex-1"
              >
                Сохранить
              </Button>
              <Button 
                onClick={() => setEditingPost(null)}
                variant="outline"
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
