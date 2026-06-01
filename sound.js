const Sound = {
  _ctx: null,

  _init() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
  },

  _play(t, freq, type, vol = 0.12) {
    this._init();
    const o = this._ctx.createOscillator();
    const g = this._ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, this._ctx.currentTime);
    g.gain.setValueAtTime(vol, this._ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this._ctx.currentTime + t);
    o.connect(g);
    g.connect(this._ctx.destination);
    o.start();
    o.stop(this._ctx.currentTime + t);
  },

  _noise(t, vol = 0.06) {
    this._init();
    const buf = this._ctx.createBuffer(1, this._ctx.sampleRate * t, this._ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    const src = this._ctx.createBufferSource();
    src.buffer = buf;
    const g = this._ctx.createGain();
    g.gain.setValueAtTime(vol, this._ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this._ctx.currentTime + t);
    src.connect(g);
    g.connect(this._ctx.destination);
    src.start();
  },

  hit() { this._play(0.12, 200, 'square', 0.1); this._noise(0.08, 0.05); },
  special() { this._play(0.2, 150, 'sawtooth', 0.08); this._play(0.15, 300, 'square', 0.06); },
  enemyHit() { this._play(0.15, 100, 'sawtooth', 0.1); this._noise(0.1, 0.06); },
  defend() { this._play(0.08, 800, 'square', 0.06); this._play(0.06, 1200, 'sine', 0.04); },
  heal() { this._play(0.3, 520, 'sine', 0.08); this._play(0.2, 660, 'sine', 0.06); },
  victory() {
    this._play(0.2, 523, 'sine', 0.1);
    setTimeout(() => this._play(0.2, 659, 'sine', 0.1), 150);
    setTimeout(() => this._play(0.2, 784, 'sine', 0.1), 300);
    setTimeout(() => this._play(0.3, 1047, 'sine', 0.12), 450);
  },
  defeat() {
    this._play(0.3, 392, 'sine', 0.08);
    setTimeout(() => this._play(0.3, 330, 'sine', 0.08), 200);
    setTimeout(() => this._play(0.4, 262, 'sine', 0.06), 400);
  },
};
