import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import { Plus, Sparkles, Download, BookOpen, Eye, Heart, Trash2 } from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  description: string;
  storiesCount: number;
  createdAt: Date;
  isAiGenerated: boolean;
}

const mockCollections: Collection[] = [
  {
    id: '1',
    title: 'B2B сервисы для офисов',
    description: 'Подборка историй о потребностях в корпоративных услугах',
    storiesCount: 12,
    createdAt: new Date('2024-01-15'),
    isAiGenerated: false,
  },
  {
    id: '2',
    title: 'Финтех для семей',
    description: 'ИИ-подборка: Семейные финансовые потребности и решения',
    storiesCount: 8,
    createdAt: new Date('2024-01-14'),
    isAiGenerated: true,
  },
];

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  
  const { user } = useAuth();
  const { userSubscription, updateUsage, getRemainingUsage, canUseFeature } = useSubscription();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="story-card">
          <CardContent className="py-8 text-center">
            <p className="elegant-text">Войдите в аккаунт для работы с подборками</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userSubscription.planId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="story-card max-w-md">
          <CardContent className="py-8 text-center">
            <h2 className="aristocratic-text text-xl font-bold mb-4">
              Подборки доступны по подписке
            </h2>
            <p className="elegant-text mb-6">
              Создавайте и управляйте подборками историй для поиска бизнес-возможностей
            </p>
            <Button asChild className="aristocratic-button">
              <a href="/pricing">Выбрать тариф</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const remainingCollections = getRemainingUsage('collections');
  const remainingAiCollections = getRemainingUsage('aiCollections');
  const canDownload = canUseFeature('downloadCollections');

  const handleCreateCollection = async () => {
    if (!newCollectionTitle.trim()) {
      toast.error('Введите название подборки');
      return;
    }

    if (remainingCollections <= 0) {
      toast.error('Исчерпан лимит подборок на этот месяц');
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      title: newCollectionTitle,
      description: newCollectionDescription,
      storiesCount: 0,
      createdAt: new Date(),
      isAiGenerated: false,
    };

    setCollections(prev => [newCollection, ...prev]);
    updateUsage({
      collectionsUsed: userSubscription.collectionsUsed + 1,
    });

    setNewCollectionTitle('');
    setNewCollectionDescription('');
    setShowCreateDialog(false);
    toast.success('Подборка создана!');
  };

  const handleCreateAiCollection = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Опишите ваши возможности и навыки');
      return;
    }

    if (remainingAiCollections <= 0) {
      toast.error('Исчерпан лимит ИИ-подборок на этот месяц');
      return;
    }

    // Simulate AI processing
    toast.info('ИИ анализирует ваш запрос...');
    
    setTimeout(() => {
      const aiCollection: Collection = {
        id: Date.now().toString(),
        title: `ИИ-подборка: ${aiPrompt.slice(0, 30)}...`,
        description: `Автоматически созданная подборка на основе ваших навыков: ${aiPrompt}`,
        storiesCount: Math.floor(Math.random() * 15) + 5,
        createdAt: new Date(),
        isAiGenerated: true,
      };

      setCollections(prev => [aiCollection, ...prev]);
      updateUsage({
        aiCollectionsUsed: userSubscription.aiCollectionsUsed + 1,
      });

      setAiPrompt('');
      setShowAiDialog(false);
      toast.success('ИИ-подборка создана!');
    }, 3000);
  };

  const handleDownload = (collection: Collection) => {
    if (!canDownload) {
      toast.error('Скачивание доступно только в Премиум тарифе');
      return;
    }

    // Simulate download
    toast.success(`Подборка "${collection.title}" скачана!`);
  };

  const handleDelete = (collectionId: string) => {
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    toast.success('Подборка удалена');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="aristocratic-text text-4xl font-bold mb-4">
              Мои подборки
            </h1>
            <p className="elegant-text text-xl opacity-80">
              Создавайте и управляйте подборками историй
            </p>
          </div>

          <div className="flex gap-4">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="aristocratic-button" disabled={remainingCollections <= 0}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать подборку
                </Button>
              </DialogTrigger>
              <DialogContent className="impressionist-card">
                <DialogHeader>
                  <DialogTitle className="aristocratic-text">Новая подборка</DialogTitle>
                  <DialogDescription className="elegant-text">
                    Создайте подборку для группировки историй по теме
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Название подборки"
                    value={newCollectionTitle}
                    onChange={(e) => setNewCollectionTitle(e.target.value)}
                    className="impressionist-input"
                  />
                  <Textarea
                    placeholder="Описание подборки (необязательно)"
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    className="impressionist-input"
                  />
                  <Button onClick={handleCreateCollection} className="w-full aristocratic-button">
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-amber-300 hover:bg-amber-50"
                  disabled={remainingAiCollections <= 0}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  ИИ-подборка
                </Button>
              </DialogTrigger>
              <DialogContent className="impressionist-card">
                <DialogHeader>
                  <DialogTitle className="aristocratic-text flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    ИИ-подборка
                  </DialogTitle>
                  <DialogDescription className="elegant-text">
                    Опишите ваши навыки и возможности, ИИ найдет подходящие истории
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Например: Я разработчик мобильных приложений, умею создавать iOS и Android приложения, работаю с React Native, имею опыт в финтехе..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="impressionist-input min-h-[120px]"
                  />
                  <Button onClick={handleCreateAiCollection} className="w-full aristocratic-button">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Создать ИИ-подборку
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Badge variant="outline" className="tag-chip">
            Подборок: {remainingCollections} осталось
          </Badge>
          <Badge variant="outline" className="tag-chip">
            ИИ-подборок: {remainingAiCollections} осталось
          </Badge>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="story-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="aristocratic-text text-lg leading-tight">
                      {collection.title}
                    </CardTitle>
                    <CardDescription className="elegant-text mt-2">
                      {collection.description}
                    </CardDescription>
                  </div>
                  {collection.isAiGenerated && (
                    <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      ИИ
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{collection.storiesCount} историй</span>
                  </div>
                  <span>{collection.createdAt.toLocaleDateString('ru-RU')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-amber-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {canDownload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(collection)}
                        className="hover:bg-green-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(collection.id)}
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-12">
            <Card className="story-card max-w-md mx-auto">
              <CardContent className="py-8">
                <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <p className="elegant-text text-lg mb-4">
                  У вас пока нет подборок
                </p>
                <p className="elegant-text opacity-60 mb-6">
                  Создайте первую подборку для группировки интересных историй
                </p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="aristocratic-button"
                  disabled={remainingCollections <= 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать подборку
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};