import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MobileNavProps {
  activeTab: 'home' | 'search' | 'saved';
  onTabChange: (tab: 'home' | 'search' | 'saved') => void;
  onUploadClick: () => void;
}

export default function MobileNav({ activeTab, onTabChange, onUploadClick }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50">
      <div className="flex items-center justify-around h-14">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onTabChange('home')}
          className={activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}
        >
          <Icon name="Home" size={24} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onTabChange('search')}
          className={activeTab === 'search' ? 'text-primary' : 'text-muted-foreground'}
        >
          <Icon name="Search" size={24} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onUploadClick}
          className="text-muted-foreground"
        >
          <Icon name="Plus" size={24} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onTabChange('saved')}
          className={activeTab === 'saved' ? 'text-primary' : 'text-muted-foreground'}
        >
          <Icon name="Bookmark" size={24} />
        </Button>
        <Avatar className="h-7 w-7 cursor-pointer">
          <AvatarFallback className="bg-secondary text-foreground text-xs">Я</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
