
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    role: 'user',
    joinDate: '2023-03-15',
    listings: 12,
    sales: 8,
    rating: 4.8,
    reports: 0,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'suspended',
    role: 'user',
    joinDate: '2023-02-20',
    listings: 5,
    sales: 3,
    rating: 3.2,
    reports: 3,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    role: 'moderator',
    joinDate: '2023-01-10',
    listings: 25,
    sales: 20,
    rating: 4.9,
    reports: 0,
  },
];

const userStatuses = ['all', 'active', 'suspended', 'banned'] as const;
const userRoles = ['all', 'user', 'moderator', 'admin'] as const;

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<typeof userStatuses[number]>('all');
  const [selectedRole, setSelectedRole] = useState<typeof userRoles[number]>('all');
  const [users, setUsers] = useState(mockUsers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching users:', query);
    // In a real app, this would filter users based on the query
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log('User action:', action, 'for user:', userId);
    
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'suspend':
        Alert.alert(
          'Suspend User',
          `Are you sure you want to suspend ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Suspend', 
              style: 'destructive',
              onPress: () => {
                setUsers(prev => prev.map(u => 
                  u.id === userId ? { ...u, status: 'suspended' } : u
                ));
              }
            }
          ]
        );
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'active' } : u
        ));
        break;
      case 'ban':
        Alert.alert(
          'Ban User',
          `Are you sure you want to permanently ban ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Ban', 
              style: 'destructive',
              onPress: () => {
                setUsers(prev => prev.map(u => 
                  u.id === userId ? { ...u, status: 'banned' } : u
                ));
              }
            }
          ]
        );
        break;
      case 'view_profile':
        router.push(`/admin/users/${userId}` as any);
        break;
      case 'view_listings':
        router.push(`/admin/listings?userId=${userId}` as any);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'suspended': return colors.warning;
      case 'banned': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return colors.error;
      case 'moderator': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const renderFilterButton = (
    options: readonly string[], 
    selected: string, 
    onSelect: (value: any) => void,
    title: string
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {options.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.filterButton,
              selected === option && styles.filterButtonActive
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.filterButtonText,
              selected === option && styles.filterButtonTextActive
            ]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderUser = (user: typeof mockUsers[0]) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.userHeader}>
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
              <Text style={styles.statusText}>{user.status}</Text>
            </View>
          </View>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.userMeta}>
            <Text style={[styles.userRole, { color: getRoleColor(user.role) }]}>
              {user.role.toUpperCase()}
            </Text>
            <Text style={styles.userJoinDate}>Joined {user.joinDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.listings}</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.sales}</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, user.reports > 0 && { color: colors.error }]}>
            {user.reports}
          </Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
      </View>

      <View style={styles.userActions}>
        <Pressable
          style={[styles.actionButton, styles.primaryAction]}
          onPress={() => handleUserAction(user.id, 'view_profile')}
        >
          <IconSymbol name="person" color="white" size={16} />
          <Text style={styles.actionButtonText}>Profile</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => handleUserAction(user.id, 'view_listings')}
        >
          <IconSymbol name="list.bullet" color={colors.primary} size={16} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Listings</Text>
        </Pressable>

        {user.status === 'active' ? (
          <Pressable
            style={[styles.actionButton, styles.warningAction]}
            onPress={() => handleUserAction(user.id, 'suspend')}
          >
            <IconSymbol name="pause" color="white" size={16} />
            <Text style={styles.actionButtonText}>Suspend</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.actionButton, styles.successAction]}
            onPress={() => handleUserAction(user.id, 'activate')}
          >
            <IconSymbol name="play" color="white" size={16} />
            <Text style={styles.actionButtonText}>Activate</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.actionButton, styles.dangerAction]}
          onPress={() => handleUserAction(user.id, 'ban')}
        >
          <IconSymbol name="xmark" color="white" size={16} />
          <Text style={styles.actionButtonText}>Ban</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'User Management',
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
        }}
      />

      <View style={commonStyles.container}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {renderFilterButton(userStatuses, selectedStatus, setSelectedStatus, 'Status')}
          {renderFilterButton(userRoles, selectedRole, setSelectedRole, 'Role')}
        </View>

        {/* Users List */}
        <ScrollView
          style={styles.usersList}
          contentContainerStyle={styles.usersListContent}
          showsVerticalScrollIndicator={false}
        >
          {users.map(renderUser)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    backgroundColor: colors.background,
    paddingBottom: 12,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  usersList: {
    flex: 1,
  },
  usersListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '700',
  },
  userJoinDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  primaryAction: {
    backgroundColor: colors.primary,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  successAction: {
    backgroundColor: colors.success,
  },
  warningAction: {
    backgroundColor: colors.warning,
  },
  dangerAction: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});
