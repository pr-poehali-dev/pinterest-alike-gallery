import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import PostCard, { type Post, type Comment } from '@/components/PostCard';
import PostDetailSheet from '@/components/PostDetailSheet';
import UploadDialog from '@/components/UploadDialog';
import EditPostDialog from '@/components/EditPostDialog';

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
      <Header
        activeTab={activeTab}
        searchQuery={searchQuery}
        onTabChange={setActiveTab}
        onSearchChange={setSearchQuery}
        onUploadClick={() => setShowUploadDialog(true)}
      />

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
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
                onDelete={deletePost}
                onEdit={startEditPost}
                onOpenComments={setSelectedPost}
              />
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

      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUploadClick={() => setShowUploadDialog(true)}
      />

      <PostDetailSheet
        post={selectedPost}
        commentText={commentText}
        onClose={() => setSelectedPost(null)}
        onLike={toggleLike}
        onSave={toggleSave}
        onCommentChange={setCommentText}
        onCommentSubmit={addComment}
      />

      <UploadDialog
        open={showUploadDialog}
        uploadTitle={uploadTitle}
        onOpenChange={setShowUploadDialog}
        onTitleChange={setUploadTitle}
        onFileUpload={handleFileUpload}
      />

      <EditPostDialog
        post={editingPost}
        editTitle={editTitle}
        onOpenChange={() => setEditingPost(null)}
        onTitleChange={setEditTitle}
        onSave={saveEditPost}
      />
    </div>
  );
}
