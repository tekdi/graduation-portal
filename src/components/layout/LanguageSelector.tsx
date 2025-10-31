import React, { useState } from 'react';
import { Text, Pressable, Menu, VStack, Modal, HStack } from '@ui';
import { useLanguage } from '../../contexts/LanguageContext';
import AVAILABLE_LANGUAGES from '../../constant/LANGUAGE_OPTIONS';
import logger from '../../utils/logger';
import { usePlatform } from '../../utils/usePlatform';

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
        <Pressable
          {...triggerProps}
          flexDirection="row"
          alignItems="center"
          gap="$1"
          px="$2"
          py="$1"
          rounded="$lg"
          bg="transparent"
          _hover={{ bg: '$backgroundLight100' }}
        >
          <Text fontSize="$sm">{currentLang.value.toUpperCase()}</Text>
          <Text fontSize="$xs">▼</Text>
        </Pressable>
      )}
      onSelect={handleLanguageChange}
      menuProps={{}}
      triggerProps={{}}
    />
  ) : (
    <>
      <Pressable
        flexDirection="row"
        alignItems="center"
        gap="$1"
        px="$2"
        py="$1"
        rounded="$lg"
        bg="transparent"
        onPress={() => setMenuOpen(true)}
      >
        <Text fontSize="$sm">{currentLang.value.toUpperCase()}</Text>
        <Text fontSize="$xs">▼</Text>
      </Pressable>

      <Modal isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <Modal.Backdrop />
        <Modal.Content rounded="$2xl" maxHeight="70%">
          <Modal.Header>
            <Text fontSize="$lg" fontWeight="$bold">
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
                    bg={isSelected ? '$primary100' : ''}
                    rounded="$lg"
                    p="$3"
                    onPress={() => handleLanguageChange(language.value)}
                  >
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text
                        fontSize="$md"
                        color="$textDark700"
                        fontWeight={isSelected ? '$semibold' : '$normal'}
                      >
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
