import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  aspectRatio: string;
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
    aspectRatio: 'aspect-[3/4]',
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
    aspectRatio: 'aspect-square',
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
    aspectRatio: 'aspect-[4/5]',
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
        aspectRatio: 'aspect-[3/4]',
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-foreground">Pix</h1>
            
            {activeTab === 'search' && (
              <div className="hidden md:flex items-center">
                <div className="relative w-96">
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

          <div className="flex items-center gap-1">
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
            <Avatar className="ml-2 h-8 w-8">
              <AvatarFallback className="bg-secondary text-foreground text-sm">Я</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'saved' && savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Icon name="Bookmark" size={56} className="text-muted-foreground mb-3" />
            <h2 className="text-xl font-semibold mb-2">Нет сохраненных постов</h2>
            <p className="text-muted-foreground text-sm">Сохраняйте посты, которые вам нравятся</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredPosts.map((post) => (
              <div key={post.id} className="masonry-item group cursor-pointer" onClick={() => setSelectedPost(post)}>
                <div className="relative overflow-hidden rounded-lg bg-card transition-transform duration-200 hover:scale-[1.02]">
                  <div className={`w-full ${post.aspectRatio}`}>
                    {post.type === 'video' ? (
                      <video 
                        src={post.image} 
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-medium text-sm mb-0.5">{post.title}</h3>
                      <p className="text-white/80 text-xs">{post.author}</p>
                    </div>
                  </div>

                  {post.type === 'video' && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/60 rounded px-1.5 py-0.5">
                        <Icon name="Play" size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'search' && searchQuery && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Icon name="Search" size={56} className="text-muted-foreground mb-3" />
            <h2 className="text-xl font-semibold mb-2">Ничего не найдено</h2>
            <p className="text-muted-foreground text-sm">Попробуйте изменить запрос</p>
          </div>
        )}
      </main>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-card border-border overflow-hidden">
          {selectedPost && (
            <div className="flex h-full">
              <div className="flex-1 bg-black flex items-center justify-center">
                {selectedPost.type === 'video' ? (
                  <video 
                    src={selectedPost.image} 
                    className="max-h-full max-w-full"
                    controls
                    autoPlay
                    loop
                  />
                ) : (
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              <div className="w-96 flex flex-col bg-card">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-foreground">
                        {selectedPost.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{selectedPost.author}</p>
                      <p className="text-xs text-muted-foreground">{selectedPost.title}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPost(null)}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedPost.comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Icon name="MessageCircle" size={48} className="text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Пока нет комментариев</p>
                    </div>
                  ) : (
                    selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-secondary text-foreground text-xs">
                            {comment.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(selectedPost.id)}
                      className="flex-1"
                    >
                      <Icon 
                        name="Heart" 
                        size={20} 
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
                        size={20}
                        className={selectedPost.saved ? 'fill-primary text-primary' : ''}
                      />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Добавьте комментарий..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[100px] resize-none text-sm"
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
                      className="h-10 w-10"
                    >
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
