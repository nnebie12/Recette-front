import Modal from './Modal'; 
import Button from './Button'; 

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  confirmVariant = 'primary',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm" 
    >
      <div className="space-y-6">
        <p className="text-gray-700">{message}</p>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;