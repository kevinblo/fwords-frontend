import {StyleSheet} from "react-native";
import Colors from "@/constants/Colors";
import {useTheme} from "@/context/ThemeContext";
const { theme } = useTheme();
const isDark = theme === 'dark';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 16,
    },
    containerDark: {
        backgroundColor: Colors.dark.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 30,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
    },
    headerTitleDark: {
        color: Colors.dark.text,
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    card: {
        width: '100%',
        height: 400,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    cardFront: {
        backgroundColor: Colors.light.card,
    },
    cardFrontDark: {
        backgroundColor: Colors.dark.card,
    },
    cardBack: {
        backgroundColor: Colors.light.card,
    },
    cardBackDark: {
        backgroundColor: Colors.dark.card,
    },
    originalWord: {
        fontSize: 32,
        fontFamily: 'Inter-Bold',
        color: Colors.light.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    originalWordDark: {
        color: Colors.dark.text,
    },
    transcription: {
        fontSize: 18,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
        marginBottom: 24,
        textAlign: 'center',
    },
    transcriptionDark: {
        color: Colors.gray[400],
    },
    audioButton: {
        backgroundColor: isDark ? Colors.dark.card : Colors.gray[100],
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    tapHint: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[500],
        marginTop: 24,
    },
    tapHintDark: {
        color: Colors.gray[500],
    },
    flipButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: Colors.gray[100],
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipButtonDark: {
        backgroundColor: Colors.gray[800],
    },
    translationTitle: {
        fontSize: 18,
        fontFamily: 'Inter-Medium',
        color: Colors.gray[600],
        marginBottom: 16,
    },
    translationTitleDark: {
        color: Colors.gray[400],
    },
    translationText: {
        fontSize: 32,
        fontFamily: 'Inter-Bold',
        color: Colors.light.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    translationTextDark: {
        color: Colors.dark.text,
    },
    exampleContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: Colors.gray[100],
        borderRadius: 12,
        marginBottom: 16,
    },
    exampleTitle: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.gray[700],
        marginBottom: 8,
    },
    exampleTitleDark: {
        color: Colors.gray[300],
    },
    exampleText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[800],
        fontStyle: 'italic',
    },
    exampleTextDark: {
        color: Colors.gray[200],
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        height: 56,
        borderRadius: 12,
    },
    unknownButton: {
        backgroundColor: Colors.error,
    },
    knownButton: {
        backgroundColor: Colors.success,
    },
    actionButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    hintText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[500],
        textAlign: 'center',
        marginBottom: 16,
    },
    hintTextDark: {
        color: Colors.gray[600],
    },
    errorText: {
        fontSize: 16,
        color: Colors.error,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorTextDark: {
        color: Colors.error,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    backButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#FFFFFF',
        marginLeft: 8,
    },
});

export default styles;
