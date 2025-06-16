import Colors from '@/constants/Colors';
import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 24,
    },
    logoContainer: {
        marginTop: 80,
        alignItems: 'center',
        marginBottom: 60,
    },
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: Colors.gray[600],
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.gray[700],
    },
    input: {
        backgroundColor: Colors.gray[100],
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.gray[200],
    },
    loginButton: {
        backgroundColor: Colors.primary,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    registerLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        color: Colors.gray[600],
    },
    registerTextBold: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
});

export default styles;