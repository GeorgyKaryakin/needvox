import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Users, TrendingUp, MessageCircle, Crown, Palette } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Делитесь историями',
      description: 'Расскажите о своих проблемах и получайте вознаграждение за каждый лайк и просмотр',
    },
    {
      icon: Users,
      title: 'Находите ниши',
      description: 'Исследуйте реальные потребности клиентов для создания успешного бизнеса',
    },
    {
      icon: TrendingUp,
      title: 'Анализируйте тренды',
      description: 'Используйте ИИ для создания подборок и выявления рыночных возможностей',
    },
    {
      icon: MessageCircle,
      title: 'Общайтесь напрямую',
      description: 'Связывайтесь с авторами историй для глубокого понимания проблем',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Историй опубликовано' },
    { number: '5,000+', label: 'Активных пользователей' },
    { number: '$50,000+', label: 'Выплачено авторам' },
    { number: '95%', label: 'Довольных клиентов' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="floating-element inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Palette className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="aristocratic-text text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Превратите клиентские боли<br />
            <span className="golden-accent">в возможности</span>
          </h1>
          
          <p className="elegant-text text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Marketplace, где авторы зарабатывают на историях, а предприниматели находят новые ниши
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button asChild size="lg" className="aristocratic-button text-lg px-8 py-4">
                  <Link to="/create-story">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Создать историю
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-amber-300 hover:bg-amber-50">
                  <Link to="/stories">
                    Исследовать истории
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="aristocratic-button text-lg px-8 py-4">
                  <Link to="/auth">
                    Начать зарабатывать
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-amber-300 hover:bg-amber-50">
                  <Link to="/pricing">
                    <Crown className="w-5 h-5 mr-2" />
                    Посмотреть тарифы
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="aristocratic-text text-3xl md:text-4xl font-bold golden-accent mb-2">
                  {stat.number}
                </div>
                <div className="elegant-text opacity-80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="aristocratic-text text-4xl md:text-5xl font-bold mb-6">
              Как это работает
            </h2>
            <p className="elegant-text text-xl opacity-80 max-w-2xl mx-auto">
              Простая и элегантная платформа для монетизации опыта и поиска бизнес-возможностей
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="story-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="aristocratic-text text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="elegant-text">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="luxury-shadow premium-gradient text-white text-center">
            <CardContent className="py-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Готовы начать?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Присоединяйтесь к сообществу предпринимателей и авторов, которые уже зарабатывают на своем опыте
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                  <Link to={user ? "/create-story" : "/auth"}>
                    {user ? "Создать историю" : "Зарегистрироваться"}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-amber-600">
                  <Link to="/stories">
                    Исследовать истории
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};