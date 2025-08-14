import type { PaymentFormData } from './payment-schema';

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

// Mock API call that randomly returns success or error
export const processPayment = async (data: PaymentFormData): Promise<PaymentResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 70% success rate for demo purposes
  const isSuccess = Math.random() > 0.3;
  
  if (isSuccess) {
    return {
      success: true,
      message: 'Оплата прошла успешно',
      transactionId: `TXN_${Date.now()}`
    };
  } else {
    return {
      success: false,
      message: 'Произошла ошибка при обработке платежа'
    };
  }
};