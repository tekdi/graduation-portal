import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { Box, HStack, Text, Center, SafeAreaView } from '@gluestack-ui/themed';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  navigation?: any;
  pendingSyncCount?: number;
}

const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor = '$backgroundLight0',
}) => {
  const { isRTL } = useLanguage();

  return (
    <SafeAreaView bg="$backgroundLight0" flex={1}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackgroundColor}
      />

      {/* Header */}
      <Box
        borderBottomWidth={1}
        borderBottomColor="$borderLight200"
        px="$4"
        py="$2"
        bg="$backgroundLight0"
        minHeight={60}
        justifyContent="center"
        shadowColor="$black"
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
          <Text size="lg" bold color="$textDark900">
            {title}
          </Text>

          {/* Header Right */}
          <HStack alignItems="center" space="md">
            {/* Language Selector */}
            <Box ml={isRTL ? '$3' : '$0'} mr={isRTL ? '$0' : '$3'}>
              <LanguageSelector />
            </Box>

            {/* Profile Circle */}
            {/* <Center w={28} h={28} rounded="$full" bg="$secondary500">
              <Text color="$textLight50" size="sm">
                U
              </Text>
            </Center> */}
          </HStack>
        </HStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} {...(Platform.OS === 'web' ? { zIndex: -1 } : {})}>
        {children}
      </Box>
    </SafeAreaView>
  );
};

export default Layout;
