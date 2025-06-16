import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Moon, Sun, Volume2, Bell, Globe, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useState } from 'react';

export default function PreferencesScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(15);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/profile')}
        >
          <ArrowLeft size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Preferences
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Display
          </Text>
          
          <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
            <View style={styles.settingLeft}>
              {isDark ? (
                <Moon size={22} color={Colors.accent} />
              ) : (
                <Sun size={22} color={Colors.primary} />
              )}
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + '80' }}
              thumbColor={isDark ? Colors.primary : Colors.gray[100]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Sound & Notifications
          </Text>
          
          <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
            <View style={styles.settingLeft}>
              <Volume2 size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                Sound Effects
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + '80' }}
              thumbColor={soundEnabled ? Colors.primary : Colors.gray[100]}
            />
          </View>
          
          <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
            <View style={styles.settingLeft}>
              <Bell size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + '80' }}
              thumbColor={notifications ? Colors.primary : Colors.gray[100]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Learning
          </Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, isDark && styles.settingItemDark]}
            onPress={() => router.push('/settings/language')}
          >
            <View style={styles.settingLeft}>
              <Globe size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                App Language
              </Text>
            </View>
            <ArrowLeft size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
            <View style={styles.settingLeft}>
              <Clock size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                Daily Goal (minutes)
              </Text>
            </View>
            <View style={styles.goalSelector}>
              <TouchableOpacity 
                style={[styles.goalButton, isDark && styles.goalButtonDark]}
                onPress={() => setDailyGoal(Math.max(5, dailyGoal - 5))}
              >
                <Text style={[styles.goalButtonText, isDark && styles.goalButtonTextDark]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.goalValue, isDark && styles.goalValueDark]}>{dailyGoal}</Text>
              <TouchableOpacity 
                style={[styles.goalButton, isDark && styles.goalButtonDark]}
                onPress={() => setDailyGoal(Math.min(60, dailyGoal + 5))}
              >
                <Text style={[styles.goalButtonText, isDark && styles.goalButtonTextDark]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
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
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  settingItemDark: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
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
  goalSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalButtonDark: {
    backgroundColor: Colors.gray[700],
  },
  goalButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[600],
  },
  goalButtonTextDark: {
    color: Colors.gray[300],
  },
  goalValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginHorizontal: 16,
  },
  goalValueDark: {
    color: Colors.dark.text,
  },
});