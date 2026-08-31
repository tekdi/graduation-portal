/**
 * TemplateEditor – Detail screen.
 * Shows sections sidebar (from questionSequenceByEcm) + questions grouped by sectionHeader.
 * Sections mirror what the end-user sees: S1, S2, … with names from solution.sections.
 * Integrates: view, add, edit, reorder, delete, dependency, impact+propagation, preview.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ScrollView, StyleSheet, Modal, ActivityIndicator, Alert,
  Platform,
} from 'react-native';
import { VStack, HStack, Box, Text, Pressable } from '@ui';
import { LucideIcon } from '@ui/index';
import {
  getSolutionDetail, getSolutionImpact,
  updateQuestion, updateDependency, addQuestion, deleteQuestion, reorderQuestions,
} from '../../services/questionEditorService';
import type {
  TemplateDetail, EditorSection, EditorQuestion, ImpactData, PropagationScope,
} from './types';
import QuestionEditModal, { type SavePayload } from './components/QuestionEditModal';
import ImpactPanel from './components/ImpactPanel';
import PreviewPanel from './components/PreviewPanel';

interface Props {
  solutionId: string;
  solutionName: string;
}

type RightPanelMode = 'editor' | 'preview';

const TemplateEditor: React.FC<Props> = ({ solutionId, solutionName }) => {
  const [detail, setDetail]                 = useState<TemplateDetail | null>(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [selectedSectionIdx, setSelectedIdx] = useState<number>(0);
  const [rightPanel, setRightPanel]         = useState<RightPanelMode>('editor');

  // Modal state
  const [modalMode, setModalMode]             = useState<'add' | 'edit' | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<EditorQuestion | null>(null);

  // Impact panel state
  const [pendingSave, setPendingSave]   = useState<{ payload: SavePayload } | null>(null);
  const [impact, setImpact]             = useState<ImpactData | null>(null);
  const [impactLoading, setImpactLoading] = useState(false);
  const [propagation, setPropagation]   = useState<PropagationScope>('templateAndFirst');
  const [saving, setSaving]             = useState(false);

  // Toast
  const [toast, setToast]   = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const toastTimer          = useRef<any>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // ── Load template ─────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSolutionDetail(solutionId);
      setDetail(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  }, [solutionId]);

  useEffect(() => { load(); }, [load]);

  // ── Derived: selected section ─────────────────────────────────────────────
  const selectedSection: EditorSection | null = detail?.sections[selectedSectionIdx] ?? null;
  const allQuestionsInSection: EditorQuestion[] = selectedSection?.questions || [];

  // ── Group questions within the section by sectionHeader ───────────────────
  type HeaderGroup = { header: string | null; description: string | null; questions: EditorQuestion[] };
  const headerGroups: HeaderGroup[] = [];
  for (const q of allQuestionsInSection) {
    const last = headerGroups[headerGroups.length - 1];
    if (!last || last.header !== (q.sectionHeader || null)) {
      headerGroups.push({ header: q.sectionHeader || null, description: q.sectionDescription || null, questions: [q] });
    } else {
      last.questions.push(q);
    }
  }

  // Default sectionHeader for new questions — inherited from last question in the section.
  const [addDefaultSectionHeader, setAddDefaultSectionHeader] = useState('');

  // ── Open edit / add modal ─────────────────────────────────────────────────
  const openEditModal = (q: EditorQuestion) => {
    setEditingQuestion(q);
    setModalMode('edit');
  };

  const openAddModal = () => {
    // Inherit the sectionHeader of the last question so the new question
    // lands in the same visual group instead of appearing as an isolated block.
    const lastQ = allQuestionsInSection[allQuestionsInSection.length - 1];
    setAddDefaultSectionHeader(lastQ?.sectionHeader || '');
    setEditingQuestion(null);
    setModalMode('add');
  };

  // ── Save flow: show impact panel, then execute ────────────────────────────
  const handleModalSave = async (payload: SavePayload, scope: PropagationScope) => {
    setPropagation(scope);
    setModalMode(null);
    setPendingSave({ payload });
    setImpactLoading(true);
    try {
      const imp = await getSolutionImpact(solutionId);
      setImpact(imp);
    } catch (e) {
      setImpact(null);
      await executeSave(payload, scope);
      return;
    } finally {
      setImpactLoading(false);
    }
  };

  const executeSave = async (payload: SavePayload, scope: PropagationScope) => {
    setSaving(true);
    try {
      if (payload.mode === 'edit' && payload.questionId) {
        const existingQ = allQuestionsInSection.find(q => q._id === payload.questionId);
        await updateQuestion(payload.questionId, {
          questionText:          payload.questionText,
          questionTextSecondary: payload.questionTextSecondary,
          responseType:          payload.responseType,
          displayType:           payload.displayType || undefined,
          options:               payload.options,
          placeholder:           payload.placeholder || undefined,
          sectionHeader:         payload.sectionHeader,
          sectionDescription:    payload.sectionDescription,
          page:                  payload.page,
          hint:                  payload.hint,
          tip:                   payload.tip,
          validation:            { ...(existingQ?.validation || {}), required: payload.required },
          propagation:           scope,
        });
        if (payload.dependency) {
          await updateDependency(payload.questionId, {
            parentExternalId: payload.dependency.parentExternalId,
            operator:         payload.dependency.operator,
            value:            payload.dependency.value,
            propagation:      scope,
          });
        } else if (payload.removeDependency) {
          const q = allQuestionsInSection.find(q2 => q2._id === payload.questionId);
          const parentExtId = q?.visibleIfResolved?.[0]?.parentExternalId;
          if (parentExtId) {
            await updateDependency(payload.questionId, {
              parentExternalId: parentExtId,
              remove: true,
              propagation: scope,
            });
          }
        }
      } else if (payload.mode === 'add' && selectedSection) {
        await addQuestion(solutionId, selectedSection.ecm, selectedSection.code, {
          questionText:          payload.questionText,
          questionTextSecondary: payload.questionTextSecondary,
          responseType:          payload.responseType,
          displayType:           payload.displayType || undefined,
          options:               payload.options,
          placeholder:           payload.placeholder || undefined,
          sectionHeader:         payload.sectionHeader,
          sectionDescription:    payload.sectionDescription,
          page:                  payload.page,
          hint:                  payload.hint,
          tip:                   payload.tip,
          validation:            { required: payload.required },
          propagation:           scope,
        });
      }
      showToast('Saved successfully');
      setPendingSave(null);
      setImpact(null);
      await load();
    } catch (e: any) {
      showToast(e.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImpactConfirm = () => {
    if (!pendingSave) return;
    executeSave(pendingSave.payload, propagation);
  };

  const handleImpactCancel = () => {
    setPendingSave(null);
    setImpact(null);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = (q: EditorQuestion) => {
    const confirmMsg =
      `Delete "${q.questionText.substring(0, 60)}…"?\n\nThis cannot be undone if no submissions exist. Questions with answers in existing submissions cannot be deleted.`;

    if (Platform.OS === 'web') {
      if (!window.confirm(confirmMsg)) return;
      doDelete(q);
    } else {
      Alert.alert('Delete question', confirmMsg, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => doDelete(q) },
      ]);
    }
  };

  const doDelete = async (q: EditorQuestion) => {
    try {
      await deleteQuestion(q._id);
      showToast('Question deleted');
      load();
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
    }
  };

  // ── Reorder ───────────────────────────────────────────────────────────────
  // Optimistic: swap in local state immediately so the UI responds without a reload.
  // Only falls back to a full reload on error.
  const handleMove = async (q: EditorQuestion, dir: -1 | 1) => {
    if (!selectedSection) return;
    const questions = [...allQuestionsInSection];
    const idx    = questions.findIndex(q2 => q2._id === q._id);
    const target = idx + dir;
    if (target < 0 || target >= questions.length) return;
    [questions[idx], questions[target]] = [questions[target], questions[idx]];

    // Update local state immediately (no reload, no scroll reset)
    setDetail(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((sec, i) =>
          i === selectedSectionIdx ? { ...sec, questions } : sec,
        ),
      };
    });

    const extIds = questions.map(q2 => q2.externalId);
    try {
      await reorderQuestions(solutionId, selectedSection.ecm, selectedSection.code, extIds);
    } catch (e: any) {
      showToast(e.message || 'Reorder failed', 'error');
      load(); // revert to server state on error
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading template…</Text>
      </Box>
    );
  }

  if (error || !detail) {
    return (
      <Box style={styles.center}>
        <LucideIcon name="AlertCircle" size={32} color="#ef4444" />
        <Text style={styles.errorText}>{error || 'Template not found'}</Text>
        <Pressable style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </Box>
    );
  }

  // Impact panel overlay
  if (pendingSave && (impact || impactLoading)) {
    return (
      <Box style={styles.impactOverlay}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {impactLoading ? (
            <Box style={styles.center}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Calculating impact…</Text>
            </Box>
          ) : impact ? (
            <ImpactPanel
              impact={impact}
              scope={propagation}
              onScopeChange={setPropagation}
              onConfirm={handleImpactConfirm}
              onCancel={handleImpactCancel}
              isSaving={saving}
            />
          ) : null}
        </ScrollView>
      </Box>
    );
  }

  return (
    <HStack style={styles.root}>
      {/* ── LEFT: Sections sidebar ─────────────────────────────────────── */}
      <ScrollView style={styles.criteriaSidebar} contentContainerStyle={styles.criteriaList}>
        <Text style={styles.criteriaTitle}>SECTIONS ({detail.sections.length})</Text>
        {detail.sections.map((sec, idx) => (
          <Pressable
            key={`${sec.ecm}-${sec.code}`}
            style={[styles.criteriaItem, selectedSectionIdx === idx && styles.criteriaItemActive]}
            onPress={() => { setSelectedIdx(idx); setRightPanel('editor'); }}
          >
            <VStack style={{ flex: 1 }}>
              <Text
                style={[styles.criteriaItemText, selectedSectionIdx === idx && styles.criteriaItemTextActive]}
                numberOfLines={2}
              >
                {sec.name}
              </Text>
              <Text style={styles.sectionCodeLabel}>{sec.ecm} / {sec.code}</Text>
            </VStack>
            <Text style={styles.criteriaQCount}>{sec.questions.length}Q</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── RIGHT: Question editor / Preview ──────────────────────────── */}
      <VStack style={styles.rightPanel}>
        {selectedSection && (
          <>
            {/* Right panel header */}
            <HStack style={styles.rightHeader}>
              <VStack style={{ flex: 1 }}>
                <Text style={styles.rightCriteriaName}>{selectedSection.name}</Text>
                <Text style={styles.rightCriteriaCode}>
                  {selectedSection.ecm} / {selectedSection.code} · {selectedSection.questions.length} questions
                </Text>
              </VStack>

              {/* Toggle editor / preview */}
              <HStack space="xs" style={styles.panelToggle}>
                <Pressable
                  style={[styles.toggleBtn, rightPanel === 'editor' && styles.toggleBtnActive]}
                  onPress={() => setRightPanel('editor')}
                >
                  <LucideIcon name="Edit3" size={14} color={rightPanel === 'editor' ? '#2563eb' : '#9ca3af'} />
                  <Text style={[styles.toggleBtnText, rightPanel === 'editor' && styles.toggleBtnTextActive]}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.toggleBtn, rightPanel === 'preview' && styles.toggleBtnActive]}
                  onPress={() => setRightPanel('preview')}
                >
                  <LucideIcon name="Eye" size={14} color={rightPanel === 'preview' ? '#2563eb' : '#9ca3af'} />
                  <Text style={[styles.toggleBtnText, rightPanel === 'preview' && styles.toggleBtnTextActive]}>Preview</Text>
                </Pressable>
              </HStack>

              {/* Add question */}
              {rightPanel === 'editor' && (
                <Pressable style={styles.addBtn} onPress={openAddModal}>
                  <LucideIcon name="Plus" size={15} color="#fff" />
                  <Text style={styles.addBtnText}>Add question</Text>
                </Pressable>
              )}
            </HStack>

            {/* Right panel content */}
            {rightPanel === 'preview' ? (
              <PreviewPanel questions={allQuestionsInSection} criteriaName={selectedSection.name} />
            ) : (
              <ScrollView contentContainerStyle={styles.editorContent}>
                {headerGroups.map((group, gi) => (
                  <VStack key={gi} style={styles.sectionGroup}>
                    {/* Section header block (visual grouping within the section) */}
                    {group.header && (
                      <Box style={styles.sectionHeaderBlock}>
                        <HStack space="sm" style={{ alignItems: 'center' }}>
                          <LucideIcon name="Heading1" size={14} color="#6b7280" />
                          <Text style={styles.sectionHeaderLabel}>{group.header}</Text>
                        </HStack>
                        {group.description && (
                          <Text style={styles.sectionDescLabel}>{group.description}</Text>
                        )}
                      </Box>
                    )}

                    {/* Questions in this header group */}
                    {group.questions.map((q) => {
                      const globalIdx = allQuestionsInSection.indexOf(q);
                      return (
                        <Box key={q._id} style={styles.questionCard}>
                          <HStack style={styles.questionCardHeader} space="sm">
                            {/* Index */}
                            <Box style={styles.qIndex}>
                              <Text style={styles.qIndexText}>{globalIdx + 1}</Text>
                            </Box>

                            {/* Type badge */}
                            <Box style={[styles.typeBadge, getTypeBadgeStyle(q.responseType)]}>
                              <Text style={[styles.typeBadgeText, getTypeBadgeTextStyle(q.responseType)]}>
                                {q.responseType}
                              </Text>
                            </Box>

                            {/* Conditional badge */}
                            {q.visibleIfResolved && q.visibleIfResolved.length > 0 && (
                              <Box style={styles.condBadge}>
                                <LucideIcon name="Eye" size={10} color="#7c3aed" />
                                <Text style={styles.condBadgeText}>conditional</Text>
                              </Box>
                            )}

                            <Box style={{ flex: 1 }} />

                            {/* Move up/down */}
                            <Pressable
                              style={[styles.iconBtn, globalIdx === 0 && styles.iconBtnDisabled]}
                              onPress={() => handleMove(q, -1)}
                              disabled={globalIdx === 0}
                            >
                              <LucideIcon name="ChevronUp" size={16} color={globalIdx === 0 ? '#d1d5db' : '#6b7280'} />
                            </Pressable>
                            <Pressable
                              style={[styles.iconBtn, globalIdx === allQuestionsInSection.length - 1 && styles.iconBtnDisabled]}
                              onPress={() => handleMove(q, 1)}
                              disabled={globalIdx === allQuestionsInSection.length - 1}
                            >
                              <LucideIcon name="ChevronDown" size={16} color={globalIdx === allQuestionsInSection.length - 1 ? '#d1d5db' : '#6b7280'} />
                            </Pressable>

                            {/* Edit */}
                            <Pressable style={styles.editBtn} onPress={() => openEditModal(q)}>
                              <LucideIcon name="Pencil" size={14} color="#2563eb" />
                              <Text style={styles.editBtnText}>Edit</Text>
                            </Pressable>

                            {/* Delete */}
                            <Pressable style={styles.delBtn} onPress={() => handleDelete(q)}>
                              <LucideIcon name="Trash2" size={15} color="#fff" />
                            </Pressable>
                          </HStack>

                          {/* Question body */}
                          <VStack style={styles.qBody} space="xs">
                            <Text style={styles.qText}>{q.questionText}</Text>
                            {q.questionTextSecondary ? (
                              <Text style={styles.qTextSecondary}>{q.questionTextSecondary}</Text>
                            ) : null}

                            {/* visibleIf */}
                            {q.visibleIfResolved && q.visibleIfResolved.length > 0 && (
                              <Box style={styles.visibleIfChip}>
                                <LucideIcon name="Eye" size={11} color="#7c3aed" />
                                <Text style={styles.visibleIfText}>
                                  Shown when "{q.visibleIfResolved[0].parentQuestionText.substring(0, 50)}" = {q.visibleIfResolved[0].value}
                                </Text>
                              </Box>
                            )}

                            {/* Options pills */}
                            {q.options && q.options.length > 0 && (
                              <HStack style={styles.optionPills} space="xs">
                                {q.options.slice(0, 6).map(opt => (
                                  <Box key={String(opt.value)} style={styles.optionPill}>
                                    <Text style={styles.optionPillText}>{opt.label}</Text>
                                  </Box>
                                ))}
                                {q.options.length > 6 && (
                                  <Box style={styles.optionPill}>
                                    <Text style={styles.optionPillText}>+{q.options.length - 6} more</Text>
                                  </Box>
                                )}
                              </HStack>
                            )}

                            {/* Hint */}
                            {q.hint && (
                              <HStack space="xs" style={{ alignItems: 'center' }}>
                                <LucideIcon name="Info" size={11} color="#9ca3af" />
                                <Text style={styles.hintText}>{q.hint}</Text>
                              </HStack>
                            )}
                          </VStack>
                        </Box>
                      );
                    })}
                  </VStack>
                ))}

                {allQuestionsInSection.length === 0 && (
                  <Box style={styles.emptyState}>
                    <LucideIcon name="FileQuestion" size={40} color="#d1d5db" />
                    <Text style={styles.emptyStateText}>No questions in this section.</Text>
                    <Pressable style={styles.addFirstBtn} onPress={openAddModal}>
                      <LucideIcon name="Plus" size={14} color="#2563eb" />
                      <Text style={styles.addFirstText}>Add the first question</Text>
                    </Pressable>
                  </Box>
                )}
              </ScrollView>
            )}
          </>
        )}
      </VStack>

      {/* ── Edit/Add modal ───────────────────────────────────────────── */}
      <Modal
        visible={!!modalMode}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalMode(null)}
      >
        {modalMode && selectedSection && (
          <QuestionEditModal
            question={editingQuestion}
            section={selectedSection}
            allQuestions={allQuestionsInSection}
            defaultSectionHeader={modalMode === 'add' ? addDefaultSectionHeader : undefined}
            onSave={handleModalSave}
            onCancel={() => setModalMode(null)}
          />
        )}
      </Modal>

      {/* ── Toast ────────────────────────────────────────────────────── */}
      {toast && (
        <Box style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          <LucideIcon name={toast.type === 'error' ? 'XCircle' : 'CheckCircle'} size={16} color="#fff" />
          <Text style={styles.toastText}>{toast.msg}</Text>
        </Box>
      )}
    </HStack>
  );
};

// ── Helpers ────────────────────────────────────────────────────────────────

function getTypeBadgeStyle(type: string): object {
  const colorMap: Record<string, string> = {
    radio: '#dbeafe', multiselect: '#dcfce7', dropdown: '#fef9c3',
    text: '#f3f4f6', textarea: '#f3f4f6', number: '#fff7ed',
    date: '#fdf2f8', slider: '#ecfdf5', matrix: '#fef2f2', file: '#f0fdf4',
  };
  return { backgroundColor: colorMap[type] || '#f3f4f6' };
}

function getTypeBadgeTextStyle(type: string): object {
  const colorMap: Record<string, string> = {
    radio: '#1d4ed8', multiselect: '#15803d', dropdown: '#854d0e',
    text: '#4b5563', textarea: '#4b5563', number: '#9a3412',
    date: '#86198f', slider: '#065f46', matrix: '#991b1b', file: '#14532d',
  };
  return { color: colorMap[type] || '#4b5563' };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6b7280', marginTop: 8 },
  errorText: { fontSize: 14, color: '#ef4444', textAlign: 'center' },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 9, backgroundColor: '#2563eb', borderRadius: 8 },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  // Criteria sidebar
  criteriaSidebar: { width: 220, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#e5e7eb' },
  criteriaList: { padding: 12, gap: 4 },
  criteriaTitle: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, paddingHorizontal: 8, paddingBottom: 8 },
  criteriaItem: { paddingHorizontal: 10, paddingVertical: 9, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  criteriaItemActive: { backgroundColor: '#eff6ff' },
  criteriaItemText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 18 },
  criteriaItemTextActive: { color: '#1d4ed8', fontWeight: '600' },
  sectionCodeLabel: { fontSize: 10, color: '#9ca3af', marginTop: 1 },
  criteriaQCount: { fontSize: 11, color: '#9ca3af', fontWeight: '600', alignSelf: 'flex-start', paddingTop: 2 },

  // Right panel
  rightPanel: { flex: 1 },
  rightHeader: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#fff', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  rightCriteriaName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  rightCriteriaCode: { fontSize: 12, color: '#9ca3af' },
  panelToggle: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 3 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  toggleBtnText: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  toggleBtnTextActive: { color: '#2563eb' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#2563eb', borderRadius: 8 },
  addBtnText: { fontSize: 13, color: '#fff', fontWeight: '600' },

  // Editor content
  editorContent: { padding: 16, gap: 16 },
  sectionGroup: { gap: 10 },
  sectionHeaderBlock: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: '#2563eb', gap: 4 },
  sectionHeaderLabel: { fontSize: 13, fontWeight: '700', color: '#374151' },
  sectionDescLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  // Question card
  questionCard: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' },
  questionCardHeader: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', alignItems: 'center', backgroundColor: '#fafafa' },
  qIndex: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  qIndexText: { fontSize: 11, fontWeight: '700', color: '#6b7280' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  typeBadgeText: { fontSize: 11, fontWeight: '600' },
  condBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, backgroundColor: '#f5f3ff' },
  condBadgeText: { fontSize: 10, color: '#7c3aed', fontWeight: '600' },
  iconBtn: { padding: 5, borderRadius: 6, backgroundColor: '#f3f4f6' },
  iconBtnDisabled: { opacity: 0.3 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7, borderWidth: 1, borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  editBtnText: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  delBtn: { padding: 7, borderRadius: 7, backgroundColor: '#ef4444' },
  qBody: { padding: 12 },
  qText: { fontSize: 14, color: '#111827', lineHeight: 20, fontWeight: '500' },
  qTextSecondary: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic' },
  visibleIfChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10, backgroundColor: '#f5f3ff', alignSelf: 'flex-start' },
  visibleIfText: { fontSize: 11, color: '#7c3aed' },
  optionPills: { flexWrap: 'wrap', marginTop: 2 },
  optionPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' },
  optionPillText: { fontSize: 11, color: '#1d4ed8' },
  hintText: { fontSize: 11, color: '#9ca3af', fontStyle: 'italic' },

  // Empty state
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyStateText: { fontSize: 14, color: '#9ca3af' },
  addFirstBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#2563eb' },
  addFirstText: { fontSize: 13, color: '#2563eb', fontWeight: '600' },

  // Impact overlay
  impactOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 100 },

  // Toast
  toast: { position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, zIndex: 200 },
  toastSuccess: { backgroundColor: '#16a34a' },
  toastError: { backgroundColor: '#dc2626' },
  toastText: { flex: 1, fontSize: 13, color: '#fff', fontWeight: '500' },
});

export default TemplateEditor;
