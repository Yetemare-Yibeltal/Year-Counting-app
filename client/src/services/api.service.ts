import { YearMetrics, DetailedDateDiff } from "../types/time.types";

const BASE_URL = "/api/analytics";

export class ApiService {
  public static async fetchYearProgress(): Promise<YearMetrics> {
    const res = await fetch(`${BASE_URL}/year-progress`);
    const json = await res.json();
    if (!json.success)
      throw new Error(json.error || "Failed to fetch year metrics");
    return json.data;
  }

  public static async fetchDateDiff(
    startDate: string,
    endDate?: string,
  ): Promise<DetailedDateDiff> {
    const res = await fetch(`${BASE_URL}/calculate-diff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate }),
    });
    const json = await res.json();
    if (!json.success)
      throw new Error(json.error || "Failed to calculate diff");
    return json.data;
  }
}
