import React, { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';

interface MobileWarningProps {
  children: React.ReactNode;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
      const isLargeScreen = window.innerWidth >= 1024;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      setIsDesktop(!isMobileDevice && (isLargeScreen || hasHover));
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-[#FAFAFA] z-50 flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-lg">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#EBF2E8] rounded-full flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-[#54D12B]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#111611]">
          Mohon Buka di Perangkat Mobile
        </h2>
        <p className="text-[#666E6A]">
          Aplikasi ini dioptimalkan untuk perangkat mobile. Silakan buka menggunakan smartphone atau tablet Anda.
        </p>
        <div className="pt-2">
          <div className="text-sm text-[#666E6A] space-y-1">
            <p>Terdeteksi sebagai: Desktop/Laptop</p>
            <p>Ukuran layar: {window.innerWidth}px × {window.innerHeight}px</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWarning; 