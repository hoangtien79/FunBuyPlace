
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromMe: boolean;
}

// Mock conversation data
const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hi! I&apos;m interested in the vintage camera you have listed.',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isFromMe: true,
  },
  {
    id: '2',
    text: 'Hello! Thanks for your interest. It&apos;s in excellent condition and comes with the original case.',
    timestamp: new Date(Date.now() - 3500000),
    isFromMe: false,
  },
  {
    id: '3',
    text: 'That sounds great! Could you tell me more about its history? Any issues I should know about?',
    timestamp: new Date(Date.now() - 3400000),
    isFromMe: true,
  },
  {
    id: '4',
    text: 'I bought it from an estate sale about 2 years ago. The previous owner took great care of it. All the functions work perfectly - shutter, light meter, everything!',
    timestamp: new Date(Date.now() - 3300000),
    isFromMe: false,
  },
  {
    id: '5',
    text: 'Perfect! Would you be open to meeting in person so I can take a look at it?',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    isFromMe: true,
  },
];

export default function MessagesScreen() {
  const { userId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        isFromMe: true,
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate seller response after a delay
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sure! I&apos;m available this weekend. Would Saturday afternoon work for you?',
          timestamp: new Date(),
          isFromMe: false,
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isFromMe ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isFromMe ? styles.myMessageBubble : styles.theirMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isFromMe ? styles.myMessageText : styles.theirMessageText,
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: userId as string,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <IconSymbol name="chevron.left" color={colors.primary} size={24} />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={() => console.log('Voice call')} style={styles.headerButton}>
                <IconSymbol name="phone" color={colors.primary} size={20} />
              </Pressable>
              <Pressable onPress={() => console.log('Video call')} style={styles.headerButton}>
                <IconSymbol name="video" color={colors.primary} size={20} />
              </Pressable>
            </View>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages List */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={sendMessage}
              style={[
                styles.sendButton,
                { backgroundColor: newMessage.trim() ? colors.primary : colors.border },
              ]}
              disabled={!newMessage.trim()}
            >
              <IconSymbol
                name="arrow.up"
                color={newMessage.trim() ? 'white' : colors.textSecondary}
                size={20}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 8,
  },
  theirMessageBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginHorizontal: 4,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
