import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookOpen, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const STORY_CRITERIA = [
  'История описывает реальную проблему или потребность',
  'Указаны конкретные детали (бюджет, временные рамки, требования)',
  'Описаны попытки решения проблемы и их результаты',
  'История может быть полезна предпринимателям для поиска ниш',
  'Отсутствует реклама конкретных продуктов или услуг',
  'Соблюдены правила приличия и этики',
];

const SUGGESTED_TAGS = [
  'B2B', 'B2C', 'Технологии', 'Здоровье', 'Образование', 'Финансы',
  'Развлечения', 'Путешествия', 'Еда', 'Спорт', 'Дом', 'Семья',
  'Работа', 'Транспорт', 'Красота', 'Мода', 'Животные', 'Хобби'
];

export const CreateStoryPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [checkedCriteria, setCheckedCriteria] = useState<boolean[]>(new Array(STORY_CRITERIA.length).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="story-card">
          <CardContent className="py-8 text-center">
            <p className="elegant-text">Войдите в аккаунт для создания историй</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleCriteriaChange = (index: number, checked: boolean) => {
    setCheckedCriteria(prev => {
      const newCriteria = [...prev];
      newCriteria[index] = checked;
      return newCriteria;
    });
  };

  const canSubmit = () => {
    return (
      title.trim().length >= 10 &&
      content.trim().length >= 100 &&
      selectedTags.length >= 2 &&
      checkedCriteria.every(checked => checked)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit()) {
      toast.error('Пожалуйста, заполните все поля и подтвердите соответствие критериям');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call for story creation and AI validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user stats
      updateUser({
        storiesCount: user.storiesCount + 1,
      });

      toast.success('История отправлена на модерацию! Она будет опубликована после проверки ИИ.');
      navigate('/profile');
    } catch (error) {
      toast.error('Ошибка при создании истории');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="aristocratic-text text-4xl font-bold mb-4">
            Создать историю
          </h1>
          <p className="elegant-text text-xl opacity-80">
            Поделитесь своей проблемой и помогите предпринимателям найти новые возможности
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Story Form */}
          <Card className="story-card">
            <CardHeader>
              <CardTitle className="aristocratic-text flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Ваша история
              </CardTitle>
              <CardDescription className="elegant-text">
                Расскажите подробно о своей проблеме или потребности
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="elegant-text">
                  Заголовок истории *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Кратко опишите вашу проблему..."
                  className="impressionist-input"
                  maxLength={200}
                />
                <p className="text-sm text-gray-500">
                  {title.length}/200 символов (минимум 10)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="elegant-text">
                  Подробное описание *
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Расскажите подробно о вашей проблеме: что вы искали, какие решения пробовали, какой результат нужен, какой у вас бюджет..."
                  className="impressionist-input min-h-[200px]"
                  maxLength={2000}
                />
                <p className="text-sm text-gray-500">
                  {content.length}/2000 символов (минимум 100)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="story-card">
            <CardHeader>
              <CardTitle className="aristocratic-text">Теги</CardTitle>
              <CardDescription className="elegant-text">
                Выберите минимум 2 тега, которые лучше всего описывают вашу историю
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedTags.includes(tag) 
                        ? 'bg-amber-500 hover:bg-amber-600' 
                        : 'tag-chip hover:bg-amber-50'
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Добавить свой тег..."
                  className="impressionist-input"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                />
                <Button 
                  type="button" 
                  onClick={handleAddCustomTag}
                  variant="outline"
                  className="border-amber-300 hover:bg-amber-50"
                >
                  Добавить
                </Button>
              </div>

              {selectedTags.length > 0 && (
                <div className="space-y-2">
                  <p className="elegant-text text-sm">Выбранные теги:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-amber-500 hover:bg-amber-600 cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Criteria Checklist */}
          <Card className="story-card">
            <CardHeader>
              <CardTitle className="aristocratic-text flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Критерии качества
              </CardTitle>
              <CardDescription className="elegant-text">
                Подтвердите, что ваша история соответствует всем критериям
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {STORY_CRITERIA.map((criterion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`criterion-${index}`}
                    checked={checkedCriteria[index]}
                    onCheckedChange={(checked) => handleCriteriaChange(index, checked as boolean)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`criterion-${index}`}
                    className="elegant-text text-sm leading-relaxed cursor-pointer"
                  >
                    {criterion}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Validation Info */}
          <Card className="story-card border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="py-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="aristocratic-text font-semibold mb-2">
                    ИИ-модерация
                  </h3>
                  <p className="elegant-text text-sm">
                    После отправки ваша история будет автоматически проверена на соответствие 
                    правилам платформы и получит релевантные теги. Процесс занимает несколько минут.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="aristocratic-button px-12 py-4 text-lg"
              disabled={!canSubmit() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Отправка на модерацию...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Опубликовать историю
                </>
              )}
            </Button>
          </div>

          {!canSubmit() && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="elegant-text text-sm">
                  Заполните все поля и подтвердите соответствие критериям
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};