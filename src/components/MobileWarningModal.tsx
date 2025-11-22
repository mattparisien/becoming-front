'use client';

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface MobileWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileWarningModal = ({ isOpen, onClose }: MobileWarningModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mobile/Tablet Notice"
      description="This plugin demo may not work properly on mobile or tablet devices. For the best experience, please view this demo on a desktop computer."
      maxWidth="md"
    >
      <div className="flex justify-end mt-6">
        <Button
          variant="primary"
          onClick={onClose}
        >
          Continue Anyway
        </Button>
      </div>
    </Modal>
  );
};

export default MobileWarningModal;
