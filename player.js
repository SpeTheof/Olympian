const ABILITY_DATA = {
  'Power Strike': { cost: 8, dmgMult: 1.3, atkBoost: 3, desc: 'Strong basic attack' },
  'Zeus Bolt': { cost: 12, dmgMult: 1.8, atkBoost: 5, desc: 'Lightning strike, high damage' },
  'Ares Rage': { cost: 10, dmgMult: 1.5, atkBoost: 5, desc: 'Berserker fury' },
  'Athena Shield': { cost: 8, dmgMult: 1.2, atkBoost: 2, desc: 'Defensive counter' },
  'Poseidon Wrath': { cost: 12, dmgMult: 1.6, atkBoost: 4, desc: 'Water damage' },
  'Artemis Volley': { cost: 10, dmgMult: 0.8, atkBoost: 2, hits: 3, desc: 'Multi-hit arrow rain' },
  'Apollo Sunburst': { cost: 10, dmgMult: 1.4, atkBoost: 3, desc: 'Blinding ray of light' },
  'Hermes Dash': { cost: 6, dmgMult: 1.2, atkBoost: 4, desc: 'Quick strike, ignores DEF' },
  'Hephaestus Forge': { cost: 8, dmgMult: 1.3, atkBoost: 5, desc: 'Temporary ATK buff' },
  'Aphrodite Charm': { cost: 10, dmgMult: 1.1, atkBoost: 2, desc: 'Chance to confuse' },
  'Demeter Bless': { cost: 8, dmgMult: 1.0, atkBoost: 2, desc: 'Restore HP over time' },
  'Dionysus Madness': { cost: 12, dmgMult: 2.0, atkBoost: 6, desc: 'Random powerful effect' },
  'Hera Judgment': { cost: 14, dmgMult: 1.0, atkBoost: 2, desc: 'Damage based on HP lost' },
  'Medusa Gaze': { cost: 12, dmgMult: 1.3, atkBoost: 3, desc: 'Chance to petrify enemy' }
};

const Player = {
  name: 'Spartan',
  hp: 60,
  maxHp: 60,
  sp: 15,
  maxSp: 15,
  atk: 10,
  def: 3,
  gold: 0,
  level: 1,
  xp: 0,
  potions: 2,
  weaponLevel: 1,
  armorLevel: 1,
  currentMapIndex: 0,
  abilities: ['Power Strike'],
  selectedAbility: 'Power Strike',
  gatekeepersDefeated: [],
  bossesDefeated: [],
  uniqueSouls: [],
  totalBattles: 0,
  totalGoldEarned: 0,
  autoAttackUnlocked: false,
  farming: false,

  reset() {
    this.name = 'Spartan';
    this.hp = 60;
    this.maxHp = 60;
    this.sp = 15;
    this.maxSp = 15;
    this.atk = 10;
    this.def = 3;
    this.gold = 0;
    this.level = 1;
    this.xp = 0;
    this.potions = 2;
    this.weaponLevel = 1;
    this.armorLevel = 1;
    this.currentMapIndex = 0;
    this.abilities = ['Power Strike'];
    this.selectedAbility = 'Power Strike';
    this.gatekeepersDefeated = [];
    this.bossesDefeated = [];
    this.uniqueSouls = [];
    this.totalBattles = 0;
    this.totalGoldEarned = 0;
    this.autoAttackUnlocked = false;
    this.farming = false;
  },

  xpToNext() {
    return 30 + this.level * 40;
  },

  getAtk() { return this.atk + (this.weaponLevel - 1) * 3; },
  getDef() { return this.def + (this.armorLevel - 1) * 2; },
  getWeaponCost() { return 40 + this.weaponLevel * 20; },
  getArmorCost() { return 30 + this.armorLevel * 15; },
  getHpCost() { return 20 + Math.floor((this.maxHp - 60) / 10) * 15; },
  getSpCost() { return 20 + Math.floor((this.maxSp - 15) / 5) * 15; },
  getPotionCost() { return 15 + Math.floor(this.potions * 2); },
  getAutoAttackCost() { return 100 + this.totalBattles * 5; },

  rest() {
    this.hp = this.maxHp;
    this.sp = this.maxSp;
  },

  addXp(amount) {
    this.xp += amount;
    const needed = this.xpToNext();
    if (this.xp >= needed) {
      this.xp -= needed;
      this.levelUp();
      return true;
    }
    return false;
  },

  levelUp() {
    this.level++;
    this.maxHp += 5;
    this.hp = this.maxHp;
    this.atk += 1;
    this.def += 1;
    this.maxSp += 2;
    this.sp = this.maxSp;
  },

  canLearnAbility() {
    const allAbilities = ['Power Strike', 'Zeus Bolt', 'Ares Rage', 'Athena Shield',
      'Poseidon Wrath', 'Artemis Volley', 'Apollo Sunburst', 'Hermes Dash',
      'Hephaestus Forge', 'Aphrodite Charm', 'Demeter Bless', 'Dionysus Madness',
      'Hera Judgment', 'Medusa Gaze'];
    return this.uniqueSouls.length > 0 && this.abilities.length < allAbilities.length;
  },

  learnNextAbility() {
    const allAbilities = ['Power Strike', 'Zeus Bolt', 'Ares Rage', 'Athena Shield',
      'Poseidon Wrath', 'Artemis Volley', 'Apollo Sunburst', 'Hermes Dash',
      'Hephaestus Forge', 'Aphrodite Charm', 'Demeter Bless', 'Dionysus Madness',
      'Hera Judgment', 'Medusa Gaze'];
    for (const a of allAbilities) {
      if (!this.abilities.includes(a)) {
        this.abilities.push(a);
        return a;
      }
    }
    return null;
  }
};
