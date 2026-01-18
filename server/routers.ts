import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { recordAnalyticsEvent, getAnalyticsStats } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  analytics: router({
    recordEvent: publicProcedure.input(z.object({
      eventType: z.string(),
      sessionId: z.string(),
      eventData: z.string().optional(),
    })).mutation(async ({ input }) => {
      await recordAnalyticsEvent({
        eventType: input.eventType,
        sessionId: input.sessionId,
        eventData: input.eventData,
      });
      return { success: true };
    }),
    getStats: publicProcedure.query(async () => {
      return await getAnalyticsStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
