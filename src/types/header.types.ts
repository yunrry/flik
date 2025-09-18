import { RegionCode } from './region.types';

export interface HeaderProps {
  variant: 'logo' | 'back' | 'close' | 'search' | 'backWithMore'| 'backWithSearch' | 'my' | 'back-from-nationwide' | 'back-from-sido' | 'posting' | 'travel-select' | 'course';
  title?: string;
  region?: RegionCode;
  onBack?: () => void;
  onClose?: () => void;
  onRegister?: () => void;
  onSearch?: (query: string) => void;
  onMore?: () => void;
  searchPlaceholder?: string;
  showRegister?: boolean;
  registerText?: string;
  isAvailable?: boolean;
  className?: string;
  // travel-select용 optional 속성들
  currentStep?: number;
  totalSteps?: number;
  stepTitle1?: string;
  stepTitle2?: string;
  stepSubtitle?: string;
  onNext?: () => void;
  onPrev?: () => void;
  canProceed?: boolean;
}

export type HeaderVariant = 'logo' | 'back' | 'close' | 'search' | 'backWithMore' | 'backWithSearch' | 'my' | 'back-from-nationwide' | 'back-from-sido' | 'posting' | 'travel-select' | 'course';

