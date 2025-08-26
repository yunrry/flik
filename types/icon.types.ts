export interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
};

export type IconTheme = 'light' | 'dark' | 'auto';
