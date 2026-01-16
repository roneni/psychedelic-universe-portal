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
