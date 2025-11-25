import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment configuration interface
 * Defines all available environment variables with their types
 */
export interface EnvironmentConfig {
  NEWSDATAHUB_API_KEY: string;
  PORT: number;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
  ENABLE_DEMO_MODE: boolean;
}

/**
 * Validates required environment variables and returns typed configuration
 * @throws {Error} If required environment variables are missing
 * @returns {EnvironmentConfig} Validated environment configuration
 */
function validateEnv(): EnvironmentConfig {
  const enableDemoMode: boolean = process.env.ENABLE_DEMO_MODE === 'true';

  // API key is only required when demo mode is disabled
  if (!enableDemoMode && !process.env.NEWSDATAHUB_API_KEY) {
    throw new Error('Missing required environment variable: NEWSDATAHUB_API_KEY is required when ENABLE_DEMO_MODE is not true');
  }

  // Validate PORT is a valid number
  const port: number = parseInt(process.env.PORT || '3001', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('Invalid PORT: must be a number between 1 and 65535');
  }

  return {
    NEWSDATAHUB_API_KEY: process.env.NEWSDATAHUB_API_KEY || '',
    PORT: port,
    NODE_ENV: process.env.NODE_ENV || 'development',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
    ENABLE_DEMO_MODE: enableDemoMode,
  };
}

export const config: EnvironmentConfig = validateEnv();
