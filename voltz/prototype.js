/* Voltz prototype: interactive Android flow, case screens gallery, artifact animations. All data is fictional. */
(function () {
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let FAST = /[?&]fast=1/.test(location.search);
const sleep = ms => new Promise(r => setTimeout(r, (reduce || FAST) ? Math.min(ms, 25) : ms));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

/* ---------- icons ---------- */
const ICONS = {
  pixm: '<g fill="currentColor" stroke="none"><rect x="9" y="3.4" width="6" height="6" rx="1.5" transform="rotate(45 12 6.4)"/><rect x="14.6" y="9" width="6" height="6" rx="1.5" transform="rotate(45 17.6 12)"/><rect x="9" y="14.6" width="6" height="6" rx="1.5" transform="rotate(45 12 17.6)"/><rect x="3.4" y="9" width="6" height="6" rx="1.5" transform="rotate(45 6.4 12)"/></g>',
  bill: '<path d="M6 3.5h12a1 1 0 0 1 1 1V20l-2.4-1.5L14.2 20 12 18.5 9.8 20l-2.4-1.5L5 20V4.5a1 1 0 0 1 1-1z" fill="currentColor" fill-opacity=".22"/><path d="M9 8h6M9 12h4"/>',
  swap: '<path d="M7 4.5 3.5 8 7 11.5M3.5 8H16M17 12.5l3.5 3.5-3.5 3.5M20.5 16H8"/>',
  tray: '<path d="M4 14.5h4.2l1.3 2.5h5l1.3-2.5H20V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="currentColor" fill-opacity=".22"/><path d="M12 3.5V12M8.5 8.8 12 12.3l3.5-3.5"/>',
  topup: '<rect x="7" y="3" width="10" height="18" rx="2.6" fill="currentColor" fill-opacity=".22"/><path d="M12.6 8l-2.2 4h3.2l-2.2 4"/>',
  sched: '<rect x="4" y="5" width="16" height="15" rx="3" fill="currentColor" fill-opacity=".22"/><path d="M8.5 3v4M15.5 3v4M4 10h16M9 14.5l2 2 4-4"/>',
  chev: '<path d="M9.5 6l6 6-6 6"/>',
  pix: '<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="2.6" transform="rotate(45 12 12)"/><path d="M9 12h6M12.8 10l2.2 2-2.2 2"/>',
  transfer: '<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/>',
  pay: '<path d="M5 4v16M9 4v16M13 4v16M17 4v16M20 4v16"/><path d="M3 4h2M3 20h2M19 4h2M19 20h2" stroke-width="1.5"/>',
  deposit: '<path d="M12 3v11M8 10l4 4 4-4"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  recharge: '<rect x="7" y="3" width="10" height="18" rx="2.4"/><path d="M12 9v5M9.5 11.5h5"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2.4"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18v2h-2"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2.4"/><path d="M3 10h18M7 15h4"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M12 9v11M3 9h18M12 9c-3 0-4-4-1.5-4S12 9 12 9zm0 0c3 0 4-4 1.5-4S12 9 12 9z"/>',
  idcard: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6.5 16c.5-2 4.5-2 5 0M14 10h4M14 13h3"/>',
  face: '<ellipse cx="12" cy="12" rx="6" ry="8"/><path d="M9.5 10.5h.01M14.5 10.5h.01M9.5 15c1.5 1.4 3.5 1.4 5 0"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 20c1-4 13-4 14 0"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/>'
};
document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
  Object.keys(ICONS).map(k => '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>').join('') + '</defs></svg>');
const ic = (n, c) => '<svg class="ic ' + (c || '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
window.__vzIc = ic;

/* ---------- fictional data ---------- */
const U = {
  apelido: 'Rafa', nome: 'Rafaela Teixeira Lima', cpf: '529.982.247-25', cel: '(32) 98765-4321',
  email: 'rafa.teixeira@exemplo.com', nasc: '14/03/1990', mae: 'Helena Teixeira Lima',
  cep: '36770-000', rua: 'Rua das Acácias', num: '120', compl: 'apto 2', cidade: 'Cataguases', uf: 'MG',
  agencia: '0001', conta: '47821-3', smsCode: '482913', mailCode: '305671'
};
const STAGES = ['Login', 'Ativação', 'Aumento de limite'];

/* ---------- masks and validators ---------- */
const digits = v => String(v).replace(/\D/g, '');
function maskCPF(v) { const d = digits(v).slice(0, 11); let o = d.slice(0, 3); if (d.length > 3) o += '.' + d.slice(3, 6); if (d.length > 6) o += '.' + d.slice(6, 9); if (d.length > 9) o += '-' + d.slice(9, 11); return o; }
function maskCel(v) { const d = digits(v).slice(0, 11); let o = ''; if (d.length) o = '(' + d.slice(0, 2); if (d.length > 2) o += ') ' + d.slice(2, 7); if (d.length > 7) o += '-' + d.slice(7, 11); return o; }
function maskDate(v) { const d = digits(v).slice(0, 8); let o = d.slice(0, 2); if (d.length > 2) o += '/' + d.slice(2, 4); if (d.length > 4) o += '/' + d.slice(4, 8); return o; }
function maskCEP(v) { const d = digits(v).slice(0, 8); return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; }
function cpfOk(v) {
  const d = digits(v); if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const calc = n => { let s = 0; for (let i = 0; i < n; i++) s += +d[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  return calc(9) === +d[9] && calc(10) === +d[10];
}
function dateOk(v) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v); if (!m) return false;
  const d = +m[1], mo = +m[2], y = +m[3]; const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d || y < 1900) return false;
  const now = new Date(2026, 9, 29); let age = now.getFullYear() - y; if (now < new Date(now.getFullYear(), mo - 1, d)) age--; return age >= 18;
}
const CEPS = { '36774120': { cidade: 'Cataguases', uf: 'MG', rua: 'Rua das Acácias', generic: false } };
const lookupCEP = d => CEPS[d] || { cidade: 'Cataguases', uf: 'MG', rua: '', generic: true };

/* ---------- chat steps ---------- */
const STEPS = [
  { id: 'cel', dock: 'num', ph: '(00) 00000-0000', im: 'tel', mask: maskCel, help: 'Com DDD. Vou te mandar um código por SMS.', ask: () => ['Oi! Eu sou a Voltz 😊', 'Vamos abrir a sua conta, é rapidinho. Qual é o seu celular?'], ex: () => U.cel, val: v => digits(v).length === 11 || 'Faltam dígitos. Digite o DDD e o número completo.', save: (v, d) => { d.cel = v; } },
  { id: 'sms', dock: 'otp', auto: true, code: U.smsCode, ask: d => ['Enviei um código para ' + d.cel + '.', 'Pode digitar ou esperar, que eu leio o SMS sozinha.'], ex: (d, n, er) => (er && n === 0) ? '123456' : U.smsCode, val: v => v === U.smsCode || 'Código incorreto. Confira o SMS e tente de novo.', save: () => {}, echo: v => v },
  { id: 'name', dock: 'text', ph: 'Seu nome ou apelido', im: 'text', ask: () => ['Pronto, celular confirmado.', 'Como você quer ser chamado(a)?'], ex: () => U.apelido, val: v => v.trim().length >= 2 || 'Digite pelo menos 2 letras.', save: (v, d) => { d.apelido = v.trim(); } },
  { id: 'cpf', dock: 'num', ph: '000.000.000-00', im: 'numeric', mask: maskCPF, help: 'Só números. A gente formata para você.', ask: d => ['Prazer, ' + d.apelido + '!', 'Qual é o seu CPF?'], ex: (d, n, er) => (er && n === 0) ? '529.982.247-26' : U.cpf, val: v => cpfOk(v) || 'Esse CPF não parece certo. Confira os 11 números.', save: (v, d) => { d.cpf = v; } },
  { id: 'email', dock: 'text', ph: 'nome@email.com', im: 'email', ask: () => ['Qual é o seu e-mail? Também vou te mandar um código lá.'], ex: () => U.email, val: v => /^\S+@\S+\.\S+$/.test(v.trim()) || 'Esse e-mail parece incompleto.', save: (v, d) => { d.email = v.trim(); } },
  { id: 'emailcode', dock: 'otp', code: U.mailCode, ask: d => ['Mandei um código para ' + d.email + '.', 'Digite aqui para confirmar.'], ex: () => U.mailCode, val: v => v === U.mailCode || 'Código incorreto. Confira o e-mail e tente de novo.', save: () => {}, echo: v => v, card: { title: 'Etapa 1 concluída', sub: 'Login. Você já tem acesso ao app.' } },
  { id: 'ativar', dock: 'ack', ask: () => ['Login concluído! 🎉', 'Quer ativar a conta agora? Leva uns 2 minutos e libera o Pix.'], echo: () => 'Ativar agora', save: () => {} },
  { id: 'nasc', stage: 2, dock: 'num', ph: 'dd/mm/aaaa', im: 'numeric', mask: maskDate, help: 'Dia, mês e ano.', ask: () => ['Vamos lá. Qual é a sua data de nascimento?'], ex: () => U.nasc, val: v => dateOk(v) || 'Confira a data. Ela precisa ser de quem tem 18 anos ou mais.', save: (v, d) => { d.nasc = v; } },
  { id: 'cep', stage: 2, dock: 'address', ask: () => ['Agora o seu endereço. Digite o CEP.'], echo: (v, d) => d.rua + ', ' + d.num + (d.compl ? ', ' + d.compl : '') + ' · ' + d.cidade + '/' + d.uf, save: () => {} },
  { id: 'termos', stage: 2, dock: 'terms', ask: () => ['Para finalizar, é importante que você conheça os nossos **Termos e Condições** e a **Política de Privacidade**.'], echo: () => 'Li e aceito os dois', save: () => {} },
  { id: 'pin', stage: 2, dock: 'pin', ask: () => ['Última coisa: crie uma senha de 4 números para confirmar as suas transações.'], echo: () => '••••', save: (v, d) => { d.pin = v; } },
  { id: 'pin2', stage: 2, dock: 'pin', again: true, ask: () => ['Digite de novo para confirmar.'], echo: () => '••••', val: (v, d) => v === d.pin || 'As senhas não são iguais. Tente de novo.', save: () => {}, card: { title: 'Etapa 2 concluída', sub: 'Ativação. Seu Pix está liberado.' } }
];
const stageOfStep = i => (i >= 7 ? 2 : 1);
const STEP_INDEX = {}; STEPS.forEach((s, i) => { STEP_INDEX[s.id] = i; });

/* ---------- state ---------- */
let S, TOK = 0, AUTO = 0;
function newDock(st) { return { val: '', err: '', terms: [false, false], pin: '', cep: '', rua: '', num: '', compl: '', cidade: '', uf: '', generic: false, found: false, auto: '' }; }
function newState() {
  return { screen: 'splash', step: 0, chat: [], seen: 0, typing: false, ready: false, data: {}, tab: 'conta', tour: -1, tourDone: false, sheet: null, toast: '', notif: false,
    errors: false, attempts: {}, dock: newDock(), tok: TOK,
    lim: { prog: 0, mae: '', maeExc: false, tipo: 'RG', side: 'front', docAttempt: 0, photos: {}, up: false } };
}
function fillData(s) { Object.assign(s.data, { apelido: U.apelido, cpf: U.cpf, cel: U.cel, email: U.email, nasc: U.nasc, cep: U.cep, rua: U.rua, num: U.num, compl: U.compl, cidade: U.cidade, uf: U.uf, pin: '2580' }); }
function prefillInto(s, upto) {
  fillData(s);
  for (let i = 0; i < upto; i++) {
    const st = STEPS[i];
    st.ask(s.data).forEach(t => s.chat.push({ k: 'bot', t }));
    let echo;
    if (st.id === 'cep') echo = st.echo('', s.data);
    else if (st.echo) echo = st.echo(st.code || '', s.data);
    else if (st.id === 'name') echo = U.apelido; else if (st.id === 'cpf') echo = U.cpf; else if (st.id === 'cel') echo = U.cel; else if (st.id === 'email') echo = U.email; else if (st.id === 'nasc') echo = U.nasc; else echo = '';
    s.chat.push({ k: 'me', t: echo });
    if (st.card) s.chat.push({ k: 'card', title: st.card.title, sub: st.card.sub });
  }
  s.seen = s.chat.length;
}
const attempt = id => S.attempts[id] || 0;

/* ---------- screens (pure: take a state) ---------- */
const shell = inner => '<div class="sbar"><span>9:41</span><span class="r"><svg viewBox="0 0 12 12"><path d="M6 10L1 4a7 7 0 0 1 10 0z"/></svg><svg viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="9" rx="1.5"/></svg></span></div>' + inner + '<div class="navbar"><i></i></div>';
const abar = (title, o) => { o = o || {}; return '<div class="abar">' + (o.back ? '<button class="ib" data-a="' + o.back + '" aria-label="Voltar">' + ic('back') + '</button>' : '<span class="ib" aria-hidden="true"></span>') + '<h4>' + title + '</h4>' + (o.close ? '<button class="ib" data-a="' + o.close + '" aria-label="Fechar">' + ic('x') + '</button>' : '<span class="help" aria-hidden="true">?</span>') + '</div>'; };

function splashInner() {
  return '<div class="splash"><div class="wm">Voltz</div>' +
    '<h1>Abra sua conta <em>100% digital</em></h1>' +
    '<p>Pix, pagamento de contas e cartão virtual. Tudo no celular, sem sair de casa.</p>' +
    '<div class="perks"><span>' + ic('pix') + 'Pix sem limite de envios</span><span>' + ic('pay') + 'Pague contas</span><span>' + ic('card') + 'Cartão virtual</span></div>' +
    '<button class="btn neon block" data-a="start">ABRIR MINHA CONTA</button><button class="btn sec block" data-a="has-account">JÁ TENHO CONTA</button></div>';
}

function bubbleHTML(m, isNew) {
  if (m.k === 'card') return '<div class="stagecard' + (isNew ? ' bub new' : '') + '" style="max-width:none;background:rgba(255,255,255,.1);box-shadow:none"><span class="ok">' + ic('check') + '</span><div><b>' + esc(m.title) + '</b><span>' + esc(m.sub) + '</span></div></div>';
  return '<div class="bub' + (m.k === 'me' ? ' me' : '') + (isNew ? ' new' : '') + '">' + (m.k === 'me' ? esc(m.t) : md(m.t)) + '</div>';
}
function dockHTML(s) {
  const st = STEPS[s.step], dk = s.dock;
  if (!s.ready) return '<div class="dock idle" aria-hidden="true"></div>';
  const msg = dk.err ? '<p class="help-t err" id="dock-msg" role="alert">' + esc(dk.err) + '</p>' : (st.help ? '<p class="help-t" id="dock-msg">' + esc(st.help) + '</p>' : '');
  const chip = '<button class="chipx" data-a="example">' + ic('info', '') + 'Preencher com exemplo</button>';
  if (st.dock === 'text' || st.dock === 'num') {
    return '<div class="dock">' + msg + '<div class="row"><input class="inp' + (dk.err ? ' err' : '') + '" id="dock-in" data-in type="text" inputmode="' + (st.im || 'text') + '" autocomplete="off" autocapitalize="none" placeholder="' + esc(st.ph) + '" value="' + esc(dk.val) + '" aria-label="' + esc(st.ph) + '"' + (dk.err ? ' aria-invalid="true"' : '') + '>' +
      '<button class="send" data-a="send" aria-label="Enviar">' + ic('send') + '</button></div>' + chip + '</div>';
  }
  if (st.dock === 'otp') {
    const v = dk.val; let cells = '';
    for (let i = 0; i < 6; i++) cells += '<b class="' + (v[i] ? 'fill' : (i === v.length ? 'on' : '')) + '">' + (v[i] || '') + '</b>';
    return '<div class="dock"><p class="help-t' + (dk.err ? ' err' : '') + '" id="dock-msg"' + (dk.err ? ' role="alert"' : '') + '>' + (dk.err ? esc(dk.err) : (dk.auto ? esc(dk.auto) : 'Código de 6 números.')) + '</p>' +
      '<div style="position:relative"><div class="otp' + (dk.err ? ' err' : '') + '" id="otp">' + cells + '</div><input id="dock-in" data-in data-otp type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" aria-label="Código de 6 números" value="' + esc(v) + '" style="position:absolute;inset:0;opacity:0;width:100%;height:100%"></div>' + chip + '</div>';
  }
  if (st.dock === 'ack') {
    return '<div class="dock"><button class="btn pri block" data-a="ack-yes">ATIVAR AGORA</button><button class="btn ghost block" data-a="ack-later">DEPOIS</button></div>';
  }
  if (st.dock === 'terms') {
    const t = dk.terms;
    const row = (i, name) => '<label class="chk"><input type="checkbox" data-a="term" data-i="' + i + '"' + (t[i] ? ' checked' : '') + '><span><b>' + name + '</b>Declaro que li e estou de acordo</span><button class="see" type="button" data-a="term-see" data-i="' + i + '">VER</button></label>';
    return '<div class="dock">' + row(0, 'TERMOS E CONDIÇÕES') + row(1, 'POLÍTICA DE PRIVACIDADE') + '<button class="btn pri block" data-a="terms-go"' + (t[0] && t[1] ? '' : ' disabled') + '>CONTINUAR</button></div>';
  }
  if (st.dock === 'pin') {
    const n = dk.pin.length; let dots = ''; for (let i = 0; i < 4; i++) dots += '<i class="' + (i < n ? 'f' : '') + '"></i>';
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => '<button data-a="pin-key" data-k="' + k + '" aria-label="' + k + '">' + k + '</button>').join('') + '<button class="ph" tabindex="-1" aria-hidden="true"></button><button data-a="pin-key" data-k="0" aria-label="0">0</button><button data-a="pin-del" aria-label="Apagar">' + ic('back') + '</button>';
    return '<div class="dock" id="pinwrap"><p class="help-t' + (dk.err ? ' err' : '') + '" id="dock-msg" style="text-align:center"' + (dk.err ? ' role="alert"' : '') + '>' + (dk.err ? esc(dk.err) : (st.again ? 'Confirme a senha de 4 números' : 'Crie uma senha de 4 números')) + '</p><div class="pinrow" aria-label="' + n + ' de 4 dígitos">' + dots + '</div><div class="keypad">' + keys + '</div></div>';
  }
  if (st.dock === 'address') {
    const c = dk.cep; const complete = digits(c).length === 8;
    let body = '<p class="help-t' + (dk.err ? ' err' : '') + '" id="dock-msg">' + (dk.err ? esc(dk.err) : 'Só números. A gente busca o resto.') + '</p>' +
      '<div class="row"><input class="inp' + (dk.err ? ' err' : '') + '" id="dock-in" data-in data-f="cep" type="text" inputmode="numeric" placeholder="00000-000" value="' + esc(c) + '" aria-label="CEP"></div>';
    if (complete && dk.found) {
      const ready = dk.rua.trim() && dk.num.trim();
      body += '<div class="addr"><div><b>' + esc(dk.cidade) + ' / ' + esc(dk.uf) + '</b>CEP ' + esc(c) + '</div></div>' +
        '<div class="field"><label for="f-rua">Rua' + (dk.generic ? ' (o CEP da cidade não traz a rua)' : '') + '</label><input class="inp" id="f-rua" data-in data-f="rua" type="text" autocomplete="off" value="' + esc(dk.rua) + '"></div>' +
        '<div class="row"><div class="field"><label for="f-num">Número</label><input class="inp" id="f-num" data-in data-f="num" type="text" inputmode="numeric" value="' + esc(dk.num) + '"></div><div class="field"><label for="f-compl">Complemento</label><input class="inp" id="f-compl" data-in data-f="compl" type="text" value="' + esc(dk.compl) + '" placeholder="opcional"></div></div>' +
        '<button class="btn pri block" data-a="cep-go"' + (ready ? '' : ' disabled') + '>CONFIRMAR ENDEREÇO</button>';
    } else {
      body += '<button class="chipx" data-a="example">' + ic('info') + 'Preencher com exemplo</button>';
    }
    return '<div class="dock">' + body + '</div>';
  }
  return '<div class="dock"></div>';
}
function chatInner(s) {
  const st = STEPS[s.step], stage = stageOfStep(s.step);
  const pct = Math.round(100 * s.step / STEPS.length);
  const bubs = s.chat.map((m, i) => bubbleHTML(m, i >= s.seen)).join('') + (s.typing ? '<div class="bub typing" aria-label="Digitando"><i></i><i></i><i></i></div>' : '');
  return abar('Cadastro', { close: 'exit' }) +
    '<div class="prog"><div class="lab"><span>Etapa ' + stage + ' de 3 · ' + STAGES[stage - 1] + '</span><span>' + pct + '%</span></div><div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Cadastro ' + pct + '% completo"><i style="width:' + pct + '%"></i></div></div>' +
    '<div class="chat" id="chat" aria-live="polite">' + bubs + '</div>' + dockHTML(s) +
    (s.sheet ? sheetHTML(s) : '') + (s.toast ? '<div class="snack" role="status">' + esc(s.toast) + '</div>' : '');
}
function activatedInner(s) {
  return '<div class="moment"><div class="ring">' + ic('check') + '</div><h2>Conta ativa, ' + esc(s.data.apelido || U.apelido) + '!</h2><p>Seu Pix já está liberado. Você pode aumentar o seu limite quando quiser.</p>' +
    '<div class="kv"><div>Agência<b>' + U.agencia + '</b></div><div>Conta<b>' + U.conta + '</b></div><hr><div>Saldo máximo<b>R$ 1.000</b></div><div>Pix por transferência<b>até R$ 500</b></div></div><div class="grow"></div>' +
    '<button class="btn neon block" data-a="activated-go">VAMOS LÁ!</button></div>';
}
function tilesHTML(items, tour) {
  return '<div class="tiles">' + items.map(t => '<button class="tile" data-a="tile" data-n="' + t[1] + '"' + (t[2] ? ' data-tour="' + t[2] + '"' : '') + '>' + ic(t[0]) + t[1] + '</button>').join('') + '</div>';
}
function homeActions() {
  const big = (i, n, sub, t) => '<button class="tile big" data-a="tile" data-n="' + n + '" data-tour="' + t + '"><span class="gl">' + ic(i) + '</span><b>' + n + '</b><small>' + sub + '</small></button>';
  const row = (i, n, sub, t) => '<button class="rowx" data-a="tile" data-n="' + n + '"' + (t ? ' data-tour="' + t + '"' : '') + '><span class="gl">' + ic(i) + '</span><span class="tx"><b>' + n + '</b><small>' + sub + '</small></span>' + ic('chev', 'cv') + '</button>';
  if (/[?&]home=b/.test(location.search)) return '<div class="rows">' + row('pixm', 'Pix', 'Envie e receba na hora', 'pix') + row('bill', 'Pagar conta', 'Ganhe até 10% de crédito em novas faturas', 'pagar') + row('swap', 'Transferir', 'Para outra conta') + row('tray', 'Depositar', 'Coloque dinheiro na conta') + '</div>';
  return '<div class="tiles pri">' + big('pixm', 'Pix', 'Envie e receba na hora', 'pix') + big('bill', 'Pagar conta', 'Ganhe até 10% de crédito em novas faturas', 'pagar') + '</div>' +
    '<div class="tiles sec">' + [['swap', 'Transferir'], ['tray', 'Depositar'], ['topup', 'Recarga'], ['sched', 'Agendar']].map(t => '<button class="tile" data-a="tile" data-n="' + t[1] + '">' + ic(t[0]) + t[1] + '</button>').join('') + '</div>';
}
function limCard(s) {
  const l = s.lim;
  if (l.up) return '<div class="limcard ok" data-tour="limite"><h5>Limite aumentado para R$ 5.000</h5><p>Seu Pix agora vai até R$ 2.000 por transferência.</p></div>';
  const n = l.prog;
  return '<div class="limcard lc2" data-tour="limite"><div><h5>Limite de até R$ 5.000</h5><p>Nome da mãe, documento e selfie</p></div><button class="btn dk" data-a="lim-start">' + (n ? 'CONTINUAR' : 'COMEÇAR') + '</button><div class="segs" role="img" aria-label="' + n + ' de 3 passos">' + [0, 1, 2].map(i => '<i class="' + (i < n ? 'on' : '') + '"></i>').join('') + '</div></div>';
}
function homeInner(s) {
  const name = s.data.apelido || U.apelido;
  const tabs = '<div class="tabs" role="tablist"><button role="tab" data-a="tab" data-t="conta" aria-selected="' + (s.tab === 'conta') + '">Sua conta</button><button role="tab" data-a="tab" data-t="cartao" data-tour="cartao" aria-selected="' + (s.tab === 'cartao') + '">Seu cartão</button></div>';
  let body;
  if (s.tab === 'conta') {
    body = '<div class="bub hi">Oi, ' + esc(name) + ' 😊</div>' +
      '<div class="bub bal" data-tour="saldo"><span class="lab">Seu saldo é</span><span class="amt">R$ 0,00</span><button class="lnk" data-a="tile" data-n="Extrato">Ver extrato' + ic('chev', 'cv') + '</button></div>' +
      '<div class="bub ask">O que deseja fazer?</div>' +
      homeActions() +
      limCard(s);
  } else {
    body = '<div class="vcard"><div class="wm">Voltz</div><div><div class="num">•••• •••• •••• 4821</div><div class="nm" style="margin-top:8px">' + esc((s.data.nome || U.nome).toUpperCase()) + '</div></div></div>' +
      '<div class="row" style="justify-content:space-between"><span class="pill ok">' + ic('check') + 'Cartão virtual ativo</span><button class="lnk" style="all:unset;cursor:pointer;color:var(--vz-mint);font:700 12px var(--vz-ui);min-height:44px;display:inline-flex;align-items:center" data-a="tile" data-n="Dados do cartão">VER DADOS</button></div>' +
      '<div class="bub note">Use o cartão virtual nas compras online. Dá para gerar um número novo quando quiser.</div>' +
      '<button class="btn sec block" data-a="tile" data-n="Cartão físico"' + (s.lim.up ? '' : ' aria-describedby="phys-help"') + '>PEDIR CARTÃO FÍSICO</button>' + (s.lim.up ? '' : '<p class="help-t" id="phys-help">Disponível depois que você aumentar o limite.</p>');
  }
  return abar('Conta pessoal', { avatar: true }).replace('<span class="ib" aria-hidden="true"></span>', '<span class="avatar" aria-hidden="true">' + esc(name.charAt(0)) + '</span>') + tabs +
    '<div class="scr hpad" id="scr">' + body + '</div>' +
    (s.sheet ? sheetHTML(s) : '') + (s.tour >= 0 ? tourHTML(s) : '') + (s.toast ? '<div class="snack" role="status">' + esc(s.toast) + '</div>' : '') + (s.notif ? notifHTML() : '');
}
function pixInner(s) {
  return abar('Pix', { back: 'pix-back' }) + '<div class="scr hpad" id="scr"><div class="bub">Qual opção de Pix você deseja acessar?</div><div class="grp">Pagar</div>' +
    tilesHTML([['qr', 'Transação por QR Code'], ['pixm', 'Transação Pix'], ['copy', 'Pix Copia e Cola']]) + '<div class="grp">Receber</div>' +
    tilesHTML([['pixm', 'Receber por Pix'], ['key', 'Minhas chaves']]) + '</div>' + (s.toast ? '<div class="snack" role="status">' + esc(s.toast) + '</div>' : '');
}
const TOUR = [
  { sel: '[data-tour=saldo]', t: 'Seu saldo, sempre à mão', b: 'Toque em "Ver extrato" para ver tudo que entrou e saiu da conta.' },
  { sel: '[data-tour=pix]', t: 'Pix a qualquer hora', b: 'Envie, receba e guarde as suas chaves aqui. Sem limite de transferências.' },
  { sel: '[data-tour=pagar]', t: 'Pague contas e ganhe crédito', b: 'Pague a fatura da Energisa e outras contas. Ganhe até 10% de crédito em novas faturas.' },
  { sel: '[data-tour=cartao]', t: 'Seu cartão virtual já está pronto', b: 'Use nas compras online. Vale para streaming, apps de transporte e mais.' },
  { sel: '[data-tour=limite]', t: 'Quer mais limite?', b: 'São 3 passos rápidos: nome da mãe, documento e selfie. Dá para parar e continuar depois.' }
];
function tourHTML(s) {
  const i = s.tour, last = i === TOUR.length - 1; let dots = ''; TOUR.forEach((_, k) => { dots += '<i class="' + (k === i ? 'on' : '') + '"></i>'; });
  return '<div class="tour" data-i="' + i + '"><div class="tour-hl"></div><div class="tour-tip" role="dialog" aria-label="Dica ' + (i + 1) + ' de ' + TOUR.length + '"><h5>' + TOUR[i].t + '</h5><p>' + TOUR[i].b + '</p><div class="ft"><div class="dots" aria-hidden="true">' + dots + '</div><div class="row"><button class="btn ghost" data-a="tour-skip">PULAR</button><button class="btn pri" data-a="tour-next">' + (last ? 'ENTENDI' : 'PRÓXIMO') + '</button></div></div></div></div>';
}
function sheetHTML(s) {
  const sh = s.sheet;
  if (sh.type === 'welcome') return '<div class="scrim"><div class="sheet"><h5>Bem-vindo à sua conta, ' + esc(s.data.apelido || U.apelido) + '! 🎉</h5><p>Antes de começar, separei algumas dicas para facilitar o seu dia a dia aqui. É rapidinho.</p><div class="btns"><button class="btn pri block" data-a="welcome-go">VAMOS LÁ!</button><button class="btn ghost block" data-a="welcome-skip">PULAR DICAS</button></div></div></div>';
  if (sh.type === 'legal') { const name = sh.i === 0 ? 'Termos e Condições' : 'Política de Privacidade'; return '<div class="scrim"><div class="sheet tall"><h5>' + name + '</h5><div class="legal" tabindex="0" aria-label="Texto de ' + name + '"><p><b>1. Quem somos.</b> A Voltz é a fintech do grupo Energisa. Este texto é fictício e serve só para o protótipo.</p><p><b>2. Seus dados.</b> A gente usa o que você informa para abrir e proteger a sua conta. Você pode pedir a correção a qualquer momento.</p><p><b>3. Seu documento e a selfie.</b> Servem para confirmar que é você. Guardamos com segurança e só usamos para isso.</p><p><b>4. Limites.</b> Contas novas começam com limite de saldo e de Pix. Dá para aumentar depois de enviar o documento.</p><p><b>5. Como a gente protege a sua conta.</b> Cada transação pede a sua senha de 4 números. Se algo fugir do seu costume, a gente pede uma confirmação a mais antes de liberar.</p><p><b>6. Com quem a gente compartilha.</b> Só com quem precisa para a conta funcionar, como o banco parceiro e os órgãos que a lei manda informar. Nunca para propaganda de terceiros.</p><p><b>7. Por quanto tempo a gente guarda.</b> Enquanto a conta estiver ativa e pelo prazo que a lei exigir depois disso. Depois, os dados são apagados ou anonimizados.</p><p><b>8. Seus direitos.</b> Você pode pedir uma cópia dos seus dados, corrigir o que estiver errado ou encerrar a conta, pelo botão de ajuda no app.</p><p><b>9. Mudanças neste texto.</b> Se algo mudar, a gente avisa no app antes de começar a valer.</p><p><b>10. Dúvidas.</b> Fale com a gente pelo app, no botão de ajuda.</p></div><button class="legal-full" data-a="legal-full">Ver o texto completo</button><button class="btn pri block" data-a="legal-ok">LI E ENTENDI</button></div></div>'; }
  if (sh.type === 'exit') return '<div class="scrim"><div class="sheet"><h5>Sair do cadastro?</h5><p>Se você sair agora, as informações que passou serão perdidas.</p><div class="btns"><button class="btn pri block" data-a="exit-stay">CONTINUAR CADASTRO</button><button class="btn sec block" data-a="exit-leave">SAIR</button></div></div></div>';
  if (sh.type === 'mae') return '<div class="scrim"><div class="sheet"><h5>Tudo bem, a gente segue</h5><p>Sem o nome da mãe, vamos confirmar a sua identidade pela data de nascimento e pelo documento.</p><button class="btn pri block" data-a="sheet-close">ENTENDI</button></div></div>';
  return '';
}
function notifHTML() { return '<div class="notif" role="status"><span class="ico">V</span><div><b>Voltz · agora</b><span>Seu limite foi aprovado 🎉 Toque para ver.</span></div></div>'; }

/* limit flow */
function limIntroInner(s) {
  const n = s.lim.prog;
  return abar('Aumentar limite', { back: 'lim-back' }) + '<div class="scr" id="scr"><div class="lim-hero"><div class="big"><small>Seu limite pode ir de R$ 1.000 para</small>R$ 5.000</div></div>' +
    '<div class="steps3"><div><span class="n">' + (n > 0 ? '✓' : '1') + '</span><p style="margin:0"><b>Nome da sua mãe</b><span>Leva 10 segundos</span></p></div><div><span class="n">' + (n > 1 ? '✓' : '2') + '</span><p style="margin:0"><b>Foto do documento</b><span>Frente e verso, cerca de 1 minuto</span></p></div><div><span class="n">' + (n > 2 ? '✓' : '3') + '</span><p style="margin:0"><b>Selfie</b><span>Leva 30 segundos</span></p></div></div>' +
    '<p class="help-t">Você pode parar e continuar depois. A gente guarda o que já fez.</p><div style="flex:1"></div><button class="btn pri block" data-a="lim-go">' + (n ? 'CONTINUAR' : 'COMEÇAR') + '</button><button class="btn ghost block" data-a="lim-back">AGORA NÃO</button></div>' + (s.toast ? '<div class="snack" role="status">' + esc(s.toast) + '</div>' : '');
}
function limMaeInner(s) {
  const l = s.lim;
  return abar('Nome da mãe', { back: 'lim-back' }) + '<div class="scr" id="scr"><div class="progress" role="progressbar" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100" aria-label="Passo 1 de 3"><i style="width:33%"></i></div><p class="help-t">Passo 1 de 3</p>' +
    '<div class="bub">Qual é o nome completo da sua mãe?</div><div style="flex:1"></div><div class="dock" style="margin:0 -16px -16px;max-height:none"><div class="field"><label for="mae-in">Nome completo da mãe</label><input class="inp" id="mae-in" data-in data-f="mae" type="text" autocomplete="off" value="' + esc(l.mae) + '"' + (l.maeExc ? ' disabled' : '') + '></div>' +
    '<label class="chk"><input type="checkbox" data-a="mae-exc"' + (l.maeExc ? ' checked' : '') + '><span>Não consta o nome da minha mãe no meu registro</span></label>' +
    '<button class="btn pri block" data-a="mae-go"' + ((l.mae.trim().length > 4 || l.maeExc) ? '' : ' disabled') + '>CONTINUAR</button><button class="chipx" data-a="example">' + ic('info') + 'Preencher com exemplo</button></div></div>' + (s.sheet ? sheetHTML(s) : '');
}
function limTipoInner(s) {
  return abar('Documento', { back: 'lim-back' }) + '<div class="scr" id="scr"><div class="progress" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Passo 2 de 3"><i style="width:50%"></i></div><p class="help-t">Passo 2 de 3</p><div class="bub">Qual documento você vai usar?</div>' +
    '<div class="opts"><button class="opt" data-a="doc-tipo" data-t="RG">' + ic('idcard') + 'RG<small>Frente e verso</small></button><button class="opt" data-a="doc-tipo" data-t="CNH">' + ic('idcard') + 'CNH<small>Frente e verso</small></button></div>' +
    '<p class="help-t" style="margin-top:6px">Dica: escolha um lugar com luz e sem reflexo. O celular fica em pé, a gente trava a tela para isso.</p></div>';
}
function limCamInner(s, o) {
  o = o || {}; const l = s.lim, side = l.side;
  const cls = o.cls || '';
  return abar(l.tipo + ', ' + (side === 'front' ? 'frente' : 'verso'), { back: 'lim-back-tipo' }) +
    '<div class="cam" id="cam"><div class="cap"><b>Encaixe o documento na moldura</b><span>Fique em um lugar com luz e sem reflexo.</span></div>' +
    '<div class="frame ' + cls + '" id="frame"><div class="fakedoc"><i class="ph"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><i class="gl"></i></div></div>' +
    '<div class="stat" id="stat">' + (o.stat || '<span class="pill info">Procurando o documento…</span>') + '</div>' +
    '<div class="shutter' + (o.go ? ' go' : '') + '" id="shutter" aria-hidden="true"><i></i><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="36"/></svg></div><div class="flash" id="flash"></div></div>';
}
function limRevInner(s) {
  const t = s.lim.tipo;
  return abar('Conferir fotos', { back: 'lim-back-tipo' }) + '<div class="scr" id="scr"><div class="bub">Ficou legível? Confira se dá para ler tudo e se não tem reflexo.</div><div class="review"><div class="thumb"><div class="fakedoc"><i class="ph"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i></div>' + t + ', frente</div><div class="thumb"><div class="fakedoc"><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i></div>' + t + ', verso</div></div><div style="flex:1"></div>' +
    '<button class="btn pri block" data-a="doc-use">USAR AS FOTOS</button><button class="btn sec block" data-a="doc-retry">TIRAR DE NOVO</button></div>';
}
function limSelfieInner(s, o) {
  o = o || {};
  return abar('Selfie', { back: 'lim-back' }) + '<div class="cam" id="cam"><div class="cap"><b>Olhe para a frente</b><span>Fique parado por um instante. A foto sai sozinha.</span></div>' +
    '<div class="oval' + (o.ok ? ' ok' : '') + '" id="frame"><div class="face"></div></div>' +
    '<div class="stat" id="stat">' + (o.stat || '<span class="pill info">Procurando o seu rosto…</span>') + '</div>' +
    '<div class="shutter' + (o.go ? ' go' : '') + '" id="shutter" aria-hidden="true"><i></i><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="36"/></svg></div><div class="flash" id="flash"></div></div>';
}
function limWaitInner(s, o) {
  return abar('Análise', {}) + '<div class="wait" role="status"><div class="spin" aria-hidden="true"></div><h3>Estamos analisando</h3><p>Isso costuma levar poucos minutos. Pode sair do app, a gente avisa quando terminar.</p><span class="pill warn">Em análise</span></div>' + ((o && o.notif) ? notifHTML() : '');
}
function limOkInner(s) {
  return '<div class="moment"><div class="ring">' + ic('check') + '</div><h2>Aprovado!</h2><p>O seu limite agora é de R$ 5.000 e o Pix vai até R$ 2.000 por transferência.</p><div class="kv"><div>Limite de saldo<b>R$ 5.000</b></div><div>Pix por transferência<b>até R$ 2.000</b></div><hr><div>Cartão físico<b>liberado</b></div></div><div class="grow"></div><button class="btn neon block" data-a="lim-done">IR PARA O INÍCIO</button></div>';
}
function limFailInner() {
  return '<div class="moment"><div class="ring" style="border-color:var(--vz-warn-bg);color:var(--vz-warn-bg);box-shadow:none">' + ic('camera') + '</div><h2>Precisamos de uma foto melhor</h2><p>A foto do verso ficou com reflexo e não deu para ler o número. Tire de novo, é rapidinho.</p><div class="kv"><div>O que fazer<b>Sem reflexo</b></div><div>Onde<b>Perto de uma janela</b></div></div><div class="grow"></div><button class="btn pri block">TIRAR DE NOVO</button><button class="btn ghost block">FALAR COM ALGUÉM</button></div>';
}
function screenInner(s) {
  switch (s.screen) {
    case 'splash': return splashInner(s);
    case 'chat': return chatInner(s);
    case 'activated': return activatedInner(s);
    case 'home': return homeInner(s);
    case 'pix': return pixInner(s);
    case 'limIntro': return limIntroInner(s);
    case 'limMae': return limMaeInner(s);
    case 'limTipo': return limTipoInner(s);
    case 'limCam': return limCamInner(s);
    case 'limRev': return limRevInner(s);
    case 'limSelfie': return limSelfieInner(s);
    case 'limWait': return limWaitInner(s);
    case 'limOk': return limOkInner(s);
  }
  return '';
}

/* ---------- interactive controller ---------- */
const phoneEl = $('#phone');
function render() {
  if (!phoneEl) return;
  const keep = document.activeElement && document.activeElement.id;
  phoneEl.innerHTML = shell(screenInner(S));
  S.seen = S.chat.length;
  const chat = $('#chat', phoneEl); if (chat) chat.scrollTop = chat.scrollHeight;
  if (S.screen === 'home' && S.tour >= 0) { phoneEl.classList.add('tourring'); positionTour(phoneEl); } else phoneEl.classList.remove('tourring');
  if (S.screen === 'chat' && S.ready && !S.auto && !FAST && matchMedia('(hover: hover)').matches) { const f = $('#dock-in', phoneEl) || null; if (f && !f.disabled && S.focusOK) f.focus({ preventScroll: true }); }
  updatePanel();
}
function toast(msg) { S.toast = msg; render(); const t = S.tok; setTimeout(() => { if (t === S.tok && S.toast === msg) { S.toast = ''; render(); } }, reduce || FAST ? 30 : 2600); }
function reset() { TOK++; AUTO++; S = newState(); S.tok = TOK; S.errors = !!($('#sw-err') && $('#sw-err').checked); render(); }
async function say(lines, tok) {
  S.ready = false;
  for (const l of lines) {
    S.typing = true; render(); await sleep(450 + Math.min(700, l.length * 12)); if (tok !== S.tok) return false;
    S.typing = false; S.chat.push({ k: 'bot', t: l }); render();
  }
  return true;
}
async function ask(i) {
  const tok = S.tok, st = STEPS[i]; S.step = i; S.dock = newDock(st); S.ready = false;
  const ok = await say(st.ask(S.data), tok); if (!ok || tok !== S.tok) return;
  S.ready = true; S.focusOK = true; render();
  if (st.auto) autoOtp(tok, st);
}
async function autoOtp(tok, st) {
  await sleep(1500); if (tok !== S.tok || S.step !== STEP_INDEX[st.id] || S.dock.val) return;
  S.dock.auto = 'Lendo o SMS…'; const m = $('#dock-msg', phoneEl); if (m) m.textContent = S.dock.auto;
  for (const ch of st.code) { await sleep(140); if (tok !== S.tok || S.step !== STEP_INDEX[st.id]) return; S.dock.val += ch; paintOtp(); }
  await sleep(500); if (tok !== S.tok || S.step !== STEP_INDEX[st.id]) return;
  submit(S.dock.val);
}
function paintOtp() {
  const o = $('#otp', phoneEl); if (!o) return; const v = S.dock.val;
  o.innerHTML = [0, 1, 2, 3, 4, 5].map(i => '<b class="' + (v[i] ? 'fill' : (i === v.length ? 'on' : '')) + '">' + (v[i] || '') + '</b>').join('');
  const inp = $('#dock-in', phoneEl); if (inp && inp.value !== v) inp.value = v;
}
function shake() { const d = $('.dock', phoneEl); if (d && !reduce) { d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); } }
function submit(v) {
  if (S.screen !== 'chat' || !S.ready) return;
  const st = STEPS[S.step]; const r = st.val ? st.val(v, S.data) : true;
  if (r !== true) { S.dock.err = r; S.attempts[st.id] = attempt(st.id) + 1; if (st.dock === 'pin') S.dock.pin = ''; if (st.id === 'pin2') { /* keep first pin */ } if (st.dock === 'otp') { S.dock.val = ''; } render(); shake(); return; }
  st.save && st.save(v, S.data);
  let echo = st.echo ? st.echo(v, S.data) : v; if (st.mask) echo = v;
  S.chat.push({ k: 'me', t: echo });
  if (st.card) S.chat.push({ k: 'card', title: st.card.title, sub: st.card.sub });
  S.ready = false; S.focusOK = false;
  if (st.id === 'pin2') return finishActivation();
  ask(S.step + 1);
}
async function finishActivation() {
  const tok = S.tok; render(); await sleep(500); if (tok !== S.tok) return;
  const ok = await say(['Pronto, a sua conta está ativa! 🎉'], tok); if (!ok) return; await sleep(900); if (tok !== S.tok) return;
  S.screen = 'activated'; S.data.nome = U.nome; render();
}
function exampleFor(st) {
  if (st.dock === 'address') return null;
  return st.ex ? st.ex(S.data, attempt(st.id), S.errors) : '';
}
function startChat() { S.screen = 'chat'; S.step = 0; S.chat = []; render(); ask(0); }

/* delegated events */
if (phoneEl) {
  phoneEl.addEventListener('click', e => {
    const el = e.target.closest('[data-a]'); if (!el || el.matches('input[type=checkbox]')) return; act(el.dataset.a, el);
  });
  phoneEl.addEventListener('change', e => {
    const el = e.target.closest('[data-a]'); if (el && el.matches('input[type=checkbox]')) act(el.dataset.a, el);
  });
  phoneEl.addEventListener('input', e => {
    const el = e.target; if (!el.matches('[data-in]')) return;
    const st = STEPS[S.step];
    if (S.screen === 'limMae') { S.lim.mae = el.value; const b = $('[data-a=mae-go]', phoneEl); if (b) b.disabled = !(S.lim.mae.trim().length > 4 || S.lim.maeExc); return; }
    if (st.dock === 'otp') { S.dock.val = digits(el.value).slice(0, 6); S.dock.err = ''; paintOtp(); if (S.dock.val.length === 6) submit(S.dock.val); return; }
    if (st.dock === 'address') {
      const f = el.dataset.f;
      if (f === 'cep') {
        el.value = maskCEP(el.value); S.dock.cep = el.value; S.dock.err = '';
        if (digits(el.value).length === 8) { const r = lookupCEP(digits(el.value)); Object.assign(S.dock, { found: true, rua: r.rua, cidade: r.cidade, uf: r.uf, generic: r.generic }); renderDockKeepFocus(r.rua ? 'f-num' : 'f-rua'); }
      } else { S.dock[f] = el.value; const b = $('[data-a=cep-go]', phoneEl); if (b) b.disabled = !(S.dock.rua.trim() && S.dock.num.trim()); }
      return;
    }
    if (st.mask) el.value = st.mask(el.value);
    S.dock.val = el.value; if (S.dock.err) { S.dock.err = ''; const m = $('#dock-msg', phoneEl); if (m) { m.textContent = st.help || ''; m.classList.remove('err'); } el.classList.remove('err'); }
  });
  phoneEl.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('#dock-in[data-in]:not([data-otp])') && S.screen === 'chat') { e.preventDefault(); const st = STEPS[S.step]; if (st.dock !== 'address') submit(S.dock.val); } });
}
function renderDockKeepFocus(id) {
  const d = $('.dock', phoneEl); if (!d) return; const tmp = document.createElement('div'); tmp.innerHTML = dockHTML(S); d.replaceWith(tmp.firstChild);
  const f = $('#' + id, phoneEl); if (f && !FAST) f.focus({ preventScroll: true });
  const chat = $('#chat', phoneEl); if (chat) chat.scrollTop = chat.scrollHeight;
}
function act(a, el) {
  switch (a) {
    case 'noop': break;
    case 'start': startChat(); break;
    case 'has-account': toast('Neste protótipo, o foco é abrir a conta.'); break;
    case 'send': submit(S.dock.val); break;
    case 'example': {
      if (S.screen === 'limMae') { S.lim.mae = U.mae; S.lim.maeExc = false; render(); break; }
      const st = STEPS[S.step];
      if (st.dock === 'address') { S.dock.cep = U.cep; Object.assign(S.dock, { found: true, rua: '', cidade: U.cidade, uf: U.uf, generic: true }); renderDockKeepFocus('f-rua'); break; }
      const v = exampleFor(st); if (st.dock === 'otp') { S.dock.val = ''; for (const ch of v) S.dock.val += ch; paintOtp(); if (S.dock.val.length === 6) submit(S.dock.val); break; }
      S.dock.val = v; const inp = $('#dock-in', phoneEl); if (inp) { inp.value = v; inp.focus({ preventScroll: true }); } break;
    }
    case 'ack-yes': S.chat.push({ k: 'me', t: 'Ativar agora' }); S.ready = false; ask(S.step + 1); break;
    case 'ack-later': S.toast = ''; S.chat.push({ k: 'me', t: 'Depois' }); S.chat.push({ k: 'bot', t: 'Sem problema. Neste protótipo, vamos seguir com a ativação para você ver o resto.' }); S.ready = false; ask(S.step + 1); break;
    case 'term': S.dock.terms[+el.dataset.i] = el.checked; { const b = $('[data-a=terms-go]', phoneEl); if (b) b.disabled = !(S.dock.terms[0] && S.dock.terms[1]); } break;
    case 'term-see': S.sheet = { type: 'legal', i: +el.dataset.i }; render(); break;
    case 'legal-full': toast('Aqui abre o texto jurídico completo.'); break;
    case 'legal-ok': { const i = S.sheet.i; S.dock.terms[i] = true; S.sheet = null; render(); break; }
    case 'terms-go': submit('ok'); break;
    case 'pin-key': { if (S.dock.pin.length >= 4) break; S.dock.err = ''; S.dock.pin += el.dataset.k; renderPin(); if (S.dock.pin.length === 4) { const tok = S.tok, v = S.dock.pin; setTimeout(() => { if (tok === S.tok) submit(v); }, reduce || FAST ? 10 : 220); } break; }
    case 'pin-del': S.dock.pin = S.dock.pin.slice(0, -1); renderPin(); break;
    case 'cep-go': S.data.cep = S.dock.cep; S.data.rua = S.dock.rua.trim(); S.data.num = S.dock.num.trim(); S.data.compl = S.dock.compl.trim(); S.data.cidade = S.dock.cidade; S.data.uf = S.dock.uf; S.chat.push({ k: 'me', t: STEPS[S.step].echo('', S.data) }); S.chat.push({ k: 'bot', t: 'Endereço cadastrado com sucesso.' }); S.ready = false; ask(S.step + 1); break;
    case 'exit': S.sheet = { type: 'exit' }; render(); break;
    case 'exit-stay': S.sheet = null; render(); break;
    case 'exit-leave': reset(); break;
    case 'sheet-close': S.sheet = null; render(); break;
    case 'activated-go': S.screen = 'home'; S.sheet = { type: 'welcome' }; render(); break;
    case 'welcome-go': S.sheet = null; S.tour = 0; render(); break;
    case 'welcome-skip': S.sheet = null; S.tourDone = true; render(); break;
    case 'tour-next': if (S.tour >= TOUR.length - 1) { S.tour = -1; S.tourDone = true; render(); toast('Pronto! Agora é com você.'); } else { S.tour++; render(); } break;
    case 'tour-skip': S.tour = -1; S.tourDone = true; render(); break;
    case 'tab': S.tab = el.dataset.t; render(); break;
    case 'tile': { const n = el.dataset.n; if (n === 'Pix') { S.screen = 'pix'; render(); } else toast('"' + n + '" fica fora deste protótipo.'); break; }
    case 'pix-back': S.screen = 'home'; render(); break;
    case 'lim-start': S.screen = 'limIntro'; render(); break;
    case 'lim-back': TOK++; S.tok = TOK; S.sheet = null; S.screen = S.screen === 'limIntro' ? 'home' : 'limIntro'; render(); break;
    case 'lim-back-tipo': TOK++; S.tok = TOK; S.screen = 'limTipo'; render(); break;
    case 'lim-go': S.screen = S.lim.prog === 0 ? 'limMae' : (S.lim.prog === 1 ? 'limTipo' : 'limSelfie'); render(); if (S.screen === 'limSelfie') runSelfie(); break;
    case 'mae-exc': S.lim.maeExc = el.checked; if (el.checked) { S.sheet = { type: 'mae' }; } render(); break;
    case 'mae-go': S.lim.prog = Math.max(S.lim.prog, 1); S.screen = 'limTipo'; render(); break;
    case 'doc-tipo': S.lim.tipo = el.dataset.t; S.lim.side = 'front'; S.lim.docAttempt = 0; S.screen = 'limCam'; render(); runDoc(); break;
    case 'doc-use': S.lim.prog = Math.max(S.lim.prog, 2); S.screen = 'limSelfie'; render(); runSelfie(); break;
    case 'doc-retry': S.lim.side = 'front'; S.lim.docAttempt = 0; S.screen = 'limCam'; render(); runDoc(); break;
    case 'lim-done': S.screen = 'home'; S.tab = 'conta'; S.notif = false; render(); break;
  }
}
function renderPin() {
  const n = S.dock.pin.length; const row = $('.pinrow', phoneEl); if (!row) return;
  row.innerHTML = [0, 1, 2, 3].map(i => '<i class="' + (i < n ? 'f' : '') + '"></i>').join(''); row.setAttribute('aria-label', n + ' de 4 dígitos');
  const m = $('#dock-msg', phoneEl); if (m && !S.dock.err) { m.classList.remove('err'); m.textContent = STEPS[S.step].again ? 'Confirme a senha de 4 números' : 'Crie uma senha de 4 números'; }
}

/* camera simulations */
async function runDoc() {
  const tok = S.tok, l = S.lim, ok = () => tok === S.tok && S.screen === 'limCam';
  const frame = () => $('#frame', phoneEl), stat = () => $('#stat', phoneEl);
  await sleep(1100); if (!ok()) return;
  if (S.errors && l.docAttempt === 0 && l.side === 'front') {
    frame().classList.add('glare'); stat().innerHTML = '<span class="pill warn">Tem reflexo. Vire um pouco o celular.</span>'; await sleep(2100); if (!ok()) return;
    l.docAttempt++; frame().classList.remove('glare'); stat().innerHTML = '<span class="pill ok">Isso. Sem reflexo.</span>'; await sleep(800); if (!ok()) return;
  }
  frame().classList.add('lock'); stat().innerHTML = '<span class="pill info">Documento detectado. Segure firme.</span>'; $('#shutter', phoneEl).classList.add('go');
  await sleep(1300); if (!ok()) return;
  $('#flash', phoneEl).classList.add('on'); frame().classList.remove('lock'); frame().classList.add('ok'); stat().innerHTML = '<span class="pill ok">' + ic('check') + 'Pronto!</span>';
  await sleep(800); if (!ok()) return;
  if (l.side === 'front') { l.photos.front = true; l.side = 'back'; l.docAttempt = 1; render(); runDoc(); } else { l.photos.back = true; S.screen = 'limRev'; render(); }
}
async function runSelfie() {
  const tok = S.tok, ok = () => tok === S.tok && S.screen === 'limSelfie';
  await sleep(1200); if (!ok()) return;
  $('#stat', phoneEl).innerHTML = '<span class="pill info">Rosto encontrado. Fique parado.</span>'; $('#shutter', phoneEl).classList.add('go');
  await sleep(1500); if (!ok()) return;
  $('#flash', phoneEl).classList.add('on'); $('#frame', phoneEl).classList.add('ok'); $('#stat', phoneEl).innerHTML = '<span class="pill ok">' + ic('check') + 'Tudo certo!</span>';
  await sleep(800); if (!ok()) return;
  S.lim.prog = 3; S.screen = 'limWait'; render(); runWait();
}
async function runWait() {
  const tok = S.tok, ok = () => tok === S.tok && S.screen === 'limWait';
  await sleep(2600); if (!ok()) return;
  S.notif = true; phoneEl.insertAdjacentHTML('beforeend', notifHTML());
  await sleep(2000); if (!ok()) return;
  S.notif = false; S.lim.up = true; S.screen = 'limOk'; render();
}

/* tour positioning (works for the interactive phone and gallery frames) */
function positionTour(phone) {
  const tour = $('.tour', phone); if (!tour) return;
  const st = TOUR[+tour.dataset.i]; const t = $(st.sel, phone); const hl = $('.tour-hl', tour), tip = $('.tour-tip', tour); if (!t) return;
  const scr = $('.scr', phone);
  if (scr && scr.contains(t)) { const tr = t.getBoundingClientRect(), sr = scr.getBoundingClientRect(), k0 = phone.getBoundingClientRect().width / phone.offsetWidth; scr.scrollTop += ((tr.top - sr.top) - (sr.height / 2 - tr.height / 2)) / k0; }
  const k = phone.getBoundingClientRect().width / phone.offsetWidth || 1;
  const o = tour.getBoundingClientRect(), r = t.getBoundingClientRect();
  const x = (r.left - o.left) / k, y = (r.top - o.top) / k, w = r.width / k, h = r.height / k, H = o.height / k;
  hl.style.left = (x - 6) + 'px'; hl.style.top = (y - 6) + 'px'; hl.style.width = (w + 12) + 'px'; hl.style.height = (h + 12) + 'px';
  const th = tip.offsetHeight; let top = y + h + 16; if (top + th > H - 14) top = Math.max(10, y - th - 16); tip.style.top = top + 'px';
}

/* ---------- side panel ---------- */
const FLOW = [
  { t: 'Welcome', s: 'One promise, one tap' },
  { t: 'Account setup', s: 'Phone, SMS, name, CPF, email, code' },
  { t: 'Activation', s: 'Birth date, address, terms, PIN' },
  { t: 'In-app onboarding', s: 'Welcome and five coach marks' },
  { t: 'Raise your limit', s: 'Mother\'s name, ID, selfie, approval' }
];
const NOTES = {
  splash: ['Welcome', 'One promise and three perks. The neon corner is the only decoration.'],
  chat1: ['Account setup: one question at a time', 'The conversation asks for the minimum to get in. The SMS code is read automatically, so most people never type it.'],
  chat2: ['Activation: the rest of the basics', 'The address is a single component. The terms live inside the chat, with a Ver button that returns to the same place.'],
  activated: ['Account active', 'The approval gets its own moment, out of the chat, with the account data and the starting limits.'],
  home: ['Home: a conversation with shortcuts', 'The balance is a line from the assistant. The actions sit right under the question.'],
  tour: ['In-app onboarding', 'Five coach marks on the real home. Each one points at a feature and says what it does in one sentence. Skippable.'],
  pix: ['Pix', 'Same structure as the home, grouped in Pagar and Receber.'],
  lim: ['Raise your limit', 'The three heavy steps are an invitation, one per screen. Progress is kept if the person leaves.'],
  limOk: ['Approved', 'Notification first, then a moment with the new limits.']
};
function stageNow(s) {
  const sc = s.screen;
  if (sc === 'splash') return 0;
  if (sc === 'chat') return s.step <= 6 ? 1 : 2;
  if (sc === 'activated') return 2;
  if (sc === 'home') { if (s.lim.up) return 5; if (s.sheet && s.sheet.type === 'welcome' || s.tour >= 0) return 3; return s.tourDone ? 4 : 3; }
  if (sc === 'pix') return 3;
  return 4;
}
function updatePanel() {
  const list = $('#flow'); if (!list || !S) return; const cur = stageNow(S);
  $$('li', list).forEach((li, i) => { li.classList.toggle('cur', i === cur); li.classList.toggle('done', i < cur); const sp = $('.s', li); if (sp) sp.textContent = i < cur ? 'done' : (i === cur ? 'now' : ''); const n = $('.n', li); if (n) n.innerHTML = i < cur ? ic('check').replace('class="ic ', 'style="width:16px;height:16px" class="ic ') : (i + 1); const b = $('button', li); if (b) b.setAttribute('aria-current', i === cur ? 'step' : 'false'); });
  const key = S.screen === 'chat' ? (S.step <= 6 ? 'chat1' : 'chat2') : (S.screen.indexOf('lim') === 0 ? (S.screen === 'limOk' ? 'limOk' : 'lim') : (S.screen === 'home' && S.tour >= 0 ? 'tour' : S.screen));
  const n = NOTES[key] || NOTES.home; const el = $('#note-now'); if (el) el.innerHTML = '<b>' + n[0] + '</b>' + n[1];
}
function buildPanel() {
  const list = $('#flow'); if (!list) return;
  list.innerHTML = FLOW.map((f, i) => '<li><button data-j="' + i + '"><span class="n">' + (i + 1) + '</span><span class="t">' + f.t + '<small>' + f.s + '</small></span><span class="s"></span></button></li>').join('');
  list.addEventListener('click', e => { const b = e.target.closest('[data-j]'); if (b) jump(+b.dataset.j); });
}
function jump(n) {
  const errs = S ? S.errors : false; reset(); S.errors = errs;
  if (n === 0) { render(); return; }
  if (n === 1) { startChat(); return; }
  if (n === 2) { S.screen = 'chat'; prefillInto(S, STEP_INDEX.nasc); S.step = STEP_INDEX.nasc; S.data.nome = U.nome; render(); ask(STEP_INDEX.nasc); return; }
  fillData(S); S.data.nome = U.nome;
  if (n === 3) { S.screen = 'home'; S.sheet = { type: 'welcome' }; render(); return; }
  if (n === 4) { S.screen = 'home'; S.tourDone = true; render(); return; }
}
function jumpTarget(t) { const m = { welcome: 0, login: 1, activation: 2, tour: 3, limit: 4 }; showTab('proto'); jump(m[t]); window.scrollTo({ top: 0 }); if (t === 'limit') { S.screen = 'limIntro'; S.tourDone = true; render(); } }

/* ---------- autoplay ---------- */
async function until(fn, run, max) { const t0 = Date.now(); while (!fn()) { if (run !== AUTO) return false; if (Date.now() - t0 > (max || 20000)) return false; await new Promise(r => setTimeout(r, 40)); } return true; }
async function play() {
  const run = ++AUTO; TOK++; const errs = S.errors; S = newState(); S.errors = errs; S.auto = true; S.tok = TOK; render(); setPlaying(true);
  const alive = () => run === AUTO;
  await sleep(1000); if (!alive()) return; startChat();
  while (alive() && S.screen === 'chat') {
    if (!(await until(() => S.ready || S.screen !== 'chat', run))) break; if (S.screen !== 'chat') break;
    await sleep(900); if (!alive()) return;
    const st = STEPS[S.step];
    if (st.auto) { if (!(await until(() => S.step !== STEP_INDEX[st.id] || S.screen !== 'chat', run))) break; continue; }
    if (st.dock === 'ack') { act('ack-yes'); }
    else if (st.dock === 'terms') { S.dock.terms = [true, true]; render(); await sleep(500); submit('ok'); }
    else if (st.dock === 'pin') { for (const k of '2580') { if (!alive()) return; act('pin-key', { dataset: { k } }); await sleep(260); } await sleep(300); }
    else if (st.dock === 'address') { act('example', {}); await sleep(600); const inp = $('#dock-in', phoneEl); S.dock.cep = U.cep; Object.assign(S.dock, { found: true, rua: U.rua, num: U.num, compl: U.compl, cidade: U.cidade, uf: U.uf, generic: true }); renderDockKeepFocus('f-num'); await sleep(800); act('cep-go'); }
    else { const v = exampleFor(st); S.dock.val = v; const inp = $('#dock-in', phoneEl); if (inp) inp.value = v; await sleep(500); submit(v); await sleep(300); }
  }
  if (!alive()) return;
  if (!(await until(() => S.screen === 'activated', run, 30000))) return; await sleep(2300); if (!alive()) return; act('activated-go');
  await sleep(1500); if (!alive()) return; act('welcome-go');
  for (let i = 0; i < TOUR.length; i++) { await sleep(2300); if (!alive()) return; act('tour-next'); }
  await sleep(1400); if (!alive()) return; act('lim-start'); await sleep(1500); if (!alive()) return; act('lim-go'); await sleep(900);
  if (!alive()) return; S.lim.mae = U.mae; render(); await sleep(1200); if (!alive()) return; act('mae-go'); await sleep(1300); if (!alive()) return; act('doc-tipo', { dataset: { t: 'RG' } });
  if (!(await until(() => S.screen === 'limRev', run, 30000))) return; await sleep(1700); if (!alive()) return; act('doc-use');
  if (!(await until(() => S.screen === 'limOk', run, 30000))) return; await sleep(2500); if (!alive()) return; act('lim-done');
  setPlaying(false); S.auto = false;
}
function setPlaying(on) { const b = $('#btn-play'); if (b) { b.textContent = on ? 'Stop' : 'Play full flow'; b.dataset.on = on ? '1' : ''; } }
function stop() { AUTO++; TOK++; if (S) { S.tok = TOK; S.auto = false; S.typing = false; } setPlaying(false); }

/* ---------- gallery ---------- */
function chatT(id, dock, extra) {
  const i = STEP_INDEX[id], s = newState(); s.screen = 'chat'; prefillInto(s, i); STEPS[i].ask(s.data).forEach(t => s.chat.push({ k: 'bot', t })); s.step = i; s.ready = true; s.dock = Object.assign(newDock(), dock || {}); s.seen = s.chat.length; return Object.assign(s, extra || {});
}
function backT() {
  const s = newState(); s.screen = 'chat'; fillData(s);
  s.chat = [{ k: 'bot', t: 'Oi! Eu sou a Voltz 😊' }, { k: 'bot', t: 'Vamos abrir a sua conta, é rapidinho. Qual é o seu celular?' }, { k: 'me', t: U.cel }, { k: 'bot', t: 'Enviei um código para ' + U.cel + '.' }, { k: 'me', t: U.smsCode }, { k: 'bot', t: 'Achei o seu cadastro do WhatsApp, ' + U.apelido + '! 🎉' }, { k: 'bot', t: 'O que você respondeu lá, não precisa responder de novo.' }, { k: 'bot', t: 'Última coisa: crie uma senha de 4 números para confirmar as suas transações.' }];
  s.seen = s.chat.length; s.step = STEP_INDEX.pin; s.ready = true; s.dock = newDock(); return s;
}
function homeT(extra) { const s = newState(); s.screen = 'home'; fillData(s); s.data.nome = U.nome; s.tourDone = true; return Object.assign(s, extra || {}); }
function limT(screen, lim, extra) { const s = newState(); fillData(s); s.screen = screen; s.tourDone = true; Object.assign(s.lim, lim || {}); return Object.assign(s, extra || {}); }
const GAL = [
  { g: 'Welcome', sub: 'The promise', f: [
    { t: 'Splash', n: 'One promise, three perks and two buttons. The neon corner from the campaign banner is the only decoration.', j: 'welcome', s: () => newState(), r: splashInner } ] },
  { g: 'Stage 1: Account setup', sub: 'The minimum to get in', f: [
    { t: 'Phone', n: 'The assistant introduces itself and asks one thing. The same first question for everyone, wherever they started.', j: 'login', s: () => chatT('cel'), r: chatInner },
    { t: 'SMS read automatically', n: 'The code fills itself in. Most people never type it, and the ones who prefer can.', j: 'login', s: () => chatT('sms', { val: '4829', auto: 'Lendo o SMS…' }), r: chatInner },
    { t: 'Name', n: 'One thing at a time. No form, no screen full of fields.', j: 'login', s: () => chatT('name'), r: chatInner },
    { t: 'CPF, with an error', n: 'The message says what is wrong and what to do. It never blames the person.', j: 'login', s: () => chatT('cpf', { val: '529.982.247-26', err: 'Esse CPF não parece certo. Confira os 11 números.' }), r: chatInner },
    { t: 'Stage complete', n: 'Stage 1 ends with a card and a choice: activate now, or later. Nothing is lost either way.', j: 'login', s: () => chatT('ativar'), r: chatInner },
    { t: 'Coming from WhatsApp', n: 'The phone number finds what was already answered on WhatsApp, so the person skips it.', j: 'login', s: () => backT(), r: chatInner } ] },
  { g: 'Stage 2: Activation', sub: 'The rest of the basics', f: [
    { t: 'Birth date', n: 'A numeric keypad, a mask and a plain error if the age is below 18.', j: 'activation', s: () => chatT('nasc', { val: '14/03/' }), r: chatInner },
    { t: 'Address, one component', n: 'ZIP code, city and state fill in. A small town has one ZIP for the whole city, so the street field stays open, with a note that says why.', j: 'activation', s: () => chatT('cep', { cep: '36770-000', found: true, rua: '', num: '', cidade: 'Cataguases', uf: 'MG', generic: true }), r: chatInner },
    { t: 'Terms inside the chat', n: 'Two lines, each with a checkbox and a Ver button. The button stays off until both are ticked.', j: 'activation', s: () => chatT('termos', { terms: [true, false] }), r: chatInner },
    { t: 'Reading the terms', n: 'The long text opens in a sheet and returns to the same place. Closing it ticks the box.', j: 'activation', s: () => chatT('termos', { terms: [true, false] }, { sheet: { type: 'legal', i: 1 } }), r: chatInner },
    { t: 'Transaction PIN', n: 'Four digits and a custom keypad. A mismatch asks again, with a short message.', j: 'activation', s: () => chatT('pin', { pin: '25' }), r: chatInner },
    { t: 'Account active', n: 'Approval gets its own moment, out of the chat. It shows the account and the starting limits.', j: 'activation', s: () => { const s = newState(); fillData(s); s.screen = 'activated'; return s; }, r: activatedInner } ] },
  { g: 'In-app onboarding', sub: 'Learning the app by using it', f: [
    { t: 'Welcome', n: 'Two choices: take the tips or skip them. The text is short and promises it is quick.', j: 'tour', s: () => homeT({ sheet: { type: 'welcome' }, tourDone: false }), r: homeInner },
    { t: 'Coach mark 1: balance', n: 'The tip points at the real element. Skip is always one tap away.', j: 'tour', s: () => homeT({ tour: 0 }), r: homeInner, tour: true },
    { t: 'Coach mark 2: Pix', n: 'One sentence per feature, in plain words.', j: 'tour', s: () => homeT({ tour: 1 }), r: homeInner, tour: true },
    { t: 'Coach mark 3: bills', n: 'The benefit comes first: paying the Energisa bill earns up to 10% credit on new bills.', j: 'tour', s: () => homeT({ tour: 2 }), r: homeInner, tour: true },
    { t: 'Coach mark 4: card', n: 'The virtual card is already there. The tip says what it is for.', j: 'tour', s: () => homeT({ tour: 3 }), r: homeInner, tour: true },
    { t: 'Coach mark 5: limit', n: 'The last tip leads to the next stage. It says how many steps and that they can wait.', j: 'tour', s: () => homeT({ tour: 4 }), r: homeInner, tour: true },
    { t: 'Home after the tour', n: 'A new account has a zero balance. The limit card stays at the bottom, with progress.', j: 'tour', s: () => homeT(), r: homeInner, end: true },
    { t: 'Pix', n: 'Same structure as the home: one question, then tiles grouped in Pagar and Receber.', j: 'tour', s: () => { const s = homeT(); s.screen = 'pix'; return s; }, r: pixInner } ] },
  { g: 'Stage 3: Raise your limit', sub: 'The heavy steps, as an invitation', f: [
    { t: 'Intro', n: 'The benefit first (R$ 5.000), then the three steps with a time for each. Progress is kept.', j: 'limit', s: () => limT('limIntro'), r: limIntroInner },
    { t: 'Mother\'s name, with an exception', n: 'Not everyone has the name on record. The checkbox opens a path instead of a dead end.', j: 'limit', s: () => limT('limMae', { maeExc: false, mae: 'Helena Teixeira Lima' }), r: limMaeInner },
    { t: 'Choose the document', n: 'Two big options. The screen is locked to portrait, so no more landscape photos.', j: 'limit', s: () => limT('limTipo'), r: limTipoInner },
    { t: 'Capture, with glare', n: 'The frame warns about glare before the photo is taken, so the person fixes it right away.', j: 'limit', s: () => limT('limCam', { tipo: 'RG', side: 'front' }), r: s => limCamInner(s, { cls: 'glare', stat: '<span class="pill warn">Tem reflexo. Vire um pouco o celular.</span>' }) },
    { t: 'Capture, steady', n: 'When the document is in the frame and steady, the photo is taken by itself.', j: 'limit', s: () => limT('limCam', { tipo: 'RG', side: 'back' }), r: s => limCamInner(s, { cls: 'lock', go: true, stat: '<span class="pill info">Documento detectado. Segure firme.</span>' }) },
    { t: 'Check the photos', n: 'A last look before sending. Retaking is one tap.', j: 'limit', s: () => limT('limRev'), r: limRevInner },
    { t: 'Selfie', n: 'A single instruction. The check is passive, so there is no head turning on a cheap phone.', j: 'limit', s: () => limT('limSelfie'), r: s => limSelfieInner(s, { go: true, stat: '<span class="pill info">Rosto encontrado. Fique parado.</span>' }) },
    { t: 'Analysis', n: 'People used to ask "was I approved?". Now there is a state, a time, and a notification.', j: 'limit', s: () => limT('limWait', { prog: 3 }), r: s => limWaitInner(s, { notif: true }) },
    { t: 'Approved', n: 'A moment with the new limits, and the physical card is unlocked.', j: 'limit', s: () => limT('limOk', { prog: 3, up: true }), r: limOkInner },
    { t: 'Needs a better photo', n: 'The rejection says why and how to fix it. It never just says "error".', j: 'limit', s: () => limT('limOk'), r: limFailInner },
    { t: 'Home, limit raised', n: 'The limit card turns into a confirmation. The journey ends where the person actually uses the app.', j: 'limit', s: () => homeT({ lim: { prog: 3, up: true, mae: '', maeExc: false, tipo: 'RG', side: 'front', docAttempt: 0, photos: {} } }), r: homeInner, end: true } ] }
];
let galBuilt = false;
function buildGallery() {
  if (galBuilt) return; galBuilt = true; const root = $('#gal-root'); let html = '';
  GAL.forEach((g, gi) => {
    html += '<div class="group"><h3>' + (gi + 1) + '. ' + g.g + ' <small>' + g.sub + '</small></h3><div class="frames">';
    g.f.forEach((f, fi) => { html += '<div class="fr"><div class="sb"><div class="phone" data-g="' + gi + '-' + fi + '">' + shell(f.r(f.s())) + '</div></div><div class="cp"><b>' + f.t + '</b><p>' + f.n + '</p><button class="pbtn" data-jt="' + f.j + '">Open in prototype</button></div></div>'; });
    html += '</div></div>';
  });
  root.innerHTML = html;
  $$('.phone[data-g]', root).forEach(p => { const [gi, fi] = p.dataset.g.split('-').map(Number); const fd = GAL[gi].f[fi]; if (fd.tour) { p.classList.add('tourring'); positionTour(p); } if (fd.end) { const sc = $('.scr', p); if (sc) sc.scrollTop = sc.scrollHeight; } const ch = $('.chat', p); if (ch) ch.scrollTop = ch.scrollHeight; });
  root.addEventListener('click', e => { const b = e.target.closest('[data-jt]'); if (b) jumpTarget(b.dataset.jt); });
}

/* ---------- tabs, scaling, artifacts ---------- */
const TABS = ['proto'];
function showTab(id) {
  TABS.forEach(t => { const p = $('#tab-' + t); if (p) p.hidden = t !== id; const b = $('[data-tab=' + t + ']'); if (b) b.setAttribute('aria-selected', t === id); });
  if (id === 'screens') buildGallery(); if (id === 'artifacts') armArtifacts(); if (id === 'proto') { fitPhone(); if (S && S.screen === 'home' && S.tour >= 0) positionTour(phoneEl); }
  if (history.replaceState) history.replaceState(null, '', '#' + id);
}
function fitPhone() { const sb = $('.scalebox'); if (!sb) return; const emb = document.documentElement.classList.contains('embed'); const k = Math.max(.55, Math.min(1, (innerWidth - (emb ? 16 : 40)) / 376, (innerHeight - (emb ? 16 : 150)) / 736)); sb.style.setProperty('--k', k.toFixed(3)); }
function armArtifacts() {
  const els = $$('.panelx[data-io]'); const on = e => e.classList.add('in');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(on); return; }
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { on(x.target); io.unobserve(x.target); } }), { threshold: .25 });
  els.forEach(e => { if (!e.classList.contains('in')) io.observe(e); });
}

/* ---------- init ---------- */
/* the home: white only for the tips; the app's own cards at 18% white; no chat bubbles on the home */
document.documentElement.classList.add('hc');
function frameMode() {
  const fp = new URLSearchParams(location.search).get('frame'); if (!fp) return false;
  const [gi, fi] = fp.split('-').map(Number); const f = GAL[gi] && GAL[gi].f[fi]; if (!f) return false;
  document.documentElement.classList.add('frame-only');
  document.body.innerHTML = '<div class="phone" id="fr">' + shell(f.r(f.s())) + '</div>';
  const insert = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + Object.keys(ICONS).map(k => '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>').join('') + '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', insert);
  const p = $('#fr'); const done = () => { if (f.tour) { p.classList.add('tourring'); positionTour(p); } if (f.end) { const sc = $('.scr', p); if (sc) sc.scrollTop = sc.scrollHeight; } const ch = $('.chat', p); if (ch) ch.scrollTop = ch.scrollHeight; document.title = 'READY'; };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(done, 200));
  return true;
}
function init() {
  if (frameMode()) return;
  if (/[?&]embed=1/.test(location.search)) {
    document.documentElement.classList.add('embed');
    /* tell the host page how tall this document is, so the iframe fits it and never traps the wheel */
    const send = () => { try { parent.postMessage({ type: 'voltz-height', h: Math.ceil(document.documentElement.getBoundingClientRect().height) }, '*'); } catch (e) {} };
    if ('ResizeObserver' in window) new ResizeObserver(send).observe(document.documentElement);
    addEventListener('load', send); setTimeout(send, 300);
  }
  S = newState(); buildPanel(); render();
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  $('#btn-restart') && $('#btn-restart').addEventListener('click', () => { stop(); reset(); });
  $('#btn-play') && $('#btn-play').addEventListener('click', e => { if (e.currentTarget.dataset.on) stop(); else play(); });
  $('#sw-err') && $('#sw-err').addEventListener('change', e => { S.errors = e.target.checked; });
  addEventListener('resize', fitPhone); fitPhone();
  const h = location.hash.replace('#', ''); showTab(TABS.includes(h) ? h : 'proto');
  document.fonts && document.fonts.ready && document.fonts.ready.then(() => { if (S.screen === 'home' && S.tour >= 0) positionTour(phoneEl); });
}
window.__vz = { get S() { return S; }, STEPS, act, play, stop, jump, showTab, buildGallery, GAL, TOUR, setFast: v => { FAST = v; } };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
