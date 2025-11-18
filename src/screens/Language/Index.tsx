import React from 'react';
import { Box, Text, Select, Card } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import LANGUAGE_OPTIONS from '@constants/LANGUAGE_OPTIONS';
import { stylesLanguage } from './Styles';

/**
 * SelectLanguageScreen - Layout is automatically applied by navigation based on user role
 */
const SelectLanguageScreen: React.FC = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <Box {...stylesLanguage.container}>
      <Card {...stylesLanguage.card}>
        <Text {...stylesLanguage.title}>{t('settings.selectLanguage')}</Text>

        <Text {...stylesLanguage.description}>
          {t('settings.selectLanguagePlaceholder')}
        </Text>

        <Select
          options={LANGUAGE_OPTIONS}
          value={currentLanguage}
          onChange={changeLanguage}
        />
      </Card>
    </Box>
  );
};

export default SelectLanguageScreen;
