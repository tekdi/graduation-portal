import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Heading,
  Spinner,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  CheckIcon,
  Image,
} from '@ui';
import { useAuth } from '@contexts/AuthContext';
import { useLanguage } from '@contexts/LanguageContext';
import { loginStyles } from './Styles';
import logoImage from '../../assets/images/logo.png';
import LanguageSelector from '@components/LanguageSelector/LanguageSelector';
import { login as loginService } from '../../services/authenticationService';
import logger from '@utils/logger';

const LoginScreen: React.FC = () => {
  const { setIsLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError(t('login.pleaseEnterBothEmailAndPassword'));
      return;
    }

    setLoading(true);

    try {
      // Call the authentication service API
      const loginResponse = await loginService(email, password);

      if (loginResponse) {
        // Update auth context with login success
        // The login response data is already saved to offline storage by authenticationService
        setIsLoggedIn(true);
        // Optionally update user data in context if needed
        // You can read from offline storage: await offlineStorage.read(STORAGE_KEYS.AUTH_USER)
      } else {
        setError(t('login.invalidEmailOrPassword'));
      }
    } catch (err: any) {
      // Handle error from API
      const errorMessage = err?.message || t('login.anErrorOccurredDuringLogin');
      setError(errorMessage);
      logger.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView {...loginStyles.scrollView}>
      <Box {...loginStyles.container}>
        <LanguageSelector menuTriggerProps={loginStyles.languageSelector} />
        <Box {...loginStyles.box}>
          <VStack {...loginStyles.vstack}>
            {/* Logo/Brand */}
            {/* Placeholder for logo - replace with actual logo */}
            <Image {...loginStyles.imageLogo} source={logoImage} />

            {/* Tagline */}
            <Heading {...loginStyles.heading}>{t('login.title')}</Heading>

            {/* Welcome Text */}
            <VStack {...loginStyles.vstack2}>
              <Text {...loginStyles.text2}>
                {t('login.welcomeToYourAccount')}
              </Text>
              <Text {...loginStyles.text3}>{t('login.logInToContinue')}</Text>
            </VStack>

            {/* Email Input */}
            <VStack {...loginStyles.vstack3}>
              <Text {...loginStyles.text4}>{t('login.username')}</Text>
              <Input isDisabled={loading}>
                <InputField
                  placeholder="your.email@brac.net"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
            </VStack>

            {/* Password Input */}
            <VStack {...loginStyles.vstack4}>
              <Text {...loginStyles.text5}>{t('login.password')}</Text>
              <Input isDisabled={loading}>
                <InputField
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Input>
            </VStack>

            {/* Remember Me Checkbox */}
            <HStack {...loginStyles.hstack}>
              <Checkbox
                value="remember"
                isChecked={rememberMe}
                onChange={setRememberMe}
                aria-label={t('login.rememberMe')}
              >
                <CheckboxIndicator mr="$2">
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>{t('login.rememberMe')}</CheckboxLabel>
              </Checkbox>
            </HStack>

            {/* Error Message */}
            {error ? (
              <Box {...loginStyles.errorBox}>
                <Text {...loginStyles.errorText}>{error}</Text>
              </Box>
            ) : null}

            {/* Login Button */}
            <Button
              {...loginStyles.button}
              onPress={handleLogin}
              isDisabled={loading}
            >
              {loading ? (
                <Spinner color="$white" />
              ) : (
                <ButtonText {...loginStyles.buttonText}>
                  {t('login.logIn')}
                </ButtonText>
              )}
            </Button>

            {/* Helper Text */}
            <VStack {...loginStyles.vstack5}>
              <Text {...loginStyles.text6}>{t('login.testAccounts')}</Text>
              <Text {...loginStyles.text7}>
                {t('login.testAccountsCredentials')}
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default LoginScreen;
