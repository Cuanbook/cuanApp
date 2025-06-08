import React, { useState } from 'react';

import BaseModal from '../ui/BaseModal';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwords: { current: string; new: string; confirm: string }) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSave = () => {
    onSave(passwords);
    onClose();
  };

  const isValid = passwords.current && passwords.new && passwords.confirm;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Ganti Kata Sandi">
      <div className="p-4 space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div className="bg-[#EBF2E8] px-4 py-4 rounded-xl">
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full bg-transparent outline-none font-inter text-[#0F1417]"
              placeholder="Current Kata Sandi"
            />
          </div>

          <div className="bg-[#EBF2E8] px-4 py-4 rounded-xl">
            <input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full bg-transparent outline-none font-inter text-[#0F1417]"
              placeholder="New Kata Sandi"
            />
          </div>

          <div className="bg-[#EBF2E8] px-4 py-4 rounded-xl">
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full bg-transparent outline-none font-inter text-[#0F1417]"
              placeholder="Konfirmasi Kata Sandi"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full font-inter font-bold py-4 rounded-[32px] text-base ${
            isValid ? 'bg-[#54D12B] text-white' : 'bg-[#E5E5E5] text-[#9E9E9E] cursor-not-allowed'
          }`}
        >
          Simpan Perubahan
        </button>
      </div>
    </BaseModal>
  );
};

export default ChangePasswordModal; 