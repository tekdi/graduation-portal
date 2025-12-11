import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  ButtonText,
  HStack,
  VStack,
  Text,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  ModalBody,
  ModalFooter,
} from '@gluestack-ui/themed';
import { LucideIcon, Modal } from '@ui';
import { useLanguage } from '@contexts/LanguageContext';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import Select from '@ui/Inputs/Select';
import { useProjectContext } from '../../context/ProjectContext';
import { Task } from '../../types/project.types';
import { TASK_STATUS } from '../../../constants/app.constant';
import { addCustomTaskModalStyles } from './Styles';

interface AddCustomTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task; // If provided, we're in edit mode
  pillarId?: string;
  pillarName?: string;
  mode?: 'add' | 'edit';
}

export const AddCustomTaskModal: React.FC<AddCustomTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  pillarId: propPillarId,
  pillarName: propPillarName,
  mode = 'add',
}) => {
  const { t } = useLanguage();
  const {
    projectData,
    addTask,
    updateTask,
    mode: playerMode,
  } = useProjectContext();

  // Form state
  const [selectedPillar, setSelectedPillar] = useState('');
  const [taskName, setTaskName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');

  const isEditMode = mode === 'edit' && !!task;
  const isPreviewMode = playerMode === 'preview';

  // Get all pillars (project type tasks) for the dropdown
  const pillars =
    projectData?.tasks
      ?.filter(pillar => pillar.type === 'project')
      .map(pillar => ({
        label: `${pillar.name} (${pillar.children?.length || 0} ${t(
          'projectPlayer.tasks',
        )})`,
        value: pillar._id,
      })) || [];

  // Find parent pillar for a task
  const findParentPillar = useCallback(
    (taskId: string): Task | undefined => {
      return projectData?.tasks?.find(
        pillar =>
          pillar.type === 'project' &&
          pillar.children?.some(child => child._id === taskId),
      );
    },
    [projectData],
  );
  // Populate form when editing or set pillar when adding
  useEffect(() => {
    if (isEditMode && task) {
      // Edit mode: populate with existing task data
      setTaskName(task.name);
      setInstructions(task.description || '');
      setServiceProvider(task.serviceProvider || '');
      // Find parent pillar
      const parentPillar = findParentPillar(task._id);
      setSelectedPillar(parentPillar?._id || '');
    } else if (propPillarId) {
      // Add mode: set pillar if provided
      setSelectedPillar(propPillarId);
      // Reset form fields for add mode
      setTaskName('');
      setInstructions('');
      setServiceProvider('');
    } else {
      // Reset everything if no pillar provided
      setSelectedPillar('');
      setTaskName('');
      setInstructions('');
      setServiceProvider('');
    }
  }, [isEditMode, task, propPillarId, findParentPillar]);

  const handleCloseModal = () => {
    // Reset form when closing
    setTaskName('');
    setInstructions('');
    setServiceProvider('');
    if (!propPillarId && !isEditMode) {
      setSelectedPillar('');
    }
    onClose();
  };

  const handleSubmit = () => {
    if (isEditMode && task) {
      // Update existing task
      updateTask(task._id, {
        name: taskName,
        description: instructions,
        serviceProvider: serviceProvider || undefined,
      });
    } else {
      // Create new task
      // In preview mode, use propPillarId. In edit mode, use selectedPillar.
      const pillarIdToUse = propPillarId || selectedPillar;
      const newTask: Task = {
        _id: `custom-${Date.now()}`,
        name: taskName,
        description: instructions,
        type: 'simple',
        status: TASK_STATUS.TO_DO,
        isCustomTask: true,
        serviceProvider: serviceProvider || undefined,
      };
      addTask(pillarIdToUse, newTask);
    }
    handleCloseModal();
  };

  // Form validation: In preview mode, pillar is always provided. In edit mode, need to select pillar.
  const isFormValid =
    (isPreviewMode || propPillarId || selectedPillar) && taskName.trim();

  const parentPillarName =
    propPillarName || findParentPillar(task?._id || '')?.name;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      variant="custom"
      title={
        isEditMode
          ? 'projectPlayer.editCustomTask'
          : 'projectPlayer.addCustomTask'
      }
      subtitle={
        isEditMode
          ? 'projectPlayer.editCustomTaskSubtitle'
          : 'projectPlayer.addCustomTaskSubtitle'
      }
      maxWidth={550}
    >
      {/* Modal Body - Form Fields */}
      <ModalBody {...addCustomTaskModalStyles.modalBody}>
        <VStack {...addCustomTaskModalStyles.formStack}>
          {/* Select Pillar */}
          <VStack {...addCustomTaskModalStyles.fieldStack}>
            {/* Label */}
            <Text
              {...TYPOGRAPHY.label}
              color="$textPrimary"
              fontWeight="$medium"
            >
              {!isPreviewMode && (
                <>
                  {t('projectPlayer.selectPillar')}
                  <Text color="$error500">*</Text>
                </>
              )}
            </Text>

            {/* Preview Mode → show Pillar: Pillar Name in one line */}
            {isPreviewMode ? (
              <HStack space="xs">
                <Text
                  {...TYPOGRAPHY.paragraph}
                  color="$textPrimary"
                  fontWeight="$medium"
                >
                  {t('projectPlayer.pillar')}:
                </Text>
                <Text {...TYPOGRAPHY.paragraph} color="$textPrimary">
                  {parentPillarName || propPillarName}
                </Text>
              </HStack>
            ) : propPillarId || isEditMode ? (
              <Text {...TYPOGRAPHY.paragraph} color="$textPrimary">
                {parentPillarName || propPillarName}
              </Text>
            ) : (
              <Select
                options={pillars}
                value={selectedPillar}
                onChange={setSelectedPillar}
                placeholder={t('projectPlayer.selectPillarPlaceholder')}
                {...addCustomTaskModalStyles.select}
              />
            )}
          </VStack>

          {/* Task Name */}
          <VStack {...addCustomTaskModalStyles.fieldStack}>
            <Text
              {...TYPOGRAPHY.label}
              color="$textPrimary"
              fontWeight="$medium"
            >
              {t('projectPlayer.taskName')} <Text color="$error500">*</Text>
            </Text>
            <Input {...addCustomTaskModalStyles.input}>
              <InputField
                placeholder={t('projectPlayer.taskNamePlaceholder')}
                value={taskName}
                onChangeText={setTaskName}
                placeholderTextColor="$textMuted"
              />
            </Input>
          </VStack>

          {/* Instructions */}
          <VStack {...addCustomTaskModalStyles.fieldStack}>
            <Text
              {...TYPOGRAPHY.label}
              color="$textPrimary"
              fontWeight="$medium"
            >
              {t('projectPlayer.instructions')}
            </Text>
            <Textarea {...addCustomTaskModalStyles.textarea}>
              <TextareaInput
                placeholder={t('projectPlayer.instructionsPlaceholder')}
                value={instructions}
                onChangeText={setInstructions}
                placeholderTextColor="$textMuted"
              />
            </Textarea>
          </VStack>

          {/* Service Provider Selection (Optional) */}
          <VStack space="xs">
            <HStack alignItems="center" space="xs">
              <LucideIcon name="Building2" size={16} color="$primary500" />
              <Text
                {...TYPOGRAPHY.label}
                color="$textPrimary"
                fontWeight="$medium"
              >
                {t('projectPlayer.serviceProviderSelection')}
              </Text>
              <Text {...TYPOGRAPHY.bodySmall} color="$textMuted">
                ({t('common.optional')})
              </Text>
            </HStack>
            <Text {...TYPOGRAPHY.bodySmall} color="$textSecondary">
              {t('projectPlayer.serviceProvider')}
            </Text>
            <Select
              options={[
                { label: 'Service Provider 1', value: 'provider1' },
                { label: 'Service Provider 2', value: 'provider2' },
                { label: 'Service Provider 3', value: 'provider3' },
              ]}
              value={serviceProvider}
              onChange={setServiceProvider}
              placeholder={t('projectPlayer.selectServiceProvider')}
              {...addCustomTaskModalStyles.select}
            />
          </VStack>
        </VStack>
      </ModalBody>

      {/* Modal Footer - Action Buttons */}
      <ModalFooter {...addCustomTaskModalStyles.modalFooter}>
        <HStack {...addCustomTaskModalStyles.footerButtons}>
          {/* Cancel Button */}
          <Button
            {...addCustomTaskModalStyles.cancelButton}
            onPress={handleCloseModal}
          >
            <ButtonText color="$textPrimary" {...TYPOGRAPHY.button}>
              {t('common.cancel')}
            </ButtonText>
          </Button>

          {/* Submit Button */}
          <Button
            {...addCustomTaskModalStyles.submitButton}
            onPress={handleSubmit}
            isDisabled={!isFormValid}
            opacity={!isFormValid ? 0.5 : 1}
          >
            <HStack {...addCustomTaskModalStyles.submitButtonContent}>
              <LucideIcon
                name={isEditMode ? 'Check' : 'Plus'}
                size={16}
                color="$backgroundPrimary.light"
              />
              <ButtonText
                color="$backgroundPrimary.light"
                {...TYPOGRAPHY.button}
              >
                {isEditMode
                  ? t('projectPlayer.updateTask')
                  : t('projectPlayer.addCustomTask')}
              </ButtonText>
            </HStack>
          </Button>
        </HStack>
      </ModalFooter>
    </Modal>
  );
};

export default AddCustomTaskModal;
