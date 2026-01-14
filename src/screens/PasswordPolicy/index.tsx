import React from 'react';
import { ScrollView } from 'react-native';
import { styles } from './Styles';
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    LucideIcon,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { theme } from '@config/theme';

const PasswordPolicy = () => {
    const { t } = useLanguage();

    // Static Data
    const HIERARCHY_DATA = [
        {
            id: 'admin',
            title: t('admin.passwordPolicyPage.cards.admin.title'),
            badgeText: t('admin.passwordPolicyPage.cards.admin.badge'),
            badgeColor: theme.tokens.colors.red500,
            sections: [
                {
                    type: 'success',
                    title: t('admin.passwordPolicyPage.labels.canResetFor'),
                    items: (t('admin.passwordPolicyPage.cards.admin.canResetFor', { returnObjects: true }) as unknown) as string[],
                }
            ],
            note: t('admin.passwordPolicyPage.cards.admin.note')
        },
        {
            id: 'supervisor',
            title: t('admin.passwordPolicyPage.cards.supervisor.title'),
            badgeText: t('admin.passwordPolicyPage.cards.supervisor.badge'),
            badgeColor: theme.tokens.colors.red900, 
            sections: [
                {
                    type: 'success',
                    title: t('admin.passwordPolicyPage.labels.canResetFor'),
                    items: (t('admin.passwordPolicyPage.cards.supervisor.canResetFor', { returnObjects: true }) as unknown) as string[],
                },
                {
                    type: 'error',
                    title: t('admin.passwordPolicyPage.labels.cannotResetFor'),
                    items: (t('admin.passwordPolicyPage.cards.supervisor.cannotResetFor', { returnObjects: true }) as unknown) as string[],
                }
            ]
        },
        {
            id: 'lc',
            title: t('admin.passwordPolicyPage.cards.lc.title'),
            badgeText: t('admin.passwordPolicyPage.cards.lc.badge'),
            badgeColor: theme.tokens.colors.gray600,
            sections: [
                {
                    type: 'success',
                    title: t('admin.passwordPolicyPage.labels.selfServiceOnly'),
                    icon: 'Key',
                    items: (t('admin.passwordPolicyPage.cards.lc.selfServiceOnly', { returnObjects: true }) as unknown) as string[],
                },
                {
                    type: 'error',
                    title: t('admin.passwordPolicyPage.labels.cannotResetFor'),
                    items: (t('admin.passwordPolicyPage.cards.lc.cannotResetFor', { returnObjects: true }) as unknown) as string[],
                }
            ]
        }
    ];

    const REQUIREMENTS_DATA = {
        strength: {
            title: t('admin.passwordPolicyPage.section2.strengthRequirements.title'),
            items: (t('admin.passwordPolicyPage.section2.strengthRequirements.items', { returnObjects: true }) as unknown) as string[]
        },
        process: {
            title: t('admin.passwordPolicyPage.section2.resetProcess.title'),
            items: (t('admin.passwordPolicyPage.section2.resetProcess.items', { returnObjects: true }) as unknown) as string[]
        }
    };

    const renderPermissionBlock = (section: any) => {
        const isSuccess = section.type === 'success';
        const bgColor = isSuccess ? theme.tokens.colors.green50 : theme.tokens.colors.red50;
        const borderColor = isSuccess ? theme.tokens.colors.green200 : theme.tokens.colors.red200;
        const iconColor = isSuccess ? theme.tokens.colors.green600 : theme.tokens.colors.red600;
        const iconName = section.icon || (isSuccess ? 'RefreshCw' : 'AlertCircle');

        return (
            <Box style={[styles.permissionBlock, { backgroundColor: bgColor, borderColor: borderColor }]}>
                <Box style={styles.permissionHeader}>
                    <LucideIcon name={iconName} size={16} color={iconColor} />
                    <Text fontWeight="600" color="$textPrimary" fontSize={14}>{section.title}</Text>
                </Box>
                <VStack style={styles.listContainer}>
                    {section.items.map((item: string, idx: number) => (
                        <HStack key={idx} style={styles.listItem}>
                            <Box style={[styles.bullet, { backgroundColor: iconColor }]} />
                            <Text style={styles.listItemText}>{item}</Text>
                        </HStack>
                    ))}
                </VStack>
            </Box>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <VStack style={styles.headerContainer}>
                <HStack alignItems="center" space="sm" style={{ marginBottom: 8 }}>
                    <LucideIcon name="Lock" size={28} color={theme.tokens.colors.black} />
                    <Heading size="xl">{t('admin.passwordPolicyPage.pageTitle')}</Heading>
                </HStack>
                <Text size="md" color="$textSecondary">{t('admin.passwordPolicyPage.pageSubtitle')}</Text>
            </VStack>

            {/* Section 1: Hierarchy */}
            <Box style={styles.sectionContainer}>
                <Box style={styles.sectionHeader}>
                    <LucideIcon name="Lock" size={20} color={theme.tokens.colors.textForeground} />
                    <VStack>
                        <Heading size="md" style={styles.sectionTitle}>{t('admin.passwordPolicyPage.section1.title')}</Heading>
                        <Text size="sm" color="$textSecondary" style={styles.sectionSubtitle}>{t('admin.passwordPolicyPage.section1.subtitle')}</Text>
                    </VStack>
                </Box>

                <Box style={styles.hierarchyGrid}>
                    {HIERARCHY_DATA.map((card) => (
                        <Box key={card.id} style={styles.hierarchyCard}>
                            <Box style={styles.cardHeader}>
                                <Box style={[styles.badge, { backgroundColor: card.badgeColor }]}>
                                    <Text style={styles.badgeText}>{card.title}</Text>
                                </Box>
                                <Text fontSize={13} color="$textSecondary" fontWeight="500">{card.badgeText}</Text>
                            </Box>

                            <VStack space="sm">
                                {card.sections.map((section, idx) => (
                                    <Box key={idx}>{renderPermissionBlock(section)}</Box>
                                ))}
                                {card.note && (
                                    <Text fontSize={12} color="$textSecondary" style={{ marginTop: 8 }}>
                                        {card.note}
                                    </Text>
                                )}
                            </VStack>
                        </Box>
                    ))}
                </Box>
                {/* Section 2: Requirements */}
                <Box style={styles.innerSectionContainer}>
                    <Box style={styles.sectionHeader}>
                        <LucideIcon name="ShieldCheck" size={20} color={theme.tokens.colors.textForeground} />
                        <Heading size="md" style={styles.sectionTitle}>{t('admin.passwordPolicyPage.section2.title')}</Heading>
                    </Box>

                    <Box style={styles.requirementsGrid}>
                        <Box style={styles.requirementColumn}>
                            <Text style={styles.columnTitle}>{REQUIREMENTS_DATA.strength.title}</Text>
                            <VStack space="xs">
                                {REQUIREMENTS_DATA.strength.items.map((item, idx) => (
                                    <HStack key={idx} alignItems="center" space="sm">
                                        <Box style={[styles.bullet, { backgroundColor: theme.tokens.colors.textForeground }]} />
                                        <Text fontSize={14} color="$textSecondary">{item}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>

                        <Box style={styles.requirementColumn}>
                            <Text style={styles.columnTitle}>{REQUIREMENTS_DATA.process.title}</Text>
                            <VStack space="xs">
                                {REQUIREMENTS_DATA.process.items.map((item, idx) => (
                                    <HStack key={idx} alignItems="flex-start" space="sm">
                                        <Box style={[styles.bullet, { backgroundColor: theme.tokens.colors.textForeground }]} />
                                        <Text style={styles.listItemText}>{item}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default PasswordPolicy;
