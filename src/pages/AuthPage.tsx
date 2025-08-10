import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Palette, Mail, Lock, User } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      toast.success('Добро пожаловать в NeedVox!');
      navigate('/');
    } catch (error) {
      toast.error('Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      await register(email, password, name);
      toast.success('Аккаунт создан! Добро пожаловать в NeedVox!');
      navigate('/');
    } catch (error) {
      toast.error('Ошибка регистрации. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="aristocratic-text text-3xl font-bold">Добро пожаловать</h1>
          <p className="elegant-text opacity-80 mt-2">в NeedVox</p>
        </div>

        <Card className="story-card">
          <CardHeader>
            <CardTitle className="aristocratic-text text-center">Вход в аккаунт</CardTitle>
            <CardDescription className="elegant-text text-center">
              Войдите или создайте новый аккаунт
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="elegant-text">Вход</TabsTrigger>
                <TabsTrigger value="register" className="elegant-text">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="elegant-text">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="impressionist-input pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="elegant-text">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="impressionist-input pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full aristocratic-button" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="elegant-text">Имя</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="register-name"
                        name="name"
                        type="text"
                        placeholder="Ваше имя"
                        className="impressionist-input pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="elegant-text">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="impressionist-input pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="elegant-text">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-amber-600" />
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="impressionist-input pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full aristocratic-button" disabled={isLoading}>
                    {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};