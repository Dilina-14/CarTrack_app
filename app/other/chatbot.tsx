import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
 
interface Message {
  id: string;
  text: string;
  isUser: boolean;
}
 
const CHAT_API_URL = 'https://car-track-bot.vercel.app/chat'; 
 
const Message = ({ message }: { message: Message }) => {
  return (
    <View style={[
      styles.messageBubble, 
      message.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.botMessageText
      ]}>
        {message.text || "No message content"}
      </Text>
    </View>
  );
};
 
export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
 
  const saveMessages = async (updatedMessages: Message[]) => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };
 
  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
 
  useEffect(() => {
    loadMessages();
  }, []);
 
  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
 
  const fetchBotResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
 
      console.log('Sending message to API:', userMessage);
 
      // Format the request payload exactly as required
      const requestPayload = {
        message: userMessage
      };
 
      console.log('Request payload:', JSON.stringify(requestPayload));
 
      const response = await axios({
        method: 'post',
        url: CHAT_API_URL,
        data: requestPayload,
        headers: { 
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      });
 
      console.log('API response status:', response.status);
      console.log('API response data:', response.data);
 
      // Check if the response contains the 'reply' field
      if (response && response.data && typeof response.data.reply === 'string') {
        return response.data.reply;
      } else {
        console.error('Invalid or unexpected response format:', response.data);
        return "I received an unexpected response. Please try again.";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Request config:', error.config);
      } else {
        console.error('Non-Axios error calling the chat API:', error);
      }
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
 
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true
    };
 
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInputText('');
 
    try {
      const botResponseText = await fetchBotResponse(inputText);
 
      // Add a debug message if the response is empty
      const finalText = botResponseText || "No response received from the server";
 
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: finalText,
        isUser: false
      };
 
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (e) {
      console.error("Error handling bot response:", e);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "An error occurred while processing your message.",
        isUser: false
      };
 
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    }
  };
 
  const clearChat = async () => {
    const initialMessage: Message[] = [
      { id: '1', text: 'Hello! How can I help you today?', isUser: false }
    ];
    setMessages(initialMessage);
    saveMessages(initialMessage);
  };
 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
 
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Skibidi Car Bot</Text>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <FontAwesome name="trash" size={20} color="#C3FF65" />
          </TouchableOpacity>
        </View>
 
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => 
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => 
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
 
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C3FF65" />
          </View>
        )}
 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#9E9E9E"
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <FontAwesome name="send" size={20} color={inputText.trim() ? "#0A0A0A" : "#B8B8B8"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#121212',
  },
  headerTitle: {
    fontSize: 20,
    color: '#C3FF65',
    textAlign: 'center',
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  messagesContainer: {
    padding: 12,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 8,
    minWidth: 60,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#C3FF65',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#424242', // Lighter shade for better visibility
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#0A0A0A',
  },
  botMessageText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#2b2b2b',
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: '#2b2b2b',
    borderRadius: 25,
    fontSize: 16,
    color: '#FFFFFF',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C3FF65',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#000000',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    padding: 12,
  },
});