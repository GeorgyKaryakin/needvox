import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Wallet, CreditCard, Heart, Eye, BookOpen, Crown, DollarSign } from 'lucide-react';
import { WalletConnectionModal } from '@/components/WalletConnectionModal';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { userSubscription, getRemainingUsage } = useSubscription();
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="story-card">
          <CardContent className="py-8 text-center">
            <p className="elegant-text">Войдите в аккаунт для просмотра профиля</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subscriptionPlan = userSubscription.planId;
  const remainingLikes = getRemainingUsage('likes');
  const remainingViews = getRemainingUsage('views');
  const remainingCollections = getRemainingUsage('collections');
  const remainingAiCollections = getRemainingUsage('aiCollections');

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="story-card">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <CardTitle className="aristocratic-text text-2xl">
                  {user.name}
                </CardTitle>
                <CardDescription className="elegant-text">
                  {user.email}
                </CardDescription>
                {subscriptionPlan && (
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200">
                    <Crown className="w-4 h-4 mr-1" />
                    {subscriptionPlan === 'premium' ? 'Премиум' : 'Базовый'}
                  </Badge>
                )}
              </CardHeader>
            </Card>

            {/* Wallet Section */}
            <Card className="story-card mt-6">
              <CardHeader>
                <CardTitle className="aristocratic-text flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Кошелек
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="aristocratic-text text-3xl font-bold golden-accent mb-2">
                    ${user.walletBalance.toFixed(2)}
                  </div>
                  <p className="elegant-text text-sm opacity-80">Доступно для вывода</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="elegant-text text-sm">Всего заработано:</span>
                    <span className="font-semibold">${user.totalEarnings.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowWalletModal(true)}
                  className="w-full aristocratic-button"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Привязать кошелек
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Usage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Author Stats */}
            <Card className="story-card">
              <CardHeader>
                <CardTitle className="aristocratic-text">Статистика автора</CardTitle>
                <CardDescription className="elegant-text">
                  Ваши достижения на платформе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="aristocratic-text text-2xl font-bold">
                      {user.storiesCount}
                    </div>
                    <div className="elegant-text text-sm opacity-80">Историй</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="aristocratic-text text-2xl font-bold">
                      {user.likesReceived}
                    </div>
                    <div className="elegant-text text-sm opacity-80">Лайков</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="aristocratic-text text-2xl font-bold">
                      {user.viewsReceived}
                    </div>
                    <div className="elegant-text text-sm opacity-80">Просмотров</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="aristocratic-text text-2xl font-bold">
                      ${(user.likesReceived * 1 + user.viewsReceived * 0.01).toFixed(0)}
                    </div>
                    <div className="elegant-text text-sm opacity-80">Заработано</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Usage */}
            {subscriptionPlan && (
              <Card className="story-card">
                <CardHeader>
                  <CardTitle className="aristocratic-text">Использование тарифа</CardTitle>
                  <CardDescription className="elegant-text">
                    Ваши лимиты и оставшиеся ресурсы
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="elegant-text">Лайки</span>
                        <span className="text-sm font-medium">
                          {remainingLikes} осталось
                        </span>
                      </div>
                      <Progress 
                        value={(remainingLikes / (subscriptionPlan === 'premium' ? 100 : 10)) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="elegant-text">Просмотры</span>
                        <span className="text-sm font-medium">
                          {remainingViews.toLocaleString()} осталось
                        </span>
                      </div>
                      <Progress 
                        value={(remainingViews / (subscriptionPlan === 'premium' ? 10000 : 1000)) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="elegant-text">Подборки</span>
                        <span className="text-sm font-medium">
                          {remainingCollections} осталось
                        </span>
                      </div>
                      <Progress 
                        value={(remainingCollections / (subscriptionPlan === 'premium' ? 1000 : 100)) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="elegant-text">ИИ-подборки</span>
                        <span className="text-sm font-medium">
                          {remainingAiCollections} осталось
                        </span>
                      </div>
                      <Progress 
                        value={(remainingAiCollections / (subscriptionPlan === 'premium' ? 200 : 1)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <WalletConnectionModal 
        open={showWalletModal} 
        onOpenChange={setShowWalletModal} 
      />
    </div>
  );
};