import React from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import { Icon, IconName } from './Icon';

interface BottomNavigationProps {}

const BottomNavigation: React.FC<BottomNavigationProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems: Array<{ icon: IconName; label: string; path: string }> = [
    { icon: 'home', label: 'Beranda', path: '/dashboard' },
    { icon: 'transaction', label: 'Transaksi', path: '/transaction' },
    { icon: 'report', label: 'Laporan', path: '/report' },
    // @ts-ignore
    { icon: 'account2', label: 'Akun', path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-[#E8EDF2] z-[999]">
      <div className="flex justify-between items-stretch gap-2 px-4 py-2 pb-6">
        {navigationItems.map(({ icon, label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-end gap-1 flex-1 py-2 ${
              isActive(path) ? 'rounded-[27px] bg-[#EBF2E8]' : ''
            }`}
          >
            <div className="h-8 flex items-center justify-center">
              <Icon 
                name={icon}
                className={isActive(path) ? 'text-[#0D141C]' : 'text-[#639154]'}
              />
            </div>
            <span className={`text-xs font-work-sans font-medium ${
              isActive(path) ? 'text-[#0D141C]' : 'text-[#639154]'
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation; 