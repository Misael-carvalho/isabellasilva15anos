/* =========================================================================
   Isabella Silva · 15 Anos — Scripts
   ========================================================================= */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG || {};
  // Se um elemento for removido do HTML, devolve um elemento "vazio" (fora da página)
  // para que o restante do site continue funcionando normalmente.
  const $ = (s, el = document) => el.querySelector(s) || document.createElement("div");
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const API = (CFG.apiUrl || "").trim();
  const DEMO = !API;

  const store = {
    get(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignorar */ } }
  };
  const getPath = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  const brl = (n) => Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-show"), 2800);
  }

  async function copy(text, okMsg, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (err) { /* ignorar */ }
      ta.remove();
    }
    // Se houver uma janela (modal) aberta, o aviso precisa ficar dentro dela para aparecer na frente
    const t = $("#toast");
    const openDlg = document.querySelector("dialog[open]");
    (openDlg || document.body).appendChild(t);
    toast(okMsg || "Copiado!");
    if (btn) {
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      btn.textContent = "✓ Copiado!";
      btn.classList.add("is-copied");
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.textContent = btn.dataset.label; btn.classList.remove("is-copied"); }, 2500);
    }
  }

  /* Normaliza a chave Pix: telefone sem +55 vira +55..., CPF/CNPJ sem pontuação */
  function isCPF(c) {
    if (!/^\d{11}$/.test(c) || /^(\d)\1{10}$/.test(c)) return false;
    const dv = (n) => { let s = 0; for (let i = 0; i < n; i++) s += +c[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
    return dv(9) === +c[9] && dv(10) === +c[10];
  }
  function pixKey(raw) {
    const k = String(raw || "").trim();
    if (!k) return "";
    if (k.includes("@")) return k.toLowerCase();                       // e-mail
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(k)) return k.toLowerCase(); // aleatória
    const d = k.replace(/\D/g, "");
    if (k.startsWith("+")) return "+" + d;                               // telefone já com +55
    if (d.length === 14) return d;                                       // CNPJ
    if (d.length === 11 && isCPF(d)) return d;                           // CPF
    if (d.length === 10 || d.length === 11) return "+55" + d;            // telefone com DDD
    if (d.length === 13 && d.startsWith("55")) return "+" + d;           // 55 + DDD + número
    return k;
  }

  /* ---------- Preenche textos da configuração ---------- */
  $$("[data-cfg]").forEach((el) => {
    const v = getPath(CFG, el.dataset.cfg);
    if (v != null && v !== "") el.textContent = v;
  });

  /* ---------- Abertura ---------- */
  const intro = $("#intro");
  let introSeen = false;
  try { introSeen = sessionStorage.getItem("introSeen") === "1"; } catch (e) { /* ignorar */ }
  if (introSeen || location.hash) {
    intro.remove();
  } else {
    document.body.classList.add("is-locked");
    $("#introBtn").addEventListener("click", () => {
      intro.classList.add("is-hidden");
      document.body.classList.remove("is-locked");
      try { sessionStorage.setItem("introSeen", "1"); } catch (e) { /* ignorar */ }
      setTimeout(() => intro.remove(), 1100);
    });
  }

  /* ---------- Navegação ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
  }
  navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("#navMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Destaca a seção atual no menu
  const links = $$("#navMenu a[href^='#']");
  if ("IntersectionObserver" in window) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.toggle("is-current", l.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => secObs.observe(s));
  }

  /* ---------- Animações de entrada ---------- */
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => obs.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Brilhos no hero ---------- */
  const sp = $(".sparkles");
  if (sp && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let i = 0; i < 38; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.setProperty("--d", 3 + Math.random() * 4 + "s");
      s.style.setProperty("--delay", Math.random() * 5 + "s");
      const size = 1 + Math.random() * 2.5;
      s.style.width = s.style.height = size + "px";
      sp.appendChild(s);
    }
  }

  /* ---------- Contagem regressiva ---------- */
  const eventDate = new Date(CFG.dataEvento);
  const cd = $("#countdown");
  function tick() {
    const diff = eventDate - new Date();
    if (isNaN(diff)) return;
    if (diff <= 0) {
      cd.classList.add("is-done");
      cd.textContent = diff > -(CFG.duracaoHoras || 6) * 3600e3 ? "A festa está acontecendo agora! ✨" : "Obrigada por fazer parte deste dia!";
      return true;
    }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    $("[data-cd=d]", cd).textContent = String(d).padStart(2, "0");
    $("[data-cd=h]", cd).textContent = String(h).padStart(2, "0");
    $("[data-cd=m]", cd).textContent = String(m).padStart(2, "0");
    $("[data-cd=s]", cd).textContent = String(s).padStart(2, "0");
  }
  if (!tick()) { const iv = setInterval(() => { if (tick()) clearInterval(iv); }, 1000); }

  /* ---------- Agenda, mapa e WhatsApp ---------- */
  const loc = CFG.local || {};
  const q = encodeURIComponent(loc.busca || `${loc.endereco} ${loc.cidade}`);
  $("#mapFrame").src = `https://www.google.com/maps?q=${q}&output=embed`;
  $("#mapsLink").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  $("#wazeLink").href = `https://waze.com/ul?q=${q}&navigate=yes`;

  const end = new Date(eventDate.getTime() + (CFG.duracaoHoras || 6) * 3600e3);
  const fmtUTC = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const evTitle = `15 anos de ${CFG.nome}`;
  const evPlace = [loc.nome, loc.endereco, loc.cidade].filter(Boolean).join(", ");
  $("#gcalLink").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(evTitle)}&dates=${fmtUTC(eventDate)}/${fmtUTC(end)}` +
    `&location=${encodeURIComponent(evPlace)}&details=${encodeURIComponent(location.href.split("#")[0])}`;
  $("#icsBtn").addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Isabella15//PT-BR", "BEGIN:VEVENT",
      `UID:${Date.now()}@isabella15`, `DTSTAMP:${fmtUTC(new Date())}`,
      `DTSTART:${fmtUTC(eventDate)}`, `DTEND:${fmtUTC(end)}`,
      `SUMMARY:${evTitle}`, `LOCATION:${evPlace.replace(/,/g, "\\,")}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${evTitle}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "isabella-15-anos.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  const wa = (text) => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(text)}`;
  $("#waContact").href = wa(`Olá! Tenho uma dúvida sobre os 15 anos da ${CFG.nome}.`);

  // Paleta de cores do traje
  const sw = $("#swatches");
  const dc = CFG.dressCode || {};
  (dc.sugeridas || []).forEach((c) => { const i = document.createElement("i"); i.style.background = c; i.title = "Sugerida"; sw.appendChild(i); });
  if ((dc.evitar || []).length) { const sep = document.createElement("span"); sep.className = "sep"; sw.appendChild(sep); }
  (dc.evitar || []).forEach((c) => { const i = document.createElement("i"); i.style.background = c; i.className = "is-avoid"; i.title = "Evitar"; sw.appendChild(i); });

  /* ---------- Mural "Era uma vez" (fotos de bebê) ---------- */
  const babyWall = $("#babyWall");
  if (babyWall) {
    const total = Number(babyWall.dataset.total) || 0;
    const tilts = [-4, 3, -2, 5, -5, 2, -3, 4, -1, 3];
    for (let i = 1; i <= total; i++) {
      const n = String(i).padStart(2, "0");
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.style.setProperty("--r", tilts[(i - 1) % tilts.length] + "deg");
      fig.innerHTML = `<img src="assets/img/pequena/p${n}.jpg" alt="Isabella bebê — foto ${i}" loading="lazy" width="180" height="180">`;
      babyWall.appendChild(fig);
    }
  }

  /* ---------- Galeria + lightbox ---------- */
  const photos = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const gal = $("#gallery");
  photos.forEach((n, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Ampliar foto ${idx + 1}`);
    b.innerHTML = `<img src="assets/img/g${n}-t.jpg" alt="Ensaio de 15 anos da Isabella — foto ${idx + 1}" loading="lazy">`;
    b.addEventListener("click", () => openLb(idx));
    gal.appendChild(b);
  });
  const lb = $("#lightbox");
  const lbImg = $("#lightboxImg");
  let lbIdx = 0;
  function showLb() {
    lbImg.src = `assets/img/g${photos[lbIdx]}.jpg`;
    lbImg.alt = `Foto ${lbIdx + 1} de ${photos.length}`;
    $("#lightboxCount").textContent = `${lbIdx + 1} / ${photos.length}`;
  }
  function openLb(i) { lbIdx = i; showLb(); lb.showModal(); }
  const step = (d) => { lbIdx = (lbIdx + d + photos.length) % photos.length; showLb(); };
  $(".lightbox__nav--prev").addEventListener("click", () => step(-1));
  $(".lightbox__nav--next").addEventListener("click", () => step(1));
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  let tx = null;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  });
  $$("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));

  /* ---------- API (Google Apps Script) ---------- */
  async function apiGet() {
    const r = await fetch(`${API}?action=data&t=${Date.now()}`);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }
  async function apiPost(payload) {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita preflight CORS
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    if (!j.ok) throw new Error(j.erro || "Falha ao salvar");
    return j;
  }

  /* ---------- Pix (BR Code) ---------- */
  const clean = (s, max) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 .@+\-_]/g, "").trim().slice(0, max);
  const emv = (id, val) => id + String(val.length).padStart(2, "0") + val;
  function crc16(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }
  function pixPayload(amount, txid) {
    const p = CFG.pix || {};
    const key = pixKey(p.chave);
    let s = emv("00", "01") +
      emv("26", emv("00", "br.gov.bcb.pix") + emv("01", key)) +
      emv("52", "0000") + emv("53", "986") +
      (amount > 0 ? emv("54", Number(amount).toFixed(2)) : "") +
      emv("58", "BR") +
      emv("59", clean(p.recebedor, 25) || "Recebedor") +
      emv("60", clean(p.cidade, 15) || "Cidade") +
      emv("62", emv("05", (clean(txid, 25).replace(/[^A-Za-z0-9]/g, "") || "***"))) +
      "6304";
    return s + crc16(s);
  }

  $("#pixKeyText").textContent = (CFG.pix || {}).chave || "";
  $("#pixBankText").textContent = [(CFG.pix || {}).recebedor, (CFG.pix || {}).banco].filter(Boolean).join(" · ");
  $("#copyPixKey").addEventListener("click", (e) => copy(pixKey((CFG.pix || {}).chave), "Chave Pix copiada! Cole no app do seu banco.", e.currentTarget));

  /* ---------- Presentes físicos ---------- */
  const pf = CFG.presentesFisicos || {};
  $("#sizes").innerHTML = (pf.tamanhos || []).map((t) =>
    `<div class="size"><span class="size__item">${esc(t.item)}</span><strong class="size__val">${esc(t.tamanho)}</strong></div>`).join("");
  $("#suggestions").innerHTML = (pf.sugestoes || []).map((s) => `<li>${esc(s)}</li>`).join("");
  if (!(pf.tamanhos || []).length && !(pf.sugestoes || []).length) $("#physical").hidden = true;

  /* ---------- Lista de presentes ---------- */
  const ICONS = {
    experiencias: '<svg viewBox="0 0 48 48"><path d="M6 30 42 12l-6 24-10-6-6 8v-10l16-12"/></svg>',
    moda: '<svg viewBox="0 0 48 48"><path d="M24 6l5 9h-10l5-9Z"/><circle cx="24" cy="29" r="12"/><path d="M19 29a5 5 0 0 1 5-5"/></svg>',
    tecnologia: '<svg viewBox="0 0 48 48"><rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 37h6"/></svg>',
    casa: '<svg viewBox="0 0 48 48"><path d="M8 40V12c6-3 12-3 16 1 4-4 10-4 16-1v28c-6-3-12-3-16 1-4-4-10-4-16-1Z"/><path d="M24 13v27"/></svg>',
    cotas: '<svg viewBox="0 0 48 48"><rect x="7" y="18" width="34" height="23" rx="2"/><path d="M5 12h38v6H5zM24 12v29"/><path d="M24 12c-4-7-12-7-12-2s8 2 12 2c4 0 12 3 12-2s-8-5-12 2Z"/></svg>'
  };
  const CAT_LABEL = { experiencias: "Experiência", moda: "Moda & Beleza", tecnologia: "Tecnologia", casa: "Quarto & Livros", cotas: "Cota" };
  let giftCounts = DEMO ? store.get("demoGifts", {}) : {};

  function renderGifts() {
    const wrap = $("#gifts");
    const active = $(".chip.is-active").dataset.filter || "todos";
    wrap.innerHTML = "";
    (CFG.presentes || []).forEach((g) => {
      const qty = Math.max(1, Number(g.quantidade) || 1);
      const given = Number(giftCounts[g.id] || 0);
      const left = Math.max(0, qty - given);
      const done = left === 0;
      const isMulti = qty > 1 && qty < 999;
      const el = document.createElement("article");
      el.className = "gift" + (done ? " is-done" : "");
      el.dataset.cat = g.categoria;
      el.hidden = active !== "todos" && g.categoria !== active;
      el.innerHTML = `
        ${done ? '<span class="gift__badge">Presenteado</span>' : ""}
        <div class="gift__icon" aria-hidden="true">${ICONS[g.categoria] || ICONS.cotas}</div>
        <span class="gift__cat">${esc(CAT_LABEL[g.categoria] || "")}</span>
        <h3>${esc(g.nome)}</h3>
        <p>${esc(g.descricao || "")}</p>
        <div class="gift__price">${g.valor > 0 ? `<small>R$</small> ${brl(g.valor)}` : "Valor livre"}</div>
        ${isMulti ? `<div class="gift__stock">${done ? "Todas presenteadas" : `Restam ${left} de ${qty}`}</div>
          <div class="gift__bar"><i style="width:${Math.min(100, (given / qty) * 100)}%"></i></div>` : '<div class="gift__stock">&nbsp;</div>'}
        <button class="btn btn--navy btn--block" type="button" ${done ? "disabled" : ""}>${done ? "Presenteado 💙" : "Presentear"}</button>
        ${g.link ? `<a class="link-gold" style="margin-top:14px;color:var(--champagne-dark)" href="${esc(g.link)}" target="_blank" rel="noopener">Ver na loja</a>` : ""}
      `;
      $("button", el).addEventListener("click", () => openGift(g));
      wrap.appendChild(el);
    });
  }

  $$(".chip").forEach((c) => c.addEventListener("click", () => {
    $$(".chip").forEach((x) => { x.classList.toggle("is-active", x === c); x.setAttribute("aria-selected", String(x === c)); });
    const f = c.dataset.filter;
    $$("#gifts .gift").forEach((g) => { g.hidden = f !== "todos" && g.dataset.cat !== f; });
  }));

  /* Modal do presente */
  const modal = $("#giftModal");
  const amountField = $("#amountField");
  const amountInput = $("#amountInput");
  let currentGift = null;

  function updatePix() {
    const g = currentGift;
    const val = g.valor > 0 ? g.valor : Number(String(amountInput.value).replace(",", "."));
    const box = $(".pix", modal);
    const qr = $("#pixQr");
    qr.innerHTML = "";
    $("#giftModalPrice").innerHTML = g.valor > 0 ? `R$ ${brl(g.valor)}` : "";
    if (!(val > 0)) { box.classList.add("is-empty"); $("#pixCode").value = ""; return; }
    box.classList.remove("is-empty");
    const code = pixPayload(val, "ISA15" + g.id);
    $("#pixCode").value = code;
    if (window.QRCode) {
      new window.QRCode(qr, { text: code, width: 164, height: 164, colorDark: "#0b1628", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M });
    } else {
      qr.textContent = "QR indisponível — use o código ao lado.";
    }
  }

  function openGift(g) {
    currentGift = g;
    $("#giftModalTitle").textContent = g.nome;
    $("#giftModalDesc").textContent = g.descricao || "";
    amountField.hidden = g.valor > 0;
    amountInput.value = "";
    const f = $("#giftForm");
    f.reset();
    setStatus(f, "");
    $("button[type=submit]", f).disabled = false;
    updatePix();
    modal.showModal();
  }
  amountInput.addEventListener("input", updatePix);
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  $("#copyPixCode").addEventListener("click", (e) => {
    const v = $("#pixCode").value;
    if (v) copy(v, "Código Pix copiado! Agora cole no app do seu banco, na opção Pix Copia e Cola.", e.currentTarget);
    else { modal.appendChild($("#toast")); toast("Informe o valor do presente."); }
  });

  $("#giftForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (f.website.value) return;
    const nome = f.nome.value.trim();
    if (!nome) { markInvalid(f.nome); setStatus(f, "Informe seu nome, por favor.", "err"); return; }
    const g = currentGift;
    const valor = g.valor > 0 ? g.valor : Number(String(amountInput.value).replace(",", "."));
    if (!(valor > 0)) { setStatus(f, "Informe o valor do presente.", "err"); amountInput.focus(); return; }
    const btn = $("button[type=submit]", f);
    btn.disabled = true;
    setStatus(f, "Enviando…");
    const payload = { tipo: "presente", id: g.id, presente: g.nome, valor, nome, mensagem: f.mensagem.value.trim() };
    try {
      if (DEMO) {
        giftCounts[g.id] = (giftCounts[g.id] || 0) + 1;
        store.set("demoGifts", giftCounts);
        window.open(wa(`Olá! Acabei de presentear a ${CFG.apelido || CFG.nome} com "${g.nome}" (R$ ${brl(valor)}) via Pix. 💙\n— ${nome}${payload.mensagem ? `\n\n${payload.mensagem}` : ""}`), "_blank", "noopener");
      } else {
        await apiPost(payload);
        giftCounts[g.id] = (giftCounts[g.id] || 0) + 1;
      }
      renderGifts();
      setStatus(f, "Muito obrigada pelo carinho! 💙", "ok");
      setTimeout(() => modal.close(), 2200);
    } catch (err) {
      btn.disabled = false;
      setStatus(f, "Não foi possível registrar agora. Tente novamente em instantes.", "err");
    }
  });

  /* ---------- Utilidades de formulário ---------- */
  function setStatus(form, msg, kind) {
    const s = $(".form__status", form);
    s.textContent = msg;
    s.className = "form__status" + (kind ? " is-" + kind : "");
  }
  function markInvalid(input) {
    const f = input.closest(".field");
    f && f.classList.add("is-invalid");
    input.focus();
    input.addEventListener("input", () => f && f.classList.remove("is-invalid"), { once: true });
  }

  // Máscara de telefone
  const tel = $("#rsvpForm [name=telefone]");
  tel.addEventListener("input", () => {
    const d = tel.value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    tel.value = out;
  });

  /* ---------- Confirmação de presença ---------- */
  const rsvp = $("#rsvpForm");
  const toggleAttending = () => {
    const yes = rsvp.presenca.value === "Sim";
    $$("[data-if-attending]", rsvp).forEach((el) => el.classList.toggle("is-hidden", !yes));
  };
  $$("[name=presenca]", rsvp).forEach((r) => r.addEventListener("change", toggleAttending));

  rsvp.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (rsvp.website.value) return;
    const nome = rsvp.nome.value.trim();
    const telefone = rsvp.telefone.value.trim();
    if (!nome) { markInvalid(rsvp.nome); setStatus(rsvp, "Informe seu nome completo.", "err"); return; }
    if (telefone.replace(/\D/g, "").length < 10) { markInvalid(rsvp.telefone); setStatus(rsvp, "Informe um WhatsApp válido com DDD.", "err"); return; }

    const yes = rsvp.presenca.value === "Sim";
    const data = {
      tipo: "rsvp", nome, telefone, presenca: rsvp.presenca.value,
      adultos: yes ? rsvp.adultos.value : "0", criancas: yes ? rsvp.criancas.value : "0",
      acompanhantes: yes ? rsvp.acompanhantes.value.trim() : "",
      mensagem: rsvp.mensagem.value.trim()
    };
    const btn = $("button[type=submit]", rsvp);
    btn.disabled = true;
    setStatus(rsvp, "Enviando…");

    try {
      if (DEMO) {
        const lines = [
          `*Confirmação — 15 anos da ${CFG.nome}*`, "",
          `Nome: ${data.nome}`, `WhatsApp: ${data.telefone}`, `Presença: ${data.presenca}`
        ];
        if (yes) {
          lines.push(`Adultos: ${data.adultos}`, `Crianças: ${data.criancas}`);
          if (data.acompanhantes) lines.push(`Acompanhantes: ${data.acompanhantes}`);
        }
        if (data.mensagem) lines.push("", `Mensagem: ${data.mensagem}`);
        window.open(wa(lines.join("\n")), "_blank", "noopener");
      } else {
        await apiPost(data);
      }
      rsvp.innerHTML = yes
        ? `<div class="success"><p class="script">Obrigada!</p><h3>Presença confirmada, ${esc(nome.split(" ")[0])}</h3><p>Mal posso esperar para celebrar com você. Até lá! ✨</p></div>`
        : `<div class="success"><p class="script">Obrigada</p><h3>Sentiremos sua falta, ${esc(nome.split(" ")[0])}</h3><p>Agradecemos muito por avisar. Você estará no nosso coração.</p></div>`;
    } catch (err) {
      btn.disabled = false;
      setStatus(rsvp, "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.", "err");
    }
  });

  /* ---------- Recados ---------- */
  let recados = [];
  function renderMessages() {
    const box = $("#messages");
    if (!recados.length) { box.innerHTML = '<p class="messages__empty">Seja o primeiro a deixar um recado ✨</p>'; return; }
    box.innerHTML = recados.map((r) => `<blockquote class="message"><p>${esc(r.mensagem)}</p><cite>— ${esc(r.nome)}</cite></blockquote>`).join("");
  }

  $("#msgForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (f.website.value) return;
    const nome = f.nome.value.trim();
    const mensagem = f.mensagem.value.trim();
    if (!nome) { markInvalid(f.nome); setStatus(f, "Informe seu nome.", "err"); return; }
    if (mensagem.length < 3) { markInvalid(f.mensagem); setStatus(f, "Escreva seu recado.", "err"); return; }
    const btn = $("button[type=submit]", f);
    btn.disabled = true;
    setStatus(f, "Publicando…");
    try {
      if (DEMO) {
        const own = store.get("demoRecados", []);
        own.unshift({ nome, mensagem });
        store.set("demoRecados", own);
      } else {
        await apiPost({ tipo: "recado", nome, mensagem });
      }
      recados.unshift({ nome, mensagem });
      renderMessages();
      f.reset();
      setStatus(f, "Recado publicado com carinho! 💙", "ok");
    } catch (err) {
      setStatus(f, "Não foi possível publicar agora. Tente novamente.", "err");
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- Carregamento inicial ---------- */
  renderGifts();
  if (DEMO) {
    recados = store.get("demoRecados", []).concat(CFG.recadosExemplo || []);
    renderMessages();
  } else {
    renderMessages();
    apiGet().then((d) => {
      giftCounts = d.presentes || {};
      recados = d.recados || [];
      renderGifts();
      renderMessages();
    }).catch(() => {
      $("#messages").innerHTML = '<p class="messages__empty">Não foi possível carregar os recados agora.</p>';
    });
  }
})();
