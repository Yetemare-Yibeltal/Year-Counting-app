export class DateValidator {
  public static isValidISOString(dateStr: string): boolean {
    if (!dateStr || typeof dateStr !== "string") return false;
    const parsed = Date.parse(dateStr);
    return !isNaN(parsed);
  }

  public static validateRange(
    startStr: string,
    endStr?: string,
  ): { valid: boolean; error?: string } {
    if (!this.isValidISOString(startStr)) {
      return {
        valid: false,
        error: "Start date must be a valid ISO 8601 date string.",
      };
    }
    if (endStr && !this.isValidISOString(endStr)) {
      return {
        valid: false,
        error: "End date must be a valid ISO 8601 date string.",
      };
    }
    return { valid: true };
  }
}
