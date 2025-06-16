import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Camera, Mail, User as UserIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      // In a real app, this would make an API call to update the user's profile
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangePhoto = () => {
    // In a real app, this would open the image picker
    Alert.alert('Coming Soon', 'Photo upload will be available in a future update');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Edit Profile
        </Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.profilePhoto}
            />
            {isEditing && (
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={handleChangePhoto}
              >
                <Camera size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          {isEditing && (
            <TouchableOpacity 
              style={styles.changePhotoLink}
              onPress={handleChangePhoto}
            >
              <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <UserIcon size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
            </View>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                !isEditing && styles.inputDisabled,
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor={Colors.gray[400]}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
            </View>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                !isEditing && styles.inputDisabled,
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Your Email"
              placeholderTextColor={Colors.gray[400]}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditing}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.deleteButton, isDark && styles.deleteButtonDark]}
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    signOut();
                    router.replace('/auth/login');
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  photoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.light.background,
  },
  changePhotoLink: {
    marginTop: 16,
  },
  changePhotoText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.light.text,
  },
  inputDark: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.card,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  deleteButton: {
    backgroundColor: Colors.error + '10',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  deleteButtonDark: {
    backgroundColor: Colors.error + '20',
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.error,
  },
});