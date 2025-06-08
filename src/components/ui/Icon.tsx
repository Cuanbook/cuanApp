import { HTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

export type IconName =
  | 'home'
  | 'transaction'
  | 'report'
  | 'account'
  | 'dashboard'
  | 'search'
  | 'filter'
  | 'close'
  | 'edit'
  | 'plus'
  | 'minus'
  | 'income'
  | 'expense'
  | 'transfer'
  | 'calendar'
  | 'notification'
  | 'delete'
  | 'eye'
  | 'success'
  | 'eye-off'
  | 'info'
  | 'chevron-down'
  | 'chevron-right'
  | 'logout'
  | 'chevron-left'
  | 'chevron-up'
  | 'settings'
  | 'menu'
  | 'share'
  | 'download';

interface IconProps extends HTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={twMerge('select-none', className)}
      {...props}
    />
  );
} 