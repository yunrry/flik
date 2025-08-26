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
            size="lg"
            isActive={activeNavigation === 'home'} 
            onClick={() => handleNavigationClick('home')}
          />
          <NavigationIcon 
            name="my" 
            size="lg"
            isActive={activeNavigation === 'my'} 
            onClick={() => handleNavigationClick('my')}
          />
          <NavigationIcon 
            name="save" 
            size="lg"
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

      {/* Icon Size System */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Size System</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">12px (xs):</span>
            <div className="w-3 h-3">
              <NavigationIcon name="home" size="xs" />
            </div>
            <span className="text-xs text-gray-500">w-3 h-3</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">16px (sm):</span>
            <div className="w-4 h-4">
              <NavigationIcon name="home" size="sm" />
            </div>
            <span className="text-xs text-gray-500">w-4 h-4</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">20px (md):</span>

              <NavigationIcon name="home" size="md" />
            <span className="text-xs text-gray-500">w-5 h-5</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">24px (lg):</span>
  
              <NavigationIcon name="home" size="lg" />

            <span className="text-xs text-gray-500">w-6 h-6</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">32px (xl):</span>

              <NavigationIcon name="home" size="xl" />
     
            <span className="text-xs text-gray-500">w-8 h-8</span>
          </div>
        </div>
      </div>

      {/* 테스트 - className과 size 확인 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Test</h2>
        <div className="flex gap-4 items-center">
          <NavigationIcon 
            name="home" 
            size="xs" 
            className="text-red-500 bg-blue-100 p-2 rounded"
          />
          <NavigationIcon 
            name="my" 
            size="lg" 
            className="text-green-500 border-2 border-green-500"
          />
        </div>
      </div>
    </div>
  );
}

export default IconGallary;
