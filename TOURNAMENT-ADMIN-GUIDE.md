# Iron Dome Command — Tournament Admin Guide

## Quick Reference

| Item | Value |
|------|-------|
| **Game URL** | [kipat-barzel.org](https://kipat-barzel.org) |
| **Admin Dashboard** | `kipat-barzel.org/?admin=YOURCODE` |
| **Spectator Board** | `kipat-barzel.org/?score=YOURCODE` |
| **Admin PIN** | `1881` |
| **Solo Access Code** | `1948` |
| **Firebase Console** | [console.firebase.google.com](https://console.firebase.google.com/project/missile-defense-41ed4) |

---

## Before the Event

### 1. Choose a Game Code
Pick a short, memorable code for your tournament (e.g., `HAWK`, `LINCOLN`, `DEMO`). This is what players will type in to join.

### 2. Upgrade Firestore (if not done)
For 50+ players, upgrade to the Blaze plan:
- Go to [Firebase Console → Billing](https://console.firebase.google.com/project/missile-defense-41ed4/usage/billing)
- Upgrade to **Blaze (pay-as-you-go)**
- Set a **$5/month budget alert**
- Cost: ~$0.02 per tournament

### 3. Set Up Your Screens
You need **3 devices**:
| Device | URL | Purpose |
|--------|-----|---------|
| **Projector/TV** | `kipat-barzel.org/?score=YOURCODE` | Spectator board (lobby + leaderboard) — projected for the room |
| **Your laptop/phone** | `kipat-barzel.org/?admin=YOURCODE` | Admin dashboard — you control the tournament from here |
| **Student devices** | `kipat-barzel.org` → enter code | Each student joins on their own device |

### 4. Create the Tournament
1. Open `kipat-barzel.org/?admin=YOURCODE` on your device
2. Enter admin PIN: **1881**
3. Click **CREATE TOURNAMENT**
4. You'll see the lobby with "0 TEAMS JOINED"

---

## Running the Tournament

### Round 1: QUALIFIER (Levels 1-3)

**Lobby Phase:**
1. Tell students: "Go to **kipat-barzel.org** and enter code **[YOUR CODE]**"
2. The projector shows names popping in as students join
3. Wait until all students have joined (check the team count)
4. Adjust advancement: default is top 50% advance (change in the ADVANCEMENT section)

**Start:**
1. Click **START QUALIFIER** on your admin dashboard
2. All students see a 5-second countdown, then gameplay begins
3. The projector switches to the live leaderboard

**During Gameplay:**
- Scores update in real-time on the projector
- Your admin dashboard shows "X/Y FINISHED" counter
- If needed: click **PAUSE ALL** to freeze everyone's game

**End of Round:**
1. Wait for all (or most) students to finish
2. Click **CLOSE ROUND** on admin dashboard
3. The projector shows a dramatic reveal: rows light up one by one
4. Students who advance see "YOU ADVANCE!" on their device
5. Students who don't advance see "GREAT RUN!" and can enter practice mode

**Advance:**
1. Click **ADVANCE TO ROUND 2** on admin dashboard

### Round 2: SEMIFINAL (Levels 4-5)

Same flow as Round 1, but:
- Only advancing players can play
- Default: top 2 advance to the final
- Scores are **cumulative** (R1 score carries forward, R2 score is multiplied by 1.5x)

### Round 3: FINAL (Level 6)

Same flow, but:
- Only 2 players compete
- R3 score is multiplied by 2x
- After closing: the projector shows a **Champion Reveal** sequence
- Runner-up → pause → Champion with celebration

---

## Advancement Rules

| Round | Default | Configurable |
|-------|---------|-------------|
| R1 → R2 | Top 50% | Change to any percentage or fixed count |
| R2 → R3 | Top 2 | Change to any count |

Adjust on the admin dashboard before closing each round.

---

## Score Multipliers

| Round | Multiplier | Why |
|-------|-----------|-----|
| R1 | 1.0x | Baseline |
| R2 | 1.5x | Rewards later-round performance |
| R3 | 2.0x | Makes the final decisive |

Scores are cumulative: Final score = R1 score + (R2 score × 1.5) + (R3 score × 2.0)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Student can't find the URL | Show the projector — it displays `kipat-barzel.org` and the code |
| "TOURNAMENT NOT FOUND" | Make sure you created the tournament first via the admin dashboard |
| Duplicate team name | Student sees "NAME ALREADY TAKEN" — they need a different name |
| Student's phone locked/died | They can rejoin with the same name. Their last-pushed score is preserved. |
| Wi-Fi dropped | Spectator board shows "CONNECTION ISSUE" banner. Scores catch up when reconnected. |
| Need to pause | Click **PAUSE ALL** on admin dashboard. Click **RESUME** when ready. |
| Closed round too early | No undo — but late-finishing students' scores are still counted. |
| Want to start over | Click **RESET** on admin dashboard (clears all teams and scores). |
| Student being disruptive | Click **KICK** next to their name in the admin lobby. |

---

## After the Tournament

1. Click **EXPORT CSV** on the admin dashboard for a spreadsheet with all scores
2. The projector holds the champion screen for photos
3. CSV includes: team name, score, quiz accuracy, intercepts, sirens, streak

---

## Legacy Mode (V1)

The old URL-based tournament mode still works:
- Player: `kipat-barzel.org/?event=CODE&round=1`
- Spectator: `kipat-barzel.org/?score=CODE`

Use this if you need manual round control or don't want the lobby system.

---

## Solo Play

Students can also play independently:
1. Go to `kipat-barzel.org`
2. Click **SOLO MISSION**
3. Enter access code: **1948**
4. Play the full 6-level campaign

---

## Technical Details

- **No account needed** — everything runs in the browser
- **No app install** — works on any device with a browser
- **Scores stored in Firebase** — persist across sessions
- **Works offline** — game continues if Wi-Fi drops, scores sync when reconnected
- **Mobile-friendly** — works on phones, tablets, laptops, desktops
