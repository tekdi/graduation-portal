import { StyleSheet, Platform, Dimensions } from 'react-native';
import { theme } from '@config/theme';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 7,
        backgroundColor: '#fff',
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
    pageSubtitle: {},

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
    },
    sectionTitle: {
        marginBottom: 4,
    },
    sectionSubtitle: {
        marginBottom: 24,
    },

    // Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        paddingHorizontal: 0,
    },

    // Card Styles
    cardContainer: {
        // Visual styles removed to use Gluestack props for hover support
        // Responsive width logic
        width: Platform.OS === 'web' ? '31%' : '100%',
        marginRight: 0,
        marginBottom: 12,
        minWidth: 280,
    },
    cardHeader: {},
    cardTitle: {
        flex: 1,
        marginRight: 8,
    },
    cardDescription: {
        marginBottom: 16,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.tokens.colors.gray300,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    downloadButtonText: {
        marginLeft: 8,
    },

    // Guidelines Section
    guidelinesContainer: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 24,
        marginTop: 16,
    },
    guidelinesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    guidelinesTitle: {
        marginLeft: 8,
    },
    guidelineItem: {
        marginBottom: 8,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.tokens.colors.textSecondary,
        marginTop: 8,
    },
    guidelineText: {
        flex: 1,
    },
});
