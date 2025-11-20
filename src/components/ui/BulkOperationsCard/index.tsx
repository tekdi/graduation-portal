import React from "react";
import { VStack, HStack, Text, Pressable, Box, Image } from "@ui";
import type { ViewProps, TextProps, PressableProps } from "react-native";
import DownloadIcon from "../../../assets/images/DownloadIcon.png";
import { bulkOperationStyles as styles } from "./Styles";

// Extend the style types to ensure type safety
interface TemplateButtonProps extends PressableProps {
  label: string;
}

interface BulletListProps {
  items: string[];
}

const BulkOperationsCard: React.FC = () => {
  return (
    <Box {...(styles.container as ViewProps)}>
      <Text {...(styles.sectionTitle as TextProps)}>
        Bulk Operations & CSV Templates
      </Text>

      <HStack space="lg" w="100%" alignItems="flex-start">
        {/* LEFT SECTION */}
        <VStack flex={1}>
          <Text {...(styles.subTitle as TextProps)}>CSV Import Templates</Text>
          <VStack>
            <TemplateButton label="Participant Import Template" />
            <TemplateButton label="LC Assignment Template" />
            <TemplateButton label="Supervisor Mapping Template" />
          </VStack>
        </VStack>

        {/* MIDDLE SECTION */}
        <VStack flex={1}>
          <Text {...(styles.subTitle as TextProps)}>User Mapping</Text>
          <Text {...(styles.description as TextProps)}>
            Use CSV uploads to map relationships between users:
          </Text>
          <BulletList
            items={[
              "Assign participants to LCs",
              "Link LCs to supervisors",
              "Update role hierarchies in bulk",
            ]}
          />
        </VStack>

        {/* RIGHT SECTION */}
        <VStack flex={1}>
          <Text {...(styles.subTitle as TextProps)}>Password Management</Text>
          <Text {...(styles.description as TextProps)}>
            Supervisors and admins can reset passwords for:
          </Text>
          <BulletList
            items={[
              "Participants (all levels)",
              "Linkage Champions (supervisors+)",
              "Other supervisors (admin only)",
            ]}
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
