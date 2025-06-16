import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';

interface ProgressBarProps {
  progress: number; // value between 0 and 1
  color?: string;
  backgroundColor?: string;
  height?: number;
}

export function ProgressBar({ 
  progress, 
  color = Colors.primary, 
  backgroundColor = Colors.gray[200],
  height = 8 
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(progress * width, { duration: 500 }),
    };
  });

  useEffect(() => {
    // Ensure progress is within bounds
    const clampedProgress = Math.max(0, Math.min(1, progress));
    setWidth(clampedProgress * 100);
  }, [progress]);

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor, height, borderRadius: height / 2 }
      ]}
    >
      <Animated.View 
        style={[
          styles.progress, 
          { backgroundColor: color, borderRadius: height / 2 },
          animatedStyle
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});