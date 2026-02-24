// ============================================================
// MindForge Type Definitions
// Central type definitions for all Firebase models and app state
// ============================================================

// --- User ---
export interface UserAvatar {
  skinColor?: string
  hairColor?: string
  hairStyle?: string
  eyes?: string
  eyeType?: string
  eyeColor?: string
  eyebrows?: string
  mouth?: string
  accessory?: string
  bgStyle?: string
  bodyType?: string
  clothingStyle?: string
  clothingColor?: string
  hat?: string
}

export interface UserSocialLinks {
  website?: string
  twitter?: string
  youtube?: string
}

export interface User {
  uid: string
  username: string
  email: string
  bio?: string
  avatar?: UserAvatar
  socialLinks?: UserSocialLinks
  activeTitle?: string
  isPremium?: boolean
  isTeacher?: boolean
  isAdmin?: boolean
  mindCoins: number
  xp: number
  level: number
  gamesPlayed: number
  gamesCreated: number
  streak: number
  lastLoginDate?: string
  createdAt: string
  updatedAt?: string
  followers?: string[]
  following?: string[]
  friends?: string[]
  friendRequests?: FriendRequest[]
  ownedItems?: string[]
  equippedItems?: EquippedItems
  achievements?: string[]
  purchasedGames?: string[]
}

export interface FriendRequest {
  id: string
  from: string
  to: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface EquippedItems {
  hat?: string
  accessory?: string
  frame?: string
  background?: string
  effect?: string
}

// --- Game ---
export type GameDifficulty = 'easy' | 'medium' | 'hard'
export type GameStatus = 'draft' | 'published' | 'archived'

export interface GameQuestion {
  id: string
  question: string
  answers: string[]
  correctAnswer: number
  timeLimit?: number
  points?: number
  image?: string
}

export interface Game {
  id: string
  title: string
  description: string
  creatorId: string
  creatorName: string
  thumbnail?: string
  screenshots?: string[]
  tags: string[]
  subject?: string
  difficulty?: GameDifficulty
  status: GameStatus
  type: 'quiz' | 'freeform' | 'template'
  questions?: GameQuestion[]
  htmlContent?: string
  zipUrl?: string
  price: number
  plays: number
  views: number
  likes: number
  dislikes: number
  ratings?: GameRating[]
  averageRating?: number
  createdAt: string
  updatedAt?: string
}

export interface GameRating {
  userId: string
  username: string
  rating: number
  comment?: string
  createdAt: string
}

// --- Achievement ---
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type AchievementCategory = 'gameplay' | 'social' | 'creation' | 'exploration' | 'special'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  category: AchievementCategory
  requirement: AchievementRequirement
  reward?: AchievementReward
  unlockedAt?: string
}

export interface AchievementRequirement {
  type: string
  target: number
  current?: number
}

export interface AchievementReward {
  type: 'title' | 'badge' | 'frame' | 'item'
  value: string
}

// --- Event ---
export type EventStatus = 'active' | 'upcoming' | 'ended'

export interface GameEvent {
  id: string
  title: string
  description: string
  type: string
  status: EventStatus
  startDate: string
  endDate: string
  participants: number
  maxParticipants?: number
  reward: EventReward
  tasks: EventTask[]
  image?: string
}

export interface EventReward {
  type: 'xp' | 'mindcoins' | 'title' | 'item'
  value: number | string
  label: string
}

export interface EventTask {
  id: string
  description: string
  target: number
  current?: number
  completed?: boolean
}

// --- Marketplace Asset ---
export type AssetType = 'model' | 'texture' | 'audio' | 'sprite' | 'template'
export type AssetRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface MarketplaceAsset {
  id: string
  name: string
  description: string
  type: AssetType
  rarity: AssetRarity
  creatorId: string
  creatorName: string
  price: number
  thumbnail: string
  downloadUrl?: string
  downloads: number
  rating: number
  tags: string[]
  createdAt: string
}

// --- Notification ---
export type NotificationType =
  | 'achievement'
  | 'friend_request'
  | 'friend_accepted'
  | 'follow'
  | 'game_like'
  | 'game_play'
  | 'level_up'
  | 'event'
  | 'system'
  | 'reward'
  | 'streak'
  | 'comment'
  | 'mention'
  | 'milestone'
  | 'welcome'
  | 'premium'
  | 'leaderboard'
  | 'challenge'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  read: boolean
  link?: string
  createdAt: string
}

// --- Transaction ---
export type TransactionType = 'purchase' | 'spend' | 'credit' | 'reward'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  balanceAfter: number
  createdAt: string
}

// --- MindCoin Package ---
export interface CoinPackage {
  id: string
  name: string
  coins: number
  bonus: number
  price: number
  badge?: string
  popular?: boolean
}

// --- Discount Code ---
export interface DiscountCode {
  code: string
  discount: number
  type: 'percent' | 'fixed'
  expiresAt?: string
  maxUses?: number
  usedCount?: number
  active: boolean
}

// --- Social Feed ---
export type ActivityType =
  | 'game_played'
  | 'game_created'
  | 'achievement_unlocked'
  | 'level_up'
  | 'friend_added'
  | 'event_joined'
  | 'streak_milestone'
  | 'rating_given'
  | 'comment_posted'

export interface SocialActivity {
  id: string
  userId: string
  username: string
  type: ActivityType
  data: Record<string, unknown>
  createdAt: string
  likes?: number
  comments?: SocialComment[]
}

export interface SocialComment {
  id: string
  userId: string
  username: string
  text: string
  createdAt: string
}

// --- Premium Tier ---
export type PremiumTier = 'free' | 'creator' | 'teacher'

export interface PremiumPlan {
  id: PremiumTier
  name: string
  price: number
  features: string[]
  monthlyCoins: number
}

// --- Inventory Item ---
export interface InventoryItem {
  id: string
  name: string
  type: 'frame' | 'hairColor' | 'background' | 'effect' | 'accessory' | 'hat'
  rarity: AssetRarity
  equipped: boolean
  acquiredAt: string
  thumbnail?: string
}

// --- Quiz Arena ---
export interface QuizRoom {
  id: string
  code: string
  hostId: string
  players: QuizPlayer[]
  status: 'waiting' | 'playing' | 'finished'
  currentQuestion: number
  questions: GameQuestion[]
  category: string
}

export interface QuizPlayer {
  id: string
  username: string
  score: number
  isBot?: boolean
  isReady?: boolean
}

// --- Leaderboard ---
export type LeaderboardPeriod = 'all' | 'week' | 'month'

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar?: UserAvatar
  xp: number
  level: number
  gamesPlayed: number
  streak: number
  isPremium?: boolean
  activeTitle?: string
}

// --- Auth Context ---
export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => void
}

// --- Toast Context ---
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

// --- Theme ---
export type Theme = 'dark' | 'light' | 'high-contrast'

// --- Component Props ---
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export interface GameCardProps {
  game: Game
  onClick?: () => void
  compact?: boolean
}

export interface AvatarRendererProps {
  skinColor?: string
  hairColor?: string
  hairStyle?: string
  eyeType?: string
  eyebrows?: string
  mouth?: string
  accessory?: string
  bgStyle?: string
  bodyType?: string
  clothingStyle?: string
  clothingColor?: string
  hat?: string
  size?: number
  username?: string
  className?: string
}
