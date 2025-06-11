import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BaseModal from '../ui/BaseModal';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newContact: string) => void;
  currentContact: string;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentContact,
}) => {
  const [contact, setContact] = useState(currentContact);

  const handleSave = () => {
    try {
      if (!contact.trim()) {
        toast.error('Nomor kontak tidak boleh kosong');
        return;
      }
      // Basic phone number validation
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(contact.replace(/\s+/g, ''))) {
        toast.error('Format nomor kontak tidak valid');
        return;
      }
      onSave(contact);
      toast.success('Nomor kontak berhasil diubah');
      onClose();
    } catch (error) {
      toast.error('Gagal mengubah nomor kontak');
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Nomor Kontak">
      <div className="p-4 space-y-4">
        {/* Input Field */}
        <div className="flex rounded-xl overflow-hidden">
          <div className="flex-1 bg-[#EBF2E8] px-4 py-4">
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-transparent outline-none font-inter text-[#0F1417]"
              placeholder="Nomor Kontak"
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

export default EditContactModal; 