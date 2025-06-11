import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BaseModal from '../ui/BaseModal';

interface EditEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEmail: string) => void;
  currentEmail: string;
}

const EditEmailModal: React.FC<EditEmailModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentEmail,
}) => {
  const [email, setEmail] = useState(currentEmail);

  const handleSave = () => {
    try {
      if (!email.trim()) {
        toast.error('Email tidak boleh kosong');
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Format email tidak valid');
        return;
      }
      onSave(email);
      toast.success('Email berhasil diubah');
      onClose();
    } catch (error) {
      toast.error('Gagal mengubah email');
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Email">
      <div className="p-4 space-y-4">
        {/* Input Field */}
        <div className="flex rounded-xl overflow-hidden">
          <div className="flex-1 bg-[#EBF2E8] px-4 py-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none font-inter text-[#0F1417]"
              placeholder="Email"
            />
          </div>
          <div className="bg-[#EBF2E8] px-4 flex items-center rounded-r-xl">
            <Pencil 
              className="w-6 h-6 cursor-pointer text-[#54D12B]"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full font-inter font-bold py-4 rounded-[32px] text-base bg-[#54D12B] text-white"
        >
          Simpan
        </button>
      </div>
    </BaseModal>
  );
};

export default EditEmailModal; 