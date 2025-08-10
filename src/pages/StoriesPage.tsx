import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Heart, Eye, MessageCircle, Search, Filter, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  likes: number;
  views: number;
  createdAt: Date;
  isLiked?: boolean;
}

const mockStories: Story[] = [
  {
    id: '1',
    title: 'Не могу найти качественный сервис доставки еды для офиса',
    excerpt: 'Работаю в IT-компании, и мы постоянно сталкиваемся с проблемой заказа еды для команды...',
    content: 'Полная история о проблемах с доставкой еды в офис, включая детали о требованиях команды, бюджете и неудачных попытках найти подходящий сервис.',
    author: {
      id: '1',
      name: 'Анна Петрова',
    },
    tags: ['Доставка еды', 'B2B', 'Офис', 'IT'],
    likes: 24,
    views: 156,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Ищу приложение для учета личных финансов с семейным доступом',
    excerpt: 'Уже полгода пытаюсь найти удобное приложение для ведения семейного бюджета...',
    content: 'Детальное описание потребностей семьи в финансовом планировании, проблемы с существующими решениями и специфические требования.',
    author: {
      id: '2',
      name: 'Михаил Иванов',
    },
    tags: ['Финансы', 'Семья', 'Мобильное приложение', 'Бюджет'],
    likes: 18,
    views: 89,
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Нужен сервис для организации детских праздников на дому',
    excerpt: 'Как мама двоих детей, постоянно сталкиваюсь с проблемой организации дней рождения...',
    content: 'История о сложностях организации детских праздников, поиске аниматоров, декораций и развлечений.',
    author: {
      id: '3',
      name: 'Елена Смирнова',
    },
    tags: ['Дети', 'Праздники', 'Развлечения', 'Услуги'],
    likes: 31,
    views: 203,
    createdAt: new Date('2024-01-13'),
  },
];

export const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');
  
  const { user } = useAuth();
  const { userSubscription, updateUsage, getRemainingUsage } = useSubscription();

  const allTags = Array.from(new Set(stories.flatMap(story => story.tags)));

  const filteredStories = stories
    .filter(story => 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(story => !selectedTag || story.tags.includes(selectedTag))
    .sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        case 'recent':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const handleLike = (storyId: string) => {
    if (!user) {
      toast.error('Войдите в аккаунт для оценки историй');
      return;
    }

    if (!userSubscription.planId) {
      toast.error('Оформите подписку для оценки историй');
      return;
    }

    const remainingLikes = getRemainingUsage('likes');
    if (remainingLikes <= 0) {
      toast.error('Исчерпан лимит лайков на этот месяц');
      return;
    }

    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        const isLiked = story.isLiked;
        return {
          ...story,
          likes: isLiked ? story.likes - 1 : story.likes + 1,
          isLiked: !isLiked,
        };
      }
      return story;
    }));

    // Update usage
    updateUsage({
      likesUsed: userSubscription.likesUsed + 1,
    });

    toast.success('Лайк поставлен! Автор получит $1');
  };

  const handleView = (storyId: string) => {
    if (!user || !userSubscription.planId) return;

    const remainingViews = getRemainingUsage('views');
    if (remainingViews <= 0) {
      toast.error('Исчерпан лимит просмотров на этот месяц');
      return;
    }

    // Update usage
    updateUsage({
      viewsUsed: userSubscription.viewsUsed + 1,
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="aristocratic-text text-4xl font-bold mb-4">
            Истории клиентов
          </h1>
          <p className="elegant-text text-xl opacity-80 mb-6">
            Исследуйте реальные потребности и найдите свою нишу
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
              <Input
                placeholder="Поиск по историям, тегам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="impressionist-input pl-10"
              />
            </div>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-48 impressionist-input">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Все теги" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все теги</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 impressionist-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Новые</SelectItem>
                <SelectItem value="likes">По лайкам</SelectItem>
                <SelectItem value="views">По просмотрам</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Usage Stats */}
          {user && userSubscription.planId && (
            <div className="flex flex-wrap gap-4 mb-6">
              <Badge variant="outline" className="tag-chip">
                <Heart className="w-4 h-4 mr-1" />
                Лайков: {getRemainingUsage('likes')}
              </Badge>
              <Badge variant="outline" className="tag-chip">
                <Eye className="w-4 h-4 mr-1" />
                Просмотров: {getRemainingUsage('views')}
              </Badge>
            </div>
          )}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="story-card">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="elegant-text font-medium">{story.author.name}</p>
                    <p className="elegant-text text-sm opacity-60">
                      {story.createdAt.toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                
                <CardTitle className="aristocratic-text text-lg leading-tight">
                  {story.title}
                </CardTitle>
                <CardDescription className="elegant-text">
                  {story.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="tag-chip text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(story.id)}
                      className={`hover:bg-red-50 ${story.isLiked ? 'text-red-600' : ''}`}
                      disabled={!user || !userSubscription.planId}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${story.isLiked ? 'fill-current' : ''}`} />
                      {story.likes}
                    </Button>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{story.views}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-amber-50"
                      disabled={!user || !userSubscription.planId}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-amber-300 hover:bg-amber-50"
                      onClick={() => handleView(story.id)}
                    >
                      <Link to={`/stories/${story.id}`}>
                        Читать
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <Card className="story-card max-w-md mx-auto">
              <CardContent className="py-8">
                <p className="elegant-text text-lg mb-4">
                  Истории не найдены
                </p>
                <p className="elegant-text opacity-60">
                  Попробуйте изменить параметры поиска
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};