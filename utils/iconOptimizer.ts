import { IconProps } from '../types/icon.types';

export const optimizeIconProps = (props: IconProps) => {
  const { size = 'md', color, className = '', onClick, disabled } = props;
  
  return {
    size,
    color,
    className: className.trim(),
    onClick: disabled ? undefined : onClick,
    disabled,
  };
};

export const createIconClassName = (
  baseClasses: string,
  size: string,
  color: string,
  additionalClasses?: string
) => {
  const classes = [baseClasses, size, color];
  
  if (additionalClasses) {
    classes.push(additionalClasses);
  }
  
  return classes.filter(Boolean).join(' ');
};

export const validateIconProps = (props: IconProps): boolean => {
  const validSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  if (props.size && !validSizes.includes(props.size)) {
    console.warn(`Invalid icon size: ${props.size}. Using default size 'md'`);
    return false;
  }
  
  return true;
};
