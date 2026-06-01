# Battle Screen Refactor Plan

## Status
- ✅ Step 1: Layout & Sizing (60/20/20 flex, dynamic canvas, proportional scaling)
- ✅ Step 2: Sprite Scaling & Pokemon Positioning (enemy 3-4x top-right, player 2.5x bottom-left)
- ✅ Step 3: Per-Zone Backgrounds (12 color palettes, seeded starfield)
- ✅ Step 4: Health Bar Redesign (color zones green/yellow/red, name + level, bigger)
- ✅ Step 5: Action Bar Redesign (2x2 grid, ::before icons, hover states)
- ✅ Step 6: Floating Damage Numbers (animated, crit styling)
- ✅ Step 7: Idle Animation (breathing) + Hit Shake
- ✅ Step 8: Greek Theme CSS Variables

Current problems observed from screenshot:

1. The battlefield uses less than 30% of the available viewport.
2. There is excessive unused vertical space.
3. Character sprites are too small.
4. Combat information lacks hierarchy.
5. Action buttons feel detached from the battle.
6. The screen feels like a prototype/debug UI rather than a game.
7. Nothing visually communicates "Greek mythology".

==================================================
PRIMARY OBJECTIVE
==================================================

Refactor the battle UI into three distinct regions:

TOP 65% = Battlefield
MIDDLE 15% = Battle Log
BOTTOM 20% = Action Menu

The viewport should feel full and intentional.

==================================================
LAYOUT REFACTOR
==================================================

Implement:

<BattleScreen>
 ├── Battlefield
 │    ├── Background
 │    ├── EnemyZone
 │    ├── PlayerZone
 │    ├── EffectsLayer
 │    └── FloatingTextLayer
 │
 ├── CombatLog
 │
 └── ActionBar

Use flex/grid instead of absolute positioning whenever possible.

Remove large empty black areas.

Battlefield should always occupy most of the screen.

==================================================
POKEMON-STYLE POSITIONING
==================================================

Enemy:
- Top right quadrant
- Larger scale
- Anchor to ground plane

Player:
- Bottom left quadrant
- Slightly smaller than enemy
- Anchor to ground plane

Do NOT place both fighters near the center.

Create clear battle staging.

==================================================
SPRITE SCALING
==================================================

Current sprites are too small.

Requirements:

enemyScale = 2.5x to 4x current

playerScale = 2x to 3x current

Sprites should immediately attract attention.

The user should recognize the combatants before reading text.

==================================================
BATTLEFIELD BACKGROUND SYSTEM
==================================================

Create reusable backgrounds:

OlympusBackground
TempleBackground
UnderworldBackground
SacredForestBackground
TitanBattlefieldBackground

Background should fill the battlefield area.

Use:

- gradients
- parallax layers
- atmospheric effects

Avoid flat black backgrounds.

==================================================
HEALTH BAR REDESIGN
==================================================

Current HP bars feel generic.

Implement reusable component:

<HealthBar
  name=""
  level={}
  currentHp={}
  maxHp={}
  status=""
/>

Features:

- smooth damage animation
- smooth healing animation
- color transitions

100%-60% = green
60%-30% = yellow
30%-0% = red

Add:

- character name
- level
- hp values

Increase height significantly.

==================================================
COMBAT LOG REDESIGN
==================================================

Current combat log is too small.

Create:

<BattleDialogueBox />

Requirements:

- minimum 3-4 lines visible
- larger font
- padding
- typewriter effect support

Example:

"A Wild Satyr Appeared!"

"Achilles used Spear Throw!"

"Satyr took 24 damage!"

==================================================
ACTION BAR REDESIGN
==================================================

Replace current button layout with a Pokémon-style command panel.

Structure:

+----------------------+
| Attack | Skill       |
| Relics | Defend      |
+----------------------+

Buttons should:

- have icons
- have hover state
- have active state
- have disabled state

Selected action should be visually obvious.

==================================================
VISUAL FEEDBACK SYSTEM
==================================================

Implement:

DamageNumber
HealNumber
StatusEffectPopup

Examples:

-24
+18
STUNNED
BURNING

Animate:

opacity
translateY
scale

Destroy after animation completes.

==================================================
ANIMATION SYSTEM
==================================================

Add:

IdleAnimation
AttackAnimation
HitAnimation
DeathAnimation

Examples:

Idle:
small breathing movement

Attack:
forward lunge

Hit:
shake + flash

Death:
fade + fall

==================================================
GREEK MYTHOLOGY THEME
==================================================

Introduce design tokens:

--gold
--bronze
--marble
--royal-purple
--divine-blue

Use:

Greek borders
Laurel motifs
Marble panels
Gold trim

Avoid:

sci-fi styling
modern flat UI
generic MMO aesthetics

==================================================
RESPONSIVE REQUIREMENTS
==================================================

Desktop:
Battlefield dominates screen.

Tablet:
Combat log shrinks slightly.

Mobile:
Action bar remains visible without scrolling.

NO vertical dead space.

NO scrolling during battle.

==================================================
TECHNICAL REQUIREMENTS
==================================================

Create reusable components:

Battlefield.tsx
CharacterSprite.tsx
HealthBar.tsx
BattleDialogueBox.tsx
ActionBar.tsx
DamagePopup.tsx

Move all hardcoded styles into theme variables.

Reduce absolute positioning.

Use animation utilities instead of manual frame updates where possible.

==================================================
SUCCESS CRITERIA
==================================================

When the screen loads:

1. The player's eyes immediately go to the combatants.
2. HP information is readable in under 1 second.
3. The battlefield occupies most of the viewport.
4. The UI feels like a Greek mythology RPG.
5. The battle no longer resembles a prototype.
6. The layout feels comparable to Pokémon battle screens in terms of readability and structure.
