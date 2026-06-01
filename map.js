const MapSystem = {
  show() {
    const idx = Player.currentMapIndex;
    if (!ENEMIES_BY_MAP[idx]) {
      Game.showVictory();
      return;
    }
    document.getElementById('map-screen').classList.remove('hidden');
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('battle-screen').classList.add('hidden');
    this.refresh();
  },

  refresh() {
    const idx = Player.currentMapIndex;
    const mapData = ENEMIES_BY_MAP[idx];

    if (!mapData) {
      Game.showVictory();
      return;
    }

    document.getElementById('map-name').textContent = `📍 ${mapData.name}`;
    document.getElementById('map-description').textContent = mapData.desc;
    document.getElementById('map-hp').textContent = Player.hp;
    document.getElementById('map-max-hp').textContent = Player.maxHp;
    document.getElementById('map-gold').textContent = Player.gold;
    document.getElementById('map-potions').textContent = Player.potions;

    document.getElementById('stat-name').textContent = Player.name;
    document.getElementById('stat-level').textContent = Player.level;
    document.getElementById('stat-atk').textContent = Player.getAtk();
    document.getElementById('stat-def').textContent = Player.getDef();
    document.getElementById('stat-weapon').textContent = Player.weaponLevel;
    document.getElementById('stat-armor').textContent = Player.armorLevel;
    document.getElementById('stat-total-gold').textContent = Player.totalGoldEarned;
    document.getElementById('stat-abilities').textContent = Player.abilities.length;

    const xpNeeded = Player.xpToNext();
    const xpPct = Math.min(100, Math.floor((Player.xp / xpNeeded) * 100));
    document.getElementById('xp-fill-map').style.width = xpPct + '%';
    document.getElementById('xp-cur-map').textContent = Player.xp;
    document.getElementById('xp-next-map').textContent = xpNeeded;

    const needed = getGoldRequired(idx);
    const current = Player.totalGoldEarned;
    const pct = Math.min(100, Math.floor((current / needed) * 100));

    document.getElementById('progress-current').textContent = Math.min(current, needed);
    document.getElementById('progress-needed').textContent = needed;
    document.getElementById('progress-fill').style.width = pct + '%';

    const gatekeeper = getGatekeeperForMap(idx);
    const boss = getBossForMap(idx);
    const gatekeeperDefeated = gatekeeper && Player.gatekeepersDefeated.includes(gatekeeper.name);
    const bossDefeated = boss && Player.bossesDefeated.includes(boss.name);

    const farmBtn = document.getElementById('farm-btn');
    if (Player.autoAttackUnlocked) {
      farmBtn.classList.remove('hidden');
    } else {
      farmBtn.classList.add('hidden');
    }

    const gatekeeperBtn = document.getElementById('gatekeeper-btn');
    const bossBtn = document.getElementById('boss-btn');
    const gatekeeperInfo = document.getElementById('gatekeeper-info');
    const bossInfo = document.getElementById('boss-info');

    if (gatekeeper) {
      const unlocked = current >= needed;
      gatekeeperBtn.classList.remove('hidden');
      gatekeeperBtn.textContent = unlocked
        ? `⚔ Challenge ${gatekeeper.name}`
        : `🔒 Need ${needed - current} more gold earned`;
      gatekeeperBtn.className = unlocked ? 'gold-btn' : 'gold-btn locked-btn';
      gatekeeperInfo.classList.remove('hidden');
      const gkLv = 3 + idx * 4;
      const defeated = Player.gatekeepersDefeated.includes(gatekeeper.name);
      gatekeeperInfo.innerHTML = `
        <strong>${gatekeeper.name}</strong> — ${gatekeeper.title}${defeated ? ' <span class="defeated">(Rematch)</span>' : ''}
        <span class="stat-preview">Lv.${gkLv}  HP:${gatekeeper.hp}  ATK:${gatekeeper.atk}  DEF:${gatekeeper.def}</span>
      `;
    } else {
      gatekeeperBtn.classList.add('hidden');
      gatekeeperInfo.classList.add('hidden');
    }

    if (gatekeeperDefeated && boss && !bossDefeated) {
      bossBtn.classList.remove('hidden');
      bossBtn.textContent = `⚔ Face ${boss.name} — ${boss.title}`;
      bossBtn.className = 'boss-btn';
      bossInfo.classList.remove('hidden');
      const bossLv = 5 + idx * 5;
      bossInfo.innerHTML = `
        <strong>${boss.name}</strong> — Phase 2 at ${Math.round((1 - (boss.phaseAt || 0.5)) * 100)}% HP
        <span class="stat-preview">Lv.${bossLv}  HP:${boss.hp}  ATK:${boss.atk}  DEF:${boss.def}</span>
      `;
    } else if (bossDefeated) {
      bossBtn.classList.add('hidden');
      bossInfo.classList.remove('hidden');
      bossInfo.innerHTML = `<span class="defeated">👑 ${boss.name} — Defeated ✓</span>`;
    } else {
      bossBtn.classList.add('hidden');
      bossInfo.classList.add('hidden');
    }

    if (bossDefeated) {
      document.getElementById('boss-btn').classList.add('hidden');
    }
  }
};
