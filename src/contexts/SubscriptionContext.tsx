import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SubscriptionPlan {
  id: 'basic' | 'premium';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    collections: number;
    aiCollections: number;
    likes: number;
    views: number;
    downloadCollections: boolean;
    viewUserProfiles: boolean;
  };
}

export interface UserSubscription {
  planId: 'basic' | 'premium' | null;
  isYearly: boolean;
  expiresAt: Date | null;
  collectionsUsed: number;
  aiCollectionsUsed: number;
  likesUsed: number;
  viewsUsed: number;
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  userSubscription: UserSubscription;
  subscribe: (planId: 'basic' | 'premium', isYearly: boolean) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateUsage: (updates: Partial<UserSubscription>) => void;
  canUseFeature: (feature: keyof SubscriptionPlan['features']) => boolean;
  getRemainingUsage: (feature: 'collections' | 'aiCollections' | 'likes' | 'views') => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

const PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Базовый',
    monthlyPrice: 30,
    yearlyPrice: 240,
    features: {
      collections: 100,
      aiCollections: 1,
      likes: 10,
      views: 1000,
      downloadCollections: false,
      viewUserProfiles: false,
    },
  },
  {
    id: 'premium',
    name: 'Премиум',
    monthlyPrice: 300,
    yearlyPrice: 2400,
    features: {
      collections: 1000,
      aiCollections: 200,
      likes: 100,
      views: 10000,
      downloadCollections: true,
      viewUserProfiles: true,
    },
  },
];

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userSubscription, setUserSubscription] = useState<UserSubscription>({
    planId: null,
    isYearly: false,
    expiresAt: null,
    collectionsUsed: 0,
    aiCollectionsUsed: 0,
    likesUsed: 0,
    viewsUsed: 0,
  });

  useEffect(() => {
    const savedSubscription = localStorage.getItem('needvox-subscription');
    if (savedSubscription) {
      const parsed = JSON.parse(savedSubscription);
      setUserSubscription({
        ...parsed,
        expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      });
    }
  }, []);

  const subscribe = async (planId: 'basic' | 'premium', isYearly: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (isYearly ? 12 : 1));
    
    const newSubscription: UserSubscription = {
      planId,
      isYearly,
      expiresAt,
      collectionsUsed: 0,
      aiCollectionsUsed: 0,
      likesUsed: 0,
      viewsUsed: 0,
    };
    
    setUserSubscription(newSubscription);
    localStorage.setItem('needvox-subscription', JSON.stringify(newSubscription));
  };

  const cancelSubscription = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const canceledSubscription: UserSubscription = {
      planId: null,
      isYearly: false,
      expiresAt: null,
      collectionsUsed: 0,
      aiCollectionsUsed: 0,
      likesUsed: 0,
      viewsUsed: 0,
    };
    
    setUserSubscription(canceledSubscription);
    localStorage.setItem('needvox-subscription', JSON.stringify(canceledSubscription));
  };

  const updateUsage = (updates: Partial<UserSubscription>) => {
    const updatedSubscription = { ...userSubscription, ...updates };
    setUserSubscription(updatedSubscription);
    localStorage.setItem('needvox-subscription', JSON.stringify(updatedSubscription));
  };

  const canUseFeature = (feature: keyof SubscriptionPlan['features']): boolean => {
    if (!userSubscription.planId) return false;
    
    const plan = PLANS.find(p => p.id === userSubscription.planId);
    if (!plan) return false;
    
    return plan.features[feature] as boolean;
  };

  const getRemainingUsage = (feature: 'collections' | 'aiCollections' | 'likes' | 'views'): number => {
    if (!userSubscription.planId) return 0;
    
    const plan = PLANS.find(p => p.id === userSubscription.planId);
    if (!plan) return 0;
    
    const limit = plan.features[feature] as number;
    const used = userSubscription[`${feature}Used` as keyof UserSubscription] as number;
    
    return Math.max(0, limit - used);
  };

  return (
    <SubscriptionContext.Provider value={{
      plans: PLANS,
      userSubscription,
      subscribe,
      cancelSubscription,
      updateUsage,
      canUseFeature,
      getRemainingUsage,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};