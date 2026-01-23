# Psychedelic Universe Portal - TODO

## Completed Features
- [x] Hero section with branding and live radio player UI
- [x] Categorized mix navigation (Goa Trance, Progressive Psy, Full-On, Psychill)
- [x] YouTube video embeds section (FeaturedMixes)
- [x] Newsletter signup form
- [x] Brand partners carousel
- [x] Footer with social CTAs
- [x] Persistent audio player UI (visual prototype)
- [x] Real-time YouTube subscriber counter with API integration
- [x] Graceful fallback to simulation mode for dev environment
- [x] Cyber-shamanic design theme (dark mode, glassmorphism)
- [x] Upgrade to full-stack application (database + auth)
- [x] Database schema for Mixes, Partners, Settings, Subscribers
- [x] Admin Dashboard at /admin route
- [x] Admin CRUD for Mixes management
- [x] Admin CRUD for Partners management
- [x] Admin view for Newsletter Subscribers
- [x] Admin Settings management (stream URL, YouTube credentials)
- [x] Admin authentication and role-based access control
- [x] Unit tests for admin database helpers

## In Progress
- [x] Connect frontend components to dynamic database content
- [x] Make FeaturedMixes read from database instead of hardcoded
- [x] Make PartnersCarousel read from database
- [x] Connect Newsletter signup to database

## Future Enhancements
- [ ] Connect real audio stream URL (Icecast/Shoutcast) to make player functional
- [ ] Auto-fetch latest YouTube videos using API
- [ ] Publish to permanent domain to enable live subscriber counter

## YouTube Channel Scan
- [x] Fetch all 5000+ videos from Psychedelic Universe channel (5350 fetched)
- [x] Extract artist names from video titles
- [x] Compile deduplicated artist list with video counts (1622 unique artists)
- [x] Deliver comprehensive artist list for categorization

## Artist Genre Categorization Project
- [x] Clean duplicates and false entries from artist CSV (1368 unique artists)
- [x] Research genre classifications (Progressive, Psychedelic, Goa, Full On, Psychill)
- [x] Cross-reference artists with genre research (318 artists with 5+ tracks categorized)
- [x] Create comprehensive artist-genre mapping document

## Follow-Up: Website Genre Updates (Complete)
- [x] Add new "Psychedelic Trance" section to website
- [x] Reorder genres: Progressive Psytrance / Psychedelic Trance / Goa Trance / Full On / Psychill Ambient
- [x] Update genre count from 4 to 5 sections
- [x] Update database schema (added psychedelic-trance category)
- [x] Update frontend components (MixGrid, Footer, Admin)

## YouTube Search Feature (Complete)
- [x] Set up YouTube Data API integration on server
- [x] Create search bar component with auto-complete UI
- [x] Connect frontend to backend search endpoint
- [x] Test search with real artist and track names (Astrix, Infected Mushroom - working)

## Pending: Background Images (Complete)
- [x] Generate background image for Psychedelic Trance genre card
- [x] Generate background image for Psychill/Ambient genre card
- [x] Add images to website (saved directly to public/images/)

## Radio Streaming Setup
- [x] Research free radio streaming solutions
- [x] Create comprehensive guide for user
- [ ] Connect live radio stream URL to persistent player (waiting for user to set up stream)

## YouTube Playlist Player Integration
- [x] Create Radio Mode section under Psy Portal with YouTube mixes player
- [x] Link "Listen Live 24/7" button to Radio Mode section
- [x] Maintain cosmic psychedelic design in new section
- [x] Update bottom persistent player to use main playlist (3200+ tracks)
- [x] Show track title data on bottom player
- [x] Make YouTube logo and track name clickable (links to YouTube)
- [x] Clickable elements only visible on hover
- [ ] Main playlist: https://www.youtube.com/playlist?list=PLIVLAENoBSJfgJbBPOUFmjoKxkMeKMM4P
- [ ] Mixes playlist: https://www.youtube.com/playlist?list=PLIVLAENoBSJcudnp-NfZUcJbPYj7SWrws

---

## SUGGESTED NEXT STEPS & FOLLOW-UPS

### Bug Fixes
- [x] Fix partners section not displaying on homepage (added 11 partner logos via database)
- [x] Fix manually added partners not showing up (partners carousel now working)
- [x] Fix Featured Mixes showing placeholder videos (updated fallback to real Psychedelic Universe videos)
- [ ] Improve partner logo upload functionality in Admin panel

### High Priority - Site Functionality
- [ ] Add genre-specific pages - Make "Explore Mixes" buttons on genre cards link to dedicated pages filtering mixes by that genre
- [ ] Populate genre mixes via Admin - Use the artist categorization data to add YouTube videos to each genre section through Admin Dashboard
- [ ] Connect your live radio stream - Add Icecast/Shoutcast URL in Admin → Settings → Stream URL (if you set up Listen2MyRadio or similar)

### User Experience Enhancements
- [ ] Create a favorites/playlist feature - Let logged-in users save their favorite mixes to a personal playlist
- [ ] Add social sharing buttons - Include share buttons on Radio Mode page so listeners can share what they're currently playing
- [ ] Make genre cards clickable - Link each category card to a dedicated page showing all mixes for that genre

### Content & Data
- [ ] Complete the main playlist - User mentioned will add remaining tracks to the 3200+ playlist later
- [ ] Use artist categorization data - 318 artists categorized by genre available in /home/ubuntu/artists_by_genre_5plus.csv

### Technical Improvements
- [ ] Auto-fetch latest YouTube videos using API - Keep site content fresh automatically
- [ ] Publish to permanent domain - Enable live subscriber counter functionality

### Resources Created
- Artist Genre Guide: /home/ubuntu/Psychedelic_Universe_Artist_Genre_Guide.md
- Artist CSV (categorized): /home/ubuntu/artists_by_genre_5plus.csv
- Radio Streaming Guide: /home/ubuntu/Radio_Streaming_Setup_Guide.md
- All video titles: /home/ubuntu/psychedelic_universe_titles.txt
- Full video data (JSON): /home/ubuntu/psychedelic_universe_videos.json

### Playlists Reference
- Main playlist (3200+ tracks): https://www.youtube.com/playlist?list=PLIVLAENoBSJfgJbBPOUFmjoKxkMeKMM4P
- Mixes playlist: https://www.youtube.com/playlist?list=PLIVLAENoBSJcudnp-NfZUcJbPYj7SWrws

## Genre Playlist Auto-Population (Completed)
- [x] Filter artists to 20+ tracks only (73 artists across 4 genres)
- [x] Reduce genres from 5 to 4 (removed Psychill/Ambient)
- [x] Fetch all 4,975 videos from main YouTube playlist
- [x] Cross-reference videos with categorized artists (2,046 matched)
- [x] Populate database with genre-tagged mixes
- [x] Update genre pages with Play All and Shuffle buttons
- [x] Remove Psychill/Ambient section from MixGrid and database schema
- [x] Create Genre page component with embedded YouTube player


## Export Packages
- [ ] Full source code ZIP
- [ ] Static HTML/CSS export of design
- [ ] Design assets package (images, colors, fonts)
- [ ] Database SQL dump

## Artist Directory Page (Completed)
- [x] Identify top 20 artists by track count
- [x] Research artist information (bios, social links, images) - parallel research completed
- [x] Create artists database table
- [x] Design Artist Directory page layout
- [x] Build Artist Directory page component with search and genre filters
- [x] Populate 20 artist profiles with images, bios, and social links
- [ ] Add admin interface for artist management (future enhancement)


## Site Restructuring & Updates (Completed)
- [x] Add site-wide navigation header (Home, Artists, Genres dropdown, Radio)
- [x] Update track count from 3200+ to 5000+
- [x] Add subscribe button link (http://bit.ly/PsyUniverseSubscribe)
- [x] Live YouTube subscriber count already implemented (uses YouTube API)
- [x] Update footer social links - YouTube and SoundCloud only
- [x] Change "sound" to "trance" in tagline
- [x] Change "TRUSTED" to "UNIVERSED" in partners section
