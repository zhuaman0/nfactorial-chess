# Quests — Royal Chess

Quests are the main way to earn **XP** on Royal Chess. They teach chess concepts through interactive challenges.

---

## Quest Types

### 1. Quiz Quests

A series of multiple-choice questions about chess rules, tactics, or strategy.

**How it works:**
1. Open a quiz quest from `/quests`
2. Read the question and pick one of 4 answers
3. After submitting:
   - ✅ Correct → move to the next question, a brief explanation is shown
   - ❌ Wrong → explanation is shown, you can retry or skip
4. Complete all questions to finish the quest and earn XP

**Example quest:** *"Which piece can jump over other pieces?"* — Knight

---

### 2. Piece Training Quests

An interactive chess board where you learn how a specific piece moves by completing guided steps.

**How it works:**
1. Open a piece training quest (e.g. "Knight Movements")
2. A board appears with your piece placed on a specific square
3. A panel shows the **target square** you must move to
4. Click the correct square to advance to the next step
5. Complete all steps to finish the quest

**Pieces covered:**
- Pawn, Knight, Bishop, Rook, Queen, King

Each step tests a different aspect of that piece's movement (diagonal, L-shape, etc.).

---

## Quest Levels

Quests are grouped by difficulty level, matching the XP level system:

| Level | Who it's for |
|-------|-------------|
| Pawn | Total beginners |
| Knight | Know the basics |
| Bishop | Intermediate |
| Rook | Advanced tactics |
| Queen | Expert strategy |
| King | Grandmaster concepts |

---

## Earning XP

When you complete a quest:
1. The app calls the `fn_complete_quest` RPC in Supabase
2. Your `user_quests` row is updated to `status = 'completed'`
3. The quest's `points` value is added to your `profiles.points`
4. Your XP total updates immediately in the navbar and home page

Each quest can only be completed **once** — attempting a completed quest shows a "Already done" state.

---

## Quest Progress

On the `/quests` index page you can see:

- Total quests available
- How many you've completed
- Total XP earned from quests
- A progress bar for each level group

Quests you haven't started yet show a **Start** button.  
In-progress quests show **Continue**.  
Completed quests show a ✓ badge and your score.

---

## Starting a Quest

1. Go to `/quests`
2. Browse by level or scroll through all quests
3. Click any quest card → opens `/quests/[id]`
4. The app calls `fn_start_quest` RPC which creates a `user_quests` row with `status = 'in_progress'`
5. Complete the quest — XP is awarded automatically on the last step

---

## Technical Notes

- Quest content (questions, steps) is stored in the `quests` table as a JSONB `content` column
- User progress is in `user_quests` table with `user_id`, `quest_id`, `status`, `score`, `completed_at`
- The `fn_complete_quest(p_user_id, p_quest_id, p_score)` function handles both updating the quest row and incrementing profile points atomically
