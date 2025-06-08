import React, { useState } from 'react';

import { Pencil } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(email);
    onClose();
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
              disabled={!isEditing}
            />
          </div>
          <div className="bg-[#EBF2E8] px-4 flex items-center rounded-r-xl">
            <Pencil 
              className={`w-6 h-6 cursor-pointer ${isEditing ? 'text-[#639154]' : 'text-[#54D12B]'}`}
              onClick={() => setIsEditing(!isEditing)}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isEditing}
          className={`w-full font-inter font-bold py-4 rounded-[32px] text-base ${
            isEditing ? 'bg-[#54D12B] text-white' : 'bg-[#E5E5E5] text-[#9E9E9E] cursor-not-allowed'
          }`}
        >
          Simpan
        </button>
      </div>
    </BaseModal>
  );
};

export default EditEmailModal; 