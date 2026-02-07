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


## PWA Implementation (Completed)
- [x] Process logo and create app icons in multiple sizes (11 sizes generated)
- [x] Create PWA manifest.json with app shortcuts (Radio, Artists)
- [x] Add service worker for offline capability
- [x] Add Apple-specific meta tags for iOS (apple-touch-icon, apple-mobile-web-app-capable)
- [x] Add logo to navigation header
- [x] Update index.html with SEO meta tags and Open Graph
- [x] Verify responsive design on all platforms
- [ ] User testing: Add to Home Screen on iPhone


## Bug Fixes & Updates (Jan 24) - Completed
- [x] Remove non-channel video from Featured Mixes (replaced Indian Spirit with StarLab - Oceans from Silence)
- [x] Investigate why non-channel video appeared (was manually added fallback - added comment to prevent future cases)
- [x] Center logo on PWA app icon (regenerated all icons with proper centering)
- [x] Implement shuffle start for 5000-track playlist player (starts from random track each time)
- [x] Update search placeholder: "mixes" → "tracks/albums/mixes"
- [x] Fix favicon with channel logo (proper sizes: 16x16, 32x32, 48x48)

## In-Site Notification System - Completed
- [x] Create notifications database table
- [x] Build notification component for site header (bell icon)
- [x] Implement "New upload!" notifications with track link
- [x] Implement "Username commented" notifications (no link)
- [x] Notifications display within site only (no push notifications)

## Future: Community Features (Follow-up)
- [ ] Research and suggest community feature implementations


## Final Deployment Preparation (Jan 24) - Completed
- [x] Fix logo size in navigation (transparent logo with proper sizing)
- [x] Remove black background from logo (transparent background applied)
- [x] Audit all footer links (all working)
- [x] Create Privacy Policy page with Google/YouTube terms compliance
- [x] Update About Us page with user's exact provided text
- [x] Create Contact page
- [x] Create Submit Track page (coming soon)
- [x] Connect newsletter signup (notifications sent to owner at psyuniverse9@gmail.com)
- [x] Test all pages and links before deployment (Privacy, About, Contact, Submit all verified)


## SEO Improvements (Jan 24)
- [ ] Fix subscriber count caching issue (showing 633,023 instead of live 633,988) - Note: This is YouTube API behavior, not a bug
- [x] Add Schema.org structured data (Organization, MusicGroup, WebSite)
- [x] Add social sharing buttons
- [x] Implement internal linking between pages
- [x] Google Search Console verification meta tag (extra method) - Not needed, verified via GoDaddy Domain Connect

## Pending Reminders
- [ ] Remind user about Bing Webmaster Tools setup


## YouTube Analytics Dashboard (Jan 29)
- [x] Update PWA icon with new logo (cyan eye/orbit design on dark background)
- [x] Create YouTube Analytics OAuth backend integration
- [x] Store OAuth tokens securely in database
- [x] Build Statistics Dashboard page (/stats)
- [x] Display curated positive metrics (subscribers, views, top videos)
- [x] Design differently from YouTube Studio
- [x] Filter out negative/sensitive data (revenue, declining metrics)
- [ ] User to connect YouTube account via OAuth to unlock advanced analytics

- [x] Add Stats page link to navigation menu

- [ ] Fix Connect YouTube Account button not appearing/clickable on Stats page


## Noted Bugs (To Fix Later)
- [ ] PWA logo not updating on mobile (still showing old logo) - cache issue
- [ ] Notifications not working (uploaded tracks but no notifications appeared)

## New Features (Jan 30)
- [x] Site Suggestions/Feedback page - Allow users to submit improvement ideas (/suggestions)
- [x] Artist Directory contact section - "Want to Be Featured Here?" CTA at bottom of Artists page
- [ ] Standalone audio player for unlisted mixes - ON HOLD (copyright risk without YouTube's Content ID protection)

## Noted Issues (Jan 30) - To Fix Later
- [ ] Suggestions form not sending email/notification to owner - needs debugging
- [ ] Automatic notifications for new YouTube uploads - currently requires manual creation, should auto-detect
- [ ] YouTube comment notifications - not implemented yet, was discussed as automatic feature
- [ ] Underground/Private mixes feature - user wants to share mixes with uncertain rights privately (password-protected listening room idea)

## PWA Icon Fix (Feb 5)
- [x] Regenerated all PWA icons with new centered logo (cyan on dark background)
- [x] Updated apple-touch-icon.png for iOS
- [x] Updated favicon.ico with new design
- [ ] User needs to: Delete the app from phone, clear browser cache, then re-add to home screen


---

## IMPLEMENTATION ROADMAP (Feb 5, 2026)
*Goal: Complete before YouTube community announcement*

### Phase 2: Community Features
- [ ] Karma System - gamification for user engagement
  - [ ] Add karma field to users table
  - [ ] Create karma_history table
  - [ ] Build Karma Leaderboard page
  - [ ] Add karma display to user profile
  - [ ] Create special badge for top 10 users
- [ ] User Favorites/Playlists
  - [ ] Create favorites table
  - [ ] Add heart icon to mix cards
  - [ ] Build Favorites page for logged-in users
  - [ ] Create "Ronen's Picks" curated section (personal favorites not on YouTube)

### Phase 3: Content Features
- [ ] Festival Calendar
  - [ ] Research/scrape festival data from goabase.net, psytrance-calendar.com
  - [ ] Build calendar component with monthly view
  - [ ] Add region/country filters
  - [ ] Implement auto-update mechanism
- [ ] Weekly Staff Pick
  - [ ] Add staff_pick fields to mixes table
  - [ ] Create Staff Pick component for homepage
  - [ ] Build admin interface for selecting picks

### Phase 4: Artist Features
- [ ] Artist Invitation System (admin-only, not public submissions)
- [ ] Admin interface for artist management

### Milestones Before YouTube Announcement
- [ ] All Phase 1 bugs fixed
- [ ] Karma system implemented
- [ ] User favorites working
- [ ] Festival calendar with current data
- [ ] Staff Pick feature live
- [ ] Full site testing complete


## Sprint Feb 7, 2026

### Festival Calendar
- [x] Research top 5 psytrance festival data sources (goabase.net, psymedia.co.za, psycalendar.com, psytranceportal.com)
- [x] Scrape/collect festival data (56 festivals Feb-Dec 2026)
- [x] Build Festival Calendar page with static data, search, region/month filters
- [x] Add to navigation and footer

### YouTube Notification Fixes
- [x] Implement YouTube poller (checks every 5 min for new uploads, creates notifications automatically)
- [ ] YouTube comment notifications (deferred - requires more complex API setup)

### Community/Karma System
- [x] Design karma reward program (points for actions: login, favorite, suggestion, daily visit, streak)
- [x] Create karma database tables (karma_points, favorites)
- [x] Build favorites system (FavoriteButton component with heart animation + karma tooltip)
- [x] Build Community page with karma leaderboard, level badges, and user stats
- [x] Add Community to navigation and footer
- [ ] Integrate FavoriteButton into mix cards across the site
- [ ] Add Ronen's Picks section

### Underground Vault
- [x] Build passphrase-protected page (/underground) for private mixes
- [x] Implement access control (login required + passphrase verification, stored in DB)
- [x] Vault mix management via admin API (add/remove mixes)
- [x] YouTube embed player for vault mixes
- [ ] Ronen to set custom passphrase (default: cosmicunderground2026)
- [ ] Ronen to add mixes via Admin panel


## Visual Overhaul (Feb 7)
- [x] Study YouTube channel cover for sci-fi style reference
- [x] Generate cosmic/Goa background images (planetary landscape with palm trees)
- [x] Animated star field / nebula background (CSS nebula blobs + floating particles)
- [x] Floating particles (CSS-only, 12 particles in hero)
- [x] Neon glow headings with sci-fi font (Orbitron)
- [x] Glassmorphism cards with animated gradient borders
- [x] Parallax hero section with pulsing logo glow
- [x] Cosmic section dividers (gradient line dividers)
- [x] Cyan + purple/magenta nebula color palette
- [x] Card hover tilt + glow animations
- [x] Remove "since 2013" - tagline: "Promoting & Spreading Psychedelic Trance Worldwide"
- [x] Fix all generic AI wording ("Flagship" → "Major", rewrote partner quotes, genre descriptions)
- [x] Blend Goa/India elements (palm trees in hero, Goa Trance desc references beaches of Goa)
