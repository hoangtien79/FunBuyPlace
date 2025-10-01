
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

// Mock admin data
const adminStats = {
  totalUsers: 1247,
  activeListings: 892,
  totalTransactions: 3456,
  revenue: 12450.75,
  pendingReports: 8,
  flaggedItems: 12,
  newUsersToday: 23,
  salesToday: 156,
};

const adminMenuItems = [
  {
    id: 'users',
    title: 'User Management',
    icon: 'person.2',
    description: 'Manage users, roles, and permissions',
    count: adminStats.totalUsers,
    route: '/admin/users',
  },
  {
    id: 'listings',
    title: 'Listing Management',
    icon: 'list.bullet.rectangle',
    description: 'Review and moderate listings',
    count: adminStats.activeListings,
    route: '/admin/listings',
  },
  {
    id: 'transactions',
    title: 'Transaction Management',
    icon: 'creditcard',
    description: 'Monitor payments and disputes',
    count: adminStats.totalTransactions,
    route: '/admin/transactions',
  },
  {
    id: 'reports',
    title: 'Reports & Moderation',
    icon: 'exclamationmark.triangle',
    description: 'Handle user reports and flagged content',
    count: adminStats.pendingReports,
    route: '/admin/reports',
    urgent: true,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: 'chart.bar',
    description: 'View app performance and metrics',
    count: null,
    route: '/admin/analytics',
  },
  {
    id: 'settings',
    title: 'App Settings',
    icon: 'gear',
    description: 'Configure app-wide settings',
    count: null,
    route: '/admin/settings',
  },
];

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing admin dashboard...');
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleMenuPress = (item: typeof adminMenuItems[0]) => {
    console.log('Admin menu item pressed:', item.id);
    router.push(item.route as any);
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    switch (action) {
      case 'ban_user':
        Alert.alert('Ban User', 'This would open user search to ban a user');
        break;
      case 'feature_listing':
        Alert.alert('Feature Listing', 'This would open listing search to feature an item');
        break;
      case 'send_notification':
        Alert.alert('Send Notification', 'This would open notification composer');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <IconSymbol name={icon as any} color={color} size={24} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>
        {typeof value === 'number' && title.includes('Revenue') 
          ? `$${value.toLocaleString()}` 
          : value.toLocaleString()}
      </Text>
    </View>
  );

  const renderMenuItem = (item: typeof adminMenuItems[0]) => (
    <Pressable
      key={item.id}
      style={[styles.menuItem, item.urgent && styles.urgentMenuItem]}
      onPress={() => handleMenuPress(item)}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, item.urgent && styles.urgentIcon]}>
          <IconSymbol 
            name={item.icon as any} 
            color={item.urgent ? colors.error : colors.primary} 
            size={20} 
          />
        </View>
        <View style={styles.menuContent}>
          <Text style={[styles.menuTitle, item.urgent && styles.urgentTitle]}>
            {item.title}
          </Text>
          <Text style={styles.menuDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.count !== null && (
          <View style={[styles.countBadge, item.urgent && styles.urgentBadge]}>
            <Text style={[styles.countText, item.urgent && styles.urgentCountText]}>
              {item.count}
            </Text>
          </View>
        )}
        <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Admin Dashboard',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 20,
            fontWeight: '700',
          },
          headerRight: () => (
            <Pressable onPress={handleRefresh} style={styles.headerButton}>
              <IconSymbol 
                name="arrow.clockwise" 
                color={colors.primary} 
                size={20} 
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={commonStyles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          Platform.OS === 'ios' ? undefined : {
            refreshing,
            onRefresh: handleRefresh,
            colors: [colors.primary],
          } as any
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Total Users', adminStats.totalUsers, 'person.2', colors.primary)}
            {renderStatCard('Active Listings', adminStats.activeListings, 'list.bullet', colors.secondary)}
            {renderStatCard('Transactions', adminStats.totalTransactions, 'creditcard', colors.accent)}
            {renderStatCard('Revenue', adminStats.revenue, 'dollarsign.circle', colors.success)}
          </View>
        </View>

        {/* Today's Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <IconSymbol name="person.badge.plus" color={colors.primary} size={20} />
              <Text style={styles.activityText}>
                <Text style={styles.activityNumber}>{adminStats.newUsersToday}</Text> new users
              </Text>
            </View>
            <View style={styles.activityItem}>
              <IconSymbol name="bag" color={colors.success} size={20} />
              <Text style={styles.activityText}>
                <Text style={styles.activityNumber}>{adminStats.salesToday}</Text> sales completed
              </Text>
            </View>
            <View style={styles.activityItem}>
              <IconSymbol name="flag" color={colors.error} size={20} />
              <Text style={styles.activityText}>
                <Text style={styles.activityNumber}>{adminStats.flaggedItems}</Text> items flagged
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('ban_user')}
            >
              <IconSymbol name="person.slash" color={colors.error} size={24} />
              <Text style={styles.quickActionText}>Ban User</Text>
            </Pressable>
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('feature_listing')}
            >
              <IconSymbol name="star" color={colors.accent} size={24} />
              <Text style={styles.quickActionText}>Feature Item</Text>
            </Pressable>
            <Pressable 
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('send_notification')}
            >
              <IconSymbol name="bell" color={colors.primary} size={24} />
              <Text style={styles.quickActionText}>Send Alert</Text>
            </Pressable>
          </View>
        </View>

        {/* Admin Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Administration</Text>
          <View style={styles.menuContainer}>
            {adminMenuItems.map(renderMenuItem)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  headerButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  statsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityText: {
    fontSize: 16,
    color: colors.text,
  },
  activityNumber: {
    fontWeight: '700',
    color: colors.primary,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuContainer: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  urgentMenuItem: {
    backgroundColor: '#FFF5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  urgentIcon: {
    backgroundColor: '#FFEBEE',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  urgentTitle: {
    color: colors.error,
  },
  menuDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  urgentBadge: {
    backgroundColor: colors.error,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  urgentCountText: {
    color: 'white',
  },
});
