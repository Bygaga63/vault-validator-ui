import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}

export const PaymentStatusModal = ({ 
  isOpen, 
  onClose, 
  success, 
  message 
}: PaymentStatusModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          {success ? (
            <CheckCircle className="w-16 h-16 text-success" />
          ) : (
            <XCircle className="w-16 h-16 text-destructive" />
          )}
          
          <h2 className="text-xl font-semibold">
            {message}
          </h2>
          
          <Button onClick={onClose} className="mt-4">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};