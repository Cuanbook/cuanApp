import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconName } from './Icon';
import { useNavigation } from '@/lib/context/NavigationContext';
import LoadingScreen from './LoadingScreen';

interface BottomNavigationProps {}

const BottomNavigation: React.FC<BottomNavigationProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, startLoading, loadingMessage } = useNavigation();

  const isActive = (path: string) => location.pathname === path;

  const getLoadingMessage = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Memuat Dashboard...';
      case '/transaction':
        return 'Memuat Transaksi...';
      case '/report':
        return 'Memuat Laporan...';
      case '/account':
        return 'Memuat Profil...';
      default:
        return 'Memuat...';
    }
  };

  const handleNavigation = useCallback((path: string) => {
    if (path !== location.pathname && !isLoading) {
      startLoading(getLoadingMessage(path));
      // Use Promise to handle navigation
      Promise.resolve().then(() => {
        navigate(path);
      });
    }
  }, [location.pathname, navigate, startLoading, isLoading]);

  const navigationItems: Array<{ icon: IconName; label: string; path: string }> = [
    { icon: 'home', label: 'Beranda', path: '/dashboard' },
    { icon: 'transaction', label: 'Transaksi', path: '/transaction' },
    { icon: 'report', label: 'Laporan', path: '/report' },
    // @ts-ignore
    { icon: 'account2', label: 'Akun', path: '/account' },
  ];

  return (
    <>
      {isLoading && <LoadingScreen message={loadingMessage} />}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] border-t border-[#E8EDF2] z-[999]">
        <div className="flex justify-between items-stretch gap-2 px-4 py-2 pb-6">
          {navigationItems.map(({ icon, label, path }) => (
            <button
              key={label}
              onClick={() => handleNavigation(path)}
              disabled={isLoading}
              className={`flex flex-col items-center justify-end gap-1 flex-1 py-2 
                ${isActive(path) ? 'rounded-[27px] bg-[#EBF2E8]' : ''}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                transition-all duration-200 ease-in-out hover:bg-[#EBF2E8]/50
              `}
            >
              <div className="h-8 flex items-center justify-center">
                <Icon 
                  name={icon}
                  className={`${isActive(path) ? 'text-[#0D141C]' : 'text-[#639154]'}
                    transition-colors duration-200
                  `}
                />
              </div>
              <span className={`text-xs font-work-sans font-medium 
                ${isActive(path) ? 'text-[#0D141C]' : 'text-[#639154]'}
                transition-colors duration-200
              `}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation; 