/**
 * ImpactPanel – shown before any save operation.
 * Displays impact counts and lets admin choose propagation scope.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { VStack, HStack, Box, Text, Pressable } from '@ui';
import { LucideIcon } from '@ui/index';
import type { ImpactData, PropagationScope } from '../types';

interface Props {
  impact: ImpactData;
  scope: PropagationScope;
  onScopeChange: (s: PropagationScope) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const ImpactPanel: React.FC<Props> = ({ impact, scope, onScopeChange, onConfirm, onCancel, isSaving }) => {
  return (
    <VStack style={styles.container} space="lg">
      <HStack space="sm" style={styles.header}>
        <LucideIcon name="AlertTriangle" size={20} color="#d97706" />
        <Text style={styles.title}>Before you save — impact summary</Text>
      </HStack>

      {/* Impact stats */}
      <Box style={styles.statsGrid}>
        <StatRow icon="Copy" label="Child solution instances" value={impact.childSolutions} />
        <StatRow icon="Briefcase" label="Project-linked instances" value={impact.projectLinkedChildren} color="#7c3aed" />
        <StatRow icon="ClipboardList" label="Standalone instances" value={impact.standaloneChildren} color="#2563eb" />
        <StatRow icon="Eye" label="Active observations" value={impact.observations} />
        <StatRow icon="Pencil" label="In-progress submissions" value={impact.inProgressSubmissions} color="#d97706" />
        <StatRow icon="CheckCircle" label="Completed submissions" value={impact.completedSubmissions} color="#16a34a" note="(unaffected)" />
      </Box>

      {/* Propagation scope choice */}
      <VStack space="sm">
        <Text style={styles.sectionLabel}>Apply changes to:</Text>

        <ScopeOption
          value="templateAndFirst"
          selected={scope === 'templateAndFirst'}
          onSelect={onScopeChange}
          title="Template + active child solution"
          description="Updates the template and the current child solution (standalone: the one shared instance; project-linked: all direct children). In-progress submissions will see the change on next load."
          icon="Layers"
        />

        <ScopeOption
          value="allInProgress"
          selected={scope === 'allInProgress'}
          onSelect={onScopeChange}
          title="All in-progress submissions"
          description={`Updates the template and all ${impact.inProgressSubmissions} in-progress submissions across every instance. Completed submissions are never touched.`}
          icon="Globe"
          warning={impact.inProgressSubmissions > 50}
        />
      </VStack>

      {/* Action buttons */}
      <HStack space="md" style={styles.actions}>
        <Pressable style={styles.cancelBtn} onPress={onCancel} disabled={isSaving}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.confirmBtn, isSaving && styles.disabledBtn]} onPress={onConfirm} disabled={isSaving}>
          <HStack space="sm" style={styles.confirmInner}>
            {isSaving
              ? <LucideIcon name="Loader" size={16} color="#fff" />
              : <LucideIcon name="Save" size={16} color="#fff" />
            }
            <Text style={styles.confirmText}>{isSaving ? 'Saving…' : 'Confirm & save'}</Text>
          </HStack>
        </Pressable>
      </HStack>
    </VStack>
  );
};

const StatRow: React.FC<{ icon: string; label: string; value: number; color?: string; note?: string }> = ({ icon, label, value, color = '#374151', note }) => (
  <HStack style={styles.statRow} space="sm">
    <LucideIcon name={icon} size={15} color={color} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}{note ? ` ${note}` : ''}</Text>
  </HStack>
);

const ScopeOption: React.FC<{
  value: PropagationScope;
  selected: boolean;
  onSelect: (v: PropagationScope) => void;
  title: string;
  description: string;
  icon: string;
  warning?: boolean;
}> = ({ value, selected, onSelect, title, description, icon, warning }) => (
  <Pressable
    style={[styles.scopeOption, selected && styles.scopeOptionSelected]}
    onPress={() => onSelect(value)}
  >
    <HStack space="sm" style={styles.scopeHeader}>
      <Box style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <Box style={styles.radioInner} />}
      </Box>
      <LucideIcon name={icon} size={16} color={selected ? '#2563eb' : '#6b7280'} />
      <Text style={[styles.scopeTitle, selected && styles.scopeTitleSelected]}>{title}</Text>
    </HStack>
    <Text style={styles.scopeDesc}>{description}</Text>
    {warning && (
      <HStack space="xs" style={styles.warningRow}>
        <LucideIcon name="AlertTriangle" size={13} color="#d97706" />
        <Text style={styles.warningText}>Large number of submissions — this may affect many users</Text>
      </HStack>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statsGrid: { backgroundColor: '#f9fafb', borderRadius: 10, padding: 14, gap: 8 },
  statRow: { alignItems: 'center' },
  statLabel: { flex: 1, fontSize: 13, color: '#374151' },
  statValue: { fontSize: 13, fontWeight: '600' },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 2 },
  scopeOption: {
    borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 10,
    padding: 14, gap: 8, backgroundColor: '#fff',
  },
  scopeOptionSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  scopeHeader: { alignItems: 'center' },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2,
    borderColor: '#9ca3af', alignItems: 'center', justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#2563eb' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb' },
  scopeTitle: { fontSize: 14, fontWeight: '600', color: '#374151', flex: 1 },
  scopeTitleSelected: { color: '#1d4ed8' },
  scopeDesc: { fontSize: 12, color: '#6b7280', lineHeight: 18, paddingLeft: 26 },
  warningRow: { alignItems: 'center', paddingLeft: 26, marginTop: 2 },
  warningText: { fontSize: 12, color: '#d97706' },
  actions: { justifyContent: 'flex-end', marginTop: 4 },
  cancelBtn: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db' },
  cancelText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  confirmBtn: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 8, backgroundColor: '#2563eb' },
  confirmInner: { alignItems: 'center' },
  confirmText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  disabledBtn: { opacity: 0.6 },
});

export default ImpactPanel;
