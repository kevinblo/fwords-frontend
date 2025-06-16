import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Book, Plane, Briefcase, UtensilsCrossed } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Map icon name to component
  const getIcon = () => {
    const size = 24;
    const color = isDark ? Colors.accent : Colors.primary;
    
    switch (category.icon) {
      case 'Book':
        return <Book size={size} color={color} />;
      case 'Plane':
        return <Plane size={size} color={color} />;
      case 'Briefcase':
        return <Briefcase size={size} color={color} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed size={size} color={color} />;
      default:
        return <Book size={size} color={color} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isDark && styles.cardDark]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
        {getIcon()}
      </View>
      <Text style={[styles.name, isDark && styles.nameDark]}>
        {category.name}
      </Text>
      <Text style={[styles.count, isDark && styles.countDark]}>
        {category.count} words
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: Colors.dark.card,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainerDark: {
    backgroundColor: Colors.accent + '20',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  nameDark: {
    color: Colors.dark.text,
  },
  count: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  countDark: {
    color: Colors.gray[400],
  },
});