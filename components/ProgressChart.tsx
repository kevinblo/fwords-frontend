import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/Colors';

interface ProgressChartProps {
  timeFrame: 'week' | 'month' | 'year';
  isDark: boolean;
}

export function ProgressChart({ timeFrame, isDark }: ProgressChartProps) {
  // In a real app, this would use a charting library like react-native-chart-kit
  // and fetch real data from the API based on the timeframe
  
  // For demo purposes, we're creating a placeholder visualization
  const getBarData = () => {
    switch (timeFrame) {
      case 'week':
        return [
          { day: 'Mon', count: 15 },
          { day: 'Tue', count: 8 },
          { day: 'Wed', count: 12 },
          { day: 'Thu', count: 20 },
          { day: 'Fri', count: 5 },
          { day: 'Sat', count: 10 },
          { day: 'Sun', count: 7 },
        ];
      case 'month':
        return Array.from({ length: 4 }, (_, i) => ({
          day: `Week ${i + 1}`,
          count: Math.floor(Math.random() * 50) + 10,
        }));
      case 'year':
        return Array.from({ length: 12 }, (_, i) => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return {
            day: monthNames[i],
            count: Math.floor(Math.random() * 100) + 20,
          };
        });
      default:
        return [];
    }
  };

  const barData = getBarData();
  const maxCount = Math.max(...barData.map(d => d.count));
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {barData.map((data, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: `${(data.count / maxCount) * 100}%`,
                    backgroundColor: isDark ? Colors.accent : Colors.primary 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.barLabel, isDark && styles.barLabelDark]}>
              {data.day}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View 
            style={[
              styles.legendDot, 
              { backgroundColor: isDark ? Colors.accent : Colors.primary }
            ]} 
          />
          <Text style={[styles.legendText, isDark && styles.legendTextDark]}>
            Words Learned
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 120,
    width: 20,
    backgroundColor: Colors.gray[200],
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[700],
  },
  barLabelDark: {
    color: Colors.gray[400],
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[700],
  },
  legendTextDark: {
    color: Colors.gray[400],
  },
});