import React, { useState } from 'react';
import { Text, Pressable, Menu, VStack, Modal, HStack } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import AVAILABLE_LANGUAGES from '@constants/LANGUAGE_OPTIONS';
import logger from '@utils/logger';
import { usePlatform } from '@utils/platform';
import { stylesLanguageSelector } from './Styles';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLang =
    AVAILABLE_LANGUAGES.find(lang => lang.value === currentLanguage) ||
    AVAILABLE_LANGUAGES[0];
  const { isWeb } = usePlatform();

  const handleLanguageChange = async (languageCode: string | undefined) => {
    if (
      !languageCode ||
      typeof languageCode !== 'string' ||
      languageCode.trim() === ''
    ) {
      logger.warn('Invalid language code provided:', languageCode);
      return;
    }
    await changeLanguage(languageCode);
    setMenuOpen(false);
  };

  return isWeb ? (
    <Menu
      items={AVAILABLE_LANGUAGES.map(language => ({
        key: language.value,
        label: language.nativeName,
        textValue: language.value,
      }))}
      placement="bottom"
      offset={5}
      disabledKeys={[]}
      trigger={triggerProps => (
        <Pressable {...stylesLanguageSelector.menuTrigger} {...triggerProps}>
          <Text {...stylesLanguageSelector.menuTriggerText}>
            {currentLang.value.toUpperCase()}
          </Text>
          <Text {...stylesLanguageSelector.menuTriggerIcon}>▼</Text>
        </Pressable>
      )}
      onSelect={handleLanguageChange}
    />
  ) : (
    <>
      <Pressable
        {...stylesLanguageSelector.menuTrigger}
        onPress={() => setMenuOpen(true)}
      >
        <Text {...stylesLanguageSelector.menuTriggerText}>
          {currentLang.value.toUpperCase()}
        </Text>
        <Text {...stylesLanguageSelector.menuTriggerIcon}>▼</Text>
      </Pressable>

      <Modal isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <Modal.Backdrop />
        <Modal.Content {...stylesLanguageSelector.modalContent}>
          <Modal.Header>
            <Text {...stylesLanguageSelector.modalHeaderText}>
              {t('settings.selectLanguage')}
            </Text>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body>
            <VStack>
              {AVAILABLE_LANGUAGES.map(language => {
                const isSelected = language.value === currentLanguage;
                return (
                  <Pressable
                    key={language.value}
                    {...stylesLanguageSelector.languageItem}
                    bg={isSelected ? '$primary100' : 'transparent'}
                    onPress={() => handleLanguageChange(language.value)}
                  >
                    <HStack {...stylesLanguageSelector.languageItemText}>
                      <Text {...stylesLanguageSelector.languageItemText}>
                        {language.nativeName}
                      </Text>
                      {isSelected && <Text color="$primary600">✓</Text>}
                    </HStack>
                  </Pressable>
                );
              })}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default LanguageSelector;
