import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="aristocratic-header mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h3 className="aristocratic-text text-xl font-bold">NeedVox</h3>
            </div>
            <p className="elegant-text text-sm opacity-80 max-w-md">
              Превратите клиентские боли в возможности. Marketplace, где авторы зарабатывают на историях, 
              а предприниматели находят новые ниши.
            </p>
          </div>

          <div>
            <h4 className="aristocratic-text font-semibold mb-4">Платформа</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/stories" className="elegant-text text-sm hover:text-amber-600 transition-colors">
                  Истории
                </Link>
              </li>
              <li>
                <Link to="/collections" className="elegant-text text-sm hover:text-amber-600 transition-colors">
                  Подборки
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="elegant-text text-sm hover:text-amber-600 transition-colors">
                  Тарифы
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="aristocratic-text font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="elegant-text text-sm hover:text-amber-600 transition-colors">
                  Помощь
                </a>
              </li>
              <li>
                <a href="#" className="elegant-text text-sm hover:text-amber-600 transition-colors">
                  Условия использования
                </a>
              </li>
              <li>
                <a href="#" className="elegant-text text-sm hover:text-amber-600 transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="elegant-text text-sm opacity-60">
            © 2024 NeedVox. Все права защищены.
          </p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span className="elegant-text text-sm opacity-60">Создано с</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="elegant-text text-sm opacity-60">для предпринимателей</span>
          </div>
        </div>
      </div>
    </footer>
  );
};