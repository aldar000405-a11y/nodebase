import { prisma } from "./prisma";

/**
 * Test database connection with retry logic
 * Useful for checking if Neon is available before making queries
 */
export async function testDatabaseConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Database connection successful");
      return true;
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error instanceof Error ? error.message : error);
      
      if (i < retries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000;
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error("❌ Database connection failed after all retries");
  return false;
}

/**
 * Safely execute a database query with fallback
 */
export async function withDatabaseFallback<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("Database query failed, using fallback:", error instanceof Error ? error.message : error);
    return fallback;
  }
}
