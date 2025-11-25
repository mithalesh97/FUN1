import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("slang router", () => {
  it("should get all slang terms", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.slang.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    
    const firstTerm = result[0];
    expect(firstTerm).toHaveProperty("id");
    expect(firstTerm).toHaveProperty("term");
    expect(firstTerm).toHaveProperty("meaning");
    expect(firstTerm).toHaveProperty("pronunciation");
  });

  it("should get slang term by id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First get all terms to find a valid id
    const allTerms = await caller.slang.getAll();
    expect(allTerms.length).toBeGreaterThan(0);

    const termId = allTerms[0].id;
    const result = await caller.slang.getById({ id: termId });

    expect(result).toBeDefined();
    expect(result?.id).toBe(termId);
    expect(result?.term).toBeDefined();
    expect(result?.meaning).toBeDefined();
  });

  it("should get random slang terms", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.slang.getRandomTerms({ count: 5 });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(5);
    expect(result.length).toBeGreaterThan(0);

    result.forEach((term) => {
      expect(term).toHaveProperty("id");
      expect(term).toHaveProperty("term");
      expect(term).toHaveProperty("meaning");
      expect(term).toHaveProperty("pronunciation");
    });
  });
});

describe("quiz router - stats only", () => {
  it("should get user stats for new user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.quiz.getUserStats();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("totalQuizzes");
    expect(result).toHaveProperty("correctAnswers");
    expect(result).toHaveProperty("pronunciationScore");
    expect(result).toHaveProperty("meaningScore");
    expect(result).toHaveProperty("streakCount");
    expect(result).toHaveProperty("accuracy");

    // Initial stats should be 0
    expect(result.totalQuizzes).toBeGreaterThanOrEqual(0);
    expect(result.correctAnswers).toBeGreaterThanOrEqual(0);
    expect(result.accuracy).toBeGreaterThanOrEqual(0);
  });

  it("should get quiz history", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get history
    const history = await caller.quiz.getHistory({ limit: 10 });

    expect(Array.isArray(history)).toBe(true);
    
    if (history.length > 0) {
      const firstEntry = history[0];
      expect(firstEntry).toHaveProperty("userId");
      expect(firstEntry).toHaveProperty("slangTermId");
      expect(firstEntry).toHaveProperty("quizType");
      expect(firstEntry).toHaveProperty("isCorrect");
    }
  });
});

describe("database helpers", () => {
  it("should retrieve all slang terms from database", async () => {
    const allTerms = await db.getAllSlangTerms();

    expect(Array.isArray(allTerms)).toBe(true);
    expect(allTerms.length).toBeGreaterThan(0);

    const firstTerm = allTerms[0];
    expect(firstTerm.term).toBeDefined();
    expect(firstTerm.meaning).toBeDefined();
    expect(firstTerm.pronunciation).toBeDefined();
  });

  it("should retrieve a specific slang term by id", async () => {
    const allTerms = await db.getAllSlangTerms();
    expect(allTerms.length).toBeGreaterThan(0);

    const termId = allTerms[0].id;
    const term = await db.getSlangTermById(termId);

    expect(term).toBeDefined();
    expect(term?.id).toBe(termId);
    expect(term?.term).toBeDefined();
  });

  it("should retrieve random slang terms", async () => {
    const randomTerms = await db.getRandomSlangTerms(5);

    expect(Array.isArray(randomTerms)).toBe(true);
    expect(randomTerms.length).toBeLessThanOrEqual(5);
    expect(randomTerms.length).toBeGreaterThan(0);

    randomTerms.forEach((term) => {
      expect(term.id).toBeDefined();
      expect(term.term).toBeDefined();
      expect(term.meaning).toBeDefined();
    });
  });
});
