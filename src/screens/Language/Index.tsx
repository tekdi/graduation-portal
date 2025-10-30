import React from 'react';
import { Box, Text, Select, Card } from '@ui';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/layout/Layout';
import LANGUAGE_OPTIONS from '../../constant/LANGUAGE_OPTIONS';
import { stylesLanguage } from './Styles';

const SelectLanguageScreen: React.FC = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <Layout title={t('settings.selectLanguage')}>
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
    </Layout>
  );
};

export default SelectLanguageScreen;
