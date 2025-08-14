import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { PaymentStatusModal } from "./PaymentStatusModal";
import { Loader2 } from "lucide-react";
import { processPayment } from "@/lib/payment-api";
import type { PaymentFormData } from "@/lib/payment-schema";
import {
  validateCardNumber,
  validateExpiry,
  validateCVV,
  validateCardHolder
} from "@/lib/payment-schema";

export const PaymentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setError
  } = useForm<PaymentFormData>();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    // Custom validation
    const cardError = validateCardNumber(data.cardNumber);
    const expiryError = validateExpiry(data.expiryMonth, data.expiryYear);
    const cvvError = validateCVV(data.cvv);
    const holderError = validateCardHolder(data.cardHolder);

    if (cardError) {
      setError('cardNumber', { message: cardError });
      return;
    }
    if (expiryError) {
      setError('expiryMonth', { message: expiryError });
      return;
    }
    if (cvvError) {
      setError('cvv', { message: cvvError });
      return;
    }
    if (holderError) {
      setError('cardHolder', { message: holderError });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await processPayment(data);
      setPaymentResult(result);
      setShowModal(true);
    } catch (error) {
      setPaymentResult({
        success: false,
        message: 'Произошла ошибка'
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Оплата банковской картой</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Номер карты"
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              error={errors.cardNumber?.message}
              touched={touchedFields.cardNumber}
              {...register('cardNumber', {
                onChange: (e) => {
                  e.target.value = formatCardNumber(e.target.value);
                },
                required: 'Введите номер карты'
              })}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Месяц"
                id="expiryMonth"
                placeholder="ММ"
                maxLength={2}
                error={errors.expiryMonth?.message}
                touched={touchedFields.expiryMonth}
                {...register('expiryMonth', {
                  required: 'Введите месяц',
                  pattern: {
                    value: /^(0[1-9]|1[0-2])$/,
                    message: 'Неверный формат месяца'
                  }
                })}
              />
              
              <FormField
                label="Год"
                id="expiryYear"
                placeholder="ГГ"
                maxLength={2}
                error={errors.expiryYear?.message}
                touched={touchedFields.expiryYear}
                {...register('expiryYear', {
                  required: 'Введите год',
                  pattern: {
                    value: /^\d{2}$/,
                    message: 'Неверный формат года'
                  }
                })}
              />
            </div>

            <FormField
              label="CVV"
              id="cvv"
              placeholder="***"
              maxLength={4}
              type="password"
              error={errors.cvv?.message}
              touched={touchedFields.cvv}
              {...register('cvv', {
                required: 'Введите CVV код'
              })}
            />

            <FormField
              label="Владелец карты"
              id="cardHolder"
              placeholder="IVAN IVANOV"
              error={errors.cardHolder?.message}
              touched={touchedFields.cardHolder}
              {...register('cardHolder', {
                required: 'Введите имя владельца карты'
              })}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обработка...
                </>
              ) : (
                'Оплатить'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {paymentResult && (
        <PaymentStatusModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          success={paymentResult.success}
          message={paymentResult.message}
        />
      )}
    </>
  );
};