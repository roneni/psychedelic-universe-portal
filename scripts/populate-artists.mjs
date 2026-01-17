import fs from 'fs';
import mysql from 'mysql2/promise';

// Read the research results
const researchData = JSON.parse(fs.readFileSync('/home/ubuntu/research_psytrance_artists.json', 'utf8'));

// Track counts from the genre playlist data (top 20 artists)
const trackCounts = {
  "Static Movement": 96,
  "Astrix": 87,
  "Zyce": 69,
  "Liquid Soul": 67,
  "Infected Mushroom": 66,
  "Ace Ventura": 64,
  "Egorythmia": 62,
  "Avalon": 56,
  "Djantrix": 55,
  "Outsiders": 54,
  "Ritmo": 52,
  "Lunatica": 51,
  "Sonic Species": 49,
  "Vini Vici": 48,
  "Captain Hook": 47,
  "Astral Projection": 46,
  "Side Effects": 45,
  "One Function": 44,
  "Electric Universe": 43,
  "Freedom Fighters": 42
};

// Map genre names to database enum values
const genreMap = {
  "Progressive Psytrance": "progressive-psy",
  "Psychedelic Trance": "psychedelic-trance",
  "Goa Trance": "goa-trance",
  "Full-On": "full-on"
};

// Create slug from artist name
function createSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function populateArtists() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Connected to database');
  console.log(`Processing ${researchData.results.length} artists...`);
  
  let inserted = 0;
  let sortOrder = 1;
  
  for (const result of researchData.results) {
    const artist = result.output;
    const slug = createSlug(artist.artist_name);
    const primaryGenre = genreMap[artist.primary_genre] || null;
    const trackCount = trackCounts[artist.artist_name] || 0;
    
    try {
      await connection.execute(
        `INSERT INTO artists (name, slug, realName, country, primaryGenre, bio, imageUrl, websiteUrl, youtubeUrl, soundcloudUrl, spotifyUrl, instagramUrl, facebookUrl, trackCount, featured, sortOrder, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
         realName = VALUES(realName),
         country = VALUES(country),
         primaryGenre = VALUES(primaryGenre),
         bio = VALUES(bio),
         imageUrl = VALUES(imageUrl),
         websiteUrl = VALUES(websiteUrl),
         youtubeUrl = VALUES(youtubeUrl),
         soundcloudUrl = VALUES(soundcloudUrl),
         spotifyUrl = VALUES(spotifyUrl),
         instagramUrl = VALUES(instagramUrl),
         facebookUrl = VALUES(facebookUrl),
         trackCount = VALUES(trackCount),
         sortOrder = VALUES(sortOrder),
         updatedAt = NOW()`,
        [
          artist.artist_name,
          slug,
          artist.real_name || null,
          artist.country || null,
          primaryGenre,
          artist.bio || null,
          artist.image_url || null,
          artist.website_url || null,
          artist.youtube_url || null,
          artist.soundcloud_url || null,
          artist.spotify_url || null,
          artist.instagram_url || null,
          artist.facebook_url || null,
          trackCount,
          true, // featured
          sortOrder
        ]
      );
      console.log(`✓ Inserted/Updated: ${artist.artist_name} (${trackCount} tracks, ${artist.primary_genre})`);
      inserted++;
      sortOrder++;
    } catch (error) {
      console.error(`✗ Error inserting ${artist.artist_name}:`, error.message);
    }
  }
  
  console.log(`\nCompleted: ${inserted}/${researchData.results.length} artists inserted/updated`);
  
  await connection.end();
}

populateArtists().catch(console.error);
