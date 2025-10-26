import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  activeTab: 'home' | 'search' | 'saved';
  searchQuery: string;
  onTabChange: (tab: 'home' | 'search' | 'saved') => void;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
}

export default function Header({
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
  onUploadClick
}: HeaderProps) {
  return (
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
                  onChange={(e) => onSearchChange(e.target.value)}
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
            onClick={onUploadClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="Plus" size={24} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onTabChange('home')}
            className={activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
          >
            <Icon name="Home" size={24} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onTabChange('search')}
            className={activeTab === 'search' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
          >
            <Icon name="Search" size={24} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onTabChange('saved')}
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
  );
}
