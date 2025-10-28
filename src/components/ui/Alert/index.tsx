import React from 'react';
import {
  useToast,
  Toast,
  ToastDescription,
  VStack,
} from '@gluestack-ui/themed';

export const useAlert = () => {
  const toast = useToast();

  const showAlert = ({
    action,
    description,
    variant = 'solid',
  }: {
    action: 'error' | 'warning' | 'success' | 'info' | 'attention';
    description: string;
    variant?: 'solid' | 'outline' | 'accent';
  }) => {
    toast.show({
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        return (
          <Toast nativeID={`toast-${id}`} action={action} variant={variant}>
            <VStack space="xs">
              <ToastDescription>{description}</ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
  };

  const showError = (description: string) => {
    showAlert({ action: 'error', description, variant: 'solid' });
  };

  const showSuccess = (description: string) => {
    showAlert({ action: 'success', description, variant: 'solid' });
  };

  const showInfo = (description: string) => {
    showAlert({ action: 'info', description, variant: 'solid' });
  };

  const showWarning = (description: string) => {
    showAlert({ action: 'warning', description, variant: 'solid' });
  };

  return {
    showAlert,
    showError,
    showSuccess,
    showInfo,
    showWarning,
  };
};
