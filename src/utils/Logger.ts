import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors } = winston.format;

// Définir le format de log personnalisé
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Créer un logger Winston avec rotation des fichiers
const logger = winston.createLogger({
  level: 'info', // Niveau par défaut (debug, info, warn, error)
  format: combine(
    timestamp(),
    errors({ stack: true }), // Capture la stack trace pour les erreurs
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: logFormat, //winston.format.simple(),
    }),
    new DailyRotateFile({
      dirname: 'logs', // Répertoire pour les logs
      filename: 'smp-application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // Garder les logs pendant 14 jours
    }),
  ],
});

// Capturer les exceptions non gérées
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

// Capturer les promesses rejetées non gérées
logger.rejections.handle(
  new winston.transports.File({ filename: 'logs/rejections.log' })
);

export { logger };
