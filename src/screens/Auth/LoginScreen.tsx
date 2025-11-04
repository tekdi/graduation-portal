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
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { loginStyles } from './Styles';
import logoImage from '../../assets/images/logo.png';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
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
      const success = await login(email, password);

      if (!success) {
        setError(t('login.invalidEmailOrPassword'));
      }
    } catch (err) {
      setError(t('login.anErrorOccurredDuringLogin'));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView {...loginStyles.scrollView}>
      <Box {...loginStyles.container}>
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
              <Input {...loginStyles.input} isDisabled={loading}>
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
              <Input {...loginStyles.input} isDisabled={loading}>
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
