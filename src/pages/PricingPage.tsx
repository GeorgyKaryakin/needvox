import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import { Check, Crown, Sparkles, Download, Eye, Heart, MessageCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();
  const { plans, subscribe, userSubscription } = useSubscription();

  const handleSubscribe = async (planId: 'basic' | 'premium') => {
    if (!user) {
      toast.error('Войдите в аккаунт для оформления подписки');
      return;
    }

    try {
      await subscribe(planId, isYearly);
      toast.success('Подписка успешно оформлена!');
    } catch (error) {
      toast.error('Ошибка при оформлении подписки');
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (!isYearly) return 0;
    return (plan.monthlyPrice * 12) - plan.yearlyPrice;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="aristocratic-text text-4xl md:text-5xl font-bold mb-6">
            Выберите свой тариф
          </h1>
          <p className="elegant-text text-xl opacity-80 max-w-2xl mx-auto mb-8">
            Получите доступ к уникальным историям клиентов и найдите свою нишу
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`elegant-text ${!isYearly ? 'font-semibold' : 'opacity-60'}`}>
              Ежемесячно
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-amber-500"
            />
            <span className={`elegant-text ${isYearly ? 'font-semibold' : 'opacity-60'}`}>
              Ежегодно
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Экономия до $600
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`story-card relative ${
                plan.id === 'premium' ? 'luxury-shadow border-2 border-amber-200' : ''
              }`}
            >
              {plan.id === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1">
                    <Crown className="w-4 h-4 mr-1" />
                    Популярный
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {plan.id === 'premium' ? (
                    <Sparkles className="w-8 h-8 text-amber-600" />
                  ) : (
                    <Crown className="w-8 h-8 text-amber-600" />
                  )}
                </div>
                <CardTitle className="aristocratic-text text-2xl">
                  {plan.name}
                </CardTitle>
                <div className="space-y-2">
                  <div className="aristocratic-text text-4xl font-bold golden-accent">
                    ${getPrice(plan)}
                    <span className="text-lg font-normal opacity-60">
                      /{isYearly ? 'год' : 'мес'}
                    </span>
                  </div>
                  {isYearly && getSavings(plan) > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      Экономия ${getSavings(plan)} в год
                    </div>
                  )}
                </div>
                <CardDescription className="elegant-text">
                  {plan.id === 'basic' 
                    ? 'Идеально для начинающих предпринимателей'
                    : 'Для серьезного бизнеса и исследований'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="elegant-text">
                      До {plan.features.collections} подборок
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="elegant-text">
                      {plan.features.aiCollections} ИИ-подборок в месяц
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="elegant-text">
                      {plan.features.likes} лайков в месяц
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <span className="elegant-text">
                      {plan.features.views.toLocaleString()} просмотров
                    </span>
                  </div>
                  {plan.features.downloadCollections && (
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-purple-500" />
                      <span className="elegant-text">
                        Скачивание подборок
                      </span>
                    </div>
                  )}
                  {plan.features.viewUserProfiles && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-amber-500" />
                      <span className="elegant-text">
                        Просмотр профилей авторов
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full ${
                    plan.id === 'premium' 
                      ? 'aristocratic-button' 
                      : 'border-2 border-amber-300 hover:bg-amber-50'
                  }`}
                  variant={plan.id === 'premium' ? 'default' : 'outline'}
                  disabled={userSubscription.planId === plan.id}
                >
                  {userSubscription.planId === plan.id 
                    ? 'Текущий тариф' 
                    : `Выбрать ${plan.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="story-card max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="aristocratic-text text-2xl font-bold mb-4">
                Для авторов историй
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="elegant-text">$1 за каждый лайк</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="elegant-text">$0.01 за просмотр</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-amber-500" />
                  <span className="elegant-text">$1 за сообщение</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="elegant-text">Бесплатная публикация</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};