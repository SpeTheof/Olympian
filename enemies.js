const ENEMIES_BY_MAP = [
  {
    name: 'Forbidden Forest',
    desc: 'A dark forest where harpies and satyrs roam...',
    enemies: [
      { name: 'Harpy', hp: 25, atk: 6, def: 3, gold: 8, color: '#6a8a5a' },
      { name: 'Satyr', hp: 30, atk: 8, def: 4, gold: 10, color: '#8a7a3a' },
      { name: 'Centaur', hp: 35, atk: 7, def: 5, gold: 12, color: '#5a4a2a' }
    ]
  },
  {
    name: 'Lava Forge',
    desc: 'The fiery domain of Hephaestus, filled with mechanical horrors...',
    enemies: [
      { name: 'Fire Spirit', hp: 30, atk: 9, def: 3, gold: 12, color: '#ff4a1a' },
      { name: 'Iron Golem', hp: 45, atk: 8, def: 8, gold: 15, color: '#6a6a7a' },
      { name: 'Cyclops', hp: 50, atk: 12, def: 5, gold: 18, color: '#5a5a3a' }
    ]
  },
  {
    name: 'Golden Fields',
    desc: 'Endless wheat fields under a burning sun...',
    enemies: [
      { name: 'Skeleton Soldier', hp: 35, atk: 10, def: 5, gold: 14, color: '#8a8a7a' },
      { name: 'Scarecrow', hp: 40, atk: 8, def: 7, gold: 16, color: '#6a5a2a' },
      { name: 'Wild Boar', hp: 50, atk: 11, def: 6, gold: 18, color: '#4a3a2a' }
    ]
  },
  {
    name: 'Labyrinth of Crete',
    desc: 'Twisting stone corridors where monsters lurk in shadow...',
    enemies: [
      { name: 'Gorgon', hp: 40, atk: 12, def: 6, gold: 18, color: '#4a8a4a' },
      { name: 'Minotaur', hp: 55, atk: 14, def: 7, gold: 22, color: '#6a3a1a' },
      { name: 'Chimera', hp: 45, atk: 13, def: 5, gold: 20, color: '#8a4a2a' }
    ]
  },
  {
    name: 'Isles of Speed',
    desc: 'Wind-swept islands where swift predators hunt...',
    enemies: [
      { name: 'Siren', hp: 35, atk: 15, def: 4, gold: 20, color: '#4a6a8a' },
      { name: 'Griffin', hp: 50, atk: 13, def: 8, gold: 24, color: '#8a7a4a' },
      { name: 'Storm Harpy', hp: 40, atk: 14, def: 6, gold: 22, color: '#6a6a9a' }
    ]
  },
  {
    name: 'Sunken Temple',
    desc: 'Ruins beneath the waves, guarded by ancient spirits...',
    enemies: [
      { name: 'Sea Serpent', hp: 55, atk: 14, def: 8, gold: 25, color: '#2a6a6a' },
      { name: 'Cursed Priest', hp: 45, atk: 16, def: 5, gold: 26, color: '#5a4a6a' },
      { name: 'Kraken Tentacle', hp: 50, atk: 15, def: 7, gold: 24, color: '#4a3a5a' }
    ]
  },
  {
    name: 'Blood Fields',
    desc: 'A battlefield soaked in blood, haunted by war spirits...',
    enemies: [
      { name: 'Wraith', hp: 45, atk: 17, def: 5, gold: 28, color: '#3a3a5a' },
      { name: 'Fallen Hoplite', hp: 60, atk: 15, def: 10, gold: 30, color: '#6a4a3a' },
      { name: 'War Chariot', hp: 55, atk: 18, def: 7, gold: 32, color: '#8a3a2a' }
    ]
  },
  {
    name: 'Silver Peaks',
    desc: 'Snow-capped mountains sacred to Athena...',
    enemies: [
      { name: 'Ice Wraith', hp: 50, atk: 18, def: 6, gold: 32, color: '#6a8a9a' },
      { name: 'Stone Guardian', hp: 65, atk: 16, def: 12, gold: 34, color: '#6a6a7a' },
      { name: 'Owl of Minerva', hp: 55, atk: 19, def: 7, gold: 36, color: '#8a8a6a' }
    ]
  },
  {
    name: 'Dionysus Feast',
    desc: 'A chaotic revelry where madness rules...',
    enemies: [
      { name: 'Maenad', hp: 55, atk: 20, def: 6, gold: 36, color: '#7a3a6a' },
      { name: 'Drunken Satyr', hp: 60, atk: 18, def: 9, gold: 38, color: '#6a5a3a' },
      { name: 'Panther', hp: 50, atk: 22, def: 5, gold: 40, color: '#3a3a2a' }
    ]
  },
  {
    name: 'Celestial Court',
    desc: 'The heavenly palace of Hera, guarded by divine servants...',
    enemies: [
      { name: 'Celestial Guard', hp: 65, atk: 20, def: 12, gold: 42, color: '#8a7a4a' },
      { name: 'Divine Hound', hp: 60, atk: 22, def: 8, gold: 44, color: '#6a6a4a' },
      { name: 'Aura Spirit', hp: 55, atk: 24, def: 6, gold: 46, color: '#8a8aaa' }
    ]
  },
  {
    name: 'Stormy Depths',
    desc: 'Poseidon domain, where the sea itself fights against you...',
    enemies: [
      { name: 'Tidal Elemental', hp: 70, atk: 22, def: 10, gold: 48, color: '#2a5a8a' },
      { name: 'Leviathan', hp: 80, atk: 20, def: 14, gold: 50, color: '#1a3a6a' },
      { name: 'Storm Nymph', hp: 65, atk: 24, def: 8, gold: 52, color: '#4a6a9a' }
    ]
  },
  {
    name: 'Mount Olympus',
    desc: 'The peak of creation. Only the strongest survive here...',
    enemies: [
      { name: 'Olympian Guard', hp: 80, atk: 26, def: 14, gold: 55, color: '#8a7a3a' },
      { name: 'Typhoon Spawn', hp: 90, atk: 28, def: 12, gold: 60, color: '#4a2a3a' },
      { name: 'Fallen Demigod', hp: 85, atk: 30, def: 10, gold: 65, color: '#3a2a4a' }
    ]
  }
];

function getGoldRequired(mapIndex) {
  return 200 + mapIndex * 300;
}

function getEnemyLevel(mapIndex, base) {
  return base + mapIndex * 3 + Math.floor(Math.random() * 3);
}

function getRandomEnemy(mapIndex) {
  const pool = ENEMIES_BY_MAP[mapIndex].enemies;
  const e = pool[Math.floor(Math.random() * pool.length)];
  const scale = 1 + mapIndex * 0.08;
  const level = getEnemyLevel(mapIndex, 2);
  return {
    name: e.name,
    level: level,
    hp: Math.floor(e.hp * scale),
    maxHp: Math.floor(e.hp * scale),
    atk: Math.floor(e.atk * scale),
    def: Math.floor(e.def * scale),
    gold: Math.floor((e.gold + Math.floor(mapIndex * 2)) * 2),
    color: e.color,
    isBoss: false,
    isGatekeeper: false
  };
}
