/**
 * PreviewPanel – approximate form preview.
 * Renders questions grouped by sectionHeader, respecting visibleIf conditions
 * based on currently selected answers in the preview.
 *
 * Note: this is an approximation of the mobile form. Matrix types and media
 * capture are shown as placeholders.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { VStack, HStack, Box, Text, Pressable } from '@ui';
import { LucideIcon } from '@ui/index';
import type { EditorQuestion } from '../types';

interface Props {
  questions: EditorQuestion[];
  criteriaName: string;
}

const PreviewPanel: React.FC<Props> = ({ questions, criteriaName }) => {
  // Simulated answers: externalId → selected value(s)
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const setAnswer = (externalId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [externalId]: value }));
  };

  // Determine if a question is visible based on its visibleIf
  const isVisible = (q: EditorQuestion): boolean => {
    if (!q.visibleIfResolved || q.visibleIfResolved.length === 0) return true;
    return q.visibleIfResolved.every(cond => {
      const parentAnswer = answers[cond.parentExternalId];
      if (cond.operator === '===') return String(parentAnswer) === String(cond.value);
      if (cond.operator === '!==') return String(parentAnswer) !== String(cond.value);
      if (cond.operator === 'includes') {
        return Array.isArray(parentAnswer)
          ? parentAnswer.includes(cond.value)
          : String(parentAnswer).includes(cond.value);
      }
      return true;
    });
  };

  // Group visible questions by sectionHeader
  const visibleQuestions = questions.filter(isVisible);
  const groups: { header: string | null; description: string | null; questions: EditorQuestion[] }[] = [];
  for (const q of visibleQuestions) {
    const last = groups[groups.length - 1];
    if (!last || last.header !== (q.sectionHeader || null)) {
      groups.push({ header: q.sectionHeader || null, description: q.sectionDescription || null, questions: [q] });
    } else {
      last.questions.push(q);
    }
  }

  return (
    <VStack style={styles.container}>
      {/* Preview banner */}
      <HStack style={styles.banner} space="sm">
        <LucideIcon name="Eye" size={14} color="#7c3aed" />
        <Text style={styles.bannerText}>
          Preview — approximate. Interact to test conditional logic.
        </Text>
      </HStack>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.criteriaName}>{criteriaName}</Text>

        {groups.map((group, gi) => (
          <VStack key={gi} style={styles.group} space="md">
            {group.header && (
              <VStack space="xs" style={styles.sectionHeaderBlock}>
                <Text style={styles.sectionHeader}>{group.header}</Text>
                {group.description ? (
                  <Text style={styles.sectionDesc}>{group.description}</Text>
                ) : null}
              </VStack>
            )}

            {group.questions.map((q) => (
              <QuestionPreview key={q._id} q={q} answer={answers[q.externalId]} onAnswer={setAnswer} />
            ))}
          </VStack>
        ))}

        {visibleQuestions.length === 0 && (
          <Box style={styles.empty}>
            <LucideIcon name="Eye" size={32} color="#d1d5db" />
            <Text style={styles.emptyText}>No questions to preview</Text>
          </Box>
        )}
      </ScrollView>
    </VStack>
  );
};

// ── Individual question renderer ────────────────────────────────────────────

const QuestionPreview: React.FC<{
  q: EditorQuestion;
  answer: any;
  onAnswer: (id: string, val: any) => void;
}> = ({ q, answer, onAnswer }) => {
  return (
    <VStack style={styles.questionCard} space="sm">
      <HStack space="sm" style={{ alignItems: 'flex-start' }}>
        <Box style={styles.qTypeBadge}>
          <Text style={styles.qTypeBadgeText}>{q.responseType}</Text>
        </Box>
        {q.visibleIfResolved && q.visibleIfResolved.length > 0 && (
          <Box style={styles.condBadge}>
            <LucideIcon name="Eye" size={10} color="#7c3aed" />
            <Text style={styles.condBadgeText}>conditional</Text>
          </Box>
        )}
      </HStack>

      <Text style={styles.qText}>{q.questionText}</Text>
      {q.questionTextSecondary ? (
        <Text style={styles.qTextSecondary}>{q.questionTextSecondary}</Text>
      ) : null}
      {q.hint ? <Text style={styles.qHint}>{q.hint}</Text> : null}

      {/* Input based on type */}
      {renderInput(q, answer, onAnswer)}
    </VStack>
  );
};

function renderInput(q: EditorQuestion, answer: any, onAnswer: (id: string, val: any) => void) {
  switch (q.responseType) {
    case 'radio':
    case 'dropdown':
      return (
        <VStack space="xs">
          {(q.options || []).map(opt => (
            <Pressable
              key={String(opt.value)}
              style={[styles.radioOption, String(answer) === String(opt.value) && styles.radioOptionSelected]}
              onPress={() => onAnswer(q.externalId, String(opt.value))}
            >
              <Box style={[styles.radioCircle, String(answer) === String(opt.value) && styles.radioCircleSelected]}>
                {String(answer) === String(opt.value) && <Box style={styles.radioDot} />}
              </Box>
              <Text style={styles.radioLabel}>{opt.label}</Text>
            </Pressable>
          ))}
        </VStack>
      );

    case 'multiselect':
    case 'checkbox':
      return (
        <VStack space="xs">
          {(q.options || []).map(opt => {
            const selected = Array.isArray(answer) && answer.includes(String(opt.value));
            return (
              <Pressable
                key={String(opt.value)}
                style={[styles.radioOption, selected && styles.radioOptionSelected]}
                onPress={() => {
                  const cur = Array.isArray(answer) ? answer : [];
                  const next = selected ? cur.filter(v => v !== String(opt.value)) : [...cur, String(opt.value)];
                  onAnswer(q.externalId, next);
                }}
              >
                <Box style={[styles.checkBox, selected && styles.checkBoxSelected]}>
                  {selected && <LucideIcon name="Check" size={12} color="#fff" />}
                </Box>
                <Text style={styles.radioLabel}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </VStack>
      );

    case 'text':
    case 'textarea':
      return (
        <RNTextInput
          style={q.responseType === 'textarea' ? styles.previewTextArea : styles.previewInput}
          value={answer || ''}
          onChangeText={v => onAnswer(q.externalId, v)}
          placeholder="Type your answer…"
          multiline={q.responseType === 'textarea'}
          numberOfLines={q.responseType === 'textarea' ? 3 : 1}
          textAlignVertical={q.responseType === 'textarea' ? 'top' : 'center'}
        />
      );

    case 'number':
      return (
        <RNTextInput
          style={styles.previewInput}
          value={answer != null ? String(answer) : ''}
          onChangeText={v => onAnswer(q.externalId, v)}
          placeholder="Enter number…"
          keyboardType="numeric"
        />
      );

    case 'date':
      return (
        <Box style={styles.placeholderInput}>
          <LucideIcon name="Calendar" size={16} color="#9ca3af" />
          <Text style={styles.placeholderText}>Date picker (mobile only)</Text>
        </Box>
      );

    case 'matrix':
      return (
        <Box style={styles.placeholderInput}>
          <LucideIcon name="Grid" size={16} color="#9ca3af" />
          <Text style={styles.placeholderText}>Matrix (rendered on mobile)</Text>
        </Box>
      );

    case 'file':
      return (
        <Box style={styles.placeholderInput}>
          <LucideIcon name="Paperclip" size={16} color="#9ca3af" />
          <Text style={styles.placeholderText}>File upload (mobile only)</Text>
        </Box>
      );

    default:
      return (
        <Box style={styles.placeholderInput}>
          <Text style={styles.placeholderText}>{q.responseType} — not previewable</Text>
        </Box>
      );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  banner: { alignItems: 'center', padding: 10, backgroundColor: '#faf5ff', borderBottomWidth: 1, borderBottomColor: '#e9d5ff' },
  bannerText: { fontSize: 12, color: '#7c3aed', flex: 1 },
  scroll: { padding: 16, gap: 20 },
  criteriaName: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  group: { gap: 12 },
  sectionHeaderBlock: { paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionDesc: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
  questionCard: { backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  qTypeBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, backgroundColor: '#f3f4f6' },
  qTypeBadgeText: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  condBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, backgroundColor: '#f5f3ff' },
  condBadgeText: { fontSize: 10, color: '#7c3aed', fontWeight: '600' },
  qText: { fontSize: 14, fontWeight: '500', color: '#111827', lineHeight: 20 },
  qTextSecondary: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic' },
  qHint: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  radioOptionSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: '#2563eb' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb' },
  radioLabel: { fontSize: 13, color: '#374151' },
  checkBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  checkBoxSelected: { borderColor: '#2563eb', backgroundColor: '#2563eb' },
  previewInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: '#111827', backgroundColor: '#fff' },
  previewTextArea: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: '#111827', backgroundColor: '#fff', minHeight: 72 },
  placeholderInput: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, backgroundColor: '#f9fafb', borderStyle: 'dashed' },
  placeholderText: { fontSize: 12, color: '#9ca3af' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
});

export default PreviewPanel;
