const GATEKEEPERS = [
  {
    name: 'Atalanta',
    title: 'Swift Huntress of Artemis',
    hp: 80, atk: 12, def: 6, color: '#4a8a3a',
    ability: { name: 'Swift Volley', desc: 'Fires two quick arrows', dmgMult: 0.8, hits: 2 },
    goldDrop: 60, soulDrop: 'Atalanta Soul', mapIndex: 0
  },
  {
    name: 'Cadmus',
    title: 'Dragon-Slayer of Thebes',
    hp: 100, atk: 14, def: 8, color: '#8a4a1a',
    ability: { name: 'Dragon Teeth', desc: 'Summons spectral soldiers', dmgMult: 1.2, hits: 1 },
    goldDrop: 80, soulDrop: 'Cadmus Soul', mapIndex: 1
  },
  {
    name: 'Meleager',
    title: 'Hunter of the Calydonian Boar',
    hp: 110, atk: 13, def: 9, color: '#6a5a2a',
    ability: { name: 'Boar Fury', desc: 'Charges with fierce power', dmgMult: 1.5, hits: 1 },
    goldDrop: 90, soulDrop: 'Meleager Soul', mapIndex: 2
  },
  {
    name: 'Theseus',
    title: 'Slayer of the Minotaur',
    hp: 130, atk: 16, def: 10, color: '#4a5a7a',
    ability: { name: 'Ariadne Trick', desc: 'Confuses with labyrinth tactics', dmgMult: 1.3, hits: 1 },
    goldDrop: 110, soulDrop: 'Theseus Soul', mapIndex: 3
  },
  {
    name: 'Odysseus',
    title: 'Master of Cunning',
    hp: 120, atk: 15, def: 8, color: '#5a6a5a',
    ability: { name: 'Trojan Gambit', desc: 'Deceptive strike from behind', dmgMult: 1.6, hits: 1 },
    goldDrop: 120, soulDrop: 'Odysseus Soul', mapIndex: 4
  },
  {
    name: 'Orpheus',
    title: 'The Divine Musician',
    hp: 110, atk: 18, def: 6, color: '#6a4a6a',
    ability: { name: 'Lament of the Dead', desc: 'Piercing musical notes', dmgMult: 1.4, hits: 1 },
    goldDrop: 130, soulDrop: 'Orpheus Soul', mapIndex: 5
  },
  {
    name: 'Achilles',
    title: 'The Unbreakable Warrior',
    hp: 160, atk: 20, def: 14, color: '#8a3a2a',
    ability: { name: 'Myrmidon Assault', desc: 'Devastating precision strike', dmgMult: 1.8, hits: 1 },
    goldDrop: 160, soulDrop: 'Achilles Soul', mapIndex: 6
  },
  {
    name: 'Perseus',
    title: 'Gorgon-Slayer',
    hp: 150, atk: 18, def: 12, color: '#6a6a8a',
    ability: { name: 'Mirror Shield', desc: 'Reflects attack with gorgon gaze', dmgMult: 1.5, hits: 1 },
    goldDrop: 170, soulDrop: 'Perseus Soul', mapIndex: 7
  },
  {
    name: 'Bellerophon',
    title: 'Rider of Pegasus',
    hp: 160, atk: 20, def: 10, color: '#5a6a8a',
    ability: { name: 'Pegasus Dive', desc: 'Aerial strike from above', dmgMult: 1.7, hits: 1 },
    goldDrop: 190, soulDrop: 'Bellerophon Soul', mapIndex: 8
  },
  {
    name: 'Jason',
    title: 'Leader of the Argonauts',
    hp: 180, atk: 22, def: 14, color: '#7a6a3a',
    ability: { name: 'Argonaut Charge', desc: 'Summons heroes for a combined attack', dmgMult: 1.6, hits: 2 },
    goldDrop: 210, soulDrop: 'Jason Soul', mapIndex: 9
  },
  {
    name: 'Hercules',
    title: 'The Mightiest of Heroes',
    hp: 220, atk: 28, def: 16, color: '#6a3a1a',
    ability: { name: 'Nemean Slam', desc: 'Crushing blow with the lion hide', dmgMult: 2.0, hits: 1 },
    goldDrop: 250, soulDrop: 'Hercules Soul', mapIndex: 10
  },
  {
    name: 'Typhon',
    title: 'Father of All Monsters',
    hp: 300, atk: 35, def: 20, color: '#2a0a1a',
    ability: { name: 'Primordial Chaos', desc: 'Devastating primordial energy', dmgMult: 2.5, hits: 1 },
    goldDrop: 500, soulDrop: 'Typhon Soul', mapIndex: 11
  }
];

function getGatekeeperForMap(mapIndex) {
  return GATEKEEPERS.find(g => g.mapIndex === mapIndex) || null;
}
