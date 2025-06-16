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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: Colors.light.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    headerDark: {
        backgroundColor: Colors.dark.background,
        borderBottomColor: Colors.dark.border,
    },
    backButton: {
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
    content: {
        flex: 1,
        padding: 16,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    languageItemDark: {
        backgroundColor: Colors.dark.card,
        borderColor: Colors.dark.border,
    },
    languageItemLevel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    languageItemDarkLevel: {
        backgroundColor: Colors.dark.card,
        borderColor: Colors.dark.border,
    },
    selectedItem: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10',
    },
    selectedItemDark: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '20',
    },
    languageName: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: Colors.light.text,
    },
    languageNameDark: {
        color: Colors.dark.text,
    },
    languageLevel: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        marginBottom: 10,
        color: Colors.light.text,
    },
    languageLevelDark: {
        color: Colors.dark.text,
    },
    selectedText: {
        color: Colors.primary,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
        marginBottom: 20,
        lineHeight: 20,
    },
    descriptionDark: {
        color: Colors.gray[400],
    },
});

export default styles;
