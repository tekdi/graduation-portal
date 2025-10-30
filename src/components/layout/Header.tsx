import React from 'react';
import { Box, HStack, Text, Icon, MoonIcon, SunIcon } from '@ui';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGlobal } from '../../contexts/GlobalContext';
import { stylesHeader } from './Styles';
import LanguageSelector from './LanguageSelector';
import { Platform } from 'react-native';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { isRTL } = useLanguage();
  const { colorMode, setColorMode } = useGlobal();
  const isDark = colorMode === 'dark';

  return (
    <Box
      {...stylesHeader.container}
      borderBottomColor={isDark ? '$borderDark200' : '$borderLight200'}
      bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
      shadowColor={isDark ? '$backgroundDark950' : '$black'}
    >
      <HStack
        flexDirection={isRTL && Platform.OS !== 'web' ? 'row-reverse' : 'row'}
        {...stylesHeader.title}
      >
        {/* Title */}
        <Text
          {...stylesHeader.titleText}
          color={isDark ? '$textLight100' : '$textDark900'}
        >
          {title}
        </Text>

        {/* Header Right */}
        <HStack
          flexDirection={isRTL && Platform.OS === 'web' ? 'row-reverse' : 'row'}
          {...stylesHeader.right}
        >
          {/* Language Selector */}
          <LanguageSelector />
          {/* Color Mode Icon */}
          <Icon
            {...stylesHeader.rightColorModeIcon}
            as={colorMode === 'dark' ? MoonIcon : SunIcon}
            onPress={() => {
              const newMode = colorMode === 'dark' ? 'light' : 'dark';
              setColorMode(newMode);
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;
