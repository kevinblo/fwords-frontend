import {StyleSheet} from "react-native";
import Colors from "@/constants/Colors";

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
        marginBottom: 20,
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
    progressContainer: {
        marginBottom: 24,
    },
    progressText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.gray[600],
        marginBottom: 8,
    },
    progressTextDark: {
        color: Colors.gray[400],
    },
    scrollContent: {
        flexGrow: 1,
    },
    questionCard: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    questionCardDark: {
        backgroundColor: Colors.dark.card,
    },
    questionText: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
        marginBottom: 24,
    },
    questionTextDark: {
        color: Colors.dark.text,
    },
    answersContainer: {
        width: '100%',
    },
    answerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.gray[100],
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.gray[200],
    },
    answerButtonDark: {
        backgroundColor: Colors.gray[800],
        borderColor: Colors.gray[700],
    },
    selectedAnswerButton: {
        backgroundColor: Colors.primary + '20',
        borderColor: Colors.primary,
    },
    selectedAnswerButtonDark: {
        backgroundColor: Colors.primary + '30',
        borderColor: Colors.primary,
    },
    correctAnswerButton: {
        backgroundColor: Colors.success + '20',
        borderColor: Colors.success,
    },
    incorrectAnswerButton: {
        backgroundColor: Colors.error + '20',
        borderColor: Colors.error,
    },
    answerText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: Colors.light.text,
        flex: 1,
    },
    answerTextDark: {
        color: Colors.dark.text,
    },
    selectedAnswerText: {
        color: Colors.primary,
        fontFamily: 'Inter-Medium',
    },
    correctAnswerText: {
        color: Colors.success,
        fontFamily: 'Inter-Medium',
    },
    incorrectAnswerText: {
        color: Colors.error,
        fontFamily: 'Inter-Medium',
    },
    actionsContainer: {
        marginTop: 'auto',
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: Colors.gray[300],
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#FFFFFF',
    },
    nextButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#FFFFFF',
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    resultTitle: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: Colors.light.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    resultTitleDark: {
        color: Colors.dark.text,
    },
    scoreCard: {
        width: '100%',
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 32,
    },
    scoreCardDark: {
        backgroundColor: Colors.dark.card,
    },
    scoreLabel: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: Colors.gray[600],
        marginBottom: 8,
    },
    scoreLabelDark: {
        color: Colors.gray[400],
    },
    scoreValue: {
        fontSize: 48,
        fontFamily: 'Inter-Bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    scoreValueDark: {
        color: Colors.accent,
    },
    scoreDetails: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
        marginBottom: 24,
    },
    scoreDetailsDark: {
        color: Colors.gray[400],
    },
    resultProgressBar: {
        width: '100%',
        marginBottom: 16,
    },
    feedbackText: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
        marginTop: 8,
    },
    feedbackTextDark: {
        color: Colors.dark.text,
    },
    finishButton: {
        backgroundColor: Colors.primary,
        width: '100%',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#FFFFFF',
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


