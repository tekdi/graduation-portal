import React, { useState } from 'react';
import { Platform, ScrollView, Image, Alert } from 'react-native';
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
} from '@gluestack-ui/themed';

import { useLanguage } from '../contexts/LanguageContext';

const LoginScreen: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      // const success = await login(email, password);
      // if (!success) {
      //   setError('Invalid email or password');
      // }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box
        flex={1}
        bg="$coolGray50"
        justifyContent="center"
        alignItems="center"
        p="$4"
      >
        <Box
          bg="$white"
          p="$8"
          borderRadius="$lg"
          shadowColor="$gray400"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
          elevation={5}
          w="$full"
          maxWidth={420}
        >
          <VStack space="lg" alignItems="center">
            {/* Logo/Brand */}
            <Box w="$20" h="$20" mb="$4">
              {/* Placeholder for logo - replace with actual logo */}
              <Box
                w="$full"
                h="$full"
                bg="$primary"
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize="$2xl" fontWeight="$bold" color="$white">
                  BRAC
                </Text>
              </Box>
            </Box>

            {/* Tagline */}
            <Heading size="md" color="$primary" textAlign="center">
              Generating Better Livelihoods
            </Heading>

            {/* Welcome Text */}
            <VStack space="xs" alignItems="center" mb="$4">
              <Text fontSize="$lg" fontWeight="$semibold" color="$textDark900">
                Welcome To Your Account
              </Text>
              <Text fontSize="$sm" color="$textDark600">
                Log in to Continue
              </Text>
            </VStack>

            {/* Email Input */}
            <VStack space="xs" w="$full">
              <Text fontSize="$sm" fontWeight="$medium" color="$textDark800">
                Email
              </Text>
              <Input variant="outline" size="md" isDisabled={loading}>
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
            <VStack space="xs" w="$full">
              <Text fontSize="$sm" fontWeight="$medium" color="$textDark800">
                Password
              </Text>
              <Input variant="outline" size="md" isDisabled={loading}>
                <InputField
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Input>
            </VStack>

            {/* Remember Me Checkbox */}
            <HStack w="$full" space="sm" alignItems="center">
              <Checkbox
                value="remember"
                isChecked={rememberMe}
                onChange={setRememberMe}
                aria-label="Remember Me"
              >
                <CheckboxIndicator mr="$2">
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>Remember Me</CheckboxLabel>
              </Checkbox>
            </HStack>

            {/* Error Message */}
            {error ? (
              <Box w="$full" bg="$red50" p="$3" borderRadius="$md">
                <Text fontSize="$sm" color="$red600">
                  {error}
                </Text>
              </Box>
            ) : null}

            {/* Login Button */}
            <Button
              size="lg"
              w="$full"
              bg="$primary"
              onPress={handleLogin}
              isDisabled={loading}
              $active-bg="$primaryDark"
            >
              {loading ? (
                <Spinner color="$white" />
              ) : (
                <ButtonText color="$white" fontWeight="$semibold">
                  Log In
                </ButtonText>
              )}
            </Button>

            {/* Helper Text */}
            <VStack space="xs" mt="$4" alignItems="center">
              <Text fontSize="$xs" color="$textDark500" textAlign="center">
                Test Accounts:
              </Text>
              <Text fontSize="$xs" color="$textDark500">
                admin@brac.net | supervisor@brac.net | lc@brac.net
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default LoginScreen;
