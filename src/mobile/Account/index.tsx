import React, { useState } from 'react';

import { User, Building2, Mail, Phone, Lock, LogOut, Trash2 } from 'lucide-react';

import ChangePasswordModal from '@components/Account/ChangePasswordModal';
import EditBusinessNameModal from '@components/Account/EditBusinessNameModal';
import EditContactModal from '@components/Account/EditContactModal';
import EditEmailModal from '@components/Account/EditEmailModal';
import EditOwnerNameModal from '@components/Account/EditOwnerNameModal';
import BottomNavigation from '@ui/BottomNavigation';

const Account: React.FC = () => {
  // Modal visibility states
  const [isEditBusinessNameOpen, setIsEditBusinessNameOpen] = useState(false);
  const [isEditOwnerNameOpen, setIsEditOwnerNameOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isEditEmailOpen, setIsEditEmailOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Data states
  const [businessName, setBusinessName] = useState('Budi Santoso');
  const [ownerName, setOwnerName] = useState('Budi Santoso');
  const [contact, setContact] = useState('+6281234567890');
  const [email, setEmail] = useState('Budi.santoso@email.com');

  // Handle save functions
  const handleSaveBusinessName = (newName: string) => {
    setBusinessName(newName);
  };

  const handleSaveOwnerName = (newName: string) => {
    setOwnerName(newName);
  };

  const handleSaveContact = (newContact: string) => {
    setContact(newContact);
  };

  const handleSaveEmail = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handleSavePassword = (passwords: { current: string; new: string; confirm: string }) => {
    // Handle password change logic here
    console.log('Password changed:', passwords);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="flex items-center justify-center p-4">
        <h1 className="font-inter font-bold text-[18px] text-[#111611]">Profil</h1>
      </div>

      {/* Main content container with bottom padding */}
      <div className="pb-24">
        {/* Profile Section */}
        <div className="p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-[#EBF2E8] rounded-full overflow-hidden">
              <img
                src="profile.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <h2 className="font-inter font-bold text-[22px] text-[#111611]">{ownerName}</h2>
              <span className="font-inter text-base text-[#639154]">Owner</span>
              <span className="font-inter text-base text-[#639154]">{email}</span>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-inter font-bold text-[18px] text-[#111611]">Akun</h3>
        </div>

        {/* Account Items */}
        <div className="flex flex-col">
          <div 
            className="flex items-center gap-4 p-4 cursor-pointer active:bg-[#EBF2E8] transition-colors"
            onClick={() => setIsEditBusinessNameOpen(true)}
          >
            <div className="w-12 h-12 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#111611]" />
            </div>
            <div className="flex flex-col">
              <span className="font-inter font-medium text-base text-[#111611]">Nama Bisinis</span>
              <span className="font-inter text-sm text-[#639154]">{businessName}</span>
            </div>
          </div>

          <div 
            className="flex items-center gap-4 p-4 cursor-pointer active:bg-[#EBF2E8] transition-colors"
            onClick={() => setIsEditOwnerNameOpen(true)}
          >
            <div className="w-12 h-12 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-[#111611]" />
            </div>
            <div className="flex flex-col">
              <span className="font-inter font-medium text-base text-[#111611]">Nama Pemilik</span>
              <span className="font-inter text-sm text-[#639154]">{ownerName}</span>
            </div>
          </div>

          <div 
            className="flex items-center gap-4 p-4 cursor-pointer active:bg-[#EBF2E8] transition-colors"
            onClick={() => setIsEditEmailOpen(true)}
          >
            <div className="w-12 h-12 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#111611]" />
            </div>
            <div className="flex flex-col">
              <span className="font-inter font-medium text-base text-[#111611]">Email</span>
              <span className="font-inter text-sm text-[#639154]">{email}</span>
            </div>
          </div>

          <div 
            className="flex items-center gap-4 p-4 cursor-pointer active:bg-[#EBF2E8] transition-colors"
            onClick={() => setIsEditContactOpen(true)}
          >
            <div className="w-12 h-12 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-[#111611]" />
            </div>
            <div className="flex flex-col">
              <span className="font-inter font-medium text-base text-[#111611]">Nomor Kontak</span>
              <span className="font-inter text-sm text-[#639154]">{contact}</span>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-inter font-bold text-[18px] text-[#111611]">Keamanan</h3>
        </div>

        <div 
          className="flex items-center gap-4 px-4 cursor-pointer active:bg-[#EBF2E8] transition-colors"
          onClick={() => setIsChangePasswordOpen(true)}
        >
          <div className="w-10 h-10 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#111611]" />
          </div>
          <span className="font-inter text-base text-[#111611]">Ganti Kata Sandi</span>
        </div>

        {/* Other Section */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-inter font-bold text-[18px] text-[#111611]">Lainnya</h3>
        </div>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex items-center gap-4 cursor-pointer active:bg-[#EBF2E8] transition-colors">
            <div className="w-10 h-10 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
              <LogOut className="w-6 h-6 text-[#111611]" />
            </div>
            <span className="font-inter text-base text-[#111611]">Keluar</span>
          </div>

          <div className="flex items-center gap-4 cursor-pointer active:bg-[#EBF2E8] transition-colors">
            <div className="w-10 h-10 bg-[#EBF2E8] rounded-lg flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-[#111611]" />
            </div>
            <span className="font-inter text-base text-[#111611]">Hapus Akun</span>
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Modals */}
      <EditBusinessNameModal
        isOpen={isEditBusinessNameOpen}
        onClose={() => setIsEditBusinessNameOpen(false)}
        onSave={handleSaveBusinessName}
        currentName={businessName}
      />

      <EditOwnerNameModal
        isOpen={isEditOwnerNameOpen}
        onClose={() => setIsEditOwnerNameOpen(false)}
        onSave={handleSaveOwnerName}
        currentName={ownerName}
      />

      <EditContactModal
        isOpen={isEditContactOpen}
        onClose={() => setIsEditContactOpen(false)}
        onSave={handleSaveContact}
        currentContact={contact}
      />

      <EditEmailModal
        isOpen={isEditEmailOpen}
        onClose={() => setIsEditEmailOpen(false)}
        onSave={handleSaveEmail}
        currentEmail={email}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSave={handleSavePassword}
      />
    </div>
  );
};

export default Account; 