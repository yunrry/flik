export interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface NavigationIconProps extends IconProps {
  isActive?: boolean;
  variant?: 'default' | 'filled' | 'outline';
}

export interface SocialIconProps extends IconProps {
  platform: 'kakao' | 'naver' | 'google' | 'facebook' | 'twitter' | 'instagram';
  variant?: 'default' | 'monochrome' | 'branded';
}

export interface ActionIconProps extends IconProps {
  action: 'save' | 'share' | 'like' | 'delete' | 'edit' | 'search' | 'filter';
  variant?: 'default' | 'outline' | 'filled';
}

export interface StatusIconProps extends IconProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'loading';
  variant?: 'default' | 'animated';
}

export type IconSize = {
  xs: string;    // 16px
  sm: string;    // 20px
  md: string;    // 24px
  lg: string;    // 32px
  xl: string;    // 40px (추가)
};

export type IconTheme = 'light' | 'dark' | 'auto';

// 픽셀 단위 크기 상수
export const ICON_SIZE_PX = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 60,
} as const;
