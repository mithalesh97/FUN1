import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const slangTerms = mysqlTable("slang_terms", {
  id: int("id").autoincrement().primaryKey(),
  term: varchar("term", { length: 100 }).notNull().unique(),
  meaning: text("meaning").notNull(),
  pronunciation: varchar("pronunciation", { length: 255 }).notNull(),
  example: text("example"),
  category: mysqlEnum("category", [
    "tiktok",
    "gaming",
    "fashion",
    "emotions",
    "general"
  ]).default("general").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SlangTerm = typeof slangTerms.$inferSelect;
export type InsertSlangTerm = typeof slangTerms.$inferInsert;

export const SLANG_CATEGORIES = [
  { id: "tiktok", label: "TikTok & Social Media" },
  { id: "gaming", label: "Gaming & Streaming" },
  { id: "fashion", label: "Fashion & Style" },
  { id: "emotions", label: "Emotions & Reactions" },
  { id: "general", label: "General/Everyday" },
] as const;

export type SlangCategory = typeof SLANG_CATEGORIES[number]["id"];

export const QUIZ_LENGTHS = [10, 20, 30, 100] as const;
export type QuizLength = typeof QUIZ_LENGTHS[number];

export const QUIZ_TYPES = ["pronunciation", "meaning"] as const;
export type QuizTypeOption = typeof QUIZ_TYPES[number];

export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  slangTermId: int("slangTermId").notNull().references(() => slangTerms.id, { onDelete: "cascade" }),
  quizType: mysqlEnum("quizType", ["pronunciation", "meaning"]).notNull(),
  isCorrect: int("isCorrect").notNull().default(0),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

export const userStats = mysqlTable("user_stats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  totalQuizzes: int("totalQuizzes").notNull().default(0),
  correctAnswers: int("correctAnswers").notNull().default(0),
  pronunciationScore: int("pronunciationScore").notNull().default(0),
  meaningScore: int("meaningScore").notNull().default(0),
  streakCount: int("streakCount").notNull().default(0),
  lastQuizDate: timestamp("lastQuizDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;