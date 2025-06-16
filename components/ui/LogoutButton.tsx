import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react-native';

interface LogoutButtonProps {
  style?: any;
  textStyle?: any;
  showIcon?: boolean;
  confirmLogout?: boolean;
}

export function LogoutButton({ 
  style, 
  textStyle, 
  showIcon = true, 
  confirmLogout = true 
}: LogoutButtonProps) {
  const { signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    if (confirmLogout) {
      Alert.alert(
        'Выход из аккаунта',
        'Вы уверены, что хотите выйти?',
        [
          {
            text: 'Отмена',
            style: 'cancel',
          },
          {
            text: 'Выйти',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    } else {
      await performLogout();
    }
  };

  const performLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.logoutButton, style]}
      onPress={handleLogout}
      disabled={isLoading}
    >
      {showIcon && <LogOut size={20} color="#FF4444" />}
      <Text style={[styles.logoutText, textStyle]}>
        {isLoading ? 'Выход...' : 'Выйти'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
    gap: 8,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});