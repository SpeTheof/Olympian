const Menu = {
  show() {
    Player.rest();

    document.getElementById('menu-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');

    this.refresh();
  },

  refresh() {
    document.getElementById('menu-hp').textContent = Player.hp;
    document.getElementById('menu-max-hp').textContent = Player.maxHp;
    document.getElementById('menu-gold').textContent = Player.gold;
    document.getElementById('menu-potions').textContent = Player.potions;

    document.getElementById('menu-stat-name').textContent = Player.name;
    document.getElementById('menu-stat-level').textContent = Player.level;
    document.getElementById('menu-stat-atk').textContent = Player.getAtk();
    document.getElementById('menu-stat-def').textContent = Player.getDef();
    document.getElementById('menu-stat-weapon').textContent = Player.weaponLevel;
    document.getElementById('menu-stat-armor').textContent = Player.armorLevel;
    document.getElementById('menu-stat-total-gold').textContent = Player.totalGoldEarned;
    document.getElementById('menu-stat-sp').textContent = `${Player.sp}/${Player.maxSp}`;

    const xpNeeded = Player.xpToNext();
    const xpPct = Math.min(100, Math.floor((Player.xp / xpNeeded) * 100));
    document.getElementById('xp-fill-menu').style.width = xpPct + '%';
    document.getElementById('xp-cur-menu').textContent = Player.xp;
    document.getElementById('xp-next-menu').textContent = xpNeeded;

    document.getElementById('weapon-desc').textContent =
      `Dory (Spear) Lv.${Player.weaponLevel} → ATK: ${Player.getAtk()}`;
    document.getElementById('weapon-cost').textContent =
      `Cost: ${Player.getWeaponCost()}g ${Player.gold >= Player.getWeaponCost() ? '💰' : '❌'}`;

    document.getElementById('armor-desc').textContent =
      `Aspis (Shield) Lv.${Player.armorLevel} → DEF: ${Player.getDef()}`;
    document.getElementById('armor-cost').textContent =
      `Cost: ${Player.getArmorCost()}g ${Player.gold >= Player.getArmorCost() ? '💰' : '❌'}`;

    document.getElementById('hp-desc').textContent =
      `Endurance — Max HP: ${Player.maxHp} (+10)`;
    document.getElementById('hp-cost').textContent =
      `Cost: ${Player.getHpCost()}g ${Player.gold >= Player.getHpCost() ? '💰' : '❌'}`;

    document.getElementById('sp-desc').textContent =
      `Willpower — Max SP: ${Player.maxSp} (+5)`;
    document.getElementById('sp-cost').textContent =
      `Cost: ${Player.getSpCost()}g ${Player.gold >= Player.getSpCost() ? '💰' : '❌'}`;

    document.getElementById('potion-desc').textContent =
      `Health Potion (restores 30 HP) — Own: ${Player.potions}`;
    document.getElementById('potion-cost').textContent =
      `Cost: ${Player.getPotionCost()}g ${Player.gold >= Player.getPotionCost() ? '💰' : '❌'}`;

    const autoCard = document.getElementById('auto-card');
    if (Player.autoAttackUnlocked) {
      autoCard.style.display = 'block';
      document.getElementById('auto-desc').textContent = 'Auto-Attack — use best ability automatically';
      document.getElementById('auto-cost').textContent = '✓ Purchased';
    } else {
      const cost = Player.getAutoAttackCost();
      autoCard.style.display = 'block';
      document.getElementById('auto-desc').textContent = 'Unlock auto-battle & auto-farm';
      document.getElementById('auto-cost').textContent = `Cost: ${cost}g ${Player.gold >= cost ? '💰' : '❌'}`;
    }

    const sageCard = document.getElementById('sage-card');
    if (Player.canLearnAbility()) {
      sageCard.style.display = 'block';
      document.getElementById('sage-desc').textContent = `Learn a new ability! (${Player.uniqueSouls.length} souls)`;
      document.getElementById('sage-cost').textContent = 'Use 1 Unique Soul';
    } else {
      if (Player.uniqueSouls.length === 0) {
        document.getElementById('sage-desc').textContent = 'Defeat bosses to earn Unique Souls';
        document.getElementById('sage-cost').textContent = '—';
      } else {
        document.getElementById('sage-desc').textContent = 'All abilities learned!';
        document.getElementById('sage-cost').textContent = '✓';
      }
    }

    this.renderAbilities();
    this.showLastBattle();
    this.showSuggestions();
  },

  renderAbilities() {
    const list = document.getElementById('abilities-list');
    list.innerHTML = '';
    Player.abilities.forEach(a => {
      const tag = document.createElement('span');
      tag.className = 'ability-tag' + (a === Player.selectedAbility ? ' ability-selected' : '');
      tag.textContent = a;
      tag.title = this.abilityDesc(a);
      tag.style.cursor = 'pointer';
      tag.onclick = () => {
        Player.selectedAbility = a;
        this.renderAbilities();
        if (Combat) Combat._updateSpecialBtn();
      };
      list.appendChild(tag);
    });
  },

  abilityDesc(name) {
    const descs = {
      'Power Strike': 'Strong basic attack, costs 8 SP',
      'Zeus Bolt': 'Lightning strike, high damage',
      'Ares Rage': 'Berserker fury, boosts ATK',
      'Athena Shield': 'Counterattack when hit',
      'Poseidon Wrath': 'Water damage + stun chance',
      'Artemis Volley': 'Multi-hit arrow rain',
      'Apollo Sunburst': 'Heal + damage',
      'Hermes Dash': 'Quick strike, ignores DEF',
      'Hephaestus Forge': 'Temporary ATK buff',
      'Aphrodite Charm': 'Chance to confuse enemy',
      'Demeter Bless': 'Restore HP over time',
      'Dionysus Madness': 'Random powerful effect',
      'Hera Judgment': 'Damage based on HP lost',
      'Medusa Gaze': 'Chance to petrify enemy'
    };
    return descs[name] || 'Unique ability';
  },

  showLastBattle() {
    const container = document.getElementById('last-battle');
    const r = Combat.lastResult;
    if (!r) { container.classList.add('hidden'); return; }

    container.classList.remove('hidden');
    if (r.type === 'victory') {
      let html = '<strong>⚔ Last Battle — Victory</strong><br>';
      html += `Defeated ${r.enemyName}${r.enemyLevel ? ' Lv.'+r.enemyLevel : ''}`;
      html += ` | 💰 +${r.goldEarned} | ⚡ +${r.xpGain} XP`;
      if (r.levelUpCount > 0) {
        html += ` | ⬆ LEVEL UP! ${r.prevLevel} → ${r.newLevel}`;
      }
      if (r.drops.length) {
        html += `<br>🔮 ${r.drops.join(', ')}`;
      }
      container.innerHTML = html;
    } else {
      container.innerHTML = `<strong>💀 Last Battle — Defeat</strong><br>Lost to ${r.enemyName} | 💸 Lost ${r.goldLost} gold`;
    }
  },

  showSuggestions() {
    const container = document.getElementById('upgrade-suggestions');
    const idx = Player.currentMapIndex;
    const boss = getBossForMap(idx);
    const gatekeeper = getGatekeeperForMap(idx);

    const suggestions = [];
    const nextFoe = boss || gatekeeper;

    if (nextFoe) {
      const foeLevel = nextFoe.level || (nextFoe.mapIndex !== undefined ? 3 + nextFoe.mapIndex * 4 : 1);
      if (Player.level < foeLevel - 2) {
        suggestions.push(`⬆ You're Lv.${Player.level} but ${nextFoe.name} is Lv.${foeLevel}. Fight more enemies to level up!`);
      }
      if (Player.getAtk() < nextFoe.def + 5) {
        suggestions.push(`⚔ Your ATK (${Player.getAtk()}) is low vs ${nextFoe.name}'s DEF (${nextFoe.def}). Upgrade your weapon!`);
      }
      if (Player.getDef() < nextFoe.atk - 3) {
        suggestions.push(`🛡 Your DEF (${Player.getDef()}) is low vs ${nextFoe.name}'s ATK (${nextFoe.atk}). Upgrade your shield!`);
      }
      if (Player.maxHp < nextFoe.hp * 0.6) {
        suggestions.push(`❤ Your HP (${Player.maxHp}) is low compared to ${nextFoe.name}'s HP (${nextFoe.hp}). Train endurance!`);
      }
      if (Player.potions < 2) {
        suggestions.push(`🧪 You only have ${Player.potions} potion${Player.potions === 1 ? '' : 's'}. Stock up before the fight!`);
      }
      if (Player.maxSp < 20) {
        suggestions.push(`⚡ You have ${Player.maxSp} SP. More SP = more abilities in battle!`);
      }
    }

    if (suggestions.length === 0) {
      suggestions.push('✅ You look ready for the next challenge!');
    }

    container.innerHTML = '<strong>⚡ Camp Advice:</strong><br>' + suggestions.join('<br>');
  },

  upgrade(type) {
    let cost = 0;
    if (type === 'weapon') {
      cost = Player.getWeaponCost();
      if (Player.gold < cost) { this.notEnoughGold(); return; }
      Player.gold -= cost;
      Player.weaponLevel++;
    } else if (type === 'armor') {
      cost = Player.getArmorCost();
      if (Player.gold < cost) { this.notEnoughGold(); return; }
      Player.gold -= cost;
      Player.armorLevel++;
    } else if (type === 'hp') {
      cost = Player.getHpCost();
      if (Player.gold < cost) { this.notEnoughGold(); return; }
      Player.gold -= cost;
      Player.maxHp += 10;
      Player.hp += 10;
    } else if (type === 'sp') {
      cost = Player.getSpCost();
      if (Player.gold < cost) { this.notEnoughGold(); return; }
      Player.gold -= cost;
      Player.maxSp += 5;
      Player.sp += 5;
    }
    this.refresh();
  },

  buyPotion() {
    const cost = Player.getPotionCost();
    if (Player.gold < cost) { this.notEnoughGold(); return; }
    Player.gold -= cost;
    Player.potions++;
    this.refresh();
  },

  buyAutoAttack() {
    if (Player.autoAttackUnlocked) return;
    const cost = Player.getAutoAttackCost();
    if (Player.gold < cost) { this.notEnoughGold(); return; }
    Player.gold -= cost;
    Player.autoAttackUnlocked = true;
    this.refresh();
  },

  learnAbility() {
    if (!Player.canLearnAbility()) return;
    const newAbility = Player.learnNextAbility();
    if (newAbility) {
      Player.uniqueSouls.pop();
      this.refresh();
    }
  },

  notEnoughGold() {
    const container = document.getElementById('upgrade-suggestions');
    container.innerHTML = '<strong>⚠ Not enough gold!</strong><br>Go fight more enemies and earn some.';
  }
};
