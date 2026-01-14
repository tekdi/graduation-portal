import { StyleSheet } from 'react-native';
import { theme } from '@config/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: theme.tokens.colors.white,
    },
    headerContainer: {
        marginBottom: 32,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
    pageTitle: {
        marginBottom: 8,
    },

    // Section Styles
    sectionContainer: {
        borderWidth: 1,
        borderColor: theme.tokens.colors.gray300,
        borderRadius: 8,
        padding: 24,
        marginBottom: 32,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: theme.tokens.colors.white,
    },
    innerSectionContainer: {
        borderWidth: 1,
        borderColor: theme.tokens.colors.gray300,
        borderRadius: 8,
        padding: 24,
        marginTop: 20,
        width: '100%',
    },
    sectionHeader: {
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontWeight: '600',
    },
    sectionSubtitle: {
        marginTop: 4,
    },

    // Hierarchy Grid
    hierarchyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        width: '100%',
    },
    hierarchyCard: {
        flex: 1,
        minWidth: 260,
    },

    // Card Specifics
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.tokens.colors.white,
    },

    // Permission Blocks
    permissionBlock: {
        padding: 16,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
    },
    permissionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    listContainer: {
        gap: 4,
        paddingLeft: 4,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    listItemText: {
        flex: 1,
        fontSize: 13,
        color: theme.tokens.colors.textSecondary,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.tokens.colors.textSecondary,
        marginTop: 6, // Align regarding line height
    },

    // Section 2: Requirements
    requirementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 32, // Reduced gap
        marginTop: 16,
    },
    requirementColumn: {
        flex: 1,
        minWidth: 260,
    },
    columnTitle: {
        marginBottom: 12,
        fontWeight: '600',
    },
});
