export class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  public static info(message: string, ...args: any[]): void {
    console.log(`[INFO] [${this.getTimestamp()}] ${message}`, ...args);
  }

  public static warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] [${this.getTimestamp()}] ${message}`, ...args);
  }

  public static error(message: string, ...args: any[]): void {
    console.error(`[ERROR] [${this.getTimestamp()}] ${message}`, ...args);
  }

  public static debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] [${this.getTimestamp()}] ${message}`, ...args);
    }
  }
}
