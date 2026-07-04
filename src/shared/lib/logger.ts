type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = __DEV__ ? "debug" : "info";

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

export const Logger = {
  debug: (message: string, ...args: any[]) => {
    if (shouldLog("debug")) {
      console.log(`[DEBUG] [${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (shouldLog("info")) {
      console.info(`[INFO] [${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (shouldLog("warn")) {
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (shouldLog("error")) {
      console.error(
        `[ERROR] [${new Date().toISOString()}] ${message}`,
        ...args,
      );
    }
  },
};
