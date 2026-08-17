import React, { useState } from 'react';
import { Box, VStack, HStack, Text, LucideIcon, Pressable } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { graduationCriteriaStyles } from '../../../styles';
import { CategoryConfig, ParticipantGraduationCriteria } from '@constants/DASHBOARD_LC';

interface CategoryCardProps {
  category: CategoryConfig;
  statuses: ParticipantGraduationCriteria;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, statuses }) => {
  const { t } = useLanguage();
  const [expandedLogic, setExpandedLogic] = useState<Record<string, boolean>>({});

  const toggleLogic = (key: string) => {
    setExpandedLogic((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate counts
  const subCriteriaStatuses = category.subCriteria.map((sc) => statuses[sc.key] || 'At Risk');
  const achievedCount = subCriteriaStatuses.filter((s) => s === 'Achieved').length;
  const onTrackCount = subCriteriaStatuses.filter((s) => s === 'On Track').length;
  const atRiskCount = subCriteriaStatuses.filter((s) => s === 'At Risk').length;

  const subtitle = t('requestorDashboard.graduationCriteria.checklist.categorySummary')
    .replace('{{achieved}}', String(achievedCount))
    .replace('{{onTrack}}', String(onTrackCount))
    .replace('{{atRisk}}', String(atRiskCount));

  // Determine category icon color and background style
  const getCategoryTheme = (key: string) => {
    switch (key) {
      case 'financialInclusion':
        return { color: '#059669', bg: '#ECFDF5' }; // green
      case 'socialEmpowerment':
        return { color: '#2563EB', bg: '#EFF6FF' }; // blue
      case 'genderEquality':
        return { color: '#DC2626', bg: '#FEF2F2' }; // red
      case 'livelihoods':
      default:
        return { color: '#991B1B', bg: '#FEF2F2' }; // brown/pink
    }
  };

  const categoryTheme = getCategoryTheme(category.key);

  const getStatusDetails = (status: 'Achieved' | 'On Track' | 'At Risk') => {
    switch (status) {
      case 'Achieved':
        return { name: 'CheckCircle2', color: '$success600', bg: '#F0FDF4', label: t('requestorDashboard.graduationCriteria.indicators.achieved') };
      case 'On Track':
        return { name: 'AlertCircle', color: '$warning600', bg: '#FEF3C7', label: t('requestorDashboard.graduationCriteria.indicators.onTrack') };
      case 'At Risk':
      default:
        return { name: 'XCircle', color: '$error600', bg: '#FEF2F2', label: t('requestorDashboard.graduationCriteria.indicators.atRisk') };
    }
  };

  return (
    <Box {...graduationCriteriaStyles.categoryCard}>
      {/* Category Header */}
      <HStack {...graduationCriteriaStyles.categoryHeader}>
        <Box
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: categoryTheme.bg,
            alignItems: 'center',
            justifyContent: 'center',
          } as any}
        >
          <LucideIcon name={category.icon as any} size={20} color={categoryTheme.color as any} />
        </Box>
        <VStack>
          <Text {...graduationCriteriaStyles.categoryTitle}>{t(category.labelKey)}</Text>
          <Text {...graduationCriteriaStyles.categorySubtitle}>{subtitle}</Text>
        </VStack>
      </HStack>

      {/* Sub-Criteria Stack */}
      <VStack space="xs">
        {category.subCriteria.map((criterion) => {
          const status = statuses[criterion.key] || 'At Risk';
          const statusDetails = getStatusDetails(status);
          const isExpanded = !!expandedLogic[criterion.key];

          return (
            <Box key={criterion.key} {...graduationCriteriaStyles.criterionCard(status)}>
              <VStack>
                {/* Header */}
                <HStack {...graduationCriteriaStyles.criterionHeader}>
                  <HStack {...graduationCriteriaStyles.criterionTitleRow}>
                    <Box
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: statusDetails.bg,
                        alignItems: 'center',
                        justifyContent: 'center',
                      } as any}
                    >
                      <LucideIcon name={statusDetails.name as any} size={14} color={statusDetails.color as any} />
                    </Box>
                    <Text {...graduationCriteriaStyles.criterionTitleText}>
                      {t(criterion.labelKey)}
                    </Text>
                  </HStack>

                  {/* Status Badge */}
                  <Box {...graduationCriteriaStyles.criterionStatusBadge(status)}>
                    <Text {...graduationCriteriaStyles.criterionStatusBadge(status).text}>
                      {statusDetails.label}
                    </Text>
                  </Box>
                </HStack>

                {/* Description Box */}
                <Box {...graduationCriteriaStyles.criterionDescBox(status)}>
                  <Text {...graduationCriteriaStyles.criterionDescText(status)}>
                    <Text fontWeight="$bold" color={graduationCriteriaStyles.criterionDescText(status).color}>
                      {t('requestorDashboard.graduationCriteria.checklist.toAchieveLabel')}{' '}
                    </Text>
                    {t(criterion.descKey)}
                  </Text>

                  {/* Graduation Logic Toggle */}
                  <Pressable onPress={() => toggleLogic(criterion.key)}>
                    <HStack {...graduationCriteriaStyles.criterionLogicLink}>
                      <LucideIcon
                        name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                        size={11}
                        color="$textMutedForeground"
                      />
                      <Text {...graduationCriteriaStyles.criterionLogicText}>
                        {t('requestorDashboard.graduationCriteria.checklist.graduationLogicLabel')}
                      </Text>
                    </HStack>
                  </Pressable>

                  {/* Graduation Logic Details */}
                  {isExpanded && (
                    <Box style={{ marginTop: 8, paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: '#D1D5DB' } as any}>
                      <Text fontSize={11} color="$textSecondary" lineHeight={16}>
                        {t(criterion.descKey)}
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Note Badge if present */}
                {criterion.note && (
                  <Box {...graduationCriteriaStyles.criterionNoteBadge}>
                    <Text {...graduationCriteriaStyles.criterionNoteText}>
                      {criterion.note}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default CategoryCard;
