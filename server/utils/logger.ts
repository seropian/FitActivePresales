/**
 * Simple logging utility for the application
 */

// LogLevel and LogEntry types available if needed

const LOG_LEVELS: Record<string, number> = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
} as const;

const LOG_COLORS: Record<string, string> = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[37m', // White
  RESET: '\x1b[0m'   // Reset
} as const;

class Logger {
  private level: string;
  private currentLevel: number;

  constructor() {
    this.level = process.env.LOG_LEVEL || 'INFO';
    this.currentLevel = (LOG_LEVELS[this.level as keyof typeof LOG_LEVELS] ?? LOG_LEVELS.INFO) as number;
  }

  private formatMessage(level: string, message: string, meta: Record<string, any> = {}): string {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level] || LOG_COLORS.RESET;
    const reset = LOG_COLORS.RESET;

    let formatted = `${color}[${timestamp}] ${level}: ${message}${reset}`;

    if (Object.keys(meta).length > 0) {
      formatted += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return formatted;
  }

  private log(level: string, message: string, meta: Record<string, any> = {}): void {
    const levelValue = LOG_LEVELS[level];
    if (levelValue !== undefined && levelValue <= this.currentLevel) {
      console.log(this.formatMessage(level, message, meta));
    }
  }

  error(message: string, meta: Record<string, any> = {}): void {
    this.log('ERROR', message, meta);
  }

  warn(message: string, meta: Record<string, any> = {}): void {
    this.log('WARN', message, meta);
  }

  info(message: string, meta: Record<string, any> = {}): void {
    this.log('INFO', message, meta);
  }

  debug(message: string, meta: Record<string, any> = {}): void {
    this.log('DEBUG', message, meta);
  }
}

export const logger = new Logger();
