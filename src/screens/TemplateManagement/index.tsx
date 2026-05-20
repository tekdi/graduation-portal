import React, { useEffect, useMemo, useState } from "react";
import { HStack , VStack, Text, Button, Image, Box, Icon } from "@ui";
import { useLanguage } from '@contexts/LanguageContext';
import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';
import DataTable from '@components/DataTable';
import { getTemplatesColumns } from './TemplatesTableConfig';
// import { TEMPLATE_MANAGEMENT_MOCK_DATA } from '@constants/TEMPLATE_MANAGEMENT_MOCK_DATA';
import CSVUploadGuide from './CSVUploadGuide';
import { getProjectTemplatesList } from '../../services/projectService';
import { useNavigation } from '@react-navigation/native';

const TemplateManagementScreen = () => {
    const { t } = useLanguage()
    const navigation = useNavigation<any>();
    const columns = useMemo(() => getTemplatesColumns(), []);
    const [templates, setTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const templatesData = async () => {
        setIsLoading(true);
        try {
            const response = await getProjectTemplatesList();
            console.log('response', response);
            setTemplates(response || []);
        } catch (error) {
            setError(error as string);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        templatesData();
    }, []);

    return(
        <VStack>
           <TitleHeader
            title="admin.menu.templateManagement"
            description="admin.templateManagement.templateManagementDescription"

            right={
                <HStack space="md" alignItems="center">
                    <Button
                    {...titleHeaderStyles.outlineButton}
                    onPress={() => {
                        // Handle bulk upload
                    }}
                    >
                    <HStack space="sm" alignItems="center">
                      
                        <LucideIcon
                            name="FileDown"
                            size={16}
                            color={theme.tokens.colors.textForeground}
                        />
                        <Text {...titleHeaderStyles.outlineButtonText}>
                        {t('admin.actions.downloadSampleCsv')}
                        </Text>
                    </HStack>
                    </Button>
                    
                    <Button
                    {...titleHeaderStyles.solidButton}
                    onPress={() => {
                        // Handle create user
                    }}
                    >
                    <HStack space="sm" alignItems="center">
                        <LucideIcon
                            name="Upload"
                            size={16}
                            color={theme.tokens.colors.white}
                        />
                        <Text {...titleHeaderStyles.solidButtonText}>
                        {t('admin.actions.uploadTemplateCsv')}
                        </Text>
                    </HStack>
                    </Button>
                </HStack>
            }
           />
           { /*
           <Box {...templateManagementStyles.infoBox}>
                <HStack space="md" alignItems="flex-start">
                    
                    <LucideIcon
                            name="AlertCircle"
                            size={16}
                        />
                    <VStack space="sm" flex={1}>
                        <Text {...templateManagementStyles.infoBoxTitle}>
                                {t('admin.templateManagement.infoBox.title')}
                        </Text>

                        <Text {...templateManagementStyles.infoBoxDescription}>
                            {t('admin.templateManagement.infoBox.description')}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
            */ }
            <Box mt="$6" width="$full">
                <DataTable
                    data={templates}
                    columns={columns}
                    getRowKey={(template: any) => template?._id || ''}
                    isLoading={isLoading}
                    emptyMessage={t('admin.templates.noTemplatesFound')}
                    loadingMessage={t('admin.templates.loadingTemplates')}
                    onRowClick={(template: any) => {
                        const id = typeof template._id === 'object'
                            ? template._id.$oid
                            : template._id;
                        navigation.navigate('template-detail', { id });
                    }}
                    pagination={{
                        enabled: true,
                        pageSize: 10,
                        maxPageNumbers: 5,
                    }}
                />
            </Box>
            {/* CSV Upload Guide */}
            <CSVUploadGuide />
        </VStack>
    );
}

export default TemplateManagementScreen