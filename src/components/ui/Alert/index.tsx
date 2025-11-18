import React from 'react';
import {
  useToast,
  Toast,
  ToastDescription,
  VStack,
} from '@gluestack-ui/themed';

/*
  Example usage:
  const { showAlert } = useAlert();

  // Show different types of alerts
  showAlert('error', 'Operation failed');
  showAlert('success', 'Data saved!');
  showAlert('info', 'Processing...');
  showAlert('warning', 'Please check your input');
*/

export const useAlert = () => {
  const toast = useToast();

  const showAlert = (
    action: 'error' | 'warning' | 'success' | 'info' | 'attention',
    description: string,
    {
      variant = 'solid',
      placement = 'top',
      duration = 3000,
    }: {
      variant?: 'solid' | 'outline' | 'accent';
      placement?: 'top' | 'bottom';
      duration?: number;
    } = {},
  ) => {
    toast.show({
      placement,
      duration,
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

  return {
    showAlert,
  };
};
