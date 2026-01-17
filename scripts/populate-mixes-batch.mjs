import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const genreData = JSON.parse(fs.readFileSync('/home/ubuntu/genre_playlists.json', 'utf-8'));

const genreToCategory = {
  'Progressive Psytrance': 'progressive-psy',
  'Psychedelic Trance': 'psychedelic-trance',
  'Goa Trance': 'goa-trance',
  'Full On': 'full-on'
};

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL not found');
  }

  const url = new URL(dbUrl);
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connected to database');

  // Clear existing mixes
  await connection.execute('DELETE FROM mixes');
  console.log('Cleared existing mixes');

  let totalInserted = 0;

  for (const [genre, videos] of Object.entries(genreData)) {
    if (genre === 'unmatched') continue;
    
    const category = genreToCategory[genre];
    if (!category) {
      console.log(`Skipping unknown genre: ${genre}`);
      continue;
    }

    console.log(`Processing ${genre} (${videos.length} videos)...`);

    // Batch insert - 100 at a time
    const batchSize = 100;
    for (let i = 0; i < videos.length; i += batchSize) {
      const batch = videos.slice(i, i + batchSize);
      
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, 0, 0)').join(', ');
      const values = batch.flatMap(video => [
        video.title.substring(0, 255),
        video.videoId,
        category,
        video.matchedArtist || null,
        video.thumbnail || null
      ]);

      await connection.execute(
        `INSERT INTO mixes (title, youtubeId, category, artist, thumbnailUrl, featured, sortOrder) VALUES ${placeholders}`,
        values
      );
      
      totalInserted += batch.length;
      process.stdout.write(`\\r  Progress: ${Math.min(i + batchSize, videos.length)}/${videos.length}`);
    }
    console.log(' - Done');
  }

  console.log(`\\n=== Summary ===`);
  console.log(`Total mixes inserted: ${totalInserted}`);

  // Get counts by category
  const [rows] = await connection.execute(
    'SELECT category, COUNT(*) as count FROM mixes GROUP BY category'
  );
  console.log('\\nMixes by category:');
  for (const row of rows) {
    console.log(`  ${row.category}: ${row.count}`);
  }

  await connection.end();
  console.log('\\nDatabase population complete!');
}

main().catch(console.error);
