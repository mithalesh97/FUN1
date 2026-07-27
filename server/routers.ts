import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { SLANG_CATEGORIES, QUIZ_LENGTHS } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  slang: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllSlangTerms();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getSlangTermById(input.id);
    }),

    getRandomTerms: publicProcedure
      .input(z.object({ count: z.number().min(1).max(50) }))
      .query(async ({ input }) => {
        return db.getRandomSlangTerms(input.count);
      }),

    getCategories: publicProcedure.query(async () => {
      return SLANG_CATEGORIES.map(cat => ({ id: cat.id, label: cat.label }));
    }),

    getQuizTerms: publicProcedure
      .input(
        z.object({
          categories: z.union([
            z.literal("all"),
            z.array(z.enum(["tiktok", "gaming", "fashion", "emotions", "general"]))
          ]),
          quizLength: z.enum(["10", "20", "30", "100"]).transform(v => parseInt(v) as 10 | 20 | 30 | 100),
        })
      )
      .query(async ({ input }) => {
        return db.getSlangTermsForQuiz(
          input.categories === "all" ? "all" : input.categories,
          input.quizLength
        );
      }),
  }),

  quiz: router({
    recordAnswer: protectedProcedure
      .input(
        z.object({
          slangTermId: z.number(),
          quizType: z.enum(["pronunciation", "meaning"]),
          isCorrect: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.recordUserProgress(
          ctx.user.id,
          input.slangTermId,
          input.quizType,
          input.isCorrect
        );

        // Update user stats
        const stats = await db.getOrCreateUserStats(ctx.user.id);
        if (stats) {
          const totalQuizzes = stats.totalQuizzes + 1;
          const correctAnswers = input.isCorrect ? stats.correctAnswers + 1 : stats.correctAnswers;
          const streak = input.isCorrect ? stats.streakCount + 1 : 0;

          const updates: Record<string, any> = {
            totalQuizzes,
            correctAnswers,
            streakCount: streak,
            lastQuizDate: new Date(),
          };

          if (input.quizType === "pronunciation") {
            updates.pronunciationScore = input.isCorrect
              ? stats.pronunciationScore + 1
              : stats.pronunciationScore;
          } else {
            updates.meaningScore = input.isCorrect
              ? stats.meaningScore + 1
              : stats.meaningScore;
          }

          await db.updateUserStats(ctx.user.id, updates);
        }

        return { success: true };
      }),

    getUserStats: protectedProcedure.query(async ({ ctx }) => {
      const stats = await db.getOrCreateUserStats(ctx.user.id);
      if (!stats) {
        return {
          totalQuizzes: 0,
          correctAnswers: 0,
          pronunciationScore: 0,
          meaningScore: 0,
          streakCount: 0,
          accuracy: 0,
        };
      }

      const accuracy =
        stats.totalQuizzes > 0
          ? Math.round((stats.correctAnswers / stats.totalQuizzes) * 100)
          : 0;

      return {
        totalQuizzes: stats.totalQuizzes,
        correctAnswers: stats.correctAnswers,
        pronunciationScore: stats.pronunciationScore,
        meaningScore: stats.meaningScore,
        streakCount: stats.streakCount,
        accuracy,
      };
    }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).optional() }))
      .query(async ({ ctx, input }) => {
        return db.getUserProgressHistory(ctx.user.id, input.limit || 10);
      }),

    getQuizLengths: publicProcedure.query(async () => {
      return QUIZ_LENGTHS.map(length => ({ value: length, label: `${length} Questions` }));
    }),
  }),
});

export type AppRouter = typeof appRouter;
