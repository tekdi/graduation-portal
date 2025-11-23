import React from "react";
import { HStack, Text, Button, Image } from "@ui";
import type { ImageSourcePropType, PressableProps } from "react-native";
import { adminActionButtonStyles as styles } from "./Styles";

export type ButtonVariant = 'outline' | 'solid';

export interface AdminActionButton {
  label: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  variant?: ButtonVariant;
  iconAlt?: string;
}

export interface AdminActionButtonsProps {
  buttons: AdminActionButton[];
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const AdminActionButtons: React.FC<AdminActionButtonsProps> = ({ 
  buttons, 
  space = 'md' 
}) => {
  return (
    <HStack space={space} alignItems="center" mt="$2">
      {buttons.map((button, index) => {
        const isOutline = button.variant === 'outline' || button.variant === undefined;
        
        return (
          <Button
            key={index}
            {...(isOutline ? styles.outlineButton : styles.solidButton)}
            onPress={button.onPress}
          >
            <HStack space="sm" alignItems="center">
              <Image 
                source={button.icon}
                style={{ width: 16, height: 16 }}
                alt={button.iconAlt || `${button.label} icon`}
              />
              <Text {...(isOutline ? styles.outlineButtonText : styles.solidButtonText)}>
                {button.label}
              </Text>
            </HStack>
          </Button>
        );
      })}
    </HStack>
  );
};

export default AdminActionButtons;

