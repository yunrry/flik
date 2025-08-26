import React, { useState } from 'react';
import { 
  Icon, 
  NavigationIcon, 
  SocialIcon, 
  ActionIcon, 
  StatusIcon 
} from './components/Icons';
import IconGallary from './pages/IconGallary';

function App() {
  const [activeNavigation, setActiveNavigation] = useState<string>('home');

  const handleNavigationClick = (name: string) => {
    setActiveNavigation(name);
  };

  return (
    <IconGallary />
  );
}

export default App;
