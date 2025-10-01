
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Platform,
  Dimensions 
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, commonStyles } from "@/styles/commonStyles";

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // 2 columns with padding

// Mock data for marketplace items
const mockItems = [
  {
    id: '1',
    title: 'Vintage Camera',
    price: 299,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
    seller: 'PhotoPro',
    likes: 24,
    isLiked: false,
    isSaved: false,
    category: 'Electronics',
    condition: 'Excellent',
  },
  {
    id: '2',
    title: 'Designer Sneakers',
    price: 150,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    seller: 'SneakerHead',
    likes: 18,
    isLiked: true,
    isSaved: false,
    category: 'Fashion',
    condition: 'Like New',
  },
  {
    id: '3',
    title: 'Handmade Pottery',
    price: 45,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    seller: 'ArtisanCrafts',
    likes: 12,
    isLiked: false,
    isSaved: true,
    category: 'Art',
    condition: 'New',
  },
  {
    id: '4',
    title: 'Gaming Headset',
    price: 89,
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop',
    seller: 'TechGamer',
    likes: 31,
    isLiked: false,
    isSaved: false,
    category: 'Electronics',
    condition: 'Good',
  },
  {
    id: '5',
    title: 'Leather Jacket',
    price: 220,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    seller: 'StyleIcon',
    likes: 42,
    isLiked: true,
    isSaved: true,
    category: 'Fashion',
    condition: 'Excellent',
  },
  {
    id: '6',
    title: 'Succulent Plants',
    price: 25,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
    seller: 'GreenThumb',
    likes: 8,
    isLiked: false,
    isSaved: false,
    category: 'Plants',
    condition: 'New',
  },
];

export default function HomeScreen() {
  const [items, setItems] = useState(mockItems);

  const handleLike = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { 
              ...item, 
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1
            }
          : item
      )
    );
  };

  const handleSave = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, isSaved: !item.isSaved }
          : item
      )
    );
  };

  const renderItem = (item: typeof mockItems[0]) => (
    <Pressable
      key={item.id}
      style={[styles.itemCard, { width: ITEM_WIDTH }]}
      onPress={() => console.log('Navigate to item detail:', item.id)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: item.isLiked ? colors.error : 'rgba(0,0,0,0.6)' }]}
            onPress={() => handleLike(item.id)}
          >
            <IconSymbol 
              name={item.isLiked ? "heart.fill" : "heart"} 
              color="white" 
              size={16} 
            />
          </Pressable>
          <Pressable
            style={[styles.actionButton, { backgroundColor: item.isSaved ? colors.accent : 'rgba(0,0,0,0.6)' }]}
            onPress={() => handleSave(item.id)}
          >
            <IconSymbol 
              name={item.isSaved ? "bookmark.fill" : "bookmark"} 
              color="white" 
              size={16} 
            />
          </Pressable>
        </View>
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{item.condition}</Text>
        </View>
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.sellerName}>by {item.seller}</Text>
          <View style={styles.likesContainer}>
            <IconSymbol name="heart" color={colors.textSecondary} size={12} />
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Add new item')}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => console.log('Open search')}
      style={styles.headerButton}
    >
      <IconSymbol name="magnifyingglass" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Marketplace",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
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
            <View style={styles.headerContent}>
              <Pressable onPress={() => console.log('Open search')}>
                <IconSymbol name="magnifyingglass" color={colors.primary} size={24} />
              </Pressable>
              <Text style={styles.headerTitle}>Marketplace</Text>
              <Pressable onPress={() => console.log('Add new item')}>
                <IconSymbol name="plus" color={colors.primary} size={24} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {['All', 'Electronics', 'Fashion', 'Art', 'Plants', 'Books'].map((category) => (
              <Pressable key={category} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{category}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Items Grid */}
        <View style={styles.itemsContainer}>
          <View style={styles.itemsGrid}>
            {items.map((item, index) => (
              <View key={item.id} style={index % 2 === 0 ? styles.leftColumn : styles.rightColumn}>
                {renderItem(item)}
              </View>
            ))}
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
  scrollContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerButton: {
    padding: 8,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: ITEM_WIDTH,
  },
  rightColumn: {
    width: ITEM_WIDTH,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: ITEM_WIDTH * 0.8,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conditionBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
