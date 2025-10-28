import React from 'react';
import { StatusBar, Platform } from 'react-native';
import {
  Box,
  HStack,
  Text,
  SafeAreaView,
  SunIcon,
  MoonIcon,
  useColorMode,
  Icon,
} from '@gluestack-ui/themed';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  navigation?: any;
  pendingSyncCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const { isRTL } = useLanguage();
  const mode = useColorMode();
  const isDark = mode === 'dark';

  return (
    <SafeAreaView
      flex={1}
      bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000' : '#fff'}
      />

      {/* Header */}
      <Box
        borderBottomWidth={1}
        borderBottomColor={isDark ? '$borderDark200' : '$borderLight200'}
        px="$4"
        py="$2"
        minHeight={60}
        justifyContent="center"
        bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
        shadowColor={isDark ? '$backgroundDark950' : '$black'}
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={3}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
          flexDirection={isRTL ? 'row-reverse' : 'row'}
        >
          {/* Title */}
          <Text
            size="lg"
            bold
            color={isDark ? '$textLight100' : '$textDark900'}
          >
            {title}
          </Text>

          {/* Header Right */}
          <HStack alignItems="center" space="md">
            <Box ml={isRTL ? '$3' : '$0'} mr={isRTL ? '$0' : '$3'}>
              <LanguageSelector />
            </Box>
            <Text>{mode}</Text>
            <Icon
              as={mode === 'dark' ? MoonIcon : SunIcon}
              size="sm"
              onPress={() => {
                localStorage.setItem(
                  'colorMode',
                  mode === 'dark' ? 'light' : 'dark',
                );
                window.location.reload();
              }}
            />
          </HStack>
        </HStack>
      </Box>

      {/* Main Content */}
      <Box
        flex={1}
        bg={isDark ? '$backgroundDark950' : '$backgroundLight0'}
        {...(Platform.OS === 'web' ? { zIndex: -1 } : {})}
      >
        {children}
      </Box>
    </SafeAreaView>
  );
};

export default Layout;
