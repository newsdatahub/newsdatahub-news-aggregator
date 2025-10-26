import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validates and exports environment configuration
 */
export interface EnvironmentConfig {
  NEWSDATAHUB_API_KEY: string;
  PORT: number;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string;
  ENABLE_DEMO_MODE: boolean;
}

/**
 * Validates required environment variables
 */
function validateEnv(): EnvironmentConfig {
  const enableDemoMode = process.env.ENABLE_DEMO_MODE === 'true';

  // API key is only required when demo mode is disabled
  if (!enableDemoMode && !process.env.NEWSDATAHUB_API_KEY) {
    throw new Error('NEWSDATAHUB_API_KEY is required when ENABLE_DEMO_MODE is not true');
  }

  return {
    NEWSDATAHUB_API_KEY: process.env.NEWSDATAHUB_API_KEY || '',
    PORT: parseInt(process.env.PORT || '3001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
    ENABLE_DEMO_MODE: enableDemoMode,
  };
}

export const config = validateEnv();
