
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

const mockUser = {
  name: 'John Doe',
  username: '@johndoe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  rating: 4.9,
  reviews: 156,
  joinDate: 'March 2023',
  location: 'San Francisco, CA',
  bio: 'Passionate collector of vintage items and tech gadgets. Always looking for unique finds!',
  role: 'admin', // This would come from your auth system
  stats: {
    listings: 24,
    sold: 18,
    bought: 32,
    saved: 47,
  },
};

const menuItems = [
  { id: 'listings', title: 'My Listings', icon: 'list.bullet', count: mockUser.stats.listings },
  { id: 'purchases', title: 'Purchase History', icon: 'bag', count: mockUser.stats.bought },
  { id: 'sales', title: 'Sales History', icon: 'dollarsign.circle', count: mockUser.stats.sold },
  { id: 'saved', title: 'Saved Items', icon: 'bookmark', count: mockUser.stats.saved },
  { id: 'reviews', title: 'Reviews', icon: 'star', count: mockUser.reviews },
  { id: 'settings', title: 'Settings', icon: 'gear', count: null },
  { id: 'help', title: 'Help & Support', icon: 'questionmark.circle', count: null },
];

// Admin menu items (only shown for admin users)
const adminMenuItems = [
  { id: 'admin', title: 'Admin Dashboard', icon: 'shield', count: null, description: 'Manage users, listings, and app settings' },
];

export default function ProfileScreen() {
  const isAdmin = mockUser.role === 'admin' || mockUser.role === 'moderator';

  const handleMenuPress = (itemId: string) => {
    console.log('Menu item pressed:', itemId);
    
    if (itemId === 'admin') {
      router.push('/admin/' as any);
      return;
    }
    
    // Handle other menu items
    switch (itemId) {
      case 'listings':
        console.log('Navigate to my listings');
        break;
      case 'purchases':
        console.log('Navigate to purchase history');
        break;
      case 'sales':
        console.log('Navigate to sales history');
        break;
      case 'saved':
        console.log('Navigate to saved items');
        break;
      case 'reviews':
        console.log('Navigate to reviews');
        break;
      case 'settings':
        console.log('Navigate to settings');
        break;
      case 'help':
        console.log('Navigate to help');
        break;
      default:
        console.log('Unknown menu item:', itemId);
    }
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <Pressable
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.id)}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <IconSymbol name={item.icon as any} color={colors.primary} size={20} />
        </View>
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.count !== null && (
          <Text style={styles.menuCount}>{item.count}</Text>
        )}
        <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
      </View>
    </Pressable>
  );

  const renderAdminMenuItem = (item: typeof adminMenuItems[0]) => (
    <Pressable
      key={item.id}
      style={[styles.menuItem, styles.adminMenuItem]}
      onPress={() => handleMenuPress(item.id)}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, styles.adminIcon]}>
          <IconSymbol name={item.icon as any} color={colors.error} size={20} />
        </View>
        <View style={styles.menuContent}>
          <Text style={[styles.menuTitle, styles.adminTitle]}>{item.title}</Text>
          {item.description && (
            <Text style={styles.menuDescription}>{item.description}</Text>
          )}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
            headerRight: () => (
              <Pressable onPress={handleEditProfile} style={styles.headerButton}>
                <IconSymbol name="pencil" color={colors.primary} size={20} />
              </Pressable>
            ),
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTitleStyle: {
              color: colors.text,
              fontSize: 20,
              fontWeight: '700',
            },
          }}
        />
      )}

      <ScrollView
        style={commonStyles.container}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header for non-iOS platforms */}
        {Platform.OS !== 'ios' && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Pressable onPress={handleEditProfile}>
              <IconSymbol name="pencil" color={colors.primary} size={24} />
            </Pressable>
          </View>
        )}

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{mockUser.name}</Text>
                {isAdmin && (
                  <View style={styles.adminBadge}>
                    <IconSymbol name="shield" color="white" size={12} />
                    <Text style={styles.adminBadgeText}>ADMIN</Text>
                  </View>
                )}
              </View>
              <Text style={styles.userHandle}>{mockUser.username}</Text>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" color={colors.accent} size={16} />
                <Text style={styles.rating}>{mockUser.rating}</Text>
                <Text style={styles.reviewCount}>({mockUser.reviews} reviews)</Text>
              </View>
            </View>
          </View>

          <Text style={styles.bio}>{mockUser.bio}</Text>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <IconSymbol name="location" color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>{mockUser.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="calendar" color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>Joined {mockUser.joinDate}</Text>
            </View>
          </View>

          <Pressable style={[buttonStyles.outline, styles.editButton]} onPress={handleEditProfile}>
            <Text style={[commonStyles.buttonText, { color: colors.primary }]}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUser.stats.listings}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUser.stats.sold}</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUser.stats.bought}</Text>
            <Text style={styles.statLabel}>Bought</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUser.stats.saved}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Admin Section (only for admin users) */}
        {isAdmin && (
          <View style={styles.adminSection}>
            <Text style={styles.sectionTitle}>Administration</Text>
            <View style={styles.menuSection}>
              {adminMenuItems.map(renderAdminMenuItem)}
            </View>
          </View>
        )}

        {/* Regular Menu */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <Pressable
            style={styles.signOutButton}
            onPress={() => console.log('Sign out')}
          >
            <IconSymbol name="arrow.right.square" color={colors.error} size={20} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  userHandle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bio: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  metaInfo: {
    gap: 8,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    alignSelf: 'stretch',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  adminSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuSection: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  adminMenuItem: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminIcon: {
    backgroundColor: '#FFEBEE',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  adminTitle: {
    color: colors.error,
    fontWeight: '600',
  },
  menuDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  signOutSection: {
    marginHorizontal: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});
