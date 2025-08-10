import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface WalletConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletConnectionModal: React.FC<WalletConnectionModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'visa',
      name: 'Visa',
      icon: '💳',
      description: 'Привязать карту Visa',
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      icon: '💳',
      description: 'Привязать карту Mastercard',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Привязать PayPal аккаунт',
    },
    {
      id: 'mir',
      name: 'МИР',
      icon: '🏦',
      description: 'Привязать карту МИР',
    },
  ];

  const handleConnect = (methodId: string) => {
    setSelectedMethod(methodId);
    // Simulate connection process
    setTimeout(() => {
      toast.success('Кошелек успешно привязан!');
      onOpenChange(false);
      setSelectedMethod(null);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="impressionist-card max-w-md">
        <DialogHeader>
          <DialogTitle className="aristocratic-text flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            Привязка кошелька
          </DialogTitle>
          <DialogDescription className="elegant-text">
            Выберите способ для вывода средств
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card 
              key={method.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMethod === method.id ? 'ring-2 ring-amber-400' : ''
              }`}
              onClick={() => selectedMethod ? null : handleConnect(method.id)}
            >
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="text-2xl">{method.icon}</div>
                <div className="flex-1">
                  <h3 className="aristocratic-text font-semibold">{method.name}</h3>
                  <p className="elegant-text text-sm opacity-80">{method.description}</p>
                </div>
                {selectedMethod === method.id ? (
                  <div className="text-amber-600 text-sm font-medium">
                    Подключение...
                  </div>
                ) : (
                  <CreditCard className="w-5 h-5 text-amber-600" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="elegant-text text-sm text-amber-800">
            <strong>Обратите внимание:</strong> Это демонстрационная версия. 
            В реальном приложении здесь будет интеграция с платежными системами.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};