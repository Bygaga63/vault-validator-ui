export interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolder: string;
}

// Validation functions
export const validateCardNumber = (value: string) => {
  const cleaned = value.replace(/\s/g, '');
  if (cleaned.length < 16) return 'Номер карты должен содержать минимум 16 цифр';
  if (cleaned.length > 19) return 'Номер карты слишком длинный';
  if (!/^\d+$/.test(cleaned)) return 'Номер карты может содержать только цифры';
  return null;
};

export const validateExpiry = (month: string, year: string) => {
  if (!month || !year) return 'Укажите срок действия карты';
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (expMonth < 1 || expMonth > 12) return 'Неверный месяц';
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return 'Карта просрочена';
  }
  
  return null;
};

export const validateCVV = (value: string) => {
  if (value.length < 3) return 'CVV должен содержать минимум 3 цифры';
  if (value.length > 4) return 'CVV слишком длинный';
  if (!/^\d+$/.test(value)) return 'CVV может содержать только цифры';
  return null;
};

export const validateCardHolder = (value: string) => {
  if (value.length < 2) return 'Имя слишком короткое';
  if (value.length > 50) return 'Имя слишком длинное';
  if (!/^[a-zA-Z\s]+$/.test(value)) return 'Имя может содержать только буквы';
  return null;
};