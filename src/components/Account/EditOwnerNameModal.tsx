import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BaseModal from '../ui/BaseModal';

interface EditOwnerNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentName: string;
}

const EditOwnerNameModal: React.FC<EditOwnerNameModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
}) => {
  const [ownerName, setOwnerName] = useState(currentName);

  const handleSave = () => {
    try {
      if (!ownerName.trim()) {
        toast.error('Nama pemilik tidak boleh kosong');
        return;
      }
      onSave(ownerName);
      toast.success('Nama pemilik berhasil diubah');
      onClose();
    } catch (error) {
      toast.error('Gagal mengubah nama pemilik');
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Nama Pemilik">
      <div className="p-4 space-y-4">
        {/* Input Field */}
        <div className="flex rounded-xl overflow-hidden">
          <div className="flex-1 bg-[#EBF2E8] px-4 py-4">
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full bg-transparent outline-none font-inter text-[#0F1417]"
              placeholder="Nama Pemilik"
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

export default EditOwnerNameModal; 