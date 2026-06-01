const OLYMPIANS = [
  {
    name: 'Hephaestus',
    title: 'God of the Forge',
    hp: 220, atk: 18, def: 20, color: '#8a5a1a',
    phaseAt: 0.5,
    abilities: {
      normal: { name: 'Hammer Slam', desc: 'Crushes with his forge hammer', dmgMult: 1.3 },
      phase: { name: 'Molten Fury', desc: 'Unleashes forge fire', dmgMult: 1.7 }
    },
    goldDrop: 200, mapIndex: 0,
    intro: 'You dare enter my forge, mortal?'
  },
  {
    name: 'Demeter',
    title: 'Goddess of the Harvest',
    hp: 240, atk: 20, def: 16, color: '#4a8a3a',
    phaseAt: 0.4,
    abilities: {
      normal: { name: 'Vine Whip', desc: 'Strikes with enchanted vines', dmgMult: 1.2 },
      phase: { name: 'Famine Curse', desc: 'Drains life from the land', dmgMult: 1.6 }
    },
    goldDrop: 240, mapIndex: 1,
    intro: 'The harvest comes for all...'
  },
  {
    name: 'Hermes',
    title: 'Messenger of the Gods',
    hp: 200, atk: 24, def: 12, color: '#8a8a2a',
    phaseAt: 0.3,
    abilities: {
      normal: { name: 'Swift Strike', desc: 'Lightning-fast jab', dmgMult: 1.4 },
      phase: { name: 'Stolen Time', desc: 'Attacks twice in a single turn', dmgMult: 1.3 }
    },
    goldDrop: 280, mapIndex: 2,
    intro: 'Too slow, mortal!'
  },
  {
    name: 'Artemis',
    title: 'Goddess of the Hunt',
    hp: 240, atk: 26, def: 14, color: '#5a8a5a',
    phaseAt: 0.4,
    abilities: {
      normal: { name: 'Moon Arrow', desc: 'Precise shot under moonlight', dmgMult: 1.4 },
      phase: { name: 'Silver Volley', desc: 'Rain of celestial arrows', dmgMult: 1.6 }
    },
    goldDrop: 320, mapIndex: 3,
    intro: 'You are the hunted now.'
  },
  {
    name: 'Ares',
    title: 'God of War',
    hp: 280, atk: 30, def: 16, color: '#8a1a1a',
    phaseAt: 0.5,
    abilities: {
      normal: { name: 'Spartan Rage', desc: 'Furious blade assault', dmgMult: 1.5 },
      phase: { name: 'Bloodlust', desc: 'Gets stronger as his HP drops', dmgMult: 1.9 }
    },
    goldDrop: 360, mapIndex: 4,
    intro: 'War is all I know!'
  },
  {
    name: 'Apollo',
    title: 'God of Light and Prophecy',
    hp: 270, atk: 28, def: 14, color: '#c8a83a',
    phaseAt: 0.4,
    abilities: {
      normal: { name: 'Sun Strike', desc: 'Blinding ray of light', dmgMult: 1.4 },
      phase: { name: 'Prophecy', desc: 'Foresees your attack and counters', dmgMult: 1.7 }
    },
    goldDrop: 400, mapIndex: 5,
    intro: 'I have already seen your defeat.'
  },
  {
    name: 'Aphrodite',
    title: 'Goddess of Love',
    hp: 260, atk: 26, def: 12, color: '#c86a8a',
    phaseAt: 0.35,
    abilities: {
      normal: { name: 'Golden Charm', desc: 'Enchanting strike', dmgMult: 1.3 },
      phase: { name: 'Heartbreak', desc: 'Devastating emotional blow', dmgMult: 1.8 }
    },
    goldDrop: 440, mapIndex: 6,
    intro: 'Mortals always fall for me...'
  },
  {
    name: 'Athena',
    title: 'Goddess of Wisdom',
    hp: 290, atk: 26, def: 20, color: '#8a8aaa',
    phaseAt: 0.5,
    abilities: {
      normal: { name: 'Spear of Wisdom', desc: 'Calculated precise thrust', dmgMult: 1.4 },
      phase: { name: 'Shield of Medusa', desc: 'Reflects and counters', dmgMult: 1.9 }
    },
    goldDrop: 480, mapIndex: 7,
    intro: 'Brute force will not save you.'
  },
  {
    name: 'Dionysus',
    title: 'God of Wine and Madness',
    hp: 310, atk: 30, def: 14, color: '#6a2a6a',
    phaseAt: 0.4,
    abilities: {
      normal: { name: 'Thyrsus Strike', desc: 'Wild unpredictable blow', dmgMult: 1.4 },
      phase: { name: 'Maddening Revel', desc: 'Chaos strikes all around', dmgMult: 2.0 }
    },
    goldDrop: 520, mapIndex: 8,
    intro: 'Drink with me... forever!'
  },
  {
    name: 'Hera',
    title: 'Queen of the Gods',
    hp: 350, atk: 32, def: 20, color: '#6a3a8a',
    phaseAt: 0.5,
    abilities: {
      normal: { name: 'Divine Wrath', desc: 'Queenly judgment', dmgMult: 1.5 },
      phase: { name: 'Celestial Storm', desc: 'Unleashes the fury of Olympus', dmgMult: 2.1 }
    },
    goldDrop: 560, mapIndex: 9,
    intro: 'How dare you stand before a queen?'
  },
  {
    name: 'Poseidon',
    title: 'God of the Sea',
    hp: 380, atk: 34, def: 22, color: '#1a4a8a',
    phaseAt: 0.5,
    abilities: {
      normal: { name: 'Trident Thrust', desc: 'Strikes with the sea trident', dmgMult: 1.5 },
      phase: { name: 'Tidal Wave', desc: 'Overwhelming ocean force', dmgMult: 2.3 }
    },
    goldDrop: 600, mapIndex: 10,
    intro: 'The sea bows to no one!'
  },
  {
    name: 'Zeus',
    title: 'King of the Gods',
    hp: 400, atk: 38, def: 22, color: '#4a3a8a',
    phaseAt: 0.5,
    abilities: {
      normal: { name: 'Thunderbolt', desc: 'Master bolt strike', dmgMult: 1.5 },
      phase: { name: 'Storm of Olympus', desc: 'Calls the full wrath of the sky', dmgMult: 2.5 }
    },
    goldDrop: 600, mapIndex: 11,
    intro: 'You dare challenge the King of Olympus?'
  }
];

function getBossForMap(mapIndex) {
  return OLYMPIANS.find(b => b.mapIndex === mapIndex) || null;
}
