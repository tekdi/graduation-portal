import React from 'react';
import { Box, Text, Select, VStack } from '@ui';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from '../components/layout/Layout';

const languages = [
  { value: 'en', name: 'English', nativeName: 'English', isRTL: false },
  { value: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { value: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
  { value: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false },
];

export default function App() {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <Layout
      title={t('settings.selectLanguage')}
      statusBarStyle="dark-content"
      statusBarBackgroundColor="$backgroundLight0"
    >
      <Box flex={1} justifyContent="center" alignItems="center">
        <VStack width={350} borderRadius="$2xl" alignItems="center" gap="$1">
          <Text fontSize="$xl" fontWeight="$bold" color="$primary" mb="$3">
            {t('settings.selectLanguage')}
          </Text>

          <Text color="$textLight700" mb="$6" textAlign="center">
            {t('settings.selectLanguagePlaceholder')}
          </Text>

          <Select
            options={languages}
            value={currentLanguage}
            onChange={changeLanguage}
          />
        </VStack>
      </Box>
    </Layout>
  );
}
