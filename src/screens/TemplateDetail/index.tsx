import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonText,
  ButtonSpinner,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  Textarea,
  TextareaInput,
  VStack,
  Loader,
  ScrollView,
  showSuccessToast,
} from '@ui';
import {
  useToast,
} from '@gluestack-ui/themed';

import { useLanguage } from '@contexts/LanguageContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LucideIcon, Modal } from '@ui';
import { theme } from '@config/theme';
import {
  getProjectTemplateDetails,
  updateProjectTemplate,
  updateProjectTemplateTask,
  getProjectCategoryList,
  getCategoriesByParentId,
} from '../../services/projectService';
import { templateDetailStyles as styles } from './Styles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TemplateTask {
  _id: string;
  externalId: string;
  name: string;
  description: string;
  type: string; // "content" (simple) | "observation"
  hasSubTasks: boolean;
  taskSequence: string[];
  children: TemplateTask[];
  deleted?: boolean;
  isDeleted?: boolean;
  metaInformation?: {
    startDate?: string;
    endDate?: string;
    hasAParentTask?: string;
  };
}

interface Category {
  _id: string;
  externalId: string;
  name: string;
  hasChildCategories?: boolean;
  children?: Category[];
  parentId?: string | null;
}

type ActiveMenu = 'details' | 'tasks';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Orders items strictly by sequence — only returns items present in sequence */
function orderBySequence(items: TemplateTask[], sequence: string[]): TemplateTask[] {
  if (!sequence?.length || !items?.length) return [];
  const map = new Map<string, TemplateTask>(items.map(t => [t.externalId, t]));
  const ordered: TemplateTask[] = [];
  sequence.forEach(seq => {
    const task = map.get(seq);
    if (task) ordered.push(task);
  });
  return ordered;
}

function swapArray<T>(arr: T[], i: number, j: number): T[] {
  const next = [...arr];
  const temp = next[i];
  next[i] = next[j];
  next[j] = temp;
  return next;
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Safely extracts a plain string ID from either a string or a { $oid: "..." } object */
function extractId(id: any): string {
  if (!id) return '';
  if (typeof id === 'object' && id.$oid) return id.$oid;
  return String(id);
}

/** Recursively fetches children for any category with hasChildCategories=true that has no children yet */
async function resolveChildren(cats: Category[]): Promise<Category[]> {
  return Promise.all(
    cats.map(async (cat) => {
      // Use children already embedded in the response
      let children: Category[] | undefined = cat.children?.length ? cat.children : undefined;

      // Fetch missing children if needed
      if (!children && cat.hasChildCategories) {
        try {
          children = await getCategoriesByParentId(cat._id);
        } catch {
          children = [];
        }
      }

      if (children?.length) {
        // Recursively resolve grandchildren
        const deep = await resolveChildren(children);
        return { ...cat, children: deep };
      }
      return cat;
    })
  );
}

/** Flattens a nested category tree into a single array */
function flattenCategories(cats: Category[]): Category[] {
  const result: Category[] = [];
  const traverse = (items: Category[]) => {
    items.forEach(c => {
      result.push(c);
      if (c.children?.length) traverse(c.children);
    });
  };
  traverse(cats);
  return result;
}

function getTaskTypeLabel(type: string): string {
  if (type === 'observation') return 'Observation';
  return 'Simple';
}

// ---------------------------------------------------------------------------
// Tab Bar
// ---------------------------------------------------------------------------
const TAB_ITEMS: { key: ActiveMenu; labelKey: string }[] = [
  { key: 'details', labelKey: 'admin.templates.detail.detailsMenu' },
  { key: 'tasks', labelKey: 'admin.templates.detail.tasksMenu' },
];

interface TabBarProps {
  activeTab: ActiveMenu;
  onSelect: (tab: ActiveMenu) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onSelect }) => {
  const { t } = useLanguage();
  return (
    <HStack {...styles.tabBar}>
      {TAB_ITEMS.map(item => {
        const isActive = item.key === activeTab;
        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            {...styles.tab}
            borderBottomColor={isActive ? theme.tokens.colors.primary500 : 'transparent'}
          >
            <Text
              {...styles.tabText}
              {...(isActive ? styles.tabTextActive : {})}
            >
              {t(item.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
};

// ---------------------------------------------------------------------------
// Category Selector (hierarchical multi-select)
// ---------------------------------------------------------------------------
interface CategorySelectorProps {
  categories: Category[];
  selectedIds: string[]; // selected _id values
  onToggle: (cat: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedIds, onToggle }) => {
  const renderRow = (cat: Category, depth: number): React.ReactNode => {
    const isSelected = selectedIds.includes(extractId(cat._id));
    const indentLeft = 12 + depth * 20; // 12px base + 20px per level
    const isChild = depth > 0;
    return (
      <Box key={cat._id}>
        <Pressable
          onPress={() => onToggle(cat)}
          borderBottomWidth={1}
          borderBottomColor="$borderLight100"
        >
          <HStack
            {...styles.categoryRow}
            paddingLeft={indentLeft}
            {...(isSelected ? (isChild ? styles.categoryRowChildSelected : styles.categoryRowSelected) : {})}
          >
            <Box
              width={16}
              height={16}
              borderRadius="$sm"
              borderWidth={1.5}
              borderColor={isSelected ? theme.tokens.colors.primary500 : '$borderLight400'}
              bg={isSelected ? theme.tokens.colors.primary500 : '$white'}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              {isSelected && <LucideIcon name="Check" size={10} color="#ffffff" />}
            </Box>
            <Text
              {...styles.categoryText}
              {...(isChild ? styles.categoryChildText : styles.categoryParentText)}
            >
              {cat.name}
            </Text>
            {cat.hasChildCategories && (
              <LucideIcon
                name="ChevronRight"
                size={14}
                color={theme.tokens.colors.textMutedForeground}
              />
            )}
          </HStack>
        </Pressable>
        {/* Render children recursively */}
        {cat.hasChildCategories && cat.children?.map(child => renderRow(child, depth + 1))}
      </Box>
    );
  };

  return (
    <Box {...styles.categoryListContainer}>
      <ScrollView nestedScrollEnabled>
        {categories.map(cat => renderRow(cat, 0))}
      </ScrollView>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// TemplateDetailsForm
// ---------------------------------------------------------------------------
interface DetailsFormProps {
  template: any;
  onSave: (data: any) => Promise<void>;
}

const TemplateDetailsForm: React.FC<DetailsFormProps> = ({ template, onSave }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(template?.title || '');
  const [description, setDescription] = useState(template?.description || '');
  const [duration, setDuration] = useState(template?.durationInDays?.toString() || '');
  const [goal, setGoal] = useState(template?.metaInformation?.goal || '');
  const [saving, setSaving] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    (template?.categories || []).map((c: any) => extractId(c._id))
  );
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    setTitle(template?.title || '');
    setDescription(template?.description || '');
    setDuration(template?.durationInDays?.toString() || '');
    setGoal(template?.metaInformation?.goal || '');
    setSelectedCategoryIds((template?.categories || []).map((c: any) => extractId(c._id)));
  }, [template]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const rootCats: Category[] = await getProjectCategoryList();
        const resolved = await resolveChildren(rootCats || []);
        setCategories(resolved);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleToggleCategory = (cat: Category) => {
    const catId = extractId(cat._id);
    setSelectedCategoryIds(prev => {
      if (prev.includes(catId)) {
        return prev.filter(id => id !== catId);
      }
      return [...prev, catId];
    });
  };

  // Build flat list of all categories (any depth) for chip lookup
  const allCats = flattenCategories(categories);

  const selectedCategoryObjects = allCats.filter(c => selectedCategoryIds.includes(extractId(c._id)));

  const handleSave = async () => {
    setSaving(true);
    try {
      const categoriesPayload = selectedCategoryObjects.map(c => ({
        _id: extractId(c._id),
        externalId: c.externalId,
        name: c.name,
      }));
      const payload: any = {
        title,
        description,
        durationInDays: duration ? parseInt(duration, 10) : undefined,
        metaInformation: { ...template?.metaInformation, goal },
        categories: categoriesPayload,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <VStack>
      <Text {...styles.panelTitle}>{t('admin.templates.detail.detailsTitle')}</Text>
      <Text {...styles.panelDescription}>{t('admin.templates.detail.detailsDescription')}</Text>

      {/* Title */}
      <VStack {...styles.fieldContainer}>
        <Text {...styles.fieldLabel}>{t('admin.templates.detail.fieldTitle')}</Text>
        <Input>
          <InputField
            value={title}
            onChangeText={setTitle}
            placeholder={t('admin.templates.detail.fieldTitle')}
          />
        </Input>
      </VStack>

      {/* Description */}
      <VStack {...styles.fieldContainer}>
        <Text {...styles.fieldLabel}>{t('admin.templates.detail.fieldDescription')}</Text>
        <Textarea borderWidth={1} borderColor="$borderLight200" borderRadius="$md">
          <TextareaInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('admin.templates.detail.fieldDescription')}
            numberOfLines={4}
          />
        </Textarea>
      </VStack>

      {/* Duration */}
      <VStack {...styles.fieldContainer}>
        <Text {...styles.fieldLabel}>{t('admin.templates.detail.fieldDuration')}</Text>
        <Input>
          <InputField
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="60"
          />
        </Input>
      </VStack>

      {/* Goal */}
      <VStack {...styles.fieldContainer}>
        <Text {...styles.fieldLabel}>{t('admin.templates.detail.fieldGoal')}</Text>
        <Textarea borderWidth={1} borderColor="$borderLight200" borderRadius="$md">
          <TextareaInput
            value={goal}
            onChangeText={setGoal}
            placeholder={t('admin.templates.detail.fieldGoal')}
            numberOfLines={3}
          />
        </Textarea>
      </VStack>

      {/* Categories */}
      <VStack {...styles.fieldContainer}>
        <Text {...styles.fieldLabel}>{t('admin.templates.detail.fieldCategories')}</Text>
        {categoriesLoading ? (
          <Loader size="small" color="$primary500" />
        ) : (
          <CategorySelector
            categories={categories}
            selectedIds={selectedCategoryIds}
            onToggle={handleToggleCategory}
          />
        )}
        {/* Selected chips */}
        {selectedCategoryObjects.length > 0 && (
          <HStack {...styles.selectedCategoriesContainer} mt="$2" flexWrap="wrap">
            {selectedCategoryObjects.map(cat => (
              <Pressable
                key={cat._id}
                onPress={() => handleToggleCategory(cat)}
              >
                <HStack {...styles.selectedCategoryChip}>
                  <Text {...styles.selectedCategoryChipText}>{cat.name}</Text>
                  <LucideIcon name="X" size={10} color={theme.tokens.colors.primary700} />
                </HStack>
              </Pressable>
            ))}
          </HStack>
        )}
      </VStack>

      <Button
        bg={theme.tokens.colors.primary500}
        borderRadius="$md"
        onPress={handleSave}
        isDisabled={saving}
        alignSelf="flex-start"
      >
        <HStack space="sm" alignItems="center">
          {saving && <ButtonSpinner color="$white" />}
          <ButtonText color="$white" fontSize="$sm" fontWeight="$medium">
            {saving
              ? t('admin.templates.detail.saving')
              : t('admin.templates.detail.saveDetails')}
          </ButtonText>
        </HStack>
      </Button>
    </VStack>
  );
};

// ---------------------------------------------------------------------------
// TaskEditModal
// ---------------------------------------------------------------------------
interface TaskEditModalProps {
  task: TemplateTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, data: any) => Promise<void>;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [externalId, setExternalId] = useState('');
  const [description, setDescription] = useState('');
  const [isExternalIdEdited, setIsExternalIdEdited] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setExternalId(task.externalId || '');
      setDescription(task.description || '');
      setIsExternalIdEdited(false);
    }
  }, [task]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isExternalIdEdited) {
      setExternalId(slugifyName(val));
    }
  };

  const handleExternalIdChange = (val: string) => {
    setExternalId(val);
    setIsExternalIdEdited(true);
  };

  const handleSave = async () => {
    if (!task) return;
    setSaving(true);
    try {
      await onSave(task._id, { name, externalId, description });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerTitle={t('admin.templates.detail.editTask')}
      cancelButtonText={t('common.cancel')}
      confirmButtonText={saving ? t('admin.templates.detail.saving') : t('admin.templates.detail.saveTask')}
      onConfirm={handleSave}
      confirmLoading={saving}
      size="md"
    >
      <VStack space="sm">
        {/* Name */}
        <VStack {...styles.modalFieldContainer}>
          <Text {...styles.modalFieldLabel}>{t('admin.templates.detail.taskName')}</Text>
          <Input>
            <InputField
              value={name}
              onChangeText={handleNameChange}
              placeholder={t('admin.templates.detail.taskName')}
            />
          </Input>
        </VStack>

        {/* External ID */}
        <VStack {...styles.modalFieldContainer}>
          <Text {...styles.modalFieldLabel}>{t('admin.templates.detail.taskExternalId')}</Text>
          <Input>
            <InputField
              value={externalId}
              onChangeText={handleExternalIdChange}
              placeholder="e.g. my-task-name"
              autoCapitalize="none"
            />
          </Input>
          <Text {...styles.modalFieldHint}>{t('admin.templates.detail.taskExternalIdHint')}</Text>
        </VStack>

        {/* Description */}
        <VStack {...styles.modalFieldContainer}>
          <Text {...styles.modalFieldLabel}>{t('admin.templates.detail.taskDescription')}</Text>
          <Textarea borderWidth={1} borderColor="$borderLight200" borderRadius="$md">
            <TextareaInput
              value={description}
              onChangeText={setDescription}
              placeholder={t('admin.templates.detail.taskDescription')}
              numberOfLines={4}
            />
          </Textarea>
        </VStack>
      </VStack>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// DeleteTaskModal
// ---------------------------------------------------------------------------
interface DeleteTaskModalProps {
  task: TemplateTask | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string) => Promise<void>;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ task, isOpen, onClose, onConfirm }) => {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);
    try {
      await onConfirm(task._id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerTitle={t('admin.templates.detail.deleteTask')}
      cancelButtonText={t('common.cancel')}
      confirmButtonText={deleting ? t('admin.templates.detail.deleting') : t('common.delete')}
      onConfirm={handleDelete}
      confirmLoading={deleting}
      confirmButtonColor={theme.tokens.colors.error600}
      size="sm"
    >
      <Text fontSize="$sm" color="$textForeground">
        {t('admin.templates.detail.deleteTaskConfirm')}
      </Text>
      {task && (
        <Text fontSize="$sm" fontWeight="$medium" color="$textForeground" mt="$1">
          "{task.name}"
        </Text>
      )}
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Task Type Badge
// ---------------------------------------------------------------------------
const TaskTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const isObservation = type === 'observation';
  return (
    <Box
      {...styles.typeBadge}
      {...(isObservation ? styles.typeBadgeObservation : styles.typeBadgeSimple)}
    >
      <Text
        {...styles.typeBadgeText}
        {...(isObservation ? styles.typeBadgeTextObservation : styles.typeBadgeTextSimple)}
      >
        {getTaskTypeLabel(type)}
      </Text>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// SubTaskItem
// ---------------------------------------------------------------------------
interface SubTaskItemProps {
  task: TemplateTask;
  index: number;
  total: number;
  onEdit: (task: TemplateTask) => void;
  onDelete: (task: TemplateTask) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({
  task,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => (
  <HStack {...styles.subtaskCard} alignItems="flex-start">
    <VStack flex={1} mr="$2">
      <Text {...styles.taskNameText} fontSize="$xs">
        {task.name || '-'}
      </Text>
      {!!task.externalId && (
        <Text {...styles.taskExternalId}>{task.externalId}</Text>
      )}
      {!!task.description && (
        <Text {...styles.taskDescriptionText}>{task.description}</Text>
      )}
      {!!task.type && <TaskTypeBadge type={task.type} />}
    </VStack>
    <HStack {...styles.taskActions}>
      <Pressable
        {...styles.iconButton}
        onPress={onMoveUp}
        disabled={index === 0}
        opacity={index === 0 ? 0.4 : 1}
      >
        <LucideIcon name="ChevronUp" size={14} color={theme.tokens.colors.textMutedForeground} />
      </Pressable>
      <Pressable
        {...styles.iconButton}
        onPress={onMoveDown}
        disabled={index === total - 1}
        opacity={index === total - 1 ? 0.4 : 1}
      >
        <LucideIcon name="ChevronDown" size={14} color={theme.tokens.colors.textMutedForeground} />
      </Pressable>
      <Pressable {...styles.iconButton} onPress={() => onEdit(task)}>
        <LucideIcon name="Pencil" size={14} color={theme.tokens.colors.textMutedForeground} />
      </Pressable>
      <Pressable {...styles.iconButton} onPress={() => onDelete(task)}>
        <LucideIcon name="Trash2" size={14} color={theme.tokens.colors.error600} />
      </Pressable>
    </HStack>
  </HStack>
);

// ---------------------------------------------------------------------------
// TaskItem
// ---------------------------------------------------------------------------
interface TaskItemProps {
  task: TemplateTask;
  index: number;
  total: number;
  onEdit: (task: TemplateTask) => void;
  onDelete: (task: TemplateTask) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onReorderSubTask: (taskId: string, newSequence: string[]) => void;
  onEditSubTask: (subTask: TemplateTask) => void;
  onDeleteSubTask: (subTask: TemplateTask) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onReorderSubTask,
  onEditSubTask,
  onDeleteSubTask,
}) => {
  const { t } = useLanguage();
  const [showSubTasks, setShowSubTasks] = useState(false);

  const orderedSubTasks = task.hasSubTasks && task.children?.length
    ? orderBySequence(task.children, task.taskSequence)
    : [];

  const handleSubTaskMoveUp = (subIndex: number) => {
    if (subIndex === 0) return;
    const newOrdered = swapArray(orderedSubTasks, subIndex, subIndex - 1);
    const newSeq = newOrdered.map(t => t.externalId);
    onReorderSubTask(task._id, newSeq);
  };

  const handleSubTaskMoveDown = (subIndex: number) => {
    if (subIndex === orderedSubTasks.length - 1) return;
    const newOrdered = swapArray(orderedSubTasks, subIndex, subIndex + 1);
    const newSeq = newOrdered.map(t => t.externalId);
    onReorderSubTask(task._id, newSeq);
  };

  return (
    <Box {...styles.taskCard}>
      {/* Task header */}
      <HStack {...styles.taskCardHeader}>
        <VStack flex={1} mr="$2">
          <Text {...styles.taskNameText}>{task.name || '-'}</Text>
          {!!task.externalId && (
            <Text {...styles.taskExternalId}>{task.externalId}</Text>
          )}
          {!!task.description && (
            <Text {...styles.taskDescriptionText} numberOfLines={2}>
              {task.description}
            </Text>
          )}
          {!!task.type && <TaskTypeBadge type={task.type} />}
        </VStack>

        <HStack {...styles.taskActions}>
          <Pressable
            {...styles.iconButton}
            onPress={onMoveUp}
            disabled={index === 0}
            opacity={index === 0 ? 0.4 : 1}
          >
            <LucideIcon name="ChevronUp" size={16} color={theme.tokens.colors.textMutedForeground} />
          </Pressable>

          <Pressable
            {...styles.iconButton}
            onPress={onMoveDown}
            disabled={index === total - 1}
            opacity={index === total - 1 ? 0.4 : 1}
          >
            <LucideIcon name="ChevronDown" size={16} color={theme.tokens.colors.textMutedForeground} />
          </Pressable>

          <Pressable {...styles.iconButton} onPress={() => onEdit(task)}>
            <LucideIcon name="Pencil" size={16} color={theme.tokens.colors.textMutedForeground} />
          </Pressable>

          <Pressable {...styles.iconButton} onPress={() => onDelete(task)}>
            <LucideIcon name="Trash2" size={16} color={theme.tokens.colors.error600} />
          </Pressable>

          {task.hasSubTasks && orderedSubTasks.length > 0 && (
            <Pressable
              {...styles.iconButton}
              onPress={() => setShowSubTasks(prev => !prev)}
            >
              <LucideIcon
                name={showSubTasks ? 'ChevronUp' : 'ChevronDown'}
                size={16}
                color={theme.tokens.colors.primary500}
              />
            </Pressable>
          )}
        </HStack>
      </HStack>

      {/* Subtasks */}
      {task.hasSubTasks && showSubTasks && orderedSubTasks.length > 0 && (
        <VStack {...styles.subtaskContainer}>
          <Text {...styles.subtaskLabel}>{t('admin.templates.detail.subTasks')}</Text>
          {orderedSubTasks.map((sub, subIdx) => (
            <SubTaskItem
              key={sub._id}
              task={sub}
              index={subIdx}
              total={orderedSubTasks.length}
              onEdit={onEditSubTask}
              onDelete={onDeleteSubTask}
              onMoveUp={() => handleSubTaskMoveUp(subIdx)}
              onMoveDown={() => handleSubTaskMoveDown(subIdx)}
            />
          ))}
          {/* Add Sub Task button commented out — requires create task API
          <Pressable ... >
            <HStack>
              <LucideIcon name="Plus" />
              <Text>Add Sub Task</Text>
            </HStack>
          </Pressable>
          */}
        </VStack>
      )}
    </Box>
  );
};

// ---------------------------------------------------------------------------
// TasksList
// ---------------------------------------------------------------------------
interface TasksListProps {
  template: any;
  onReorderTasks: (newSequence: string[]) => Promise<void>;
  onReorderSubTasks: (taskId: string, newSequence: string[]) => Promise<void>;
  onUpdateTask: (taskId: string, data: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const TasksList: React.FC<TasksListProps> = ({
  template,
  onReorderTasks,
  onReorderSubTasks,
  onUpdateTask,
  onDeleteTask,
}) => {
  const { t } = useLanguage();
  const [editingTask, setEditingTask] = useState<TemplateTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<TemplateTask | null>(null);

  // template.tasks has ALL tasks (parents + subtasks)
  // template.taskSequence has only parent task externalIds
  const allTasks: TemplateTask[] = template?.tasks || [];
  const taskSequence: string[] = template?.taskSequence || [];

  // Only show top-level tasks (those present in taskSequence)
  const orderedTasks = orderBySequence(allTasks, taskSequence);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrdered = swapArray(orderedTasks, index, index - 1);
    const newSeq = newOrdered.map(t => t.externalId);
    onReorderTasks(newSeq);
  };

  const handleMoveDown = (index: number) => {
    if (index === orderedTasks.length - 1) return;
    const newOrdered = swapArray(orderedTasks, index, index + 1);
    const newSeq = newOrdered.map(t => t.externalId);
    onReorderTasks(newSeq);
  };

  const handleDeleteConfirm = async (taskId: string) => {
    await onDeleteTask(taskId);
  };

  if (!orderedTasks.length) {
    return (
      <VStack>
        <Text {...styles.panelTitle}>{t('admin.templates.detail.tasksTitle')}</Text>
        <Text {...styles.panelDescription}>{t('admin.templates.detail.tasksDescription')}</Text>
        <Box {...styles.centeredBox}>
          <Text {...styles.emptyText}>{t('admin.templates.detail.noTasks')}</Text>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack>
      <Text {...styles.panelTitle}>{t('admin.templates.detail.tasksTitle')}</Text>
      <Text {...styles.panelDescription}>{t('admin.templates.detail.tasksDescription')}</Text>

      {orderedTasks.map((task, index) => (
        <TaskItem
          key={task._id}
          task={task}
          index={index}
          total={orderedTasks.length}
          onEdit={setEditingTask}
          onDelete={setDeletingTask}
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
          onReorderSubTask={onReorderSubTasks}
          onEditSubTask={setEditingTask}
          onDeleteSubTask={setDeletingTask}
        />
      ))}

      {/* Edit Task Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={onUpdateTask}
      />

      {/* Delete Task Modal */}
      <DeleteTaskModal
        task={deletingTask}
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
      />
    </VStack>
  );
};

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------
const TemplateDetailScreen: React.FC = () => {
  const { t } = useLanguage();
  const toast = useToast();
  
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const templateId: string = route.params?.id;

  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveMenu>('details');

  const loadTemplate = useCallback(async () => {
    if (!templateId) return;
    setIsLoading(true);
    try {
      const data = await getProjectTemplateDetails(templateId);
      setTemplate(data);
    } finally {
      setIsLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const handleSaveDetails = async (data: any) => {
    const result = await updateProjectTemplate(templateId, data);
    if (result && result._id) {
      showSuccessToast(toast, t('admin.templates.detail.updateSuccess'));
      await loadTemplate();
    }
  };

  const handleReorderTasks = async (newSequence: string[]) => {
    await updateProjectTemplate(templateId, { taskSequence: newSequence });
    await loadTemplate();
  };

  const handleReorderSubTasks = async (taskId: string, newSequence: string[]) => {
    await updateProjectTemplateTask(taskId, { taskSequence: newSequence });
    await loadTemplate();
  };

  const handleUpdateTask = async (taskId: string, data: any) => {
    const result = await updateProjectTemplateTask(taskId, data);
    if (result && result._id) {
      showSuccessToast(toast, t('admin.templates.detail.taskUpdateSuccess'));
      await loadTemplate();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await updateProjectTemplateTask(taskId, { deleted: true, isDeleted: true });
    await loadTemplate();
  };

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" py="$12">
        <Loader
          size="large"
          color="$primary500"
          message={t('admin.templates.detail.loadingTemplate')}
        />
      </Box>
    );
  }

  return (
    <VStack flex={1} px="$6" py="$4">
      {/* Back button + Title */}
      <VStack mb="$4" space="xs">
        <Pressable onPress={() => navigation.goBack()}>
          <HStack space="xs" alignItems="center">
            <LucideIcon
              name="ArrowLeft"
              size={16}
              color={theme.tokens.colors.textMutedForeground}
            />
            <Text {...styles.backButtonText}>
              {t('admin.templates.detail.backToTemplates')}
            </Text>
          </HStack>
        </Pressable>
        <Text {...styles.headerTitle}>{template?.title || ''}</Text>
      </VStack>

      {/* Content panel with tabs */}
      <Box {...styles.contentPanel} flex={1}>
        {/* Tab bar */}
        <TabBar activeTab={activeTab} onSelect={setActiveTab} />

        {/* Tab content */}
        {activeTab === 'details' && (
          <TemplateDetailsForm template={template} onSave={handleSaveDetails} />
        )}
        {activeTab === 'tasks' && (
          <TasksList
            template={template}
            onReorderTasks={handleReorderTasks}
            onReorderSubTasks={handleReorderSubTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </Box>
    </VStack>
  );
};

export default TemplateDetailScreen;
