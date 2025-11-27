import React from "react";
import { VStack, HStack, Text, Pressable, Box, Image } from "@ui";
import type { ViewProps, TextProps, PressableProps } from "react-native";
import DownloadIcon from "../../assets/images/DownloadIcon.png";
import { bulkOperationStyles as styles } from "./Styles";
import { useLanguage } from "@contexts/LanguageContext";
import { USER_MAPPING_ITEMS, PASSWORD_MANAGEMENT_ITEMS } from "@constants/BULK_OPERATIONS";

// Extend the style types to ensure type safety
interface TemplateButtonProps extends PressableProps {
  label: string;
}

interface BulletListProps {
  items: string[];
}

const BulkOperationsCard: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Box {...(styles.container as ViewProps)}>
      <Text {...(styles.sectionTitle as TextProps)}>
        {t('admin.bulkOperations.title')}
      </Text>

      <HStack space="lg" w="100%" alignItems="flex-start">
        {/* LEFT SECTION */}
        <VStack flex={1}>
          <Text {...(styles.subTitle as TextProps)}>{t('admin.bulkOperations.csvImportTemplates')}</Text>
          <VStack>
            <TemplateButton label={t('admin.bulkOperations.participantImportTemplate')} />
            <TemplateButton label={t('admin.bulkOperations.lcAssignmentTemplate')} />
            <TemplateButton label={t('admin.bulkOperations.supervisorMappingTemplate')} />
          </VStack>
        </VStack>

        {/* MIDDLE SECTION */}
        <VStack flex={1}>
          <Text {...(styles.subTitle as TextProps)}>{t('admin.bulkOperations.userMapping')}</Text>
          <Text {...(styles.description as TextProps)}>
            {t('admin.bulkOperations.userMappingDescription')}
          </Text>
          <BulletList
            items={USER_MAPPING_ITEMS.map(key => t(key))}
          />
        </VStack>

        {/* RIGHT SECTION */}
        <VStack flex={1}>
          <Text {...(styles.subTitle as TextProps)}>{t('admin.bulkOperations.passwordManagement')}</Text>
          <Text {...(styles.description as TextProps)}>
            {t('admin.bulkOperations.passwordManagementDescription')}
          </Text>
          <BulletList
            items={PASSWORD_MANAGEMENT_ITEMS.map(key => t(key))}
          />
        </VStack>
      </HStack>
    </Box>
  );
};

export default BulkOperationsCard;

/* ----------------------
   TEMPLATE BUTTON
----------------------- */
const TemplateButton: React.FC<TemplateButtonProps> = ({ label, ...props }) => (
  <Pressable {...(styles.templateButton as PressableProps)} {...props}>
    <Image source={DownloadIcon} {...styles.icon} alt="download-icon" />
    <Text {...(styles.templateButtonText)}>{label}</Text>
  </Pressable>
);

/* ----------------------
   BULLET LIST (NO BULLET STYLE)
----------------------- */
const BulletList: React.FC<BulletListProps> = ({ items }) => (
  <VStack>
    {items.map((item, index) => (
      <HStack key={index} alignItems="flex-start" space="md">
        <Box mt="$1" w={5} h={5} borderRadius="$full" bg="$textLight500" />
        <Text flex={1} {...(styles.bulletText as TextProps)}>{item}</Text>
      </HStack>
    ))}
  </VStack>
);
