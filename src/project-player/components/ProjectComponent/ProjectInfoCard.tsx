import React from 'react';
import { Box, VStack, Text, HStack } from '@gluestack-ui/themed';
import { useLanguage } from '@contexts/LanguageContext';
import { ProjectInfoCardProps } from '../../types/components.types';

const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ project }) => {
  const { t } = useLanguage();

  return (
    <Box
      bg="$white"
      borderRadius="$lg"
      padding="$4"
      borderWidth={1}
      borderColor="$borderLight300"
    >
      <VStack space="sm">
        <Text fontSize="$xl" fontWeight="$bold">
          {t(project.name)}
        </Text>

        {project.description && (
          <Text fontSize="$sm" color="$textLight600">
            {t(project.description)}
          </Text>
        )}

        <HStack space="md" marginTop="$2">
          <Text fontSize="$sm">
            {t('projectPlayer.status')}:{' '}
            <Text fontWeight="$semibold">
              {t(`projectPlayer.statusTypes.${project.status}`)}
            </Text>
          </Text>
          <Text fontSize="$sm">
            {t('projectPlayer.progress')}:{' '}
            <Text fontWeight="$semibold">{project.progress}%</Text>
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProjectInfoCard;
