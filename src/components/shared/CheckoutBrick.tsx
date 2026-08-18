import React, { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { toast } from 'react-hot-toast';

// Initialize with a default test key, but ideally use env var
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-00000000-0000-0000-0000-000000000000';

export interface CheckoutBrickProps {
  preferenceId: string;
  onReady?: () => void;
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

export const CheckoutBrick: React.FC<CheckoutBrickProps> = ({ preferenceId, onReady, onError, onSuccess }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initMercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });
    setInitialized(true);
  }, []);

  if (!initialized || !preferenceId) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;
  }

  const initialization = {
    amount: 0, // Handled by preferenceId
    preferenceId: preferenceId,
  };

  const customization = {
    paymentMethods: {
      creditCard: 'all',
      pix: 'all',
      bankTransfer: 'all',
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    // When using preferenceId, the SDK processes the payment directly with Mercado Pago.
    // The Promise resolves when the frontend confirms the submission.
    return new Promise<void>((resolve, reject) => {
      fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 'approved' || response.status === 'in_process' || response.status === 'pending') {
            resolve();
            if (onSuccess) onSuccess();
          } else {
            reject();
            toast.error('Pagamento não aprovado. Verifique os dados e tente novamente.');
          }
        })
        .catch((error) => {
          reject();
          if (onError) onError(error);
          toast.error('Erro ao processar pagamento.');
        });
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
      <Payment
        initialization={initialization}
        customization={customization as any}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={(error) => {
          console.error(error);
          if (onError) onError(error);
        }}
      />
    </div>
  );
};
