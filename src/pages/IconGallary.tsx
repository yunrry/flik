import React, { useState } from 'react';
import { 
  Icon, 
  NavigationIcon, 
  SocialIcon, 
  ActionIcon, 
  StatusIcon 
} from '../components/Icons';

function IconGallary() {
  const [activeNavigation, setActiveNavigation] = useState<string>('home');

  const handleNavigationClick = (name: string) => {
    setActiveNavigation(name);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Icon Components Demo</h1>
      
      {/* Basic Icon */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Icons</h2>
        <div className="flex gap-4 items-center">
          <Icon name="home" size="sm" />
          <Icon name="user" size="md" />
          <Icon name="settings" size="lg" />
          <Icon name="bookmark" size="xl" />
        </div>
      </div> */}
      
      {/* Navigation Icons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Navigation Icons</h2>
        <div className="flex gap-4 items-center">
          <NavigationIcon 
            name="home" 
            isActive={activeNavigation === 'home'} 
            onClick={() => handleNavigationClick('home')}
          />
          <NavigationIcon 
            name="my" 
            isActive={activeNavigation === 'my'} 
            onClick={() => handleNavigationClick('my')}
          />
          <NavigationIcon 
            name="save" 
            isActive={activeNavigation === 'save'} 
            onClick={() => handleNavigationClick('save')}
          />
          <NavigationIcon 
            name="flik" 
            size="lg" 
            isActive={activeNavigation === 'flik'} 
            onClick={() => handleNavigationClick('flik')}
          />
        </div>
      </div>
      
      {/* Social Icons */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Social Icons</h2>
        <div className="flex gap-4 items-center">
          <SocialIcon platform="kakao" />
          <SocialIcon platform="naver" variant="branded" />
          <SocialIcon platform="google" variant="monochrome" />
        </div>
      </div> */}
      
      {/* Action Icons */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Action Icons</h2>
        <div className="flex gap-4 items-center">
          <ActionIcon action="save" variant="filled" />
          <ActionIcon action="like" variant="outline" />
          <ActionIcon action="share" />
        </div>
      </div> */}
      
      {/* Status Icons */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Status Icons</h2>
        <div className="flex gap-4 items-center">
          <StatusIcon status="success" />
          <StatusIcon status="loading" variant="animated" />
          <StatusIcon status="error" variant="animated" />
        </div>
      </div> */}
    </div>
  );
}

export default IconGallary;
