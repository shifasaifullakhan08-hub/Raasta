import React from 'react';
import { AppProvider } from './context/AppContext';
import { AppContent } from './AppContent';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
