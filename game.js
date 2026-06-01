const Game = {
  start() {
    const nameInput = document.getElementById('hero-name');
    const name = nameInput ? nameInput.value.trim() : '';
    Player.reset();
    Player.name = name || 'Spartan';
    Combat.lastResult = null;
    MapSystem.show();
  },

  reset() {
    document.getElementById('victory-screen').classList.add('hidden');
    this.start();
  },

  startRandomBattle() {
    const enemy = getRandomEnemy(Player.currentMapIndex);
    Combat.start(enemy, 'random');
  },

  startFarming() {
    Player.farming = true;
    this.startRandomBattle();
  },

  startGatekeeperBattle() {
    const gatekeeper = getGatekeeperForMap(Player.currentMapIndex);
    if (!gatekeeper) return;
    const needed = getGoldRequired(Player.currentMapIndex);
    if (Player.totalGoldEarned < needed) return;
    const gkLevel = 3 + Player.currentMapIndex * 4;
    const enemy = {
      ...gatekeeper,
      level: gkLevel,
      maxHp: gatekeeper.hp,
      isGatekeeper: true,
      gold: gatekeeper.goldDrop,
      soulDrop: gatekeeper.soulDrop
    };
    Combat.start(enemy, 'gatekeeper');
  },

  startBossBattle() {
    const boss = getBossForMap(Player.currentMapIndex);
    if (!boss) return;
    const gatekeeper = getGatekeeperForMap(Player.currentMapIndex);
    if (gatekeeper && !Player.gatekeepersDefeated.includes(gatekeeper.name)) return;
    if (Player.bossesDefeated.includes(boss.name)) return;
    const idx = Player.currentMapIndex;
    const difficultyScale = 1 + idx * 0.08;
    const bossLevel = 5 + Player.currentMapIndex * 5;
    const enemy = {
      ...boss,
      level: bossLevel,
      maxHp: boss.hp,
      hp: Math.floor(boss.hp * difficultyScale),
      atk: Math.floor(boss.atk * difficultyScale),
      def: Math.floor(boss.def * difficultyScale),
      gold: boss.goldDrop + Math.floor(idx * 10),
      isBoss: true,
      soulDrop: boss.name + ' Soul',
      abilities: boss.abilities,
      phaseAt: boss.phaseAt
    };
    Combat.start(enemy, 'boss');
  },

  afterBattle() {
    const last = Combat.lastResult;
    if (last && last.type === 'victory' && last.battleType === 'boss') {
      Player.currentMapIndex++;
    }
    MapSystem.refresh();
    Menu.show();
  },

  continueMap() {
    MapSystem.show();
  },

  showAbilities() {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('abilities-screen').classList.remove('hidden');
    const list = document.getElementById('abilities-codex-list');
    list.innerHTML = '';
    Player.abilities.forEach(name => {
      const data = ABILITY_DATA[name];
      if (!data) return;
      const card = document.createElement('div');
      card.className = 'ability-codex-card';
      let hitsInfo = data.hits ? ` | Hits: ${data.hits}` : '';
      card.innerHTML = `
        <div class="codex-header">${name}</div>
        <div class="codex-desc">${data.desc}</div>
        <div class="codex-stats">
          SP Cost: ${data.cost} | DMG Mult: ${data.dmgMult}x | ATK Boost: +${data.atkBoost}${hitsInfo}
        </div>
      `;
      list.appendChild(card);
    });
  },

  hideAbilities() {
    document.getElementById('abilities-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
  },

  showVictory() {
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.remove('hidden');
    document.getElementById('final-stats').textContent =
      `Final Level: ${Player.level} | Battles: ${Player.totalBattles} | Gold: ${Player.totalGoldEarned} | Abilities: ${Player.abilities.length}`;
  }
};
