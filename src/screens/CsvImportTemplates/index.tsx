import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { styles } from './Styles';
import { TemplateCard } from './TemplateCard';
import {
    LucideIcon,
    VStack,
    HStack,
    Text,
    Box,
    Heading,
    useToast,
    Toast,
    ToastTitle,
} from '@ui';
import { useLanguage } from '@contexts/LanguageContext';

const CsvImportTemplates = () => {
    const { t } = useLanguage();
    const toast = useToast();

    const TEMPLATE_DATA = [
        {
            id: 'user_import',
            title: t('admin.csvTemplatePage.templates.user_import.title'),
            description: t('admin.csvTemplatePage.templates.user_import.description'),
        },
        {
            id: 'participant_assignment',
            title: t('admin.csvTemplatePage.templates.participant_assignment.title'),
            description: t('admin.csvTemplatePage.templates.participant_assignment.description'),
        },
        {
            id: 'lc_supervisor_mapping',
            title: t('admin.csvTemplatePage.templates.lc_supervisor_mapping.title'),
            description: t('admin.csvTemplatePage.templates.lc_supervisor_mapping.description'),
        },
        {
            id: 'bulk_status_update',
            title: t('admin.csvTemplatePage.templates.bulk_status_update.title'),
            description: t('admin.csvTemplatePage.templates.bulk_status_update.description'),
        },
        {
            id: 'geographic_reassignment',
            title: t('admin.csvTemplatePage.templates.geographic_reassignment.title'),
            description: t('admin.csvTemplatePage.templates.geographic_reassignment.description'),
        },
    ];

    const GUIDELINES = [
        t('admin.csvTemplatePage.guidelines.items.0'),
        t('admin.csvTemplatePage.guidelines.items.1'),
        t('admin.csvTemplatePage.guidelines.items.2'),
        t('admin.csvTemplatePage.guidelines.items.3'),
        t('admin.csvTemplatePage.guidelines.items.4'),
        t('admin.csvTemplatePage.guidelines.items.5'),
        t('admin.csvTemplatePage.guidelines.items.6'),
    ];

    const CSV_TEMPLATES: Record<string, string> = {
        user_import: "username,email,role,department,province,district\njohn.doe,john@example.com,Linkage Champion,Social Services,Gauteng,Johannesburg",
        participant_assignment: "participant_email,lc_email,assignment_date\nparticipant@example.com,lc@example.com,2024-01-01",
        lc_supervisor_mapping: "lc_email,supervisor_email\nlc@example.com,supervisor@example.com",
        bulk_status_update: "user_email,new_status,reason\nuser@example.com,inactive,Resigned",
        geographic_reassignment: "user_email,new_province,new_district\nuser@example.com,Western Cape,Cape Town"
    };

    const handleDownload = (id: string) => {
        const template = TEMPLATE_DATA.find(item => item.id === id);
        if (!template) return;

        const sanitizedTitle = template.title.replace(/[^a-zA-Z0-9-_]/g, '_');
        const fileName = `${sanitizedTitle || id}.csv`;

        // Trigger Download
        if (Platform.OS === 'web') {
            const csvContent = CSV_TEMPLATES[id] || "header1,header2\nvalue1,value2";
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show Success Toast only on Web
                toast.show({
                    placement: 'top right',
                    render: ({ id }) => {
                        return (
                            <Toast nativeID={`toast-${id}`} action="success" variant="outline" bg="$white" hardShadow="5" style={{ borderColor: '#e5e7eb' }}>
                                <HStack space="md" alignItems="center">
                                    <LucideIcon name="CheckCircle" size={20} color="#16a34a" />
                                    <ToastTitle color="$textPrimary" fontSize="$sm" fontWeight="$bold">
                                        {t('admin.csvTemplatePage.downloadSuccess', { title: template.title })}
                                    </ToastTitle>
                                </HStack>
                            </Toast>
                        )
                    }
                });
            }
        } else {
            // Show Info Toast for Mobile
            toast.show({
                placement: 'top',
                render: ({ id }) => {
                    return (
                        <Toast nativeID={`toast-${id}`} action="info" variant="outline" bg="$white" hardShadow="5" style={{ borderColor: '#e5e7eb' }}>
                            <HStack space="md" alignItems="center">
                                <LucideIcon name="Info" size={20} color="#3b82f6" />
                                <ToastTitle color="$textPrimary" fontSize="$sm" fontWeight="$bold">
                                    {t('admin.csvTemplatePage.downloadMobileInfo')}
                                </ToastTitle>
                            </HStack>
                        </Toast>
                    )
                }
            });
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <VStack space="xl" style={styles.headerContainer}>
                <Box>
                    <Heading size="xl" style={styles.pageTitle}>{t('admin.csvTemplatePage.pageTitle')}</Heading>
                    <Text size="md" color="$textSecondary">{t('admin.csvTemplatePage.pageSubtitle')}</Text>
                </Box>
            </VStack>

            <Box style={styles.sectionContainer}>
                <VStack space="md">
                    <Box>
                        <Heading size="md" style={styles.sectionTitle}>{t('admin.csvTemplatePage.sectionTitle')}</Heading>
                        <Text size="sm" color="$textSecondary">{t('admin.csvTemplatePage.sectionSubtitle')}</Text>
                    </Box>

                    <Box style={styles.gridContainer}>
                        {TEMPLATE_DATA.map((item) => (
                            <TemplateCard
                                key={item.id}
                                title={item.title}
                                description={item.description}
                                buttonText={t('admin.csvTemplatePage.downloadTemplate')}
                                onDownload={() => handleDownload(item.id)}
                            />
                        ))}
                    </Box>

                    <Box style={styles.guidelinesContainer}>
                        <HStack space="sm" alignItems="center" style={{ marginBottom: 16 }}>
                            <LucideIcon name="Info" size={20} color="#666" />
                            <Heading size="sm" style={styles.guidelinesTitle}>{t('admin.csvTemplatePage.guidelines.title')}</Heading>
                        </HStack>

                        <VStack space="sm">
                            {GUIDELINES.map((guideline, index) => (
                                <HStack key={index} space="sm" alignItems="flex-start">
                                    <Box style={styles.bulletPoint} />
                                    <Text size="sm" style={styles.guidelineText}>{guideline}</Text>
                                </HStack>
                            ))}
                        </VStack>
                    </Box>
                </VStack>
            </Box>
        </ScrollView>
    );
};

export default CsvImportTemplates;
