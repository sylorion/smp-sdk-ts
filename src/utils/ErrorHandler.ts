import { logger } from './Logger.js';
import { i18n } from '../i18n/index.js';

export class ErrorHandler {
  static handleError(error: any, defaultMessageKey: string): void {
    // Guess the message error from eventual response ... or print message
    const message =
      error.response?.data?.message || i18n.translate(defaultMessageKey);
    logger.error(message);
    throw new Error(message);
  }
}
