import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Post {
  id: number;
  image: string;
  title: string;
  author: string;
  liked: boolean;
  saved: boolean;
  aspectRatio: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/2f845b11-8a2e-4dcc-a4fe-66ca7b82c306.jpg',
    title: 'Mountain Serenity',
    author: 'Alex M.',
    liked: false,
    saved: false,
    aspectRatio: 'aspect-[3/4]'
  },
  {
    id: 2,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/08d3fc9d-2f9e-4972-a4a7-ed3436825f0c.jpg',
    title: 'Urban Lines',
    author: 'Sarah K.',
    liked: false,
    saved: false,
    aspectRatio: 'aspect-square'
  },
  {
    id: 3,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/8fa240a2-beeb-42fb-b0ce-224a39780c7f.jpg',
    title: 'Coffee Moments',
    author: 'Mike R.',
    liked: false,
    saved: false,
    aspectRatio: 'aspect-[4/5]'
  },
  {
    id: 4,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/2f845b11-8a2e-4dcc-a4fe-66ca7b82c306.jpg',
    title: 'Nature Escape',
    author: 'Emma L.',
    liked: false,
    saved: false,
    aspectRatio: 'aspect-[2/3]'
  },
  {
    id: 5,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/08d3fc9d-2f9e-4972-a4a7-ed3436825f0c.jpg',
    title: 'City Views',
    author: 'John D.',
    liked: false,
    saved: false,
    aspectRatio: 'aspect-[3/4]'
  },
  {
    id: 6,
    image: 'https://cdn.poehali.dev/projects/a1b85591-5932-4ee8-9fa7-8d4bef4a4ecf/files/8fa240a2-beeb-42fb-b0ce-224a39780c7f.jpg',
    title: 'Cozy Space',
    author: 'Lisa W.',
    liked: false,
    saved: false,
    aspectRatio: 'aspect-square'
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'saved'>('home');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, liked: !post.liked } : post
    ));
  };

  const toggleSave = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, saved: !post.saved } : post
    ));
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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Pix</h1>
          
          {activeTab === 'search' && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Поиск контента..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
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
              onClick={() => setActiveTab('saved')}
              className={activeTab === 'saved' ? 'text-primary' : 'text-muted-foreground'}
            >
              <Icon name="Bookmark" size={24} />
            </Button>
            <Avatar className="ml-2">
              <AvatarFallback className="bg-primary text-primary-foreground">Я</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'saved' && savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Icon name="Bookmark" size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Нет сохраненных постов</h2>
            <p className="text-muted-foreground">Сохраняйте посты, которые вам нравятся</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredPosts.map((post) => (
              <div key={post.id} className="masonry-item group">
                <div className="relative overflow-hidden rounded-2xl bg-secondary transition-transform duration-300 hover:scale-[1.02]">
                  <div className={`w-full ${post.aspectRatio}`}>
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold mb-1">{post.title}</h3>
                      <p className="text-white/80 text-sm">{post.author}</p>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 rounded-full shadow-lg"
                      onClick={() => toggleLike(post.id)}
                    >
                      <Icon 
                        name="Heart" 
                        size={18} 
                        className={post.liked ? 'fill-red-500 text-red-500' : ''}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 rounded-full shadow-lg"
                      onClick={() => toggleSave(post.id)}
                    >
                      <Icon 
                        name="Bookmark" 
                        size={18}
                        className={post.saved ? 'fill-primary text-primary' : ''}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'search' && searchQuery && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Icon name="Search" size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Ничего не найдено</h2>
            <p className="text-muted-foreground">Попробуйте изменить запрос</p>
          </div>
        )}
      </main>
    </div>
  );
}
