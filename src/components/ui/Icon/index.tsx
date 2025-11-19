import React from 'react';
import { Image } from 'react-native';
import { ImageProps as RNImageProps } from 'react-native';
import { ICONS, IconName } from '@constants/ICONS';

interface IconProps extends Omit<RNImageProps, 'source'> {
  name: IconName;
  size?: number;
  tintColor?: string;
}

/**
 * Icon Component
 * Optimized icon component using images from assets
 * Works cross-platform (Android, iOS, Web)
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 32,
  tintColor = 'white',
  style,
  ...props
}) => {
  return (
    <Image
      source={ICONS[name]}
      style={[
        {
          width: size,
          height: size,
          tintColor: tintColor,
        },
        style,
      ]}
      resizeMode="contain"
      accessibilityLabel={`${name} icon`}
      {...props}
    />
  );
};

export default Icon;
