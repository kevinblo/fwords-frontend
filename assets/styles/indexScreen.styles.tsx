import {StyleSheet} from "react-native";
import Colors from "@/constants/Colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    containerDark: {
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 100, // Add space for the header
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
    },
    loadingContainerDark: {
        backgroundColor: Colors.dark.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    errorContainerDark: {
        backgroundColor: Colors.dark.background,
    },
    errorText: {
        fontSize: 16,
        color: Colors.error,
        marginBottom: 16,
        textAlign: 'center',
    },
    errorTextDark: {
        color: Colors.error,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    statsCard: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statsCardDark: {
        backgroundColor: Colors.dark.card,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
    },
    statsTitleDark: {
        color: Colors.dark.text,
    },
    statsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: Colors.primary,
        marginBottom: 4,
    },
    statValueDark: {
        color: Colors.accent,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
        textAlign: 'center',
    },
    statLabelDark: {
        color: Colors.gray[400],
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.gray[300],
        marginHorizontal: 8,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
    },
    sectionTitleDark: {
        color: Colors.dark.text,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.primary,
        marginRight: 4,
    },
    languagesContainer: {
        paddingRight: 16,
    },
    addLanguageCard: {
        width: 140,
        height: 180,
        backgroundColor: Colors.gray[100],
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginRight: 16,
        borderWidth: 2,
        borderColor: Colors.gray[200],
        borderStyle: 'dashed',
    },
    addLanguageCardDark: {
        backgroundColor: Colors.gray[800],
        borderColor: Colors.gray[700],
    },
    addLanguageText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.gray[700],
        textAlign: 'center',
        marginTop: 8,
    },
    addLanguageTextDark: {
        color: Colors.gray[300],
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickStartCard: {
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        marginTop: 12,
    },
    quickStartCardDark: {
        backgroundColor: Colors.dark.card,
    },
    quickStartContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quickStartTextContainer: {
        marginLeft: 12,
    },
    quickStartTitle: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    quickStartTitleDark: {
        color: Colors.dark.text,
    },
    quickStartDescription: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
    },
    quickStartDescriptionDark: {
        color: Colors.gray[400],
    },
});

export default styles;
