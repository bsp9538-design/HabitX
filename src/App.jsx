import React from 'react';
import { HabitixProvider } from './context/HabitixContext';
import { useHabitix } from './context/useHabitix';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TodayView from './components/TodayView';
import WeekView from './components/WeekView';
import ProgressView from './components/ProgressView';
import SettingsView from './components/SettingsView';
import './App.css';

function MainContent() {
  const { activeTab } = useHabitix();

  return (
    <div className="app-wrapper">
      <Header />
      <Navigation />

      <main className="app-container" role="main">
        {activeTab === 'today' && <TodayView />}
        {activeTab === 'week' && <WeekView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HabitixProvider>
      <MainContent />
    </HabitixProvider>
  );
}
