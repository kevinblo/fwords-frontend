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
        marginBottom: 16,
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
    modeContainer: {
        marginBottom: 24,
    },
    modesGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modeCard: {
        width: '31%',
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    modeCardDark: {
        backgroundColor: Colors.dark.card,
    },
    modeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    modeTitle: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    modeTitleDark: {
        color: Colors.dark.text,
    },
    modeDescription: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
    },
    modeDescriptionDark: {
        color: Colors.gray[400],
    },
    quizzesContainer: {
        marginBottom: 24,
    },
    statsCard: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statsCardDark: {
        backgroundColor: Colors.dark.card,
    },
    statsTitle: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
        marginBottom: 16,
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
    errorText: {
        fontSize: 16,
        color: Colors.error,
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default styles;
