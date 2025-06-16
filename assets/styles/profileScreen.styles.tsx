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
    profileCard: {
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
    profileCardDark: {
        backgroundColor: Colors.dark.card,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    profileNameDark: {
        color: Colors.dark.text,
    },
    profileEmail: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
    },
    profileEmailDark: {
        color: Colors.gray[400],
    },
    editButton: {
        backgroundColor: Colors.gray[100],
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    editButtonText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: Colors.primary,
    },
    settingsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    sectionTitleDark: {
        color: Colors.dark.text,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    settingItemDark: {
        backgroundColor: Colors.dark.card,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: Colors.light.text,
        marginLeft: 12,
    },
    settingTextDark: {
        color: Colors.dark.text,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[600],
        marginRight: 8,
    },
    settingValueDark: {
        color: Colors.gray[400],
    },
    optionsContainer: {
        marginBottom: 24,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    optionItemDark: {
        backgroundColor: Colors.dark.card,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: Colors.light.text,
        marginLeft: 12,
    },
    optionTextDark: {
        color: Colors.dark.text,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    signOutButtonDark: {
        backgroundColor: Colors.dark.card,
    },
    signOutText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: Colors.error,
        marginLeft: 8,
    },
    versionText: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: Colors.gray[500],
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    versionTextDark: {
        color: Colors.gray[600],
    },
});

export default styles;
