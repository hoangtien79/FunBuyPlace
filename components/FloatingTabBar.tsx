
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth - 32,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  
  const activeIndex = useSharedValue(0);

  // Find the active tab index
  React.useEffect(() => {
    const currentIndex = tabs.findIndex(tab => {
      if (tab.route === '/(tabs)/(home)/') {
        return pathname.startsWith('/(tabs)/(home)') || pathname === '/';
      }
      return pathname.includes(tab.name);
    });
    
    if (currentIndex !== -1) {
      activeIndex.value = withSpring(currentIndex, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [pathname, tabs]);

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    const translateX = interpolate(
      activeIndex.value,
      [0, tabs.length - 1],
      [0, (tabs.length - 1) * tabWidth]
    );

    return {
      transform: [{ translateX }],
      width: tabWidth,
    };
  });

  return (
    <SafeAreaView style={[styles.container, { bottom: bottomMargin }]} edges={['bottom']}>
      <BlurView
        style={[
          styles.tabBar,
          {
            width: containerWidth,
            borderRadius,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
          },
        ]}
        intensity={80}
        tint={theme.dark ? 'dark' : 'light'}
      >
        {/* Animated indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius - 4,
            },
            animatedIndicatorStyle,
          ]}
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => {
          const isActive = pathname.includes(tab.name) || 
            (tab.route === '/(tabs)/(home)/' && (pathname.startsWith('/(tabs)/(home)') || pathname === '/'));

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <IconSymbol
                  name={tab.icon as any}
                  size={22}
                  color={isActive ? 'white' : colors.text}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? 'white' : colors.text,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: colors.border,
  },
  indicator: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    left: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
});
