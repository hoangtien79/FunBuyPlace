
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  Pressable, 
  StyleSheet,
  Dimensions,
  Platform 
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

// Mock item data - in a real app, this would come from an API
const getItemById = (id: string) => {
  const items = {
    '1': {
      id: '1',
      title: 'Vintage Camera',
      price: 299,
      images: [
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
      ],
      description: 'Beautiful vintage camera in excellent condition. Perfect for photography enthusiasts and collectors. Comes with original leather case and manual. All functions work perfectly.',
      seller: {
        name: 'PhotoPro',
        rating: 4.8,
        reviews: 127,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      },
      likes: 24,
      isLiked: false,
      isSaved: false,
      category: 'Electronics',
      condition: 'Excellent',
      location: 'San Francisco, CA',
      postedDate: '2 days ago',
      specifications: [
        { label: 'Brand', value: 'Canon' },
        { label: 'Model', value: 'AE-1' },
        { label: 'Year', value: '1976' },
        { label: 'Condition', value: 'Excellent' },
      ],
      shippingOptions: [
        { type: 'Local Pickup', price: 0, description: 'Meet in person' },
        { type: 'Standard Shipping', price: 15, description: '5-7 business days' },
        { type: 'Express Shipping', price: 25, description: '2-3 business days' },
      ],
    },
  };
  return items[id as keyof typeof items];
};

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const item = getItemById(id as string);

  if (!item) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.text}>Item not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleContactSeller = () => {
    console.log('Navigate to messages with seller:', item.seller.name);
    router.push(`/messages/${item.seller.name}`);
  };

  const handleMakeOffer = () => {
    console.log('Make offer for item:', item.id);
  };

  const handleBuyNow = () => {
    console.log('Buy now item:', item.id);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <IconSymbol name="chevron.left" color={colors.text} size={24} />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => setIsSaved(!isSaved)}
                style={[styles.headerButton, { backgroundColor: isSaved ? colors.accent : 'rgba(0,0,0,0.6)' }]}
              >
                <IconSymbol 
                  name={isSaved ? "bookmark.fill" : "bookmark"} 
                  color="white" 
                  size={20} 
                />
              </Pressable>
              <Pressable
                onPress={() => console.log('Share item')}
                style={[styles.headerButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
              >
                <IconSymbol name="square.and.arrow.up" color="white" size={20} />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {item.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.itemImage} />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {item.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: index === currentImageIndex ? colors.primary : 'rgba(255,255,255,0.5)' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Item Info */}
        <View style={styles.itemInfo}>
          <View style={styles.titleSection}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <IconSymbol name="location" color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="clock" color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>{item.postedDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="heart" color={colors.textSecondary} size={16} />
              <Text style={styles.metaText}>{item.likes} likes</Text>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <View style={styles.sellerInfo}>
              <Image source={{ uri: item.seller.avatar }} style={styles.sellerAvatar} />
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>{item.seller.name}</Text>
                <View style={styles.sellerRating}>
                  <IconSymbol name="star.fill" color={colors.accent} size={14} />
                  <Text style={styles.ratingText}>{item.seller.rating} ({item.seller.reviews} reviews)</Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </Pressable>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            {item.specifications.map((spec, index) => (
              <View key={index} style={styles.specRow}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>

          {/* Shipping Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Options</Text>
            {item.shippingOptions.map((option, index) => (
              <View key={index} style={styles.shippingOption}>
                <View style={styles.shippingInfo}>
                  <Text style={styles.shippingType}>{option.type}</Text>
                  <Text style={styles.shippingDescription}>{option.description}</Text>
                </View>
                <Text style={styles.shippingPrice}>
                  {option.price === 0 ? 'Free' : `$${option.price}`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Pressable
          onPress={() => setIsLiked(!isLiked)}
          style={[styles.likeButton, { backgroundColor: isLiked ? colors.error : colors.border }]}
        >
          <IconSymbol 
            name={isLiked ? "heart.fill" : "heart"} 
            color={isLiked ? "white" : colors.textSecondary} 
            size={24} 
          />
        </Pressable>
        
        <Pressable onPress={handleContactSeller} style={[buttonStyles.outline, styles.contactButton]}>
          <Text style={[commonStyles.buttonText, { color: colors.primary }]}>Message</Text>
        </Pressable>
        
        <Pressable onPress={handleMakeOffer} style={[buttonStyles.secondary, styles.offerButton]}>
          <Text style={commonStyles.buttonTextPrimary}>Make Offer</Text>
        </Pressable>
        
        <Pressable onPress={handleBuyNow} style={[buttonStyles.primary, styles.buyButton]}>
          <Text style={commonStyles.buttonTextPrimary}>Buy Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageGallery: {
    height: width,
    position: 'relative',
  },
  itemImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemInfo: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sellerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  viewProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  shippingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shippingInfo: {
    flex: 1,
  },
  shippingType: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  shippingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  shippingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
    alignItems: 'center',
  },
  likeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButton: {
    flex: 1,
  },
  offerButton: {
    flex: 1,
  },
  buyButton: {
    flex: 1,
  },
});
