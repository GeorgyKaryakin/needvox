import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { BookOpen, MessageCircle, User, LogOut, Crown, Palette } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { userSubscription } = useSubscription();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="aristocratic-header sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="aristocratic-text text-2xl font-bold">NeedVox</h1>
              <p className="elegant-text text-sm opacity-80">Marketplace потребностей</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/stories" className="elegant-text hover:text-amber-600 transition-colors">
              Истории
            </Link>
            <Link to="/collections" className="elegant-text hover:text-amber-600 transition-colors">
              Подборки
            </Link>
            <Link to="/pricing" className="elegant-text hover:text-amber-600 transition-colors">
              Тарифы
            </Link>
            {user && (
              <Link to="/chat" className="elegant-text hover:text-amber-600 transition-colors flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>Чаты</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {userSubscription.planId && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                      {userSubscription.planId === 'premium' ? 'Премиум' : 'Базовый'}
                    </span>
                  </div>
                )}
                
                <Button asChild className="aristocratic-button">
                  <Link to="/create-story">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Создать историю
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 impressionist-card" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Профиль
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild className="aristocratic-button">
                <Link to="/auth">Войти</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};