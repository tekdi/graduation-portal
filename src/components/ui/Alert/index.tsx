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
    placement = 'top',
    duration = 3000,
  }: {
    action: 'error' | 'warning' | 'success' | 'info' | 'attention';
    description: string;
    variant?: 'solid' | 'outline' | 'accent';
    placement?: 'top' | 'bottom' | 'left' | 'right';
    duration?: number;
  }) => {
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

  const showError = (
    description: string,
    {
      placement = 'top',
      duration = 3000,
    }: {
      placement?: 'top' | 'bottom' | 'left' | 'right';
      duration?: number;
    } = {},
  ) => {
    showAlert({
      action: 'error',
      description,
      variant: 'solid',
      placement,
      duration,
    });
  };

  const showSuccess = (
    description: string,
    {
      placement = 'top',
      duration = 3000,
    }: {
      placement?: 'top' | 'bottom' | 'left' | 'right';
      duration?: number;
    } = {},
  ) => {
    showAlert({
      action: 'success',
      description,
      variant: 'solid',
      placement,
      duration,
    });
  };

  const showInfo = (
    description: string,
    {
      placement = 'top',
      duration = 3000,
    }: {
      placement?: 'top' | 'bottom' | 'left' | 'right';
      duration?: number;
    } = {},
  ) => {
    showAlert({
      action: 'info',
      description,
      variant: 'solid',
      placement,
      duration,
    });
  };

  const showWarning = (
    description: string,
    {
      placement = 'top',
      duration = 3000,
    }: {
      placement?: 'top' | 'bottom' | 'left' | 'right';
      duration?: number;
    } = {},
  ) => {
    showAlert({
      action: 'warning',
      description,
      variant: 'solid',
      placement,
      duration,
    });
  };

  return {
    showAlert,
    showError,
    showSuccess,
    showInfo,
    showWarning,
  };
};
