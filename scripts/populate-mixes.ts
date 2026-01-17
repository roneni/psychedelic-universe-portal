import { db } from "../server/db";
import { mixes } from "../drizzle/schema";
import * as fs from "fs";

const genreData = JSON.parse(fs.readFileSync('/home/ubuntu/genre_playlists.json', 'utf-8'));

const genreToCategory: Record<string, "progressive-psy" | "psychedelic-trance" | "goa-trance" | "full-on"> = {
  'Progressive Psytrance': 'progressive-psy',
  'Psychedelic Trance': 'psychedelic-trance',
  'Goa Trance': 'goa-trance',
  'Full On': 'full-on'
};

async function main() {
  console.log('Starting database population...');
  
  // Clear existing mixes
  await db.delete(mixes);
  console.log('Cleared existing mixes');

  let totalInserted = 0;

  for (const [genre, videos] of Object.entries(genreData)) {
    if (genre === 'unmatched') continue;
    
    const category = genreToCategory[genre];
    if (!category) {
      console.log(`Skipping unknown genre: ${genre}`);
      continue;
    }

    console.log(`\nProcessing ${genre} (${(videos as any[]).length} videos)...`);

    // Insert in batches
    const batchSize = 50;
    const videoArray = videos as any[];
    
    for (let i = 0; i < videoArray.length; i += batchSize) {
      const batch = videoArray.slice(i, i + batchSize);
      
      const insertData = batch.map(video => ({
        title: video.title.substring(0, 255),
        youtubeId: video.videoId,
        category: category,
        artist: video.matchedArtist || null,
        thumbnailUrl: video.thumbnail || null,
        featured: false,
        sortOrder: 0
      }));

      await db.insert(mixes).values(insertData);
      totalInserted += batch.length;
      
      console.log(`  Inserted ${Math.min(i + batchSize, videoArray.length)}/${videoArray.length}`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total mixes inserted: ${totalInserted}`);
  
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
