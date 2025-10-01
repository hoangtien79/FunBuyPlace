
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

// Mock listing data
const mockListings = [
  {
    id: '1',
    title: 'Vintage Camera Collection',
    price: 450,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop',
    seller: 'John Doe',
    sellerId: '1',
    status: 'active',
    category: 'Electronics',
    createdAt: '2024-01-15',
    views: 234,
    likes: 18,
    reports: 0,
    featured: false,
  },
  {
    id: '2',
    title: 'Designer Handbag - Authentic',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=200&fit=crop',
    seller: 'Jane Smith',
    sellerId: '2',
    status: 'flagged',
    category: 'Fashion',
    createdAt: '2024-01-14',
    views: 89,
    likes: 5,
    reports: 2,
    featured: false,
  },
  {
    id: '3',
    title: 'Rare Vinyl Records Set',
    price: 300,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    seller: 'Mike Johnson',
    sellerId: '3',
    status: 'active',
    category: 'Music',
    createdAt: '2024-01-13',
    views: 156,
    likes: 23,
    reports: 0,
    featured: true,
  },
];

const listingStatuses = ['all', 'active', 'flagged', 'suspended', 'sold'] as const;
const categories = ['all', 'Electronics', 'Fashion', 'Music', 'Books', 'Home', 'Sports'] as const;

export default function ListingManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<typeof listingStatuses[number]>('all');
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('all');
  const [listings, setListings] = useState(mockListings);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching listings:', query);
  };

  const handleListingAction = (listingId: string, action: string) => {
    console.log('Listing action:', action, 'for listing:', listingId);
    
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    switch (action) {
      case 'approve':
        setListings(prev => prev.map(l => 
          l.id === listingId ? { ...l, status: 'active' } : l
        ));
        break;
      case 'flag':
        Alert.alert(
          'Flag Listing',
          `Are you sure you want to flag "${listing.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Flag', 
              style: 'destructive',
              onPress: () => {
                setListings(prev => prev.map(l => 
                  l.id === listingId ? { ...l, status: 'flagged' } : l
                ));
              }
            }
          ]
        );
        break;
      case 'suspend':
        Alert.alert(
          'Suspend Listing',
          `Are you sure you want to suspend "${listing.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Suspend', 
              style: 'destructive',
              onPress: () => {
                setListings(prev => prev.map(l => 
                  l.id === listingId ? { ...l, status: 'suspended' } : l
                ));
              }
            }
          ]
        );
        break;
      case 'feature':
        setListings(prev => prev.map(l => 
          l.id === listingId ? { ...l, featured: !l.featured } : l
        ));
        break;
      case 'view_details':
        router.push(`/item/${listingId}` as any);
        break;
      case 'contact_seller':
        router.push(`/messages/${listing.sellerId}` as any);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'flagged': return colors.error;
      case 'suspended': return colors.warning;
      case 'sold': return colors.textSecondary;
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

  const renderListing = (listing: typeof mockListings[0]) => (
    <View key={listing.id} style={styles.listingCard}>
      <View style={styles.listingHeader}>
        <Image source={{ uri: listing.image }} style={styles.listingImage} />
        <View style={styles.listingInfo}>
          <View style={styles.listingTitleRow}>
            <Text style={styles.listingTitle} numberOfLines={2}>{listing.title}</Text>
            {listing.featured && (
              <View style={styles.featuredBadge}>
                <IconSymbol name="star.fill" color={colors.accent} size={12} />
              </View>
            )}
          </View>
          <Text style={styles.listingPrice}>${listing.price}</Text>
          <Text style={styles.listingSeller}>by {listing.seller}</Text>
          <View style={styles.listingMeta}>
            <Text style={styles.listingCategory}>{listing.category}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(listing.status) }]}>
              <Text style={styles.statusText}>{listing.status}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.listingStats}>
        <View style={styles.statItem}>
          <IconSymbol name="eye" color={colors.textSecondary} size={16} />
          <Text style={styles.statText}>{listing.views}</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="heart" color={colors.textSecondary} size={16} />
          <Text style={styles.statText}>{listing.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="flag" color={listing.reports > 0 ? colors.error : colors.textSecondary} size={16} />
          <Text style={[styles.statText, listing.reports > 0 && { color: colors.error }]}>
            {listing.reports}
          </Text>
        </View>
        <View style={styles.statItem}>
          <IconSymbol name="calendar" color={colors.textSecondary} size={16} />
          <Text style={styles.statText}>{listing.createdAt}</Text>
        </View>
      </View>

      <View style={styles.listingActions}>
        <Pressable
          style={[styles.actionButton, styles.primaryAction]}
          onPress={() => handleListingAction(listing.id, 'view_details')}
        >
          <IconSymbol name="eye" color="white" size={16} />
          <Text style={styles.actionButtonText}>View</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => handleListingAction(listing.id, 'contact_seller')}
        >
          <IconSymbol name="message" color={colors.primary} size={16} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Contact</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, listing.featured ? styles.warningAction : styles.accentAction]}
          onPress={() => handleListingAction(listing.id, 'feature')}
        >
          <IconSymbol name="star" color="white" size={16} />
          <Text style={styles.actionButtonText}>
            {listing.featured ? 'Unfeature' : 'Feature'}
          </Text>
        </Pressable>

        {listing.status === 'flagged' ? (
          <Pressable
            style={[styles.actionButton, styles.successAction]}
            onPress={() => handleListingAction(listing.id, 'approve')}
          >
            <IconSymbol name="checkmark" color="white" size={16} />
            <Text style={styles.actionButtonText}>Approve</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.actionButton, styles.dangerAction]}
            onPress={() => handleListingAction(listing.id, 'flag')}
          >
            <IconSymbol name="flag" color="white" size={16} />
            <Text style={styles.actionButtonText}>Flag</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Listing Management',
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
              placeholder="Search listings..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {renderFilterButton(listingStatuses, selectedStatus, setSelectedStatus, 'Status')}
          {renderFilterButton(categories, selectedCategory, setSelectedCategory, 'Category')}
        </View>

        {/* Listings List */}
        <ScrollView
          style={styles.listingsList}
          contentContainerStyle={styles.listingsListContent}
          showsVerticalScrollIndicator={false}
        >
          {listings.map(renderListing)}
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
  listingsList: {
    flex: 1,
  },
  listingsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listingHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  featuredBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 4,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  listingSeller: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listingCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
  listingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
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
  accentAction: {
    backgroundColor: colors.accent,
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
