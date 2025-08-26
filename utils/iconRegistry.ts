import { 
  Home, 
  User, 
  Bookmark, 
  Settings,
  Heart,
  Share2,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';

export const ICON_REGISTRY = {
  home: Home,
  user: User,
  bookmark: Bookmark,
  settings: Settings,
  like: Heart,
  share: Share2,
  save: Bookmark,
  search: Search,
  filter: Filter,
  edit: Edit,
  delete: Trash2,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
} as const;

export type IconName = keyof typeof ICON_REGISTRY;

export const getIconComponent = (name: IconName) => {
  return ICON_REGISTRY[name];
};
