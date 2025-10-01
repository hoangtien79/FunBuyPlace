
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

// Mock analytics data
const analyticsData = {
  overview: {
    totalRevenue: 45678.90,
    totalUsers: 1247,
    totalListings: 892,
    totalTransactions: 3456,
    averageOrderValue: 127.50,
    conversionRate: 3.2,
  },
  growth: {
    revenueGrowth: 12.5,
    userGrowth: 8.3,
    listingGrowth: 15.7,
    transactionGrowth: 9.8,
  },
  topCategories: [
    { name: 'Electronics', value: 35, color: colors.primary },
    { name: 'Fashion', value: 28, color: colors.secondary },
    { name: 'Home & Garden', value: 18, color: colors.accent },
    { name: 'Sports', value: 12, color: colors.success },
    { name: 'Books', value: 7, color: colors.warning },
  ],
  recentActivity: [
    { type: 'sale', amount: 250, time: '2 minutes ago' },
    { type: 'listing', amount: null, time: '5 minutes ago' },
    { type: 'user', amount: null, time: '8 minutes ago' },
    { type: 'sale', amount: 89, time: '12 minutes ago' },
    { type: 'sale', amount: 340, time: '15 minutes ago' },
  ],
  monthlyData: [
    { month: 'Jan', revenue: 3200, users: 89, listings: 156 },
    { month: 'Feb', revenue: 3800, users: 102, listings: 178 },
    { month: 'Mar', revenue: 4200, users: 118, listings: 203 },
    { month: 'Apr', revenue: 3900, users: 95, listings: 189 },
    { month: 'May', revenue: 4600, users: 134, listings: 234 },
    { month: 'Jun', revenue: 5100, users: 156, listings: 267 },
  ],
};

const timeRanges = ['7d', '30d', '90d', '1y'] as const;

export default function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<typeof timeRanges[number]>('30d');

  const renderMetricCard = (title: string, value: string | number, growth?: number, icon?: string) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        {icon && <IconSymbol name={icon as any} color={colors.primary} size={20} />}
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>
        {typeof value === 'number' && title.includes('Revenue') 
          ? `$${value.toLocaleString()}` 
          : typeof value === 'number' && title.includes('Rate')
          ? `${value}%`
          : value.toLocaleString()}
      </Text>
      {growth !== undefined && (
        <View style={styles.growthContainer}>
          <IconSymbol 
            name={growth >= 0 ? "arrow.up" : "arrow.down"} 
            color={growth >= 0 ? colors.success : colors.error} 
            size={12} 
          />
          <Text style={[styles.growthText, { color: growth >= 0 ? colors.success : colors.error }]}>
            {Math.abs(growth)}%
          </Text>
        </View>
      )}
    </View>
  );

  const renderCategoryChart = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Top Categories</Text>
      <View style={styles.categoryChart}>
        {analyticsData.topCategories.map((category, index) => (
          <View key={category.name} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <Text style={styles.categoryValue}>{category.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActivityFeed = () => (
    <View style={styles.activityCard}>
      <Text style={styles.activityTitle}>Recent Activity</Text>
      <View style={styles.activityList}>
        {analyticsData.recentActivity.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <IconSymbol 
                name={
                  activity.type === 'sale' ? 'dollarsign.circle' :
                  activity.type === 'listing' ? 'plus.circle' :
                  'person.badge.plus'
                } 
                color={
                  activity.type === 'sale' ? colors.success :
                  activity.type === 'listing' ? colors.primary :
                  colors.secondary
                } 
                size={16} 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                {activity.type === 'sale' ? `Sale completed` :
                 activity.type === 'listing' ? 'New listing added' :
                 'New user registered'}
                {activity.amount && ` - $${activity.amount}`}
              </Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {timeRanges.map((range) => (
        <Pressable
          key={range}
          style={[
            styles.timeRangeButton,
            selectedTimeRange === range && styles.timeRangeButtonActive
          ]}
          onPress={() => setSelectedTimeRange(range)}
        >
          <Text style={[
            styles.timeRangeText,
            selectedTimeRange === range && styles.timeRangeTextActive
          ]}>
            {range}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Analytics',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '700',
          },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <IconSymbol name="chevron.left" color={colors.text} size={20} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => console.log('Export analytics')} style={styles.headerButton}>
              <IconSymbol name="square.and.arrow.up" color={colors.primary} size={20} />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={commonStyles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Selector */}
        {renderTimeRangeSelector()}

        {/* Overview Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard('Total Revenue', analyticsData.overview.totalRevenue, analyticsData.growth.revenueGrowth, 'dollarsign.circle')}
            {renderMetricCard('Total Users', analyticsData.overview.totalUsers, analyticsData.growth.userGrowth, 'person.2')}
            {renderMetricCard('Active Listings', analyticsData.overview.totalListings, analyticsData.growth.listingGrowth, 'list.bullet')}
            {renderMetricCard('Transactions', analyticsData.overview.totalTransactions, analyticsData.growth.transactionGrowth, 'creditcard')}
            {renderMetricCard('Avg Order Value', analyticsData.overview.averageOrderValue, undefined, 'chart.bar')}
            {renderMetricCard('Conversion Rate', analyticsData.overview.conversionRate, undefined, 'percent')}
          </View>
        </View>

        {/* Category Distribution */}
        {renderCategoryChart()}

        {/* Recent Activity */}
        {renderActivityFeed()}

        {/* Monthly Trends */}
        <View style={styles.trendsCard}>
          <Text style={styles.trendsTitle}>Monthly Trends</Text>
          <View style={styles.trendsChart}>
            {analyticsData.monthlyData.map((data, index) => (
              <View key={data.month} style={styles.trendItem}>
                <View style={styles.trendBars}>
                  <View 
                    style={[
                      styles.trendBar, 
                      { 
                        height: (data.revenue / 5100) * 60,
                        backgroundColor: colors.primary 
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.trendBar, 
                      { 
                        height: (data.users / 156) * 60,
                        backgroundColor: colors.secondary 
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.trendBar, 
                      { 
                        height: (data.listings / 267) * 60,
                        backgroundColor: colors.accent 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.trendMonth}>{data.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.trendsLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.secondary }]} />
              <Text style={styles.legendText}>Users</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.accent }]} />
              <Text style={styles.legendText}>Listings</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timeRangeTextActive: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  metricsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  categoryChart: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  activityCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trendsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  trendsChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 16,
  },
  trendItem: {
    alignItems: 'center',
    gap: 8,
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  trendBar: {
    width: 6,
    borderRadius: 3,
    minHeight: 4,
  },
  trendMonth: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trendsLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
