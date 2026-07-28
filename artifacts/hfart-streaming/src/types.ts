export type CategoryType =
  | 'Live Now'
  | 'Recommended For You'
  | 'Trending in South Africa'
  | 'Music'
  | 'Gaming'
  | 'Sports'
  | 'Podcasts'
  | 'News'
  | 'Entertainment'
  | 'New Creators'
  | 'Trending';

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  verified: boolean;
  isLive: boolean;
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  totalViews: number;
  bio: string;
  country?: string;
  isFollowing?: boolean;
  isSubscribed?: boolean;
}

export interface AdBreakState {
  isScheduled: boolean;
  startsInSeconds: number;
  breakDurationSeconds: number;
  isBreakActive: boolean;
  currentAdIndex: number;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  creator: Creator;
  thumbnail: string;
  viewerCount: number;
  likesCount: number;
  startedAt: string;
  isLive: boolean;
  tags: string[];
  streamUrl?: string;
  visibility: 'Public' | 'Followers' | 'Subscribers';
  allowClips: boolean;
  enableChat: boolean;
  recordStream: boolean;
  adBreak?: AdBreakState;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  isBadge?: string;
  isGift?: boolean;
  giftType?: string;
  isMuted?: boolean;
}

export interface Clip {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  thumbnail: string;
  duration: string;
  views: number;
  createdAt: string;
}

export interface Recording {
  id: string;
  title: string;
  category: CategoryType;
  thumbnail: string;
  duration: string;
  views: number;
  date: string;
}

export interface CommunityPost {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
}

export interface AdCampaign {
  id: string;
  advertiserName: string;
  title: string;
  videoUrl: string;
  durationSeconds: number;
  cpm: number;
  impressions: number;
  status: 'Active' | 'Paused' | 'Scheduled';
  bannerImage: string;
}

export interface CreatorAnalytics {
  totalViews: number;
  peakConcurrentViewers: number;
  totalWatchTimeHours: number;
  avgWatchTimeMinutes: number;
  adRevenueHV100: number;
  subscriberRevenueUsd: number;
  followerGrowth: number;
  sharesCount: number;
  likesCount: number;
  chatMessagesCount: number;
}

export interface UserNotification {
  id: string;
  type: 'live' | 'follower' | 'reply' | 'reminder' | 'subscription' | 'announcement' | 'message';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  avatar?: string;
  linkAction?: string;
}

export type NotificationItem = UserNotification;

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  country?: string;
  dateOfBirth?: string;
  avatar: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  sparklesBalance?: number;
  isCreator?: boolean;
  verified?: boolean;
  isGuest?: boolean;
  agreedToTerms?: boolean;
  agreedToGuidelines?: boolean;
  bannerUrl?: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  costSparkles: number;
  color: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantVerified: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

// All view modes — no admin, business portal or developer portal
export type ViewMode =
  | 'home'
  | 'discover'
  | 'live_watch'
  | 'profile'
  | 'creator_studio'
  | 'go_live_setup'
  | 'while_live_creator'
  | 'messages'
  | 'settings';
