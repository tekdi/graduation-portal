import React, { useState } from 'react';
import { Platform } from 'react-native';
import {
  Text,
  Pressable,
  Menu,
  MenuItem,
  MenuItemLabel,
  VStack,
  Modal,
  HStack,
} from '@gluestack-ui/themed';
import { useLanguage } from '../../contexts/LanguageContext';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false },
];

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLang =
    AVAILABLE_LANGUAGES.find(lang => lang.code === currentLanguage) ||
    AVAILABLE_LANGUAGES[0];

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Web: Dropdown menu */}
      {Platform.OS === 'web' ? (
        <Menu
          placement="bottom right"
          isOpen={menuOpen}
          onOpen={() => setMenuOpen(true)}
          onClose={() => setMenuOpen(false)}
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
              <Text fontSize="$sm">{currentLang.code.toUpperCase()}</Text>
              <Text fontSize="$xs">▼</Text>
            </Pressable>
          )}
        >
          {AVAILABLE_LANGUAGES.map(language => {
            const isSelected = language.code === currentLanguage;
            return (
              <MenuItem
                key={language.code}
                onPress={() => handleLanguageChange(language.code)}
                px="$3"
                py="$2"
              >
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  w="$full"
                >
                  <MenuItemLabel
                    fontWeight={isSelected ? '$semibold' : '$normal'}
                    fontSize="$sm"
                  >
                    {language.code.toUpperCase()}
                  </MenuItemLabel>
                  {isSelected && <Text>✓</Text>}
                </HStack>
              </MenuItem>
            );
          })}
        </Menu>
      ) : (
        // ... keep your Modal version for mobile here
        <>
          <Menu
            placement="bottom right"
            isOpen={menuOpen}
            onOpen={() => setMenuOpen(true)}
            onClose={() => setMenuOpen(false)}
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
                <Text fontSize="$sm">{currentLang.code.toUpperCase()}</Text>
                <Text fontSize="$xs">▼</Text>
              </Pressable>
            )}
          />
          <Modal isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            <Modal.Backdrop />
            <Modal.Content rounded="$2xl" maxHeight="70%">
              <Modal.Header>
                <Text fontSize="$lg" fontWeight="$bold">
                  Select Language
                </Text>
                <Modal.CloseButton />
              </Modal.Header>

              <Modal.Body>
                <VStack space="sm">
                  {AVAILABLE_LANGUAGES.map(language => {
                    const isSelected = language.code === currentLanguage;
                    return (
                      <Pressable
                        key={language.code}
                        bg={isSelected ? '$primary100' : '$backgroundLight100'}
                        rounded="$lg"
                        p="$3"
                        onPress={() => handleLanguageChange(language.code)}
                      >
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
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
      )}
    </>
  );
};

export default LanguageSelector;
