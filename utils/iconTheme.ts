import { IconSize, IconTheme } from '../types/icon.types';

export const ICON_SIZES: IconSize = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
  '2xl': 'w-12 h-12',
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
