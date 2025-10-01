
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
import { colors, commonStyles } from '@/styles/commonStyles';

interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isFromMe: boolean;
  };
  unreadCount: number;
  isOnline: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    user: {
      name: 'PhotoPro',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    lastMessage: {
      text: 'Sure! I&apos;m available this weekend. Would Saturday afternoon work for you?',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isFromMe: false,
    },
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '2',
    user: {
      name: 'SneakerHead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    lastMessage: {
      text: 'Thanks for your interest! The sneakers are still available.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isFromMe: false,
    },
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    user: {
      name: 'ArtisanCrafts',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    lastMessage: {
      text: 'Perfect! I&apos;ll package it carefully for shipping.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isFromMe: false,
    },
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '4',
    user: {
      name: 'TechGamer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    },
    lastMessage: {
      text: 'Let me know if you have any other questions!',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      isFromMe: false,
    },
    unreadCount: 0,
    isOnline: false,
  },
];

export default function MessagesScreen() {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    }
  };

  const handleConversationPress = (conversation: Conversation) => {
    router.push(`/messages/${conversation.user.name}`);
  };

  const renderConversation = (conversation: Conversation) => (
    <Pressable
      key={conversation.id}
      style={styles.conversationItem}
      onPress={() => handleConversationPress(conversation)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: conversation.user.avatar }} style={styles.avatar} />
        {conversation.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{conversation.user.name}</Text>
          <Text style={styles.timestamp}>
            {formatTime(conversation.lastMessage.timestamp)}
          </Text>
        </View>
        
        <View style={styles.messagePreview}>
          <Text
            style={[
              styles.lastMessage,
              conversation.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage.isFromMe ? 'You: ' : ''}
            {conversation.lastMessage.text}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Messages',
            headerRight: () => (
              <Pressable onPress={() => console.log('New message')} style={styles.headerButton}>
                <IconSymbol name="square.and.pencil" color={colors.primary} size={20} />
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

      <View style={commonStyles.container}>
        {/* Header for non-iOS platforms */}
        {Platform.OS !== 'ios' && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
            <Pressable onPress={() => console.log('New message')}>
              <IconSymbol name="square.and.pencil" color={colors.primary} size={24} />
            </Pressable>
          </View>
        )}

        <ScrollView
          style={styles.conversationsList}
          contentContainerStyle={[
            styles.conversationsContent,
            Platform.OS !== 'ios' && styles.conversationsContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {mockConversations.length > 0 ? (
            mockConversations.map(renderConversation)
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="message" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No Messages Yet</Text>
              <Text style={styles.emptyDescription}>
                Start a conversation by messaging a seller about an item you&apos;re interested in.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    paddingBottom: 20,
  },
  conversationsContentWithTabBar: {
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '500',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
