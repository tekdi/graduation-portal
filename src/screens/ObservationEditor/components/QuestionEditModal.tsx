/**
 * QuestionEditModal
 * Handles Add / Edit for a question.
 * Type-aware: shows options editor only for option-based response types.
 * Includes dependency management (visibleIf + children).
 */
import React, { useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, TextInput as RNTextInput, ActivityIndicator,
} from 'react-native';
import { VStack, HStack, Box, Text, Pressable } from '@ui';
import { LucideIcon } from '@ui/index';
import type { EditorQuestion, QuestionOption, EditorSection, PropagationScope } from '../types';
import { RESPONSE_TYPES, OPTION_BASED_TYPES, OPERATOR_OPTIONS } from '../types';

interface Props {
  /** null = adding a new question */
  question: EditorQuestion | null;
  section: EditorSection; // parent section (replaces criteria)
  allQuestions: EditorQuestion[]; // all questions in this section (for dependency selector)
  /** For add mode: pre-populate sectionHeader so the new question lands in the right visual group */
  defaultSectionHeader?: string;
  onSave: (payload: SavePayload, propagation: PropagationScope) => Promise<void>;
  onCancel: () => void;
}

export interface SavePayload {
  mode: 'add' | 'edit';
  questionId?: string;           // for edit
  criteriaId?: string;           // @deprecated — no longer used; add is handled via section
  questionText: string;
  questionTextSecondary: string;
  responseType: string;
  displayType: string;
  options: QuestionOption[];
  placeholder: string;
  sectionHeader: string;
  sectionDescription: string;
  page: string;
  required: boolean;
  hint: string;
  tip: string;
  dependency: DependencyPayload | null;
  removeDependency: boolean;
}

interface DependencyPayload {
  parentExternalId: string;
  operator: string;
  value: string;
}

const QuestionEditModal: React.FC<Props> = ({ question, section, allQuestions, defaultSectionHeader, onSave, onCancel }) => {
  const isAdd = question === null;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [questionText, setQuestionText]             = useState(question?.questionText || '');
  const [questionTextSecondary, setSecondary]       = useState(question?.questionTextSecondary || '');
  const [responseType, setResponseType]             = useState(question?.responseType || 'radio');
  const [options, setOptions]                       = useState<QuestionOption[]>(question?.options || []);
  const [sectionHeader, setSectionHeader]           = useState(question?.sectionHeader || defaultSectionHeader || '');
  const [sectionDescription, setSectionDescription]= useState(question?.sectionDescription || '');
  const [displayType, setDisplayType]               = useState(question?.displayType || '');
  const [placeholder, setPlaceholder]               = useState(question?.placeholder || '');
  const [hint, setHint]                             = useState(question?.hint || '');
  const [tip, setTip]                               = useState(question?.tip || '');
  const [page, setPage]                             = useState(question?.page || '');
  const [required, setRequired]                     = useState<boolean>(question?.validation?.required ?? false);

  // Dependency state
  const existingVi = question?.visibleIfResolved?.[0] || null;
  const [hasDependency, setHasDependency]           = useState(!!existingVi);
  const [removeDep, setRemoveDep]                   = useState(false);
  const [parentExternalId, setParentExternalId]     = useState(existingVi?.parentExternalId || '');
  const [operator, setOperator]                     = useState(existingVi?.operator || '===');
  const [depValue, setDepValue]                     = useState(existingVi?.value || '');

  // Propagation & saving
  const [propagation, setPropagation]               = useState<PropagationScope>('templateAndFirst');
  const [saving, setSaving]                         = useState(false);
  const [error, setError]                           = useState<string | null>(null);

  // Which tab is active in the modal
  const [activeTab, setActiveTab] = useState<'basic' | 'options' | 'dependency' | 'advanced'>('basic');

  const showOptions = OPTION_BASED_TYPES.includes(responseType);

  // Reset options when type changes away from option-based
  useEffect(() => {
    if (!showOptions) setOptions([]);
  }, [responseType, showOptions]);

  // ── Option helpers ──────────────────────────────────────────────────────────
  const addOption = () => setOptions(prev => [...prev, { label: '', value: `R${prev.length + 1}` }]);
  const removeOption = (idx: number) => setOptions(prev => prev.filter((_, i) => i !== idx));
  const updateOption = (idx: number, field: 'label' | 'value', text: string) => {
    setOptions(prev => prev.map((opt, i) => i === idx ? { ...opt, [field]: text } : opt));
  };
  const moveOption = (idx: number, dir: -1 | 1) => {
    const next = [...options];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOptions(next);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!questionText.trim()) { setError('Question text is required'); return; }
    setError(null);
    setSaving(true);
    try {
      const dep: DependencyPayload | null = hasDependency && !removeDep && parentExternalId
        ? { parentExternalId, operator, value: depValue }
        : null;

      await onSave(
        {
          mode: isAdd ? 'add' : 'edit',
          questionId: question?._id,
          criteriaId: undefined,
          questionText: questionText.trim(),
          questionTextSecondary: questionTextSecondary.trim(),
          responseType,
          displayType: displayType.trim(),
          options: showOptions ? options : [],
          placeholder: placeholder.trim(),
          sectionHeader: sectionHeader.trim(),
          sectionDescription: sectionDescription.trim(),
          page: page.trim(),
          required,
          hint: hint.trim(),
          tip: tip.trim(),
          dependency: dep,
          removeDependency: removeDep,
        },
        propagation,
      );
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Eligible parent questions (exclude self) ─────────────────────────────────
  const eligibleParents = allQuestions.filter(q => q._id !== question?._id && OPTION_BASED_TYPES.includes(q.responseType));

  const parentQuestion = eligibleParents.find(q => q.externalId === parentExternalId) || null;

  const TABS = [
    { key: 'basic', label: 'Question', icon: 'FileText' },
    ...(showOptions ? [{ key: 'options', label: 'Options', icon: 'List' }] : []),
    { key: 'dependency', label: 'Visibility', icon: 'Eye' },
    { key: 'advanced', label: 'Advanced', icon: 'Settings' },
  ] as const;

  return (
    <VStack style={styles.modal}>
      {/* Header */}
      <HStack style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{isAdd ? 'Add Question' : 'Edit Question'}</Text>
        <Pressable onPress={onCancel} style={styles.closeBtn}>
          <LucideIcon name="X" size={20} color="#6b7280" />
        </Pressable>
      </HStack>

      {/* Section context */}
      <Box style={styles.criteriaTag}>
        <LucideIcon name="Layers" size={13} color="#6b7280" />
        <Text style={styles.criteriaTagText}>{section.name} ({section.ecm} / {section.code})</Text>
      </Box>

      {/* Tabs */}
      <HStack style={styles.tabRow}>
        {TABS.map(tab => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <LucideIcon name={tab.icon} size={14} color={activeTab === tab.key ? '#2563eb' : '#9ca3af'} />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </HStack>

      {/* Tab content */}
      <ScrollView style={styles.tabBody} keyboardShouldPersistTaps="handled">

        {/* ── BASIC TAB ── */}
        {activeTab === 'basic' && (
          <VStack space="md" style={styles.section}>
            <FieldLabel label="Question text *" />
            <RNTextInput
              style={styles.textArea}
              value={questionText}
              onChangeText={setQuestionText}
              placeholder="Enter question text…"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <FieldLabel label="Secondary text (translation)" />
            <RNTextInput
              style={styles.textArea}
              value={questionTextSecondary}
              onChangeText={setSecondary}
              placeholder="Secondary language text (optional)"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />

            <FieldLabel label="Response type" />
            <VStack space="xs">
              {RESPONSE_TYPES.map(rt => (
                <Pressable
                  key={rt.value}
                  style={[styles.typeOption, responseType === rt.value && styles.typeOptionSelected]}
                  onPress={() => setResponseType(rt.value)}
                >
                  <Box style={[styles.radioOuter, responseType === rt.value && styles.radioSelected]}>
                    {responseType === rt.value && <Box style={styles.radioInner} />}
                  </Box>
                  <Text style={[styles.typeLabel, responseType === rt.value && styles.typeLabelSelected]}>
                    {rt.label}
                  </Text>
                </Pressable>
              ))}
            </VStack>

            {/* displayType — only for types that have display variants */}
            {(['radio', 'dropdown', 'multiselect'] as string[]).includes(responseType) && (
              <>
                <FieldLabel
                  label="Display type"
                  note="Controls how options are rendered in the app (leave blank for default)"
                />
                <VStack space="xs">
                  {(responseType === 'multiselect'
                    ? [
                        { label: 'Default (checkboxes)', value: '' },
                        { label: 'Multiselect dropdown', value: 'multiselect-dropdown' },
                      ]
                    : [
                        { label: 'Default (radio / dropdown)', value: '' },
                        { label: 'Select dropdown', value: 'select-dropdown' },
                      ]
                  ).map(dt => (
                    <Pressable
                      key={dt.value === '' ? '__default' : dt.value}
                      style={[styles.typeOption, displayType === dt.value && styles.typeOptionSelected]}
                      onPress={() => setDisplayType(dt.value)}
                    >
                      <Box style={[styles.radioOuter, displayType === dt.value && styles.radioSelected]}>
                        {displayType === dt.value && <Box style={styles.radioInner} />}
                      </Box>
                      <Text style={[styles.typeLabel, displayType === dt.value && styles.typeLabelSelected]}>
                        {dt.label}
                      </Text>
                    </Pressable>
                  ))}
                </VStack>
              </>
            )}

            <FieldLabel label="Section header" note="Groups questions with a visible heading" />
            <RNTextInput
              style={styles.input}
              value={sectionHeader}
              onChangeText={setSectionHeader}
              placeholder="e.g. Personal Information"
            />

            <FieldLabel label="Section description" note="Shown below the section header" />
            <RNTextInput
              style={styles.textArea}
              value={sectionDescription}
              onChangeText={setSectionDescription}
              placeholder="Optional description for this section"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </VStack>
        )}

        {/* ── OPTIONS TAB ── */}
        {activeTab === 'options' && showOptions && (
          <VStack space="md" style={styles.section}>
            <HStack style={styles.optionHeaderRow}>
              <Text style={styles.optionHeaderLabel}>Options ({options.length})</Text>
              <Pressable style={styles.addOptionBtn} onPress={addOption}>
                <LucideIcon name="Plus" size={14} color="#2563eb" />
                <Text style={styles.addOptionText}>Add option</Text>
              </Pressable>
            </HStack>

            {options.length === 0 && (
              <Box style={styles.emptyOptions}>
                <Text style={styles.emptyOptionsText}>No options yet. Add at least one.</Text>
              </Box>
            )}

            {options.map((opt, idx) => (
              <Box key={idx} style={styles.optionRow}>
                <HStack space="sm" style={styles.optionControls}>
                  <Text style={styles.optionIndex}>{idx + 1}</Text>
                  <VStack style={styles.optionFields} space="xs">
                    <RNTextInput
                      style={styles.optionInput}
                      value={opt.label}
                      onChangeText={t => updateOption(idx, 'label', t)}
                      placeholder="Label (shown to user)"
                    />
                    <RNTextInput
                      style={[styles.optionInput, styles.optionValue]}
                      value={String(opt.value)}
                      onChangeText={t => updateOption(idx, 'value', t)}
                      placeholder="Value (stored in DB, e.g. R1)"
                    />
                  </VStack>
                  <VStack space="xs">
                    <Pressable
                      style={[styles.iconBtn, idx === 0 && styles.iconBtnDisabled]}
                      onPress={() => moveOption(idx, -1)}
                      disabled={idx === 0}
                    >
                      <LucideIcon name="ChevronUp" size={16} color={idx === 0 ? '#d1d5db' : '#6b7280'} />
                    </Pressable>
                    <Pressable
                      style={[styles.iconBtn, idx === options.length - 1 && styles.iconBtnDisabled]}
                      onPress={() => moveOption(idx, 1)}
                      disabled={idx === options.length - 1}
                    >
                      <LucideIcon name="ChevronDown" size={16} color={idx === options.length - 1 ? '#d1d5db' : '#6b7280'} />
                    </Pressable>
                    <Pressable style={styles.iconBtnDanger} onPress={() => removeOption(idx)}>
                      <LucideIcon name="Trash2" size={16} color="#ef4444" />
                    </Pressable>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        {/* ── DEPENDENCY TAB ── */}
        {activeTab === 'dependency' && (
          <VStack space="md" style={styles.section}>
            <Box style={styles.depNote}>
              <LucideIcon name="Info" size={14} color="#2563eb" />
              <Text style={styles.depNoteText}>
                When a dependency is set, this question is only visible when the parent question's answer matches the condition.
                Both the parent's children[] and this question's visibleIf[] are updated together.
              </Text>
            </Box>

            {/* Toggle dependency */}
            <Pressable
              style={[styles.toggleBtn, hasDependency && !removeDep && styles.toggleBtnActive]}
              onPress={() => {
                if (hasDependency && !removeDep) {
                  // Existing dep → mark for removal
                  if (existingVi) { setRemoveDep(true); setHasDependency(false); }
                  else setHasDependency(false);
                } else {
                  setHasDependency(true); setRemoveDep(false);
                }
              }}
            >
              <LucideIcon name={hasDependency && !removeDep ? 'ToggleRight' : 'ToggleLeft'} size={20} color={hasDependency && !removeDep ? '#2563eb' : '#9ca3af'} />
              <Text style={styles.toggleText}>
                {hasDependency && !removeDep ? 'Conditional visibility ON' : 'Always visible (no condition)'}
              </Text>
            </Pressable>

            {existingVi && removeDep && (
              <Box style={styles.removeDepWarning}>
                <LucideIcon name="AlertTriangle" size={14} color="#d97706" />
                <Text style={styles.removeDepText}>
                  Existing dependency on "{existingVi.parentQuestionText}" will be removed on save.
                </Text>
              </Box>
            )}

            {hasDependency && !removeDep && (
              <VStack space="md">
                <FieldLabel label="Parent question (controls visibility)" />
                {eligibleParents.length === 0 ? (
                  <Box style={styles.noParentsNote}>
                    <Text style={styles.noParentsText}>No option-based questions available as parent. Add radio/dropdown questions first.</Text>
                  </Box>
                ) : (
                  <ScrollView style={styles.parentList} nestedScrollEnabled>
                    {eligibleParents.map(pq => (
                      <Pressable
                        key={pq._id}
                        style={[styles.parentOption, parentExternalId === pq.externalId && styles.parentOptionSelected]}
                        onPress={() => { setParentExternalId(pq.externalId); setDepValue(''); }}
                      >
                        <Box style={[styles.radioOuter, parentExternalId === pq.externalId && styles.radioSelected]}>
                          {parentExternalId === pq.externalId && <Box style={styles.radioInner} />}
                        </Box>
                        <VStack style={{ flex: 1 }}>
                          <Text style={styles.parentQText} numberOfLines={2}>{pq.questionText}</Text>
                          <Text style={styles.parentQType}>{pq.responseType}</Text>
                        </VStack>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}

                {parentExternalId && parentQuestion && (
                  <VStack space="sm">
                    <FieldLabel label="Condition" />
                    <HStack space="sm" style={{ alignItems: 'center' }}>
                      {/* Operator */}
                      {OPERATOR_OPTIONS.map(op => (
                        <Pressable
                          key={op.value}
                          style={[styles.opOption, operator === op.value && styles.opOptionSelected]}
                          onPress={() => setOperator(op.value)}
                        >
                          <Text style={[styles.opText, operator === op.value && styles.opTextSelected]}>{op.label}</Text>
                        </Pressable>
                      ))}
                    </HStack>

                    <FieldLabel label="Answer value that triggers visibility" />
                    {parentQuestion.options.length > 0 ? (
                      <VStack space="xs">
                        {parentQuestion.options.map((opt) => (
                          <Pressable
                            key={String(opt.value)}
                            style={[styles.valueOption, String(depValue) === String(opt.value) && styles.valueOptionSelected]}
                            onPress={() => setDepValue(String(opt.value))}
                          >
                            <Box style={[styles.radioOuter, String(depValue) === String(opt.value) && styles.radioSelected]}>
                              {String(depValue) === String(opt.value) && <Box style={styles.radioInner} />}
                            </Box>
                            <Text style={styles.valueLabel}>{opt.label}</Text>
                            <Text style={styles.valueMeta}>({String(opt.value)})</Text>
                          </Pressable>
                        ))}
                      </VStack>
                    ) : (
                      <RNTextInput
                        style={styles.input}
                        value={depValue}
                        onChangeText={setDepValue}
                        placeholder="Enter the answer value"
                      />
                    )}
                  </VStack>
                )}
              </VStack>
            )}
          </VStack>
        )}

        {/* ── ADVANCED TAB ── */}
        {activeTab === 'advanced' && (
          <VStack space="md" style={styles.section}>
            <FieldLabel label="Page group" note="Questions sharing the same page name are grouped into a single swipeable page in the app" />
            <RNTextInput
              style={styles.input}
              value={page}
              onChangeText={setPage}
              placeholder="e.g. page1 (leave blank for no page grouping)"
              autoCapitalize="none"
            />

            <Pressable
              style={[styles.toggleBtn, required && styles.toggleBtnActive]}
              onPress={() => setRequired(r => !r)}
            >
              <LucideIcon name={required ? 'ToggleRight' : 'ToggleLeft'} size={20} color={required ? '#2563eb' : '#9ca3af'} />
              <VStack style={{ flex: 1 }}>
                <Text style={styles.toggleText}>{required ? 'Required' : 'Optional'}</Text>
                <Text style={styles.fieldNote}>Stored as validation.required — the app blocks submission if unanswered</Text>
              </VStack>
            </Pressable>

            <FieldLabel label="Placeholder" note="Placeholder text shown inside the answer input" />
            <RNTextInput
              style={styles.input}
              value={placeholder}
              onChangeText={setPlaceholder}
              placeholder="e.g. Enter your answer here…"
            />

            <FieldLabel label="Hint" note="Shown as a helper text under the question" />
            <RNTextInput style={styles.textArea} value={hint} onChangeText={setHint} placeholder="Optional hint…" multiline numberOfLines={2} textAlignVertical="top" />

            <FieldLabel label="Tip" note="Shown as a tooltip/popup tip" />
            <RNTextInput style={styles.textArea} value={tip} onChangeText={setTip} placeholder="Optional tip…" multiline numberOfLines={2} textAlignVertical="top" />

            {!isAdd && (
              <Box style={styles.externalIdBox}>
                <Text style={styles.externalIdLabel}>External ID (read-only)</Text>
                <Text style={styles.externalIdValue}>{question?.externalId}</Text>
                <Text style={styles.externalIdNote}>ExternalId is the key used in submissions and cannot be changed.</Text>
              </Box>
            )}
          </VStack>
        )}
      </ScrollView>

      {/* Propagation scope — shown for both add and edit */}
      <Box style={styles.propagationRow}>
        <Text style={styles.propagationLabel}>
          {isAdd ? 'Add question to:' : 'Apply changes to:'}
        </Text>
        <HStack space="sm">
          {([
            { val: 'templateAndFirst', label: isAdd ? 'Template only' : 'Template + current instance' },
            { val: 'allInProgress', label: 'All in-progress' },
          ] as const).map(s => (
            <Pressable
              key={s.val}
              style={[styles.scopeChip, propagation === s.val && styles.scopeChipActive]}
              onPress={() => setPropagation(s.val)}
            >
              <Text style={[styles.scopeChipText, propagation === s.val && styles.scopeChipTextActive]}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </Box>

      {/* Error */}
      {error && (
        <Box style={styles.errorBox}>
          <LucideIcon name="AlertCircle" size={14} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </Box>
      )}

      {/* Footer */}
      <HStack style={styles.footer} space="md">
        <Pressable style={styles.cancelBtn} onPress={onCancel} disabled={saving}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator size="small" color="#fff" />
            : <LucideIcon name="Save" size={15} color="#fff" />
          }
          <Text style={styles.saveText}>{saving ? 'Saving…' : isAdd ? 'Add question' : 'Save changes'}</Text>
        </Pressable>
      </HStack>
    </VStack>
  );
};

const FieldLabel: React.FC<{ label: string; note?: string }> = ({ label, note }) => (
  <VStack space="xs" style={{ marginBottom: 2 }}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {note && <Text style={styles.fieldNote}>{note}</Text>}
  </VStack>
);

const styles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  closeBtn: { padding: 4 },
  criteriaTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#f3f4f6', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  criteriaTagText: { fontSize: 12, color: '#6b7280' },
  tabRow: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#fff' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  tabTextActive: { color: '#2563eb' },
  tabBody: { flex: 1 },
  section: { padding: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  fieldNote: { fontSize: 11, color: '#9ca3af' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: '#111827', backgroundColor: '#fff' },
  textArea: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: '#111827', backgroundColor: '#fff', minHeight: 72 },
  typeOption: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  typeOptionSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  typeLabel: { fontSize: 13, color: '#374151' },
  typeLabelSelected: { color: '#1d4ed8', fontWeight: '500' },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: '#2563eb' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb' },
  optionHeaderRow: { justifyContent: 'space-between', alignItems: 'center' },
  optionHeaderLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  addOptionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 7, borderWidth: 1, borderColor: '#2563eb' },
  addOptionText: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  emptyOptions: { padding: 20, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed' },
  emptyOptionsText: { fontSize: 13, color: '#9ca3af' },
  optionRow: { borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', padding: 10 },
  optionControls: { alignItems: 'center' },
  optionIndex: { fontSize: 13, color: '#9ca3af', fontWeight: '600', width: 20, textAlign: 'center' },
  optionFields: { flex: 1 },
  optionInput: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, fontSize: 13, color: '#111827' },
  optionValue: { backgroundColor: '#f9fafb', color: '#6b7280' },
  iconBtn: { padding: 5, borderRadius: 6, backgroundColor: '#f3f4f6' },
  iconBtnDisabled: { opacity: 0.3 },
  iconBtnDanger: { padding: 5, borderRadius: 6, backgroundColor: '#fef2f2' },
  depNote: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: '#eff6ff', borderRadius: 8, padding: 12 },
  depNoteText: { flex: 1, fontSize: 12, color: '#1e40af', lineHeight: 18 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  toggleBtnActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  toggleText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  removeDepWarning: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#fffbeb', borderRadius: 8, padding: 10 },
  removeDepText: { flex: 1, fontSize: 12, color: '#92400e' },
  parentList: { maxHeight: 200, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 },
  parentOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  parentOptionSelected: { backgroundColor: '#eff6ff' },
  parentQText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  parentQType: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  opOption: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 7, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  opOptionSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  opText: { fontSize: 12, color: '#374151' },
  opTextSelected: { color: '#1d4ed8', fontWeight: '600' },
  valueOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  valueOptionSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  valueLabel: { flex: 1, fontSize: 13, color: '#374151' },
  valueMeta: { fontSize: 11, color: '#9ca3af' },
  noParentsNote: { padding: 12, backgroundColor: '#f9fafb', borderRadius: 8 },
  noParentsText: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
  externalIdBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, gap: 4 },
  externalIdLabel: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  externalIdValue: { fontSize: 13, color: '#111827', fontFamily: 'monospace' },
  externalIdNote: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  propagationRow: { padding: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: 6 },
  propagationLabel: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  scopeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  scopeChipActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  scopeChipText: { fontSize: 12, color: '#374151' },
  scopeChipTextActive: { color: '#1d4ed8', fontWeight: '600' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 16, padding: 10, backgroundColor: '#fef2f2', borderRadius: 8 },
  errorText: { fontSize: 12, color: '#dc2626', flex: 1 },
  footer: { padding: 14, borderTopWidth: 1, borderTopColor: '#e5e7eb', justifyContent: 'flex-end' },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db' },
  cancelText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 8, backgroundColor: '#2563eb' },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { fontSize: 14, color: '#fff', fontWeight: '600' },
});

export default QuestionEditModal;
