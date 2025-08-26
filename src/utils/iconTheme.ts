import { IconSize, IconTheme } from '../types/icon.types';

export const ICON_SIZES: IconSize = {
  xs: 'w-4 h-4',      // 16px (w-4 = 16px)
  sm: 'w-5 h-5',      // 20px (w-5 = 20px)
  md: 'w-6 h-6',      // 24px (w-6 = 24px)
  lg: 'w-8 h-8',      // 32px (w-8 = 32px)
  xl: 'w-10 h-10',    // 40px (w-10 = 40px)
};

export const ICON_COLORS = {
  light: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    accent: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  },
  dark: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    accent: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  },
};

export const getIconColor = (theme: IconTheme, colorKey: keyof typeof ICON_COLORS.light) => {
  if (theme === 'auto') {
    return `dark:${ICON_COLORS.dark[colorKey]} ${ICON_COLORS.light[colorKey]}`;
  }
  return ICON_COLORS[theme][colorKey];
};

export const getIconSize = (size: keyof IconSize = 'md') => {
  return ICON_SIZES[size];
};

// 픽셀 단위로 크기 가져오기
export const getIconSizePx = (size: keyof IconSize = 'md') => {
  const sizeMap = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };
  return sizeMap[size];
};
