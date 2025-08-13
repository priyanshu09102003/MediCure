import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL_AI_CONSULTANTS!);
export const db = drizzle({ client: sql });
