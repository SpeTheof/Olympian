const Combat = {
  enemy: null,
  player: null,
  isPlayerTurn: true,
  battleType: 'random',
  gameOver: false,
  isDefending: false,
  autoMode: false,
  farming: false,
  turnCount: 0,
  bossPhaseTriggered: false,
  displayEnemyHp: 0,
  displayPlayerHp: 0,
  animFrame: null,
  floatingTexts: [],
  idleTime: 0,
  enemyShake: 0,
  playerShake: 0,
  edx: 180, edy: 100, ecx: 180, ecy: 70,
  pdx: 620, pdy: 250,

  start(enemy, type = 'random') {
    this.enemy = JSON.parse(JSON.stringify(enemy));
    this.player = {
      hp: Player.hp,
      maxHp: Player.maxHp,
      sp: Player.sp,
      maxSp: Player.maxSp,
      atk: Player.getAtk(),
      def: Player.getDef()
    };
    this.battleType = type;
    this.isPlayerTurn = true;
    this.gameOver = false;
    this.isDefending = false;
    this.autoMode = false;
    this.farming = Player.farming;
    this.turnCount = 0;
    this.bossPhaseTriggered = false;
    this.displayEnemyHp = this.enemy.hp;
    this.displayPlayerHp = this.player.hp;

    this._updateSpecialBtn();
    const autoBtn = document.getElementById('auto-btn');
    if (Player.autoAttackUnlocked) {
      autoBtn.classList.remove('hidden');
    } else {
      autoBtn.classList.add('hidden');
    }

    document.getElementById('battle-actions').classList.remove('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.add('hidden');

    const log = document.getElementById('battle-log');
    const levelTag = this.enemy.level ? ` Lv.${this.enemy.level}` : '';
    log.innerHTML = `<span class="log-system">⚔ A wild ${this.enemy.name}${levelTag} appears!</span>`;
    if (this.enemy.intro) {
      log.innerHTML += `<br><span class="log-system">"${this.enemy.intro}"</span>`;
    }

    this.draw();
    if (this.enemy.isBoss) {
      Music.playBoss();
    } else {
      Music.playBattle();
    }

    if (this.farming) {
      this.autoMode = true;
      document.getElementById('auto-btn').textContent = 'Auto ⏳';
      document.getElementById('farming-btn').classList.remove('hidden');
      setTimeout(() => this.autoTurn(), 500);
    }

    const onResize = () => this.draw();
    window.removeEventListener('resize', this._resizeHandler);
    window.addEventListener('resize', onResize);
    this._resizeHandler = onResize;

    if (this._ro) this._ro.disconnect();
    const canvas = document.getElementById('battle-canvas');
    this._ro = new ResizeObserver(() => this.draw());
    this._ro.observe(canvas.parentElement);
  },

  _updateSpecialBtn() {
    const btn = document.querySelector('.special-btn');
    if (!btn) return;
    const data = ABILITY_DATA[Player.selectedAbility];
    btn.textContent = data ? `${Player.selectedAbility} (${data.cost} SP)` : 'Special';
  },

  resizeCanvas() {
    const canvas = document.getElementById('battle-canvas');
    const container = canvas.parentElement;
    void container.offsetHeight;
    const rect = container.getBoundingClientRect();
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
  },

  draw() {
    this.resizeCanvas();
    const canvas = document.getElementById('battle-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    this.idleTime += 0.02;
    if (this.enemyShake > 0) this.enemyShake *= 0.85;
    if (this.playerShake > 0) this.playerShake *= 0.85;

    // Background fills full canvas (can stretch)
    this.drawBackground(ctx, w, h);

    const portrait = h > w;
    const dw = portrait ? 460 : 800;
    const dh = portrait ? 460 : 460;
    const scale = Math.min(w / dw, h / dh);
    const offX = (w - dw * scale) / 2;
    const offY = (h - dh * scale) / 2;
    ctx.save();
    ctx.translate(offX, offY);
    ctx.scale(scale, scale);

    const enemyScale = this.enemy.isBoss ? 2.5 : this.enemy.isGatekeeper ? 2.2 : 2.0;

    if (portrait) {
      this.edx = 115; this.edy = 70; this.ecx = 115; this.ecy = 40;
      this.pdx = 345; this.pdy = 250;
      this.drawHealthBar(ctx, 20, 8, 200, 22, this.displayEnemyHp, this.enemy.maxHp, this.enemy.name, this.enemy.level);
      this.drawCharacter(ctx, this.enemy, 115, 210, true, enemyScale);
      const playerScale = 1.8;
      this.drawCharacter(ctx, this.player, 345, 260, false, playerScale);
      this.drawHealthBar(ctx, 240, 380, 200, 22, this.displayPlayerHp, this.player.maxHp, Player.name, Player.level);
      this.drawSPBar(ctx, 240, 404, 200, 22, this.player.sp, this.player.maxSp);
    } else {
      this.edx = 180; this.edy = 100; this.ecx = 180; this.ecy = 70;
      this.pdx = 620; this.pdy = 250;
      this.drawHealthBar(ctx, 40, 12, 280, 30, this.displayEnemyHp, this.enemy.maxHp, this.enemy.name, this.enemy.level);
      this.drawCharacter(ctx, this.enemy, 180, 190, true, enemyScale);
      const playerScale = 1.8;
      this.drawCharacter(ctx, this.player, 620, 285, false, playerScale);
      this.drawHealthBar(ctx, 460, 395, 280, 32, this.displayPlayerHp, this.player.maxHp, Player.name, Player.level);
      this.drawSPBar(ctx, 460, 429, 280, 30, this.player.sp, this.player.maxSp);
    }

    this.drawFloatingTexts(ctx);
    ctx.restore();
  },

  drawBackground(ctx, dw, dh) {
    const colors = [
      ['#0d1a0d', '#051005'], ['#2a1a08', '#140a00'], ['#1a1a08', '#0f0f04'],
      ['#1a0d1a', '#0a050a'], ['#0a1420', '#040810'], ['#091515', '#040a0a'],
      ['#1a0808', '#0a0202'], ['#0f0f1a', '#080810'], ['#1a0815', '#0c0410'],
      ['#150d1a', '#0a0610'], ['#08081a', '#03030a'], ['#2a1a08', '#1a0a00']
    ];
    const idx = Math.min(Player.currentMapIndex, colors.length - 1);
    const [top, bottom] = colors[idx] || ['#1a1210', '#0a0808'];
    const grad = ctx.createLinearGradient(0, 0, 0, dh);
    grad.addColorStop(0, top);
    grad.addColorStop(1, bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, dw, dh);

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 20; i++) {
      const sx = (i * 53 + 17) % dw;
      const sy = (i * 37 + 29) % dh;
      ctx.fillRect(sx, sy, 1 + (i % 2), 1 + (i % 2));
    }
  },

  drawCharacter(ctx, entity, x, y, isEnemy, scale = 1.0) {
    const color = entity.color || '#6a5a4a';

    ctx.save();
    const breathe = Math.sin(this.idleTime * 2 + (isEnemy ? 0 : Math.PI)) * 2;
    const shake = isEnemy ? this.enemyShake : this.playerShake;
    const shakeX = shake > 0.5 ? (Math.random() - 0.5) * shake : 0;
    const shakeY = shake > 0.5 ? (Math.random() - 0.5) * shake : 0;
    ctx.translate(x + shakeX, y + breathe + shakeY);

    if (isEnemy && this.isDefending && this.battleType !== 'random') {
      ctx.globalAlpha = 0.3;
    }

    const s = scale;
    const headY = -50 * s;

    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    const headColor = isEnemy ? color : '#d4a87a';
    ctx.fillStyle = headColor;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, headY, 18 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.fillStyle = isEnemy ? '#8a2a2a' : '#2a4a8a';
    ctx.beginPath();
    ctx.arc(-6 * s, headY - 3 * s, 3 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6 * s, headY - 3 * s, 3 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-5 * s, headY - 4 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7 * s, headY - 4 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();

    // ── Body type ──
    const bodyType = isEnemy ? this.getBodyType(entity.name) : 'humanoid';

    if (bodyType === 'elemental') {
      this.drawElementalBody(ctx, s, color);
    } else if (bodyType === 'quadruped') {
      this.drawQuadrupedBody(ctx, entity, s, color);
    } else if (bodyType === 'winged') {
      this.drawWingedBody(ctx, s, color, isEnemy);
    } else if (bodyType === 'giant') {
      this.drawGiantBody(ctx, entity, s, color, isEnemy, headY);
    } else {
      this.drawHumanoidBody(ctx, entity, s, color, isEnemy, headY);
    }

    if (entity.isGatekeeper || entity.isBoss) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, headY - 25 * s, 28 * s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = `${16 * s}px serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      if (entity.isBoss) ctx.fillText('👑', 0, headY - 40 * s);
      else ctx.fillText('⚔', 0, headY - 40 * s);
    }

    ctx.restore();
  },

  getBodyType(name) {
    if (/spirit|wraith|elemental|aura|kraken|tentacle|flame/i.test(name)) return 'elemental';
    if (/harpy|siren|nymph|owl|griffin/i.test(name)) return 'winged';
    if (/centaur|boar|hound|panther|serpent|leviathan|beast/i.test(name)) return 'quadruped';
    if (/golem|guardian|cyclops|minotaur|chariot|spawn|demigod|giant/i.test(name)) return 'giant';
    return 'humanoid';
  },

  drawHumanoidBody(ctx, entity, s, color, isEnemy, headY) {
    ctx.fillStyle = color;
    ctx.fillRect(-8 * s, -30 * s, 16 * s, 60 * s);
    ctx.fillStyle = isEnemy ? '#6a1a1a' : '#1a3a6a';
    ctx.fillRect(-14 * s, -10 * s, 6 * s, 30 * s);
    ctx.fillRect(8 * s, -10 * s, 6 * s, 30 * s);
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-10 * s, 35 * s, 8 * s, 18 * s);
    ctx.fillRect(2 * s, 35 * s, 8 * s, 18 * s);
    if (/satyr/i.test(entity.name)) {
      ctx.fillStyle = '#8a8a6a';
      ctx.beginPath(); ctx.moveTo(-6 * s, headY - 5 * s); ctx.lineTo(-10 * s, headY - 20 * s); ctx.lineTo(-2 * s, headY - 8 * s); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(6 * s, headY - 5 * s); ctx.lineTo(10 * s, headY - 20 * s); ctx.lineTo(2 * s, headY - 8 * s); ctx.closePath(); ctx.fill();
    }
  },

  drawQuadrupedBody(ctx, entity, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 8 * s, 28 * s, 18 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-18 * s, 22 * s, 5 * s, 16 * s);
    ctx.fillRect(-6 * s, 24 * s, 5 * s, 16 * s);
    ctx.fillRect(4 * s, 24 * s, 5 * s, 16 * s);
    ctx.fillRect(16 * s, 22 * s, 5 * s, 16 * s);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(28 * s, 5 * s);
    ctx.quadraticCurveTo(38 * s, -10 * s, 34 * s, -20 * s);
    ctx.stroke();
    ctx.lineWidth = 2;
  },

  drawWingedBody(ctx, s, color, isEnemy) {
    ctx.fillStyle = color;
    ctx.fillRect(-10 * s, -30 * s, 20 * s, 55 * s);
    ctx.fillStyle = isEnemy ? '#6a4a4a' : '#4a6a6a';
    ctx.beginPath();
    ctx.moveTo(-10 * s, -20 * s); ctx.lineTo(-40 * s, -45 * s); ctx.lineTo(-35 * s, -20 * s); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(10 * s, -20 * s); ctx.lineTo(40 * s, -45 * s); ctx.lineTo(35 * s, -20 * s); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-10 * s, 30 * s, 4 * s, 15 * s);
    ctx.fillRect(6 * s, 30 * s, 4 * s, 15 * s);
    ctx.fillStyle = '#8a8a6a';
    ctx.fillRect(-12 * s, 42 * s, 8 * s, 3 * s);
    ctx.fillRect(4 * s, 42 * s, 8 * s, 3 * s);
  },

  drawGiantBody(ctx, entity, s, color, isEnemy, headY) {
    ctx.fillStyle = color;
    ctx.fillRect(-14 * s, -35 * s, 28 * s, 70 * s);
    ctx.fillStyle = isEnemy ? '#6a1a1a' : '#1a3a6a';
    ctx.fillRect(-22 * s, -15 * s, 10 * s, 35 * s);
    ctx.fillRect(12 * s, -15 * s, 10 * s, 35 * s);
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-16 * s, 38 * s, 12 * s, 20 * s);
    ctx.fillRect(4 * s, 38 * s, 12 * s, 20 * s);
    if (entity.name.match(/minotaur|cyclops|satyr/i)) {
      ctx.fillStyle = '#8a8a6a';
      ctx.beginPath(); ctx.moveTo(-8 * s, headY - 5 * s); ctx.lineTo(-12 * s, headY - 25 * s); ctx.lineTo(-4 * s, headY - 10 * s); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(8 * s, headY - 5 * s); ctx.lineTo(12 * s, headY - 25 * s); ctx.lineTo(4 * s, headY - 10 * s); ctx.closePath(); ctx.fill();
    }
    if (/cyclops/i.test(entity.name)) {
      ctx.fillStyle = '#ff4a2a';
      ctx.beginPath(); ctx.arc(0, headY + 2 * s, 6 * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(0, headY + 2 * s, 2 * s, 0, Math.PI * 2); ctx.fill();
    }
  },

  drawElementalBody(ctx, s, color) {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 10 * s, 20 * s, 30 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(0, -5 * s, 10 * s, 15 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    for (let i = -16 * s; i <= 16 * s; i += 5 * s) {
      const wy = 35 * s + Math.sin(i * 0.3 + this.idleTime * 4) * 4 * s;
      ctx.fillRect(i, wy, 5 * s, 8 * s);
    }
  },

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  drawHealthBar(ctx, x, y, w, h, displayVal, max, name, level) {
    const pct = Math.max(0, Math.min(1, displayVal / max));
    ctx.save();

    let barColor;
    if (pct > 0.6) barColor = '#4aff6a';
    else if (pct > 0.3) barColor = '#e8c84a';
    else barColor = '#ff4a2a';

    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#fff';
    ctx.fillText(name, x, y - 6);
    if (level) {
      ctx.textAlign = 'right';
      ctx.fillText(`Lv.${level}`, x + w, y - 6);
    }

    ctx.fillStyle = '#0a0808';
    this.roundRect(ctx, x, y, w, h, 6);
    ctx.fill();

    ctx.fillStyle = '#1a1518';
    this.roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 5);
    ctx.fill();

    if (pct > 0) {
      const grad = ctx.createLinearGradient(x, y, x + w * pct, y + h);
      grad.addColorStop(0, barColor);
      grad.addColorStop(0.7, barColor);
      grad.addColorStop(1, '#fff04a');
      ctx.fillStyle = grad;
      this.roundRect(ctx, x + 2, y + 2, (w - 4) * pct, h - 4, 5);
      ctx.fill();

      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#fff';
      this.roundRect(ctx, x + 4, y + 3, Math.max(0, (w - 8) * pct), 4, 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = '#5a4838';
    ctx.lineWidth = 2;
    this.roundRect(ctx, x, y, w, h, 6);
    ctx.stroke();

    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(`${Math.ceil(displayVal)} / ${max}`, x + w / 2, y + h / 2 + 1);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${Math.ceil(displayVal)} / ${max}`, x + w / 2, y + h / 2 + 1);

    ctx.restore();
  },

  drawSPBar(ctx, x, y, w, h, current, max) {
    const pct = Math.max(0, Math.min(1, current / max));
    ctx.save();

    ctx.fillStyle = '#0a0808';
    this.roundRect(ctx, x, y, w, h, 6);
    ctx.fill();

    ctx.fillStyle = '#1a1518';
    this.roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 5);
    ctx.fill();

    if (pct > 0) {
      const grad = ctx.createLinearGradient(x, y, x + w * pct, y + h);
      grad.addColorStop(0, '#e8c84a');
      grad.addColorStop(0.7, '#e8c84a');
      grad.addColorStop(1, '#fff04a');
      ctx.fillStyle = grad;
      this.roundRect(ctx, x + 2, y + 2, (w - 4) * pct, h - 4, 5);
      ctx.fill();

      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#fff';
      this.roundRect(ctx, x + 4, y + 3, Math.max(0, (w - 8) * pct), 4, 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = '#5a4838';
    ctx.lineWidth = 2;
    this.roundRect(ctx, x, y, w, h, 6);
    ctx.stroke();

    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(`⚡ ${Math.floor(current)} / ${max}`, x + w / 2, y + h / 2 + 1);
    ctx.fillStyle = '#e8c84a';
    ctx.fillText(`⚡ ${Math.floor(current)} / ${max}`, x + w / 2, y + h / 2 + 1);

    ctx.restore();
  },

  addFloatingText(x, y, text, color = '#ff4a2a') {
    this.floatingTexts.push({ x, y, text, color, life: 1.0, vy: -1.5 });
  },

  drawFloatingTexts(ctx) {
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
    for (const ft of this.floatingTexts) {
      ft.y += ft.vy;
      ft.life -= 0.025;
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.life);
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  },

  log(msg, cls = 'log-system') {
    const log = document.getElementById('battle-log');
    log.innerHTML += `<br><span class="${cls}">${msg}</span>`;
    log.scrollTop = log.scrollHeight;
  },

  animateBars() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const step = () => {
      let changed = false;
      const eDiff = this.enemy.hp - this.displayEnemyHp;
      if (Math.abs(eDiff) > 0.5) {
        this.displayEnemyHp += eDiff * 0.18;
        changed = true;
      } else {
        this.displayEnemyHp = this.enemy.hp;
      }
      const pDiff = this.player.hp - this.displayPlayerHp;
      if (Math.abs(pDiff) > 0.5) {
        this.displayPlayerHp += pDiff * 0.18;
        changed = true;
      } else {
        this.displayPlayerHp = this.player.hp;
      }
      this.draw();
      if (changed || this.floatingTexts.length) this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  },

  doAction(action, abilityName) {
    if (!this.isPlayerTurn || this.gameOver) return;
    this.isPlayerTurn = false;
    this.isDefending = false;

    if (action === 'attack') {
      this.playerAttack();
    } else if (action === 'ability') {
      const data = ABILITY_DATA[abilityName];
      if (!data) { this.isPlayerTurn = true; return; }
      if (this.player.sp < data.cost) {
        this.log(`Not enough SP for ${abilityName}!`, 'log-system');
        this.isPlayerTurn = true;
        return;
      }
      this.player.sp -= data.cost;
      this.playerSpecial(abilityName, data);
    } else if (action === 'defend') {
      this.isDefending = true;
      Sound.defend();
      this.log(`${Player.name} braces for the attack! 🛡`, 'log-defend');
    } else if (action === 'item') {
      if (Player.potions <= 0) {
        this.log('No potions left!', 'log-system');
        this.isPlayerTurn = true;
        return;
      }
      Player.potions--;
      this.player.potions = Player.potions;
      const heal = 30;
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
      Sound.heal();
      this.log(`${Player.name} drinks a potion! Restored ${heal} HP 💚`, 'log-heal');
      this.animateBars();
    } else if (action === 'auto') {
      if (!Player.autoAttackUnlocked) {
        this.log('Buy Auto-Attack at camp first!', 'log-system');
        this.isPlayerTurn = true;
        return;
      }
      this.autoMode = !this.autoMode;
      this.log(this.autoMode ? '⚡ Auto-battle ON' : '⚡ Auto-battle OFF', 'log-system');
      document.getElementById('auto-btn').textContent = this.autoMode ? 'Auto ⏳' : 'Auto';
      this.isPlayerTurn = true;
      this.draw();
      if (this.autoMode) setTimeout(() => this.autoTurn(), 300);
      return;
    }

    if (!this.gameOver) {
      setTimeout(() => {
        this.enemyTurn();
        if (this.autoMode && !this.gameOver) {
          setTimeout(() => this.autoTurn(), 400);
        }
      }, 600);
    }
    this.draw();
  },

  _bestAffordableAbility() {
    return Player.abilities
      .map(n => ({ name: n, data: ABILITY_DATA[n] }))
      .filter(a => a.data && this.player.sp >= a.data.cost)
      .sort((a, b) => b.data.cost - a.data.cost)[0] || null;
  },

  doSpecial() {
    if (!this.isPlayerTurn || this.gameOver) return;
    const name = Player.selectedAbility;
    const data = ABILITY_DATA[name];
    if (!data || this.player.sp < data.cost) {
      this.log(`Not enough SP for ${name}!`, 'log-system');
      return;
    }
    this.doAction('ability', name);
  },

  autoTurn() {
    if (!this.isPlayerTurn || this.gameOver) return;
    const best = this._bestAffordableAbility();
    if (best) {
      this.doAction('ability', best.name);
    } else {
      this.doAction('attack');
    }
  },

  playerAttack() {
    const crit = Math.random() < 0.12;
    const baseDmg = Math.max(2, this.player.atk - Math.floor(this.enemy.def * 0.4) + Math.floor(Math.random() * 4));
    const dmg = crit ? Math.floor(baseDmg * 1.6) : baseDmg;
    this.enemy.hp = Math.max(0, this.enemy.hp - dmg);
    const critText = crit ? ' 💥 CRITICAL!' : '';
    this.log(`${Player.name} strikes for ${dmg} damage!${critText}`, 'log-dmg');
    this.enemyShake = 6;
    this.addFloatingText(this.edx, this.edy, `-${dmg}`, crit ? '#ffea00' : '#ff4a2a');
    if (crit) this.addFloatingText(this.ecx, this.ecy, 'CRITICAL!', '#ffea00');
    Sound.hit();
    this.turnCount++;
    this.animateBars();
    this.checkEnemyDeath();
  },

  playerSpecial(name, data) {
    let dmg;
    const crit = Math.random() < 0.15;
    const atkBoost = (data.atkBoost || 3) + (this.battleType === 'boss' ? 5 : this.battleType === 'gatekeeper' ? 2 : 0);
    const mult = (data.dmgMult || 1.2) + (this.battleType === 'boss' ? 0.3 : this.battleType === 'gatekeeper' ? 0.1 : 0);
    const ignoreDef = data.hits ? false : false;
    const hits = data.hits || 1;
    let totalDmg = 0;
    for (let i = 0; i < hits; i++) {
      const hitDmg = Math.max(1, Math.floor((this.player.atk + atkBoost) * mult - this.enemy.def * 0.3 * (ignoreDef ? 0 : 1)) + Math.floor(Math.random() * 5));
      totalDmg += hitDmg;
    }
    if (crit) totalDmg = Math.floor(totalDmg * 1.6);
    this.enemy.hp = Math.max(0, this.enemy.hp - totalDmg);
    const critText = crit ? ' 💥 CRITICAL!' : '';
    const hitsText = hits > 1 ? ` (${hits} hits)` : '';
    this.log(`${Player.name} uses ${name} for ${totalDmg} damage!${hitsText}${critText}`, 'log-special');
    this.enemyShake = 8;
    this.addFloatingText(this.edx, this.edy, `-${totalDmg}`, crit ? '#ffea00' : '#e8c84a');
    if (crit) this.addFloatingText(this.ecx, this.ecy, 'CRITICAL!', '#ffea00');
    Sound.special();
    this.turnCount++;
    this.animateBars();
    this.checkEnemyDeath();
  },

  checkEnemyDeath() {
    if (this.enemy.hp <= 0) {
      this.gameOver = true;
      this.log(`🏆 ${this.enemy.name} defeated!`, 'log-heal');
      document.getElementById('battle-actions').classList.add('hidden');
      setTimeout(() => this.onVictory(), 800);
    }
  },

  enemyTurn() {
    if (this.gameOver) return;

    if (this.enemy.isBoss || this.enemy.isGatekeeper) {
      const pct = this.enemy.hp / this.enemy.maxHp;
      if (this.enemy.isBoss && pct <= (this.enemy.phaseAt || 0.5) && !this.bossPhaseTriggered) {
        this.bossPhaseTriggered = true;
        this.log(`⚠ ${this.enemy.name} enters phase 2! "${this.enemy.abilities.phase.desc}"`, 'log-special');
      }
    }

    let dmg;
    const baseEnemyDmg = Math.max(2, this.enemy.atk - Math.floor(this.player.def * 0.3) + Math.floor(Math.random() * 3));
    if (this.isDefending) {
      dmg = Math.floor(baseEnemyDmg * 0.4);
    } else {
      dmg = baseEnemyDmg;
    }

    this.player.hp = Math.max(0, this.player.hp - dmg);
    this.playerShake = 5;
    Sound.enemyHit();
    this.log(`${this.enemy.name} attacks for ${dmg} damage!`, 'log-dmg');
    this.addFloatingText(this.pdx, this.pdy, `-${dmg}`, '#ff4a2a');
    this.animateBars();

    if (this.player.hp <= 0) {
      this.gameOver = true;
      this.log(`💀 ${Player.name} has fallen...`, 'log-dmg');
      document.getElementById('battle-actions').classList.add('hidden');
      setTimeout(() => this.onDefeat(), 1200);
    } else {
      setTimeout(() => {
        this.isPlayerTurn = true;
        this.isDefending = false;
      }, 400);
    }
  },

  onVictory() {
    const goldEarned = this.enemy.gold || 10;
    Player.gold += goldEarned;
    Player.totalGoldEarned += goldEarned;
    Player.totalBattles++;

    const level = this.enemy.level || Math.floor((this.enemy.maxHp || 30) / 8);
    const xpMult = this.battleType === 'boss' ? 2.5 : (this.battleType === 'gatekeeper' ? 1.5 : 1);
    const xpGain = Math.floor(level * 8 * xpMult + 4);
    const prevLevel = Player.level;
    const leveled = Player.addXp(xpGain);
    let levelUpCount = leveled ? 1 : 0;
    while (Player.xp >= Player.xpToNext()) {
      Player.addXp(0);
      levelUpCount++;
    }

    const drops = [];
    if (this.enemy.soulDrop) {
      Player.uniqueSouls.push(this.enemy.soulDrop);
      drops.push(this.enemy.soulDrop);
    }

    if (this.battleType === 'gatekeeper' && !Player.gatekeepersDefeated.includes(this.enemy.name)) {
      Player.gatekeepersDefeated.push(this.enemy.name);
    }
    if (this.battleType === 'boss') {
      Player.bossesDefeated.push(this.enemy.name);
    }

    this.lastResult = {
      type: 'victory',
      enemyName: this.enemy.name,
      enemyLevel: this.enemy.level || '?',
      goldEarned,
      xpGain,
      drops,
      levelUpCount,
      prevLevel,
      newLevel: Player.level,
      battleType: this.battleType
    };

    const wasFarming = this.farming;
    if (wasFarming && this.battleType === 'random') {
      Player.hp = this.player.hp;
      Player.sp = this.player.sp;
    }
    this.player = null;
    this.enemy = null;

    if (wasFarming && this.battleType === 'random') {
      Sound.victory();
      this.log('<span class="log-heal">⚡ Farming continues...</span>');
      document.getElementById('battle-log').scrollTop = document.getElementById('battle-log').scrollHeight;
      setTimeout(() => Game.startRandomBattle(), 800);
      return;
    }

    document.getElementById('battle-screen').classList.add('hidden');
    Sound.victory();
    Music.stop();

    if (this.battleType === 'random') {
      Game.afterBattle();
    } else {
      this.showResultScreen();
    }
  },

  showResultScreen() {
    const r = this.lastResult;
    document.getElementById('result-screen').classList.remove('hidden');
    const titleEl = document.getElementById('result-title');
    titleEl.classList.remove('level-up-title');
    if (r.levelUpCount > 0) {
      titleEl.classList.add('level-up-title');
      titleEl.textContent = `⬆ LEVEL UP! Lv.${r.prevLevel} → ${r.newLevel}`;
    } else {
      titleEl.textContent = '⚔ VICTORY!';
    }
    let text = `⚔ ${r.enemyName} ${r.enemyLevel ? 'Lv.'+r.enemyLevel : ''} defeated`;
    text += `\n💰 +${r.goldEarned} gold`;
    if (r.xpGain) text += ` | ⚡ +${r.xpGain} XP`;
    document.getElementById('result-text').textContent = text;
    document.getElementById('result-drops').textContent = r.drops.length ? `🔮 Obtained: ${r.drops.join(', ')}` : '';
    document.getElementById('result-screen').dataset.battleType = r.battleType;
  },

  stopFarming() {
    Player.farming = false;
    this.farming = false;
    this.autoMode = false;
    document.getElementById('farming-btn').classList.add('hidden');
    document.getElementById('auto-btn').textContent = 'Auto';
    this.log('⏹ Farming stopped.', 'log-system');
  },

  onDefeat() {
    const wasFarming = this.farming;
    const lostGold = Math.floor(Player.gold * 0.3);
    Player.gold = Math.max(0, Player.gold - lostGold);

    this.lastResult = {
      type: 'defeat',
      enemyName: this.enemy ? this.enemy.name : 'unknown',
      goldLost: lostGold
    };

    Player.farming = false;
    this.farming = false;
    this.player = null;
    this.enemy = null;

    if (wasFarming) {
      document.getElementById('farming-btn').classList.add('hidden');
      document.getElementById('auto-btn').textContent = 'Auto';
    }

    document.getElementById('battle-screen').classList.add('hidden');
    Sound.defeat();
    Music.stop();
    Game.afterBattle();
  }
};
