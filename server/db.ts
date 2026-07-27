import { eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, slangTerms, userProgress, userStats, InsertUserStats, SlangCategory, QUIZ_LENGTHS, QuizLength } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSlangTerms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slangTerms);
}

export async function getSlangTermById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(slangTerms).where(eq(slangTerms.id, id)).limit(1);
  return result[0];
}

export async function getRandomSlangTerms(count: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slangTerms).orderBy(sql`RAND()`).limit(count);
}

export async function getSlangTermsByCategory(category: SlangCategory, count: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slangTerms).where(eq(slangTerms.category, category)).orderBy(sql`RAND()`).limit(count);
}

export async function getSlangTermsByCategories(categories: SlangCategory[], count: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slangTerms).where(inArray(slangTerms.category, categories)).orderBy(sql`RAND()`).limit(count);
}

export async function getSlangTermsForQuiz(categories: SlangCategory[] | "all", quizLength: QuizLength) {
  const db = await getDb();
  if (!db) return [];
  
  const count = Math.min(quizLength, 100);
  
  if (categories === "all") {
    return db.select().from(slangTerms).orderBy(sql`RAND()`).limit(count);
  }
  
  return db.select().from(slangTerms).where(inArray(slangTerms.category, categories)).orderBy(sql`RAND()`).limit(count);
}

export async function recordUserProgress(
  userId: number,
  slangTermId: number,
  quizType: "pronunciation" | "meaning",
  isCorrect: boolean
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userProgress).values({
    userId,
    slangTermId,
    quizType,
    isCorrect: isCorrect ? 1 : 0,
  });
}

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
  return result[0];
}

export async function getOrCreateUserStats(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const existing = await getUserStats(userId);
  if (existing) return existing;
  
  await db.insert(userStats).values({ userId });
  return getUserStats(userId);
}

export async function updateUserStats(
  userId: number,
  updates: Partial<InsertUserStats>
) {
  const db = await getDb();
  if (!db) return;
  await db.update(userStats).set(updates).where(eq(userStats.userId, userId));
}

export async function getUserProgressHistory(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(limit);
}

export function isValidQuizLength(length: unknown): length is QuizLength {
  return QUIZ_LENGTHS.includes(length as QuizLength);
}
