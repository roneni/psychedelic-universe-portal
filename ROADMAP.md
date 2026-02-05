# Psychedelic Universe - Implementation Roadmap

**Last Updated:** February 5, 2026  
**Goal:** Complete site development before announcing to 633K YouTube subscribers

---

## Phase 1: Bug Fixes & Stability (Priority: High)

These issues must be resolved before the community announcement.

| Item | Status | Notes |
|------|--------|-------|
| PWA icon not updating on mobile | ✅ Fixed | User needs to delete app and re-add to home screen |
| Suggestions form character limit not shown | ✅ Fixed | Now shows "minimum 10 characters" with counter |
| Suggestions form notification not working | 🔍 Investigating | Code looks correct - may be Manus notification service issue |
| YouTube OAuth button on Stats page | ⏳ Pending | Button not appearing/clickable |
| Automatic YouTube upload notifications | ⏳ Pending | Currently manual - needs YouTube webhook integration |
| YouTube comment notifications | ⏳ Pending | Not implemented yet |

---

## Phase 2: Community Features (Priority: Critical)

The foundation for building an engaged community around the site.

### 2.1 Karma System
A gamification layer to encourage user engagement.

**Concept:**
- Users earn Karma Points for various actions on the site
- Leaderboard displays top contributors
- Top users receive special recognition (icon/badge)

**Karma-Earning Actions:**
| Action | Points | Notes |
|--------|--------|-------|
| Create account | 10 | One-time |
| Submit a suggestion | 5 | Per submission |
| Suggestion gets implemented | 50 | Bonus |
| Subscribe to newsletter | 5 | One-time |
| Daily site visit | 1 | Max 1/day |
| Share on social media | 3 | Trackable via UTM |
| Refer a new user | 10 | Via referral link |

**Implementation Steps:**
1. Add `karma` field to users table
2. Create karma_history table (tracks all point changes)
3. Build Karma Leaderboard page
4. Add karma display to user profile
5. Create special badge/icon for top 10 users

### 2.2 User Favorites & Playlists
Let users save their favorite mixes.

**Features:**
- "Add to Favorites" button on each mix/track
- Personal favorites page for logged-in users
- **Ronen's Picks** - A curated playlist with the concept: "These are personal favorites that I can't share on YouTube - a glimpse into my own musical journey"

**Implementation Steps:**
1. Create favorites table (user_id, mix_id, added_at)
2. Add heart icon to mix cards
3. Build Favorites page
4. Create "Ronen's Picks" special section

---

## Phase 3: Content Features (Priority: High)

### 3.1 Festival Calendar
Display upcoming psytrance festivals worldwide.

**Data Sources to Scrape:**
- goabase.net (comprehensive festival database)
- psytrance-calendar.com
- festivalinsider.com

**Features:**
- Monthly calendar view
- Filter by region/country
- Festival details: dates, location, lineup, ticket links
- Auto-update mechanism

**Legal Note:** Scraping public event data for informational purposes is generally acceptable. Will include attribution to sources.

### 3.2 Weekly Staff Pick
Highlight one mix or track per week on the homepage.

**Features:**
- Prominent placement on homepage
- Can be a mix OR a single track
- Brief curator note explaining the selection
- Archive of past picks

**Implementation:**
- Add `staff_pick` boolean + `staff_pick_note` to mixes table
- Create Staff Pick component for homepage
- Admin interface to select weekly pick

---

## Phase 4: Artist Features (Priority: Medium)

### 4.1 Artist Contact Section ✅
Already implemented - "Want to Be Featured Here?" CTA at bottom of Artists page.

### 4.2 Artist Submission Queue (Revised)
**Original concern:** Open submissions would attract anyone with a SoundCloud account.

**Revised approach - "Artist Invitation System":**
- NOT a public submission form
- Admin-only feature to send invitations to established artists
- Invited artists can fill out their own profile
- Maintains quality control while reducing manual data entry

**Alternative:** Keep artist profiles admin-managed only, reach out to artists directly via email/social.

---

## Phase 5: Technical Improvements (Priority: Medium)

| Item | Description | Status |
|------|-------------|--------|
| Bing Webmaster Tools | Additional search visibility | ⏳ Pending |
| Admin interface for artists | Manage artist profiles via dashboard | ⏳ Pending |
| Auto-fetch YouTube videos | Keep content fresh automatically | ⏳ Pending |

---

## Phase 6: Underground/Private Features (Priority: Low - On Hold)

### Private Listening Room
**Concept:** Password-protected area for mixes with uncertain rights.

**Status:** On hold due to copyright concerns. Even private hosting doesn't make it legal - just less discoverable.

**Alternative approaches to explore:**
1. Contact labels directly for permission
2. Use only mixes with cleared/licensed tracks
3. Create original mixes with properly licensed content

---

## Milestones Before YouTube Announcement

Before posting to the community tab, the following should be complete:

- [ ] All Phase 1 bugs fixed
- [ ] Karma system implemented (Phase 2.1)
- [ ] User favorites working (Phase 2.2)
- [ ] Festival calendar with current data (Phase 3.1)
- [ ] Staff Pick feature live (Phase 3.2)
- [ ] Site tested on mobile and desktop
- [ ] All navigation links working
- [ ] Newsletter signup confirmed working

---

## Announcement Strategy

**When ready:**
1. Single community post announcing the site
2. Describe key features
3. Ask for feedback via Suggestions page
4. Mention Karma system to encourage engagement

**Post template (draft):**
> 🌀 Introducing psychedelic-universe.com - Your new home for psytrance culture!
> 
> After months of development, I'm excited to share our companion website featuring:
> ✦ Artist Directory with 20+ featured artists
> ✦ Genre-organized playlists
> ✦ Festival Calendar
> ✦ 24/7 Radio Mode
> ✦ And more coming soon...
> 
> Visit and let me know what you think! Use the Suggestions page to share your ideas.
> 
> 🔗 psychedelic-universe.com

---

## Resources

- Artist Genre Guide: `/home/ubuntu/Psychedelic_Universe_Artist_Genre_Guide.md`
- Categorized Artists CSV: `/home/ubuntu/artists_by_genre_5plus.csv`
- All Video Titles: `/home/ubuntu/psychedelic_universe_titles.txt`
- Full Video Data: `/home/ubuntu/psychedelic_universe_videos.json`

---

*This roadmap is a living document. Updates will be tracked as features are implemented.*
