/**
 * ObservationEditor – List Screen
 * Shows all observation templates (no child instances).
 * Filter: All | Project-linked | Standalone
 */
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { VStack, HStack, Box, Text, Pressable } from '@ui';
import { LucideIcon } from '@ui/index';
import TitleHeader from '@components/TitleHeader';
import { useNavigation } from '@react-navigation/native';
import { getSolutions } from '../../services/questionEditorService';
import type { TemplateSolution } from './types';
import { theme } from '@config/theme';

type FilterType = 'all' | 'project' | 'standalone';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Project-linked', value: 'project' },
  { label: 'Standalone', value: 'standalone' },
];

const ObservationEditorScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [solutions, setSolutions] = useState<TemplateSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (f: FilterType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSolutions(f);
      setSolutions(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filter); }, [filter, load]);

  const handleFilterChange = (f: FilterType) => {
    setFilter(f);
  };

  const handleSelect = (sol: TemplateSolution) => {
    navigation.navigate('observation-editor-detail', { solutionId: sol._id, solutionName: sol.name });
  };

  return (
    <VStack style={styles.root}>
      <TitleHeader
        title="admin.menu.observationEditor"
        description="admin.observationEditor.description"
      />

      {/* Filter tabs */}
      <HStack style={styles.filterRow} space="sm">
        {FILTERS.map(f => (
          <Pressable
            key={f.value}
            style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
            onPress={() => handleFilterChange(f.value)}
          >
            <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </HStack>

      <ScrollView contentContainerStyle={styles.listContent}>
        {loading ? (
          <Box style={styles.centeredBox}>
            <ActivityIndicator size="large" color={theme.tokens.colors.primary500 || '#2563eb'} />
            <Text style={styles.loadingText}>Loading templates…</Text>
          </Box>
        ) : error ? (
          <Box style={styles.centeredBox}>
            <LucideIcon name="AlertCircle" size={32} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={() => load(filter)}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </Box>
        ) : solutions.length === 0 ? (
          <Box style={styles.centeredBox}>
            <LucideIcon name="FileX" size={40} color="#9ca3af" />
            <Text style={styles.emptyText}>No templates found</Text>
          </Box>
        ) : (
          solutions.map(sol => (
            <Pressable key={sol._id} style={styles.card} onPress={() => handleSelect(sol)}>
              <HStack style={styles.cardInner} space="md">
                {/* Icon column */}
                <Box style={[
                  styles.iconBox,
                  sol.templateType === 'project' ? styles.iconBoxProject : styles.iconBoxStandalone,
                ]}>
                  <LucideIcon
                    name={sol.templateType === 'project' ? 'Briefcase' : 'ClipboardList'}
                    size={22}
                    color={sol.templateType === 'project' ? '#7c3aed' : '#2563eb'}
                  />
                </Box>

                {/* Content */}
                <VStack style={styles.cardContent} space="xs">
                  <Text style={styles.cardTitle}>{sol.name}</Text>

                  <HStack space="sm" style={styles.metaRow}>
                    <Box style={[
                      styles.badge,
                      sol.templateType === 'project' ? styles.badgeProject : styles.badgeStandalone,
                    ]}>
                      <Text style={[
                        styles.badgeText,
                        sol.templateType === 'project' ? styles.badgeTextProject : styles.badgeTextStandalone,
                      ]}>
                        {sol.templateType === 'project' ? 'Project-linked' : 'Standalone'}
                      </Text>
                    </Box>

                    {sol.programName ? (
                      <Text style={styles.metaText}>{sol.programName}</Text>
                    ) : null}
                  </HStack>

                  <HStack space="md" style={styles.statsRow}>
                    <HStack space="xs" style={styles.statItem}>
                      <LucideIcon name="Copy" size={13} color="#6b7280" />
                      <Text style={styles.statText}>{sol.childCount} instance{sol.childCount !== 1 ? 's' : ''}</Text>
                    </HStack>
                    {sol.entityType ? (
                      <HStack space="xs" style={styles.statItem}>
                        <LucideIcon name="Tag" size={13} color="#6b7280" />
                        <Text style={styles.statText}>{sol.entityType}</Text>
                      </HStack>
                    ) : null}
                  </HStack>
                </VStack>

                {/* Arrow */}
                <Box style={styles.arrow}>
                  <LucideIcon name="ChevronRight" size={20} color="#9ca3af" />
                </Box>
              </HStack>
            </Pressable>
          ))
        )}
      </ScrollView>
    </VStack>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9fafb' },
  filterRow: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  filterTab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f3f4f6' },
  filterTabActive: { backgroundColor: '#2563eb' },
  filterTabText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  filterTabTextActive: { color: '#fff' },
  listContent: { padding: 16, gap: 12 },
  centeredBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  loadingText: { color: '#6b7280', fontSize: 14, marginTop: 8 },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 15, marginTop: 8 },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#2563eb', borderRadius: 8, marginTop: 4 },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' },
  cardInner: { padding: 16, alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconBoxProject: { backgroundColor: '#ede9fe' },
  iconBoxStandalone: { backgroundColor: '#dbeafe' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  metaRow: { alignItems: 'center', flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeProject: { backgroundColor: '#ede9fe' },
  badgeStandalone: { backgroundColor: '#dbeafe' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  badgeTextProject: { color: '#7c3aed' },
  badgeTextStandalone: { color: '#2563eb' },
  metaText: { fontSize: 12, color: '#6b7280' },
  statsRow: { alignItems: 'center', marginTop: 2 },
  statItem: { alignItems: 'center' },
  statText: { fontSize: 12, color: '#6b7280' },
  arrow: { paddingLeft: 8 },
});

export default ObservationEditorScreen;
