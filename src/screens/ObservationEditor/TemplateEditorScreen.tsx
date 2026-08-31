/**
 * TemplateEditorScreen – navigation wrapper for TemplateEditor.
 * Reads solutionId / solutionName from route params and renders the editor.
 * Provides a breadcrumb header with a back button.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { VStack, HStack, Text, Pressable } from '@ui';
import { LucideIcon } from '@ui/index';
import TemplateEditor from './TemplateEditor';

const TemplateEditorScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { solutionId, solutionName } = (route.params || {}) as {
    solutionId: string;
    solutionName: string;
  };

  return (
    <VStack style={styles.root}>
      {/* Breadcrumb / back header */}
      <HStack style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <LucideIcon name="ArrowLeft" size={16} color="#2563eb" />
          <Text style={styles.backText}>Templates</Text>
        </Pressable>
        <Text style={styles.separator}>/</Text>
        <Text style={styles.title} numberOfLines={1}>
          {solutionName || 'Template Editor'}
        </Text>
      </HStack>

      {/* Main editor (fills remaining height) */}
      <TemplateEditor solutionId={solutionId} solutionName={solutionName} />
    </VStack>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  backText: { fontSize: 13, color: '#2563eb', fontWeight: '500' },
  separator: { fontSize: 13, color: '#d1d5db' },
  title: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
});

export default TemplateEditorScreen;
