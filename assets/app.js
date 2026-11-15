/* ============================================================================
   czwarta.eu — app.js
   Theme · mobile nav · search (kbd) · copy · scrollspy · diagram · ffmpeg
   builder · protocol recommender. Vanilla, no deps.
   ============================================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  var body = document.body;

  /* ----------------------------------------------------------------- THEME */
  var THEME_KEY = "czwarta-theme";
  function appliedTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    localStorage.setItem(THEME_KEY, t);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(t === "dark"));
      b.setAttribute("aria-label", t === "dark" ? "Przełącz na motyw jasny" : "Przełącz na motyw ciemny");
    });
  }
  // apply early to avoid flash
  setTheme(appliedTheme());
  // react to system changes only if user hasn't chosen
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem(THEME_KEY)) setTheme(e.matches ? "dark" : "light");
  });

  /* ----------------------------------------------------- delegated actions */
  document.addEventListener("click", function (e) {
    var themeBtn = e.target.closest("[data-theme-toggle]");
    if (themeBtn) {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      return;
    }
    var open = e.target.closest("[data-menu-open]");
    if (open) { body.classList.add("sidebar-open"); open.setAttribute("aria-expanded", "true"); return; }
    var close = e.target.closest("[data-menu-close]") || e.target.closest(".sidebar-overlay");
    if (close) {
      body.classList.remove("sidebar-open");
      var mo = document.querySelector("[data-menu-open]");
      if (mo) mo.setAttribute("aria-expanded", "false");
      return;
    }
  });

  /* ----------------------------------------------------- active nav + year */
  (function markNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var target = href.split("#")[0] || "index.html";
      if (target === here || (here === "" && target === "index.html")) a.classList.add("active");
    });
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  })();

  /* ----------------------------------------------------------- copy buttons */
  function addCopy(target, getText) {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "copy-btn";
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Kopiuj';
    btn.setAttribute("aria-label", "Kopiuj do schowka");
    btn.addEventListener("click", function () {
      var text = getText();
      var done = function () {
        btn.classList.add("copied");
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Skopiowano';
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Kopiuj';
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
    target.appendChild(btn);
  }
  document.querySelectorAll(".code-block").forEach(function (block) {
    var head = block.querySelector(".code-head");
    if (!head) return;
    var code = block.querySelector("code");
    addCopy(head, function () { return code ? code.innerText : block.innerText; });
  });

  /* --------------------------------------------------------------- search */
  var SEARCH = [
    { t: "ONVIF", p: "protocols.html#onvif", k: "standard kamery ip discover ptz profile" },
    { t: "RTSP / RTP", p: "protocols.html#rtsp", k: "strumien rtsp rtp 554 kamera real time" },
    { t: "RTMP / HLS / WebRTC", p: "protocols.html#browser", k: "przegladarka hls rtmp webrtc latency player" },
    { t: "SIP", p: "protocols.html#sip", k: "domofon audio dwukierunkowy sesja voip" },
    { t: "Konwerter protokołów", p: "protocols.html#recommender", k: "jaki protokol wybrac rekomendacja" },
    { t: "ZoneMinder", p: "oss.html#zoneminder", k: "vms linux nvr php open source" },
    { t: "Shinobi", p: "oss.html#shinobi", k: "nodejs nvr hls lekki" },
    { t: "Frigate", p: "oss.html#frigate", k: "ai detection tensorflow mqtt home assistant" },
    { t: "Motion / MotionEye", p: "oss.html#motion", k: "raspberry pi motion detection webcam" },
    { t: "Porównanie OSS", p: "oss.html#compare", k: "tabela porownanie nvr vms" },
    { t: "Architektura DIY", p: "architecture.html#pipeline", k: "pipeline kamery serwer nvr detekcja powiadomienia archiwum" },
    { t: "Klikalny diagram", p: "architecture.html#pipeline", k: "interaktywny diagram wezly" },
    { t: "Przechwytywanie klatki (Python)", p: "libraries.html#python", k: "opencv cv2 videocapture rtsp klatka frame jpg" },
    { t: "Builder komend ffmpeg", p: "libraries.html#builder", k: "ffmpeg generator hls mp4 snapshot rtsp" },
    { t: "Biblioteki Python", p: "libraries.html#python", k: "opencv onvif-zeep imutils flask fastapi" },
    { t: "JavaScript / Node.js", p: "libraries.html#node", k: "node-rtsp-stream ffmpeg-static mqtt websocket" },
    { t: "Go", p: "libraries.html#go", k: "gortsplib proxy rtsp serwer" },
    { t: "Infra / DevOps", p: "libraries.html#devops", k: "ffmpeg docker nginx rtmp prometheus grafana" },
    { t: "Home Assistant", p: "integration.html#home-assistant", k: "automatyka domowa ha camera" },
    { t: "Node-RED", p: "integration.html#node-red", k: "flow wizualny mqtt automatyzacja" },
    { t: "Akceleratory AI", p: "integration.html#ai", k: "coral tpu intel ncs jetson edge" },
    { t: "MQTT", p: "integration.html#mqtt", k: "broker pub sub iot telemetry" },
    { t: "Zasoby i dokumentacja", p: "resources.html", k: "linki docs onvif ffmpeg opencv" },
    { t: "Strona główna", p: "index.html", k: "start overview monitoring wizyjny" }
  ];

  var searchBox = document.querySelector("[data-search]");
  if (searchBox) {
    var input = searchBox.querySelector(".search-input");
    var results = searchBox.querySelector(".search-results");
    var items = [];
    var activeIdx = -1;

    function score(entry, q) {
      var hay = (entry.t + " " + entry.k).toLowerCase();
      if (!q) return 0;
      if (entry.t.toLowerCase().indexOf(q) === 0) return 100;
      if (entry.t.toLowerCase().indexOf(q) > -1) return 80;
      if (entry.k.indexOf(q) > -1) return 60;
      if (hay.indexOf(q) > -1) return 40;
      // word-boundary token match
      var tokens = q.split(/\s+/);
      var hits = 0;
      tokens.forEach(function (tok) { if (tok && hay.indexOf(tok) > -1) hits++; });
      return hits ? 20 + hits * 5 : 0;
    }
    function render(q) {
      q = (q || "").trim().toLowerCase();
      results.innerHTML = "";
      items = [];
      if (!q) { searchBox.classList.remove("open"); return; }
      var ranked = SEARCH.map(function (e) { return { e: e, s: score(e, q) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 8);
      if (!ranked.length) {
        results.innerHTML = '<div class="sr-empty">Brak wyników dla „' + q.replace(/</g, "&lt;") + "”</div>";
        searchBox.classList.add("open");
        return;
      }
      ranked.forEach(function (x, i) {
        var a = document.createElement("a");
        a.className = "sr-item" + (i === 0 ? " active" : "");
        a.href = "./" + x.e.p;
        a.innerHTML = '<span class="sr-title">' + x.e.t + "</span>" +
          '<span class="sr-path">' + x.e.p + "</span>";
        a.addEventListener("mouseenter", function () { setActive(i); });
        results.appendChild(a);
        items.push(a);
      });
      activeIdx = 0;
      searchBox.classList.add("open");
    }
    function setActive(i) {
      activeIdx = i;
      items.forEach(function (el, idx) { el.classList.toggle("active", idx === i); });
      if (items[i]) items[i].scrollIntoView({ block: "nearest" });
    }
    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("focus", function () { if (input.value) render(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); if (items.length) setActive(Math.min(activeIdx + 1, items.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (items.length) setActive(Math.max(activeIdx - 1, 0)); }
      else if (e.key === "Enter") {
        if (items[activeIdx]) { e.preventDefault(); window.location.href = items[activeIdx].href; }
      } else if (e.key === "Escape") { input.blur(); searchBox.classList.remove("open"); }
    });
    document.addEventListener("click", function (e) {
      if (!searchBox.contains(e.target)) searchBox.classList.remove("open");
    });
  }

  /* ------------------------------------------------------------- scrollspy */
  (function scrollspy() {
    var toc = document.querySelector("[data-toc]");
    if (!toc) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll("a"));
    var byId = {};
    links.forEach(function (l) {
      var id = l.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) byId[id] = { link: l, sec: sec };
    });
    var ids = Object.keys(byId);
    if (!ids.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id;
        if (!byId[id]) return;
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          byId[id].link.classList.add("active");
        }
      });
    }, { rootMargin: "-" + (parseInt(getComputedStyle(root).getPropertyValue("--topbar-h")) || 58) + "px 0px -70% 0px", threshold: 0 });
    ids.forEach(function (id) { obs.observe(byId[id].sec); });
  })();

  /* -------------------------------------------------------- diagram clicks */
  (function diagram() {
    var nodes = document.querySelectorAll("[data-node]");
    if (!nodes.length) return;
    var panels = document.querySelectorAll(".dd-panel");
    function show(id) {
      nodes.forEach(function (n) { n.classList.toggle("active", n.getAttribute("data-node") === id); });
      panels.forEach(function (p) { p.classList.toggle("show", p.getAttribute("data-panel") === id); });
      var detail = document.querySelector(".diagram-detail");
      if (detail) detail.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    nodes.forEach(function (n) {
      n.addEventListener("click", function () { show(n.getAttribute("data-node")); });
      n.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(n.getAttribute("data-node")); } });
      if (!n.getAttribute("tabindex")) n.setAttribute("tabindex", "0");
    });
    show(nodes[0].getAttribute("data-node"));
  })();

  /* --------------------------------------------------- ffmpeg command builder */
  (function builder() {
    var b = document.querySelector("[data-builder]");
    if (!b) return;
    var urlEl = b.querySelector("[name=url]");
    var modeEl = b.querySelector("[name=mode]");
    var segEl = b.querySelector("[name=seg]");
    var resEl = b.querySelector("[name=res]");
    var out = b.querySelector("[data-output]");
    var copyHost = b.querySelector("[data-output-copy]");

    function esc(s) { return s; }
    function build() {
      var url = (urlEl.value || "").trim() || "rtsp://user:pass@192.168.1.10:554/stream1";
      var mode = modeEl.value;
      var seg = parseInt(segEl.value, 10) || 4;
      var res = resEl.value;
      var vf = res ? " -vf scale=-2:" + res : "";
      var enc = res ? " -c:v libx264 -preset veryfast -g 60" : " -c:v copy";
      var cmd;
      if (mode === "snapshot") {
        cmd = "ffmpeg -y -rtsp_transport tcp -i \"" + url + "\" \\\n  -frames:v 1 -q:v 2 snapshot.jpg";
      } else if (mode === "hls") {
        cmd = "ffmpeg -rtsp_transport tcp -i \"" + url + "\"" + vf + enc + " -c:a aac \\\n  -f hls -hls_time " + seg + " -hls_list_size 4 \\\n  -hls_flags delete_segments+append_list stream.m3u8";
      } else if (mode === "mp4") {
        cmd = "ffmpeg -rtsp_transport tcp -i \"" + url + "\" -c:v copy -c:a copy \\\n  -f segment -segment_time " + (seg * 60) + " -reset_timestamps 1 \\\n  -strftime 1 \"rec_%Y%m%d_%H%M%S.mp4\"";
      } else if (mode === "png") {
        cmd = "ffmpeg -rtsp_transport tcp -i \"" + url + "\"" + vf + " \\\n  -vf fps=1 -frames:v 1 frame_%03d.png";
      } else if (mode === "webrtc") {
        cmd = "# RTSP -> WHIP (WebRTC) przez mediamtx / MediaMTX proxy\nmediamtx\n# oraz oddzielnie, transkoduj do WHIP:\nffmpeg -rtsp_transport tcp -i \"" + url + "\"" + vf + " -c:v libx264 -preset ultrafast -tune zerolatency \\\n  -g 20 -keyint_min 20 -c:a libopus -f webrtc \"http://localhost:8889/mystream/whip.sdp\"";
      } else {
        cmd = "ffmpeg -i \"" + url + "\"";
      }
      out.textContent = cmd;
    }
    [urlEl, modeEl, segEl, resEl].forEach(function (el) {
      el.addEventListener("input", build); el.addEventListener("change", build);
    });
    // mode visibility for segment/resolution fields
    function syncFields() {
      var mode = modeEl.value;
      var segRow = b.querySelector("[data-field-seg]");
      var resRow = b.querySelector("[data-field-res]");
      if (segRow) segRow.style.display = (mode === "hls" || mode === "mp4") ? "" : "none";
      if (resRow) resRow.style.display = (mode === "hls" || mode === "webrtc" || mode === "png") ? "" : "none";
      build();
    }
    modeEl.addEventListener("change", syncFields);
    syncFields();
    if (copyHost) addCopy(copyHost, function () { return out.textContent; });
  })();

  /* ----------------------------------------------- protocol recommender */
  (function recommender() {
    var r = document.querySelector("[data-recommender]");
    if (!r) return;
    var chips = r.querySelectorAll("[data-reco]");
    var result = r.querySelector("[data-reco-result]");
    var data = {
      browser: { name: "HLS (z fallbackiem na WebRTC)", why: "Najszersza kompatybilność przeglądarek, odtwarzanie przez hls.js, ~2–5 s opóźnienia. WebRTC gdy potrzebujesz <500 ms." },
      latency: { name: "WebRTC (WHIP/WHEP)", why: "Opóźnienie poniżej 500 ms, dwukierunkowe. Wymaga serwera SFU (mediamtx, Janus, LiveKit) — RTSP nie działa w przeglądarce bezpośrednio." },
      record: { name: "RTSP → MP4/segmenty przez ffmpeg", why: "Stabilne nagrywanie 24/7, kopiowanie strumienia (-c copy) bez reencodowania, segmentacja plikami po czasie." },
      audio: { name: "SIP (+ RTP)", why: "Dwukierunkowe audio w domofonach i bramkach. Zestawia sesję między urządzeniami, integruje się z softphone'ami." },
      snapshot: { name: "RTSP + ffmpeg -frames:v 1", why: "Najprostsze pobranie pojedynczej klatki (jpg/png) do analizy, miniatur, powiadomień — bez utrzymywania strumienia." },
      discovery: { name: "ONVIF", why: "Standard odkrywania i konfiguracji kamer IP (PTZ, profile, zdarzenia) — niezależny od producenta." }
    };
    function pick(key) {
      chips.forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-reco") === key); });
      var d = data[key];
      result.innerHTML = '<div class="reco-name">' + d.name + "</div><p class=\"reco-why\">" + d.why + "</p>";
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { pick(c.getAttribute("data-reco")); }); });
    pick(chips[0].getAttribute("data-reco"));
  })();

  /* ---------------------------------------------------- keyboard shortcuts */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
    if (typing) return;
    if (e.key === "/" && searchBox) {
      e.preventDefault();
      var inp = searchBox.querySelector(".search-input");
      inp.focus(); inp.select();
    } else if (e.key.toLowerCase() === "t") {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    } else if (e.key === "Escape" && body.classList.contains("sidebar-open")) {
      body.classList.remove("sidebar-open");
    }
  });

  /* -------------------------------------------------- progressive reveal */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
  }
})();
