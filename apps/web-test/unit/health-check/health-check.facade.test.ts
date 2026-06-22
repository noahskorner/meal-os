import { describe, expect, it } from "vitest";
import {
  createHealthCheckValidationError,
  getHealthCheck,
} from "../../../web/src/app/features/health-check/health-check.facade";

describe("health-check facade", () => {
  it("returns a healthy payload without a timestamp by default", () => {
    expect(getHealthCheck({})).toEqual({
      status: "ok",
      service: "web",
    });
  });

  it("returns a timestamp when includeTimestamp is true", () => {
    const response = getHealthCheck({ includeTimestamp: "true" });

    expect(response.status).toBe("ok");
    expect(response.service).toBe("web");
    expect(response.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/,
    );
  });

  it("creates a structured validation error response", () => {
    expect(
      createHealthCheckValidationError([
        'includeTimestamp: Invalid option: expected one of "true"|"false"',
      ]),
    ).toEqual({
      message: "Invalid query parameters.",
      issues: [
        'includeTimestamp: Invalid option: expected one of "true"|"false"',
      ],
    });
  });
});
