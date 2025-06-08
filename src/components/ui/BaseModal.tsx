import React, { useEffect } from 'react';

import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
      // Hide bottom navigation
      const bottomNav = document.querySelector('[data-testid="bottom-navigation"]');
      if (bottomNav instanceof HTMLElement) {
        bottomNav.style.display = 'none';
        bottomNav.style.visibility = 'hidden';
        bottomNav.style.opacity = '0';
        bottomNav.style.pointerEvents = 'none';
      }
    }

    return () => {
      // Restore scrolling and show bottom navigation when modal closes
      document.body.style.overflow = 'unset';
      const bottomNav = document.querySelector('[data-testid="bottom-navigation"]');
      if (bottomNav instanceof HTMLElement) {
        bottomNav.style.display = '';
        bottomNav.style.visibility = '';
        bottomNav.style.opacity = '';
        bottomNav.style.pointerEvents = '';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9999]" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-[10000] flex flex-col bg-[#FAFAFA]">
        {/* Header with shadow */}
        <div className="flex items-center justify-between p-4 pb-2 bg-[#FAFAFA] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <div className="w-12 h-12 flex items-center justify-center">
            <X className="w-6 h-6 text-[#0F1417] cursor-pointer" onClick={onClose} />
          </div>
          <h2 className="font-inter font-bold text-[18px] text-[#0F1417] flex-1 text-center pr-12">
            {title}
          </h2>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
};

export default BaseModal; 