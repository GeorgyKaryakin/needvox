import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Heart, Eye, MessageCircle, User, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';

// Mock story data - in real app this would come from API
const mockStory = {
  id: '1',
  title: 'Не могу найти качественный сервис доставки еды для офиса',
  content: `Работаю в IT-компании на 50 человек, и мы постоянно сталкиваемся с проблемой заказа еды для команды. 

**Что мы пробовали:**
- Обычные сервисы доставки (Delivery Club, Яндекс.Еда) - не подходят для больших заказов
- Кейтеринговые компании - слишком дорого и формально
- Договоренности с ближайшими кафе - нестабильное качество

**Наши требования:**
- Доставка на 20-50 человек ежедневно
- Разнообразное меню (не только пицца и суши)
- Здоровые опции питания
- Бюджет: 500-800 рублей на человека
- Возможность предзаказа на неделю вперед
- Учет диетических ограничений сотрудников

**Проблемы, с которыми сталкиваемся:**
1. Большинство сервисов не работают с корпоративными заказами
2. Нет единой системы учета предпочтений сотрудников
3. Сложно организовать оплату (не все хотят платить наличными)
4. Время доставки часто не соблюдается
5. Качество еды непредсказуемо

**Что было бы идеально:**
Сервис, который понимает специфику офисных заказов, имеет удобную систему предзаказа, работает с корпоративными картами и гарантирует качество и время доставки.

Готовы платить премиум за надежность и удобство. Пробовали решать эту проблему уже полгода, но ничего подходящего не нашли.`,
  author: {
    id: '1',
    name: 'Анна Петрова',
    avatar: undefined,
  },
  tags: ['Доставка еды', 'B2B', 'Офис', 'IT'],
  likes: 24,
  views: 156,
  createdAt: new Date('2024-01-15'),
  isLiked: false,
};

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { userSubscription, updateUsage, getRemainingUsage, canUseFeature } = useSubscription();

  // In real app, fetch story by id
  const story = mockStory;

  const handleLike = () => {
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

    // Update usage
    updateUsage({
      likesUsed: userSubscription.likesUsed + 1,
    });

    toast.success('Лайк поставлен! Автор получит $1');
  };

  const handleContactAuthor = () => {
    if (!user) {
      toast.error('Войдите в аккаунт для связи с авторами');
      return;
    }

    if (!userSubscription.planId) {
      toast.error('Оформите подписку для связи с авторами');
      return;
    }

    // In real app, this would initiate a paid message
    toast.success('Сообщение отправлено! С вашего счета списано $1.50');
  };

  const canViewProfile = canUseFeature('viewUserProfiles');

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/stories">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к историям
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="story-card">
              <CardHeader>
                <CardTitle className="aristocratic-text text-2xl leading-tight">
                  {story.title}
                </CardTitle>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{story.createdAt.toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{story.views} просмотров</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{story.likes} лайков</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="tag-chip">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                <div className="elegant-text prose prose-amber max-w-none">
                  {story.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h3 key={index} className="aristocratic-text text-lg font-semibold mt-6 mb-3">
                          {paragraph.slice(2, -2)}
                        </h3>
                      );
                    }
                    if (paragraph.trim() === '') {
                      return <br key={index} />;
                    }
                    return (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card className="story-card">
              <CardHeader>
                <CardTitle className="aristocratic-text text-lg">Автор</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="elegant-text font-medium">{story.author.name}</p>
                    {canViewProfile ? (
                      <Link 
                        to={`/profile/${story.author.id}`}
                        className="text-sm text-amber-600 hover:text-amber-700"
                      >
                        Посмотреть профиль
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Профиль доступен в Премиум
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleContactAuthor}
                  className="w-full aristocratic-button"
                  disabled={!user || !userSubscription.planId}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Связаться ($1.50)
                </Button>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="story-card">
              <CardHeader>
                <CardTitle className="aristocratic-text text-lg">Действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleLike}
                  variant="outline"
                  className="w-full border-red-200 hover:bg-red-50"
                  disabled={!user || !userSubscription.planId}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Поставить лайк ($1)
                </Button>

                {user && userSubscription.planId && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Осталось лайков: {getRemainingUsage('likes')}</p>
                    <p>Осталось просмотров: {getRemainingUsage('views')}</p>
                  </div>
                )}

                {!user && (
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="elegant-text text-sm text-amber-800 mb-2">
                      Войдите для взаимодействия с историями
                    </p>
                    <Button asChild size="sm" className="aristocratic-button">
                      <Link to="/auth">Войти</Link>
                    </Button>
                  </div>
                )}

                {user && !userSubscription.planId && (
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="elegant-text text-sm text-amber-800 mb-2">
                      Оформите подписку для полного доступа
                    </p>
                    <Button asChild size="sm" className="aristocratic-button">
                      <Link to="/pricing">Выбрать тариф</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Stories */}
            <Card className="story-card">
              <CardHeader>
                <CardTitle className="aristocratic-text text-lg">Похожие истории</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link 
                    to="/stories/2" 
                    className="block p-3 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <p className="elegant-text text-sm font-medium mb-1">
                      Ищу приложение для учета личных финансов
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>18 лайков</span>
                      <span>•</span>
                      <span>89 просмотров</span>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/stories/3" 
                    className="block p-3 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <p className="elegant-text text-sm font-medium mb-1">
                      Нужен сервис для организации детских праздников
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>31 лайк</span>
                      <span>•</span>
                      <span>203 просмотра</span>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};