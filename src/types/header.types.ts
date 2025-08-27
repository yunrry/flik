import { RegionCode } from './region.types';

export interface HeaderProps {
  variant: 'logo' | 'back' | 'close' | 'search' | 'backWithMore'| 'backWithSearch' | 'my' | 'back-from-nationwide' | 'back-from-sido';
  title?: string;
  region?: RegionCode; // 지역 코드 추가
  onBack?: () => void;
  onClose?: () => void;
  onRegister?: () => void;
  onSearch?: (query: string) => void;
  onMore?: () => void;
  searchPlaceholder?: string;
  showRegister?: boolean;
  registerText?: string;
  className?: string;
}

export type HeaderVariant = 'logo' | 'back' | 'close' | 'search' | 'backWithMore' | 'backWithSearch' | 'my' | 'back-from-nationwide' | 'back-from-sido';
