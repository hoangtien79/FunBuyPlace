
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

// Mock reports data
const mockReports = [
  {
    id: '1',
    type: 'listing',
    reportedItem: {
      id: '123',
      title: 'Suspicious Electronics Deal',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop',
    },
    reportedBy: {
      name: 'Sarah Wilson',
      id: 'user456',
    },
    reportedUser: {
      name: 'John Scammer',
      id: 'user789',
    },
    reason: 'Counterfeit goods',
    description: 'This listing appears to be selling counterfeit electronics. The price is suspiciously low and the images look stolen.',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    evidence: ['Screenshot of original listing', 'Price comparison'],
  },
  {
    id: '2',
    type: 'user',
    reportedItem: null,
    reportedBy: {
      name: 'Mike Johnson',
      id: 'user321',
    },
    reportedUser: {
      name: 'Spam Account',
      id: 'user654',
    },
    reason: 'Harassment',
    description: 'This user has been sending inappropriate messages and harassing other users in the chat.',
    status: 'investigating',
    priority: 'medium',
    createdAt: '2024-01-14T15:45:00Z',
    evidence: ['Chat screenshots', 'Multiple user complaints'],
  },
  {
    id: '3',
    type: 'listing',
    reportedItem: {
      id: '456',
      title: 'Inappropriate Content',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop',
    },
    reportedBy: {
      name: 'Lisa Chen',
      id: 'user987',
    },
    reportedUser: {
      name: 'Bad Seller',
      id: 'user147',
    },
    reason: 'Inappropriate content',
    description: 'This listing contains inappropriate images that violate community guidelines.',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-01-13T09:15:00Z',
    evidence: ['Content screenshots'],
    resolution: 'Listing removed and user warned',
  },
];

const reportStatuses = ['all', 'pending', 'investigating', 'resolved', 'dismissed'] as const;
const reportPriorities = ['all', 'low', 'medium', 'high', 'urgent'] as const;

export default function ReportsModeration() {
  const [selectedStatus, setSelectedStatus] = useState<typeof reportStatuses[number]>('all');
  const [selectedPriority, setSelectedPriority] = useState<typeof reportPriorities[number]>('all');
  const [reports, setReports] = useState(mockReports);

  const handleReportAction = (reportId: string, action: string) => {
    console.log('Report action:', action, 'for report:', reportId);
    
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    switch (action) {
      case 'investigate':
        setReports(prev => prev.map(r => 
          r.id === reportId ? { ...r, status: 'investigating' } : r
        ));
        break;
      case 'resolve':
        Alert.prompt(
          'Resolve Report',
          'Please provide a resolution summary:',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Resolve', 
              onPress: (resolution) => {
                setReports(prev => prev.map(r => 
                  r.id === reportId ? { 
                    ...r, 
                    status: 'resolved',
                    resolution: resolution || 'Report resolved by admin'
                  } : r
                ));
              }
            }
          ],
          'plain-text'
        );
        break;
      case 'dismiss':
        Alert.alert(
          'Dismiss Report',
          'Are you sure you want to dismiss this report?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Dismiss', 
              style: 'destructive',
              onPress: () => {
                setReports(prev => prev.map(r => 
                  r.id === reportId ? { ...r, status: 'dismissed' } : r
                ));
              }
            }
          ]
        );
        break;
      case 'view_item':
        if (report.reportedItem) {
          router.push(`/item/${report.reportedItem.id}` as any);
        }
        break;
      case 'view_user':
        router.push(`/admin/users/${report.reportedUser.id}` as any);
        break;
      case 'contact_reporter':
        router.push(`/messages/${report.reportedBy.id}` as any);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'investigating': return colors.primary;
      case 'resolved': return colors.success;
      case 'dismissed': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return colors.error;
      case 'high': return '#FF6B35';
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  const renderReport = (report: typeof mockReports[0]) => (
    <View key={report.id} style={[styles.reportCard, report.priority === 'urgent' && styles.urgentReport]}>
      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <View style={styles.reportTitleRow}>
            <Text style={styles.reportType}>
              {report.type === 'listing' ? 'Listing Report' : 'User Report'}
            </Text>
            <View style={styles.reportBadges}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(report.priority) }]}>
                <Text style={styles.badgeText}>{report.priority.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                <Text style={styles.badgeText}>{report.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.reportReason}>{report.reason}</Text>
          <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
        </View>
      </View>

      {report.reportedItem && (
        <View style={styles.reportedItem}>
          <Image source={{ uri: report.reportedItem.image }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{report.reportedItem.title}</Text>
            <Text style={styles.itemId}>ID: {report.reportedItem.id}</Text>
          </View>
        </View>
      )}

      <View style={styles.reportDetails}>
        <Text style={styles.reportDescription}>{report.description}</Text>
        
        <View style={styles.reportParties}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Reported by:</Text>
            <Text style={styles.partyName}>{report.reportedBy.name}</Text>
          </View>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Reported user:</Text>
            <Text style={styles.partyName}>{report.reportedUser.name}</Text>
          </View>
        </View>

        {report.evidence && report.evidence.length > 0 && (
          <View style={styles.evidence}>
            <Text style={styles.evidenceTitle}>Evidence:</Text>
            {report.evidence.map((item, index) => (
              <Text key={index} style={styles.evidenceItem}>• {item}</Text>
            ))}
          </View>
        )}

        {report.resolution && (
          <View style={styles.resolution}>
            <Text style={styles.resolutionTitle}>Resolution:</Text>
            <Text style={styles.resolutionText}>{report.resolution}</Text>
          </View>
        )}
      </View>

      <View style={styles.reportActions}>
        {report.status === 'pending' && (
          <Pressable
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => handleReportAction(report.id, 'investigate')}
          >
            <IconSymbol name="magnifyingglass" color="white" size={16} />
            <Text style={styles.actionButtonText}>Investigate</Text>
          </Pressable>
        )}

        {report.status === 'investigating' && (
          <Pressable
            style={[styles.actionButton, styles.successAction]}
            onPress={() => handleReportAction(report.id, 'resolve')}
          >
            <IconSymbol name="checkmark" color="white" size={16} />
            <Text style={styles.actionButtonText}>Resolve</Text>
          </Pressable>
        )}

        {report.reportedItem && (
          <Pressable
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => handleReportAction(report.id, 'view_item')}
          >
            <IconSymbol name="eye" color={colors.primary} size={16} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>View Item</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => handleReportAction(report.id, 'view_user')}
        >
          <IconSymbol name="person" color={colors.primary} size={16} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>View User</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => handleReportAction(report.id, 'contact_reporter')}
        >
          <IconSymbol name="message" color={colors.primary} size={16} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Contact</Text>
        </Pressable>

        {report.status !== 'dismissed' && report.status !== 'resolved' && (
          <Pressable
            style={[styles.actionButton, styles.dangerAction]}
            onPress={() => handleReportAction(report.id, 'dismiss')}
          >
            <IconSymbol name="xmark" color="white" size={16} />
            <Text style={styles.actionButtonText}>Dismiss</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Reports & Moderation',
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
        {/* Filters */}
        <View style={styles.filtersContainer}>
          {renderFilterButton(reportStatuses, selectedStatus, setSelectedStatus, 'Status')}
          {renderFilterButton(reportPriorities, selectedPriority, setSelectedPriority, 'Priority')}
        </View>

        {/* Reports List */}
        <ScrollView
          style={styles.reportsList}
          contentContainerStyle={styles.reportsListContent}
          showsVerticalScrollIndicator={false}
        >
          {reports.map(renderReport)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: colors.background,
    paddingVertical: 12,
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
  reportsList: {
    flex: 1,
  },
  reportsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reportCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urgentReport: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  reportHeader: {
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportType: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  reportBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  reportReason: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reportedItem: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  itemId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reportDetails: {
    marginBottom: 16,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reportParties: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  party: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  evidence: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  evidenceItem: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resolution: {
    backgroundColor: colors.success + '20',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  resolutionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 4,
  },
  resolutionText: {
    fontSize: 12,
    color: colors.text,
  },
  reportActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
    minWidth: 80,
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
  dangerAction: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});
