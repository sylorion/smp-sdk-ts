import { logger } from './Logger.js';
import { i18n } from '../i18n/index.js';

export class ErrorHandler {
  static handleError(error: any, defaultMessageKey: string): never {
    // Preserve the original error message if available (e.g. rate-limiting, wrong password)
    const message =
      error?.message ||
      error?.response?.data?.message ||
      i18n.translate(defaultMessageKey);
    logger.error(message);
    throw new Error(message);
  }
}
