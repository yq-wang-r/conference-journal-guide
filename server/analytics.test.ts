import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("analytics", () => {
  it("records a page view event", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.recordEvent({
      eventType: "page_view",
      sessionId: "test-session-123",
      eventData: JSON.stringify({ page: "home" }),
    });

    expect(result).toEqual({ success: true });
  });

  it("records a click event", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.recordEvent({
      eventType: "click",
      sessionId: "test-session-456",
      eventData: JSON.stringify({ target: "conference-card" }),
    });

    expect(result).toEqual({ success: true });
  });

  it("retrieves analytics stats", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Record some events
    await caller.analytics.recordEvent({
      eventType: "page_view",
      sessionId: "session-1",
    });

    await caller.analytics.recordEvent({
      eventType: "page_view",
      sessionId: "session-2",
    });

    await caller.analytics.recordEvent({
      eventType: "click",
      sessionId: "session-1",
    });

    // Get stats
    const stats = await caller.analytics.getStats();

    expect(stats).toHaveProperty("totalVisits");
    expect(stats).toHaveProperty("uniqueVisitors");
    expect(stats).toHaveProperty("totalClicks");
    expect(typeof stats.totalVisits).toBe("number");
    expect(typeof stats.uniqueVisitors).toBe("number");
    expect(typeof stats.totalClicks).toBe("number");
  });
});
