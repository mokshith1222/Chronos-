/**
 * GLOBAL DOMAIN ARCHITECTURE LAYER
 * As defined in the Official Domain Model & Data Architecture Bible
 * 
 * Strict Type definitions for all core and edge entities.
 */

// ============================================================================
// SHARED TYPES & ENUMS
// ============================================================================

export type UUID = string;
export type ISO8601 = string; // e.g., "2026-06-29T10:00:00Z"
export type HEXColor = string; // e.g., "#FF0000"

export enum EntityState {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED"
}

export enum PriorityLevel {
  URGENT = 4,
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
  NONE = 0
}

export interface BaseEntity {
  id: UUID;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt?: ISO8601 | null;
  state: EntityState;
}

// ============================================================================
// CORE ENTITIES (Hierarchy)
// ============================================================================

export interface Workspace extends BaseEntity {
  name: string;
  ownerId: UUID;
  settings: Record<string, any>;
}

export interface Project extends BaseEntity {
  workspaceId: UUID;
  name: string;
  description?: string;
  color: HEXColor;
  icon?: string;
  startDate?: ISO8601;
  dueDate?: ISO8601;
  isFavorite: boolean;
}

export interface Task extends BaseEntity {
  projectId: UUID | null; // Nullable for Inbox tasks
  parentId: UUID | null; // For Subtasks
  title: string;
  description?: string;
  priority: PriorityLevel;
  dueDate?: ISO8601;
  completedAt?: ISO8601 | null;
  order: number;
  tags: UUID[];
}

// ============================================================================
// TIME & PRODUCTIVITY ENTITIES
// ============================================================================

export enum SessionType {
  POMODORO = "POMODORO",
  DEEP_WORK = "DEEP_WORK",
  BREAK = "BREAK",
  MEETING = "MEETING"
}

export interface TimeEntry extends BaseEntity {
  taskId: UUID | null;
  projectId: UUID | null;
  startTime: ISO8601;
  endTime?: ISO8601 | null;
  durationSeconds: number;
  description?: string;
  sessionType: SessionType;
}

export interface CalendarEvent extends BaseEntity {
  title: string;
  description?: string;
  startTime: number; // Minutes from midnight (e.g., 540 = 9:00 AM)
  duration: number; // Minutes
  color: string; // Tailwind class or HEX
  projectId: UUID | null;
}

export interface DailyPlanner extends BaseEntity {
  date: ISO8601; // YYYY-MM-DD
  focusObjective: string;
  energyLevel: number; // 1-10
  rating?: number;
}

// ============================================================================
// GOALS & HABITS ENTITIES
// ============================================================================

export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  targetDate: ISO8601;
  progress: number; // 0.0 to 1.0
  color: HEXColor;
  icon: string;
  milestones: Milestone[];
}

export interface Milestone extends BaseEntity {
  goalId: UUID;
  title: string;
  isCompleted: boolean;
  dueDate?: ISO8601;
}

export interface Habit extends BaseEntity {
  title: string;
  description?: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  color: HEXColor;
  icon: string;
  history: Record<string, boolean>; // Key: YYYY-MM-DD, Value: completed
  streak: number;
  longestStreak: number;
}

// ============================================================================
// KNOWLEDGE & CONTENT ENTITIES
// ============================================================================

export interface Note extends BaseEntity {
  folderId: UUID | null;
  title: string;
  content: string; // Markdown string
  tags: UUID[];
  isPinned: boolean;
}

export interface Folder extends BaseEntity {
  parentId: UUID | null;
  name: string;
  color: HEXColor;
  icon: string;
}

export interface Tag extends BaseEntity {
  name: string;
  color: HEXColor;
}

// ============================================================================
// SYSTEM & SETTINGS ENTITIES
// ============================================================================

export interface AppSettings {
  theme: "light" | "dark" | "system";
  accentColor: HEXColor;
  timeZone: string;
  startOfWeek: 0 | 1 | 6; // Sunday, Monday, Saturday
  enableNotifications: boolean;
  soundEnabled: boolean;
}

export interface Notification extends BaseEntity {
  userId: UUID;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
}

// ============================================================================
// STORE STATE INTERFACES
// ============================================================================

export interface OrganizationState {
  projects: Project[];
  tasks: Task[];
  addProject: (name: string, color: string) => void;
  addTask: (title: string, projectId: string | null) => void;
  updateTaskStatus: (taskId: string, status: EntityState) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}
