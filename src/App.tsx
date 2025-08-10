import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { StoriesPage } from '@/pages/StoriesPage';
import { CreateStoryPage } from '@/pages/CreateStoryPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PricingPage } from '@/pages/PricingPage';
import { ChatPage } from '@/pages/ChatPage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { StoryDetailPage } from '@/pages/StoryDetailPage';
import { AuthPage } from '@/pages/AuthPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="needvox-theme">
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
                <div className="aristocratic-bg">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/stories" element={<StoriesPage />} />
                      <Route path="/stories/:id" element={<StoryDetailPage />} />
                      <Route path="/create-story" element={<CreateStoryPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/collections" element={<CollectionsPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </div>
              <Toaster />
            </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;