import React from 'react';
import { Box, Text, VStack, HStack, Pressable } from '@ui';
import { LucideIcon } from '@ui';
import { styles } from './Styles';

interface TemplateCardProps {
    title: string;
    description: string;
    buttonText: string;
    onDownload: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
    title,
    description,
    buttonText,
    onDownload,
}) => {
    return (
        <Pressable
            style={styles.cardContainer}
            bg="$white"
            borderRadius="$md"
            borderWidth={1}
            borderColor="$gray300"
            p="$3"
            $hover={{
                borderColor: '$primary500',
            }}
        >
            <VStack space="sm" style={{ height: '100%' }}>
                <HStack justifyContent="space-between" alignItems="flex-start">
                    <Text style={styles.cardTitle} fontWeight="$bold" color="$textPrimary">{title}</Text>
                    <LucideIcon name="Info" size={16} color="#666" />
                </HStack>

                <Text style={styles.cardDescription} color="$textSecondary">{description}</Text>

                <Box style={{ marginTop: 'auto' }}>
                    <Pressable
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        borderWidth={1}
                        borderColor="$gray300"
                        borderRadius="$sm"
                        bg="$white"
                        py="$2"
                        px="$3"
                        onPress={onDownload}
                        $hover={{
                            bg: '$gray100',
                        }}
                    >
                        <LucideIcon name="FileDown" size={16} color="#333" />
                        <Text ml="$2" fontSize="$sm" fontWeight="$medium" color="$textPrimary">{buttonText}</Text>
                    </Pressable>
                </Box>
            </VStack>
        </Pressable>
    );
};
