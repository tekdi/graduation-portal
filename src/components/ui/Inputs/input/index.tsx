import React from 'react';
import { Input as GluestackInput } from '@gluestack-ui/themed';
import { inputStyles } from './Styles';

export const Input = ({ ...props }: any) => {
  return <GluestackInput {...inputStyles.input} {...props} />;
};
