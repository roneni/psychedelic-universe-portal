# Psychedelic Universe - Full Roadmap & Implementation Path

**Date:** February 7, 2026  
**Goal:** Complete site before announcing to 633K YouTube subscribers

---

## Everything That Needs To Be Done

### A. Bug Fixes (Must fix before anything else)

| # | Issue | Difficulty | Est. Time |
|---|-------|-----------|-----------|
| A1 | Suggestions form not sending notifications to owner | Easy | 30 min |
| A2 | Automatic notifications for new YouTube uploads | Medium | 2-3 hrs |
| A3 | YouTube comment notifications (not implemented) | Medium | 2-3 hrs |
| A4 | YouTube OAuth "Connect" button on Stats page not working | Medium | 1-2 hrs |
| A5 | Bing Webmaster Tools setup | Easy | 15 min |

### B. Community Features (Critical - the core of the site's value)

| # | Feature | Difficulty | Est. Time |
|---|---------|-----------|-----------|
| B1 | **Karma System** - Points for user actions, leaderboard, badges | Hard | 6-8 hrs |
| B2 | **User Favorites** - Heart button on mixes, personal favorites page | Medium | 3-4 hrs |
| B3 | **Ronen's Picks** - Curated playlist with modest personal touch | Easy | 1-2 hrs |

### C. Content Features (High impact for attracting visitors)

| # | Feature | Difficulty | Est. Time |
|---|---------|-----------|-----------|
| C1 | **Festival Calendar** - Scrape goabase.net, monthly view, filters | Hard | 6-8 hrs |
| C2 | **Weekly Staff Pick** - Homepage highlight, mix or track, curator note | Easy | 2-3 hrs |
| C3 | **Google AI Community Hub** - Integrate your Gemini-powered tool | Medium | 4-5 hrs |

### D. Artist Features

| # | Feature | Difficulty | Est. Time |
|---|---------|-----------|-----------|
| D1 | Admin interface for managing artist profiles | Medium | 3-4 hrs |
| D2 | Artist Invitation System (admin-only, quality-controlled) | Medium | 3-4 hrs |

### E. Technical / Pending

| # | Feature | Difficulty | Est. Time |
|---|---------|-----------|-----------|
| E1 | Auto-fetch latest YouTube videos (keep content fresh) | Medium | 2-3 hrs |
| E2 | Social sharing buttons on more pages | Easy | 1 hr |
| E3 | Underground/Private Listening Room | On Hold | - |

---

## Suggested Implementation Path

### Sprint 1: Quick Wins & Bug Fixes (Easiest first)
**Items:** A1, A5, C2, B3

Why start here: These are fast to implement, immediately visible, and fix broken things. The Staff Pick and Ronen's Picks add personality to the site with minimal effort.

1. Fix suggestions notification (A1)
2. Set up Bing Webmaster Tools (A5)
3. Build Weekly Staff Pick on homepage (C2)
4. Create Ronen's Picks section (B3)

### Sprint 2: User Engagement Foundation
**Items:** B2, B1

Why next: Favorites and Karma are the backbone of community engagement. Users need a reason to create accounts and come back.

1. User Favorites with heart buttons (B2)
2. Karma System with leaderboard (B1)

### Sprint 3: Content That Attracts New Visitors
**Items:** C1, A2, A3

Why next: Festival Calendar brings organic search traffic. Fixing notifications means you know when things happen on your channel.

1. Festival Calendar with scraped data (C1)
2. Fix YouTube upload notifications (A2)
3. Implement comment notifications (A3)

### Sprint 4: Admin & Artist Tools
**Items:** D1, D2, A4, E1

Why next: Once the site has content and community features, you need tools to manage it efficiently.

1. Artist admin interface (D1)
2. Artist invitation system (D2)
3. Fix YouTube OAuth on Stats (A4)
4. Auto-fetch new YouTube videos (E1)

### Sprint 5: Advanced Integration
**Items:** C3

Why last: The Google AI Community Hub is a powerful tool but it's for your workflow, not user-facing. Integrate after the public features are solid.

1. Integrate Gemini-powered Community Hub as admin tool

---

## Milestones Before YouTube Announcement

All of the following should be complete before the community post:

- [ ] All bug fixes resolved (Sprint 1)
- [ ] Karma system live (Sprint 2)
- [ ] User favorites working (Sprint 2)
- [ ] Ronen's Picks published (Sprint 1)
- [ ] Festival Calendar populated (Sprint 3)
- [ ] Staff Pick on homepage (Sprint 1)
- [ ] Full mobile + desktop testing
- [ ] Newsletter confirmed working

**Estimated total time to announcement-ready: ~35-40 hours of development**

---

## Notes

- The Google AI Community Hub (Gemini tool) needs a Gemini API key to run. It can be integrated as an admin-only section or kept as a separate tool.
- The Underground/Private Listening Room remains on hold pending a legal path for the mixes.
- Artist submissions are intentionally NOT public - quality is maintained through admin control and direct outreach to established artists.
