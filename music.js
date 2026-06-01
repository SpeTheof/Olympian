let _xmMod = null;
let _xmReady = false;
let _xmQueue = [];

libxm.onload = function () {
  _xmReady = true;
  _xmMod = new XMModule(44100, null, null);
  _xmMod.setVolume(50);
  for (const s of _xmQueue) _playXM(s);
  _xmQueue = [];
};

function _playXM(src) {
  if (!_xmReady || !_xmMod) { _xmQueue.push(src); return; }
  try { _xmMod.pause(); } catch (e) {}
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', src, false);
    xhr.responseType = 'arraybuffer';
    xhr.send();
    if (xhr.status === 200 || xhr.status === 0) {
      _xmMod.load(new Int8Array(xhr.response), (err) => {
        if (err) console.warn('Music:', err);
      });
      _xmMod.resume();
    }
  } catch (e) {
    console.warn('Music load failed. Serve via HTTP (python -m http.server 8080)');
  }
}

function _stopXM() {
  if (_xmMod) { try { _xmMod.pause(); } catch (e) {} }
}

const Music = {
  play(src) { _playXM(src); },
  stop() { _stopXM(); },
  setVolume(v) { if (_xmMod) _xmMod.setVolume(Math.max(0, Math.min(100, v))); },
  playBattle() { this.play('music/BReWErS%20-%20Crimes%20Of%20War%20%2B5%20trn.xm'); },
  playBoss() { this.play('music/Razor1911%20-%20Soldier%20Of%20Fortune%20intro.xm'); },
  playMenu() { this.play('music/ORiON%20-%20Nero%206.3.1.6.xm'); },
};
