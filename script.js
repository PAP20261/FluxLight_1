/* ═══════════════════════════════════════════════════════════════
   FluxLight — script.js  v2.0  FINAL
   ═══════════════════════════════════════════════════════════════
   ⚙️  CONFIGURAÇÃO — alterar aqui
   ─────────────────────────────────────────────────────────────── */

// ❗ IP do ESP32 (ver no Serial Monitor após gravar)
const ESP32_IP = "http://192.168.1.115";

// ❗ IPs das 5 lâmpadas Shelly RGBW E27
const SHELLY_IPS = [
  "192.168.1.101",   // Lâmpada 1
  "192.168.1.102",   // Lâmpada 2
  "192.168.1.103",   // Lâmpada 3
  "192.168.1.104",   // Lâmpada 4
  "192.168.1.105",   // Lâmpada 5
];

/* ═══════════════════════════════════════════════════════════════
   TRADUÇÕES — 5 LÍNGUAS
   ═══════════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  pt: {
    nav_dashboard:"Dashboard", nav_strip:"Fita LED", nav_bulbs:"Lâmpadas",
    nav_effects:"Efeitos", nav_flags:"Bandeiras", nav_settings:"Definições", nav_about:"Sobre",
    stat_strip:"Fita LED", stat_bulbs:"Lâmpadas", stat_effect:"Efeito", stat_flag:"Bandeira",
    quick_ctrl:"Controlo Rápido", scenes:"Cenas Rápidas",
    scene_relax:"Relaxar", scene_focus:"Foco", scene_party:"Festa", scene_night:"Noite",
    flags_quick_sub:"9 bandeiras animadas",
    strip_title:"Fita LED WS2812B", color:"Cor", brightness:"Brilho",
    all_bulbs:"Todas as Lâmpadas", all_bulbs_sub:"Controlo global · 5 × Shelly RGBW",
    bulb_label:"Lâmpada", on:"ON", off:"OFF",
    effects_title:"Efeitos Dinâmicos",
    effects_desc:"Seleciona um efeito para a Fita LED. Os efeitos correm no ESP32.",
    fx_rainbow:"Ciclo de cores contínuo", fx_disco:"Cores aleatórias rápidas",
    fx_fire:"Simulação de chama real", fx_pulse:"Pulsação suave",
    fx_wave:"Onda percorrendo a fita", fx_fade:"Transição suave de cores",
    fx_sparkle:"Faíscas aleatórias", fx_meteor:"Meteoro de luz",
    stop_effect:"Parar Efeito",
    flags_title:"Bandeiras em LED", flags_desc:"Escolhe uma bandeira para a fita LED animar com as cores nacionais em onda contínua.",
    flag_pt:"Portugal", flag_br:"Brasil", flag_es:"Espanha", flag_fr:"França",
    flag_de:"Alemanha", flag_it:"Itália", flag_gb:"Reino Unido", flag_us:"EUA", flag_jp:"Japão",
    stop_flag:"Parar Bandeira",
    settings_title:"Configuração", wifi:"Rede Wi-Fi", wifi_ssid:"SSID (Nome da rede)",
    wifi_pass:"Password", esp_ip:"IP do ESP32", edit:"Editar",
    bulb_ips:"IPs das Lâmpadas Shelly", esp_config:"Configuração Hardware",
    num_leds:"Número de LEDs", gpio:"GPIO da fita LED", edit_in:"Alterar em",
    about_tagline:"Sistema de Iluminação Inteligente",
    pap_title:"Prova de Aptidão Profissional", school:"Escola", course:"Curso", year:"Ano Letivo",
    team_title:"Equipa", student:"Aluno", teacher:"Professor Orientador",
    hardware_title:"Hardware", hw_mcu:"Microcontrolador", hw_strip:"Fita LED endereçável",
    hw_psu:"Alimentação", hw_shelly:"Lâmpadas inteligentes Wi-Fi",
    sw_title:"Tecnologias",
    school_sub:"Cofinanciado pela União Europeia · Portugal 2030",
    copyright_sub:"Todos os direitos reservados · PAP · TGEI",
    connecting:"A ligar...", connected:"Ligado", disconnected:"ESP32 inacessível",
    splash_msgs:["A iniciar o sistema...","A ligar ao ESP32...","A carregar interface...","Pronto!"],
  },
  en: {
    nav_dashboard:"Dashboard", nav_strip:"LED Strip", nav_bulbs:"Bulbs",
    nav_effects:"Effects", nav_flags:"Flags", nav_settings:"Settings", nav_about:"About",
    stat_strip:"LED Strip", stat_bulbs:"Bulbs", stat_effect:"Effect", stat_flag:"Flag",
    quick_ctrl:"Quick Control", scenes:"Quick Scenes",
    scene_relax:"Relax", scene_focus:"Focus", scene_party:"Party", scene_night:"Night",
    flags_quick_sub:"9 animated flags",
    strip_title:"WS2812B LED Strip", color:"Color", brightness:"Brightness",
    all_bulbs:"All Bulbs", all_bulbs_sub:"Global control · 5 × Shelly RGBW",
    bulb_label:"Bulb", on:"ON", off:"OFF",
    effects_title:"Dynamic Effects",
    effects_desc:"Select an effect for the LED Strip. Effects run on the ESP32.",
    fx_rainbow:"Continuous color cycle", fx_disco:"Fast random colors",
    fx_fire:"Real flame simulation", fx_pulse:"Smooth pulsing",
    fx_wave:"Wave across the strip", fx_fade:"Smooth color transition",
    fx_sparkle:"Random sparkles", fx_meteor:"Light meteor",
    stop_effect:"Stop Effect",
    flags_title:"Flags on LED", flags_desc:"Choose a flag to animate the LED strip with national colors in a continuous wave.",
    flag_pt:"Portugal", flag_br:"Brazil", flag_es:"Spain", flag_fr:"France",
    flag_de:"Germany", flag_it:"Italy", flag_gb:"United Kingdom", flag_us:"USA", flag_jp:"Japan",
    stop_flag:"Stop Flag",
    settings_title:"Settings", wifi:"Wi-Fi Network", wifi_ssid:"SSID (Network name)",
    wifi_pass:"Password", esp_ip:"ESP32 IP", edit:"Edit",
    bulb_ips:"Shelly Bulb IPs", esp_config:"Hardware Configuration",
    num_leds:"Number of LEDs", gpio:"LED strip GPIO", edit_in:"Edit in",
    about_tagline:"Smart Lighting System",
    pap_title:"Professional Aptitude Test (PAP)", school:"School", course:"Course", year:"School Year",
    team_title:"Team", student:"Student", teacher:"Supervising Teacher",
    hardware_title:"Hardware", hw_mcu:"Microcontroller", hw_strip:"Addressable LED strip",
    hw_psu:"Power supply", hw_shelly:"Smart Wi-Fi bulbs",
    sw_title:"Technologies",
    school_sub:"Co-funded by the European Union · Portugal 2030",
    copyright_sub:"All rights reserved · PAP · TGEI",
    connecting:"Connecting...", connected:"Connected", disconnected:"ESP32 unreachable",
    splash_msgs:["Starting system...","Connecting to ESP32...","Loading interface...","Ready!"],
  },
  de: {
    nav_dashboard:"Dashboard", nav_strip:"LED-Streifen", nav_bulbs:"Lampen",
    nav_effects:"Effekte", nav_flags:"Flaggen", nav_settings:"Einstellungen", nav_about:"Über",
    stat_strip:"LED-Streifen", stat_bulbs:"Lampen", stat_effect:"Effekt", stat_flag:"Flagge",
    quick_ctrl:"Schnellsteuerung", scenes:"Schnellszenen",
    scene_relax:"Entspannen", scene_focus:"Fokus", scene_party:"Party", scene_night:"Nacht",
    flags_quick_sub:"9 animierte Flaggen",
    strip_title:"WS2812B LED-Streifen", color:"Farbe", brightness:"Helligkeit",
    all_bulbs:"Alle Lampen", all_bulbs_sub:"Globale Steuerung · 5 × Shelly RGBW",
    bulb_label:"Lampe", on:"EIN", off:"AUS",
    effects_title:"Dynamische Effekte",
    effects_desc:"Wähle einen Effekt für den LED-Streifen. Effekte laufen auf dem ESP32.",
    fx_rainbow:"Kontinuierlicher Farbzyklus", fx_disco:"Schnelle Zufallsfarben",
    fx_fire:"Echte Flammensimulation", fx_pulse:"Sanftes Pulsieren",
    fx_wave:"Welle über den Streifen", fx_fade:"Sanfter Farbübergang",
    fx_sparkle:"Zufällige Funken", fx_meteor:"Lichtmeteor",
    stop_effect:"Effekt stoppen",
    flags_title:"Flaggen auf LED", flags_desc:"Wähle eine Flagge für den LED-Streifen.",
    flag_pt:"Portugal", flag_br:"Brasilien", flag_es:"Spanien", flag_fr:"Frankreich",
    flag_de:"Deutschland", flag_it:"Italien", flag_gb:"Vereinigtes Königreich", flag_us:"USA", flag_jp:"Japan",
    stop_flag:"Flagge stoppen",
    settings_title:"Einstellungen", wifi:"WLAN-Netzwerk", wifi_ssid:"SSID (Netzwerkname)",
    wifi_pass:"Passwort", esp_ip:"ESP32-IP", edit:"Bearbeiten",
    bulb_ips:"Shelly Lampen IPs", esp_config:"Hardware-Konfiguration",
    num_leds:"Anzahl LEDs", gpio:"LED-Streifen GPIO", edit_in:"Bearbeiten in",
    about_tagline:"Intelligentes Beleuchtungssystem",
    pap_title:"Berufseignungstest (PAP)", school:"Schule", course:"Kurs", year:"Schuljahr",
    team_title:"Team", student:"Schüler", teacher:"Betreuungslehrer",
    hardware_title:"Hardware", hw_mcu:"Mikrocontroller", hw_strip:"Adressierbarer LED-Streifen",
    hw_psu:"Netzteil", hw_shelly:"Intelligente WLAN-Lampen",
    sw_title:"Technologien",
    school_sub:"Mitfinanziert von der EU · Portugal 2030",
    copyright_sub:"Alle Rechte vorbehalten · PAP · TGEI",
    connecting:"Verbinde...", connected:"Verbunden", disconnected:"ESP32 nicht erreichbar",
    splash_msgs:["System wird gestartet...","Verbinde mit ESP32...","Interface wird geladen...","Bereit!"],
  },
  fr: {
    nav_dashboard:"Tableau de bord", nav_strip:"Bandeau LED", nav_bulbs:"Ampoules",
    nav_effects:"Effets", nav_flags:"Drapeaux", nav_settings:"Paramètres", nav_about:"À propos",
    stat_strip:"Bandeau LED", stat_bulbs:"Ampoules", stat_effect:"Effet", stat_flag:"Drapeau",
    quick_ctrl:"Contrôle Rapide", scenes:"Scènes Rapides",
    scene_relax:"Détente", scene_focus:"Concentration", scene_party:"Fête", scene_night:"Nuit",
    flags_quick_sub:"9 drapeaux animés",
    strip_title:"Bandeau LED WS2812B", color:"Couleur", brightness:"Luminosité",
    all_bulbs:"Toutes les Ampoules", all_bulbs_sub:"Contrôle global · 5 × Shelly RGBW",
    bulb_label:"Ampoule", on:"ON", off:"OFF",
    effects_title:"Effets Dynamiques",
    effects_desc:"Sélectionnez un effet pour le bandeau LED. Les effets s'exécutent sur l'ESP32.",
    fx_rainbow:"Cycle de couleurs continu", fx_disco:"Couleurs aléatoires rapides",
    fx_fire:"Simulation de flamme réelle", fx_pulse:"Pulsation douce",
    fx_wave:"Vague traversant le bandeau", fx_fade:"Transition douce des couleurs",
    fx_sparkle:"Étincelles aléatoires", fx_meteor:"Météore lumineux",
    stop_effect:"Arrêter l'effet",
    flags_title:"Drapeaux sur LED", flags_desc:"Choisissez un drapeau pour animer le bandeau LED.",
    flag_pt:"Portugal", flag_br:"Brésil", flag_es:"Espagne", flag_fr:"France",
    flag_de:"Allemagne", flag_it:"Italie", flag_gb:"Royaume-Uni", flag_us:"États-Unis", flag_jp:"Japon",
    stop_flag:"Arrêter le drapeau",
    settings_title:"Paramètres", wifi:"Réseau Wi-Fi", wifi_ssid:"SSID (Nom du réseau)",
    wifi_pass:"Mot de passe", esp_ip:"IP de l'ESP32", edit:"Modifier",
    bulb_ips:"IPs des ampoules Shelly", esp_config:"Configuration matérielle",
    num_leds:"Nombre de LEDs", gpio:"GPIO du bandeau LED", edit_in:"Modifier dans",
    about_tagline:"Système d'éclairage intelligent",
    pap_title:"Épreuve d'Aptitude Professionnelle", school:"École", course:"Cours", year:"Année scolaire",
    team_title:"Équipe", student:"Élève", teacher:"Professeur superviseur",
    hardware_title:"Matériel", hw_mcu:"Microcontrôleur", hw_strip:"Bandeau LED adressable",
    hw_psu:"Alimentation", hw_shelly:"Ampoules intelligentes Wi-Fi",
    sw_title:"Technologies",
    school_sub:"Cofinancé par l'Union Européenne · Portugal 2030",
    copyright_sub:"Tous droits réservés · PAP · TGEI",
    connecting:"Connexion...", connected:"Connecté", disconnected:"ESP32 inaccessible",
    splash_msgs:["Démarrage du système...","Connexion à l'ESP32...","Chargement...","Prêt!"],
  },
  es: {
    nav_dashboard:"Panel", nav_strip:"Tira LED", nav_bulbs:"Bombillas",
    nav_effects:"Efectos", nav_flags:"Banderas", nav_settings:"Ajustes", nav_about:"Acerca de",
    stat_strip:"Tira LED", stat_bulbs:"Bombillas", stat_effect:"Efecto", stat_flag:"Bandera",
    quick_ctrl:"Control Rápido", scenes:"Escenas Rápidas",
    scene_relax:"Relajar", scene_focus:"Foco", scene_party:"Fiesta", scene_night:"Noche",
    flags_quick_sub:"9 banderas animadas",
    strip_title:"Tira LED WS2812B", color:"Color", brightness:"Brillo",
    all_bulbs:"Todas las Bombillas", all_bulbs_sub:"Control global · 5 × Shelly RGBW",
    bulb_label:"Bombilla", on:"ON", off:"OFF",
    effects_title:"Efectos Dinámicos",
    effects_desc:"Selecciona un efecto para la Tira LED. Los efectos se ejecutan en el ESP32.",
    fx_rainbow:"Ciclo de colores continuo", fx_disco:"Colores aleatorios rápidos",
    fx_fire:"Simulación de llama real", fx_pulse:"Pulsación suave",
    fx_wave:"Ola recorriendo la tira", fx_fade:"Transición suave de colores",
    fx_sparkle:"Chispas aleatorias", fx_meteor:"Meteoro de luz",
    stop_effect:"Detener Efecto",
    flags_title:"Banderas en LED", flags_desc:"Elige una bandera para animar la tira LED.",
    flag_pt:"Portugal", flag_br:"Brasil", flag_es:"España", flag_fr:"Francia",
    flag_de:"Alemania", flag_it:"Italia", flag_gb:"Reino Unido", flag_us:"EE.UU.", flag_jp:"Japón",
    stop_flag:"Detener Bandera",
    settings_title:"Ajustes", wifi:"Red Wi-Fi", wifi_ssid:"SSID (Nombre de red)",
    wifi_pass:"Contraseña", esp_ip:"IP del ESP32", edit:"Editar",
    bulb_ips:"IPs de las bombillas Shelly", esp_config:"Configuración de hardware",
    num_leds:"Número de LEDs", gpio:"GPIO de la tira LED", edit_in:"Editar en",
    about_tagline:"Sistema de Iluminación Inteligente",
    pap_title:"Prueba de Aptitud Profesional", school:"Escuela", course:"Curso", year:"Año escolar",
    team_title:"Equipo", student:"Alumno", teacher:"Profesor supervisor",
    hardware_title:"Hardware", hw_mcu:"Microcontrolador", hw_strip:"Tira LED direccionable",
    hw_psu:"Fuente de alimentación", hw_shelly:"Bombillas inteligentes Wi-Fi",
    sw_title:"Tecnologías",
    school_sub:"Cofinanciado por la Unión Europea · Portugal 2030",
    copyright_sub:"Todos los derechos reservados · PAP · TGEI",
    connecting:"Conectando...", connected:"Conectado", disconnected:"ESP32 inaccesible",
    splash_msgs:["Iniciando sistema...","Conectando al ESP32...","Cargando interfaz...","¡Listo!"],
  },
};

/* ═══════════════════════════════════════════════════════════════
   ESTADO DA APLICAÇÃO
   ═══════════════════════════════════════════════════════════════ */
const state = {
  lang:       "pt",
  led:        { on: false, color: "#ff6a00", brightness: 200 },
  bulbs:      SHELLY_IPS.map(() => ({ on: false, color: "#ffffff", brightness: 100 })),
  effect:     null,
  flag:       null,
  master:     false,
  esp32Ok:    false,
};

const HTTP_TIMEOUT = 4000;

/* ═══════════════════════════════════════════════════════════════
   SPLASH SCREEN
   ═══════════════════════════════════════════════════════════════ */
function initSplash() {
  const canvas  = document.getElementById("splashCanvas");
  const bar     = document.getElementById("splashBar");
  const msgEl   = document.getElementById("splashMsg");
  const splash  = document.getElementById("splash");

  if (!canvas) return;

  // Canvas partículas
  const ctx = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.6 + 0.1,
    hue: Math.random() * 40 + 20, // 20–60 → laranja/amarelo
  }));

  let animId;
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // Barra de progresso + mensagens
  const msgs = TRANSLATIONS[state.lang].splash_msgs || ["A carregar...","","","Pronto!"];
  const steps = [
    { pct: 20,  msg: msgs[0], delay: 200 },
    { pct: 55,  msg: msgs[1], delay: 900 },
    { pct: 85,  msg: msgs[2], delay: 1700 },
    { pct: 100, msg: msgs[3], delay: 2400 },
  ];

  steps.forEach(s => {
    setTimeout(() => {
      bar.style.width = s.pct + "%";
      if (msgEl) msgEl.textContent = s.msg;
    }, s.delay);
  });

  // Fechar splash
  setTimeout(() => {
    cancelAnimationFrame(animId);
    splash.classList.add("hidden");
    setTimeout(() => splash.remove(), 900);
  }, 3200);
}

/* ═══════════════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initSplash();
  buildBulbCards();
  buildShellyIpFields();
  syncUI();
  applyTranslations();

  setTimeout(() => {
    checkConnection();
    if (window.lucide) lucide.createIcons();
  }, 3400);

  setInterval(checkConnection, 15000);
});

/* ═══════════════════════════════════════════════════════════════
   COMUNICAÇÃO HTTP COM ESP32
   ═══════════════════════════════════════════════════════════════ */
async function esp32Request(endpoint, desc = "") {
  const url = `${ESP32_IP}${endpoint}`;
  try {
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT);
    const res   = await fetch(url, { method:"GET", signal:ctrl.signal, mode:"cors" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (desc) showToast(`✅ ${desc}`, "success");
    setConnectionStatus(true);
    return true;
  } catch (err) {
    const msg = err.name === "AbortError" ? "Timeout" : err.message;
    if (desc) showToast(`❌ ${msg}`, "error");
    setConnectionStatus(false);
    return false;
  }
}

async function checkConnection() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${ESP32_IP}/status`, { method:"GET", signal:ctrl.signal, mode:"cors" });
    setConnectionStatus(res.ok || res.status === 404);
  } catch { setConnectionStatus(false); }
}

/* ═══════════════════════════════════════════════════════════════
   FITA LED WS2812B
   ═══════════════════════════════════════════════════════════════ */
async function toggleLED(isOn) {
  state.led.on = isOn;
  await esp32Request(isOn ? "/led/on" : "/led/off",
    isOn ? t("stat_strip") + " ON" : t("stat_strip") + " OFF");
  syncUI();
}

async function applyLEDColor() {
  const hex = document.getElementById("ledColor").value;
  const { r, g, b } = hexToRGB(hex);
  state.led.color = hex;
  updateColorBars();
  await esp32Request(`/led/color?r=${r}&g=${g}&b=${b}`);
}

async function applyLEDBrightness(value) {
  state.led.brightness = parseInt(value);
  await esp32Request(`/led/brightness?value=${value}`);
}

/* ═══════════════════════════════════════════════════════════════
   LÂMPADAS SHELLY — 5 INDIVIDUAIS
   ═══════════════════════════════════════════════════════════════ */

/** Gera os cards das 5 lâmpadas dinamicamente */
function buildBulbCards() {
  const container = document.getElementById("bulbsContainer");
  if (!container) return;

  container.innerHTML = SHELLY_IPS.map((ip, i) => {
    const n = i + 1;
    const label = t("bulb_label");
    return `
    <div class="control-card" id="bulbCard${n}">
      <div class="control-card-header">
        <div class="device-info">
          <div class="device-icon bulb-led" id="bulbIcon${n}"><i data-lucide="lightbulb"></i></div>
          <div>
            <strong>${label} ${n}</strong>
            <small id="bulbIpLabel${n}">${ip}</small>
          </div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" id="bulb${n}Toggle" onchange="toggleBulb(${n}, this.checked)" />
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="color-preview-bar" id="bulb${n}ColorBar"></div>
      <div class="control-section">
        <label class="ctrl-label" data-i18n="color">${t("color")}</label>
        <div class="color-row">
          <input type="color" class="color-wheel" id="bulb${n}Color" value="#ffffff" oninput="applyBulbColor(${n})" />
          <div class="color-swatches">
            <button class="swatch" style="--c:#ff2200" onclick="setColor('bulb${n}','#ff2200')"></button>
            <button class="swatch" style="--c:#ff8800" onclick="setColor('bulb${n}','#ff8800')"></button>
            <button class="swatch" style="--c:#ffee00" onclick="setColor('bulb${n}','#ffee00')"></button>
            <button class="swatch" style="--c:#00ff44" onclick="setColor('bulb${n}','#00ff44')"></button>
            <button class="swatch" style="--c:#00aaff" onclick="setColor('bulb${n}','#00aaff')"></button>
            <button class="swatch" style="--c:#aa00ff" onclick="setColor('bulb${n}','#aa00ff')"></button>
            <button class="swatch" style="--c:#ffffff" onclick="setColor('bulb${n}','#ffffff')"></button>
          </div>
        </div>
      </div>
      <div class="control-section">
        <label class="ctrl-label">${t("brightness")} <span class="ctrl-value" id="bulb${n}BrightVal">100</span>%</label>
        <input type="range" class="slider" id="bulb${n}Brightness" min="0" max="100" value="100"
          oninput="updateBrightLabel(this.value,'bulb${n}BrightVal')"
          onchange="applyBulbBrightness(${n},this.value)" />
      </div>
    </div>`;
  }).join("");

  if (window.lucide) lucide.createIcons();
}

async function toggleBulb(index, isOn) {
  const i = index - 1;
  state.bulbs[i].on = isOn;
  await esp32Request(
    isOn ? `/shelly/${i}/on` : `/shelly/${i}/off`,
    `${t("bulb_label")} ${index} ${isOn ? "ON" : "OFF"}`
  );
  syncUI();
}

async function shellyAllOn() {
  state.bulbs.forEach((b, i) => {
    b.on = true;
    const tog = document.getElementById(`bulb${i+1}Toggle`);
    if (tog) tog.checked = true;
  });
  await esp32Request("/shelly/on", t("all_bulbs") + " ON");
  syncUI();
}

async function shellyAllOff() {
  state.bulbs.forEach((b, i) => {
    b.on = false;
    const tog = document.getElementById(`bulb${i+1}Toggle`);
    if (tog) tog.checked = false;
  });
  await esp32Request("/shelly/off", t("all_bulbs") + " OFF");
  syncUI();
}

async function applyBulbColor(index) {
  const i   = index - 1;
  const hex = document.getElementById(`bulb${index}Color`).value;
  const { r, g, b } = hexToRGB(hex);
  state.bulbs[i].color = hex;
  const bar = document.getElementById(`bulb${index}ColorBar`);
  if (bar) bar.style.background = hex;
  await esp32Request(`/shelly/${i}/color?r=${r}&g=${g}&b=${b}`);
}

async function applyBulbBrightness(index, value) {
  const i = index - 1;
  state.bulbs[i].brightness = parseInt(value);
  await esp32Request(`/shelly/${i}/brightness?value=${value}`);
}

/* ═══════════════════════════════════════════════════════════════
   EFEITOS LED
   Endpoints: /effect/rainbow|disco|fire|pulse|wave|fade|sparkle|meteor|stop
   ═══════════════════════════════════════════════════════════════ */
async function applyEffect(name) {
  state.effect = name;
  state.flag   = null;

  document.querySelectorAll(".effect-card").forEach(el => el.classList.remove("active"));
  const card = document.getElementById(`fx-${name}`);
  if (card) card.classList.add("active");

  document.getElementById("statEffect").textContent = capitalize(name);
  document.getElementById("statFlag").textContent   = "—";

  // Sincronizar Shelly com o efeito
  syncShellyEffect(name);

  await esp32Request(`/effect/${name}`, `Efeito "${capitalize(name)}" ativado`);
}

async function stopEffect() {
  state.effect = null;
  document.querySelectorAll(".effect-card").forEach(el => el.classList.remove("active"));
  document.getElementById("statEffect").textContent = "—";
  await esp32Request("/effect/stop", t("stop_effect"));
}

/** Envia cor para as Shelly a simular o efeito */
async function syncShellyEffect(name) {
  const effectColors = {
    rainbow: ["#ff0000","#ff8800","#ffff00","#00ff00","#0000ff"],
    disco:   ["#ff00ff","#00ffff","#ffff00","#ff8800","#00ff88"],
    fire:    ["#ff2200","#ff6600","#ff9900","#ffcc00","#ff3300"],
    pulse:   ["#ff6a00","#ff6a00","#ff6a00","#ff6a00","#ff6a00"],
    wave:    ["#0044ff","#0088ff","#00aaff","#0088ff","#0044ff"],
    fade:    ["#ff0000","#00ff00","#0000ff","#ff00ff","#ffff00"],
    sparkle: ["#ffffff","#ffff00","#ffffff","#ffaaff","#ffffff"],
    meteor:  ["#ffffff","#aaaaff","#5555ff","#0000ff","#000088"],
  };
  const colors = effectColors[name] || ["#ff6a00","#ff6a00","#ff6a00","#ff6a00","#ff6a00"];
  SHELLY_IPS.forEach((_, i) => {
    const hex = colors[i % colors.length];
    const { r, g, b } = hexToRGB(hex);
    esp32Request(`/shelly/${i}/color?r=${r}&g=${g}&b=${b}`);
  });
}

/* ═══════════════════════════════════════════════════════════════
   BANDEIRAS
   Endpoint: GET /flag/pt | /flag/br | ... | /flag/stop
   ═══════════════════════════════════════════════════════════════ */
const FLAG_DATA = {
  pt: { name:"Portugal",      colors:["#006600","#ffcc00","#cc0000"] },
  br: { name:"Brasil",        colors:["#009c3b","#ffdf00","#002776"] },
  es: { name:"España",        colors:["#c60b1e","#ffc400","#c60b1e"] },
  fr: { name:"France",        colors:["#002395","#ffffff","#ed2939"] },
  de: { name:"Deutschland",   colors:["#000000","#dd0000","#ffce00"] },
  it: { name:"Italia",        colors:["#009246","#ffffff","#ce2b37"] },
  gb: { name:"United Kingdom",colors:["#012169","#ffffff","#c8102e"] },
  us: { name:"USA",           colors:["#b22234","#ffffff","#3c3b6e"] },
  jp: { name:"Japan",         colors:["#ffffff","#bc002d","#ffffff"] },
};

async function applyFlag(code) {
  state.flag   = code;
  state.effect = null;

  document.querySelectorAll(".flag-card").forEach(el => el.classList.remove("active"));
  const card = document.getElementById(`flag-${code}`);
  if (card) card.classList.add("active");
  document.querySelectorAll(".effect-card").forEach(el => el.classList.remove("active"));

  const flagInfo = FLAG_DATA[code];
  if (flagInfo) {
    document.getElementById("statFlag").textContent   = flagInfo.name;
    document.getElementById("statEffect").textContent = "—";

    // Sincronizar Shelly com as cores da bandeira
    flagInfo.colors.forEach((hex, i) => {
      if (i >= SHELLY_IPS.length) return;
      const { r, g, b } = hexToRGB(hex);
      esp32Request(`/shelly/${i}/color?r=${r}&g=${g}&b=${b}`);
      esp32Request(`/shelly/${i}/on`);
    });
  }

  await esp32Request(`/flag/${code}`, `🏳 Bandeira ${flagInfo?.name || code}`);
}

async function stopFlag() {
  state.flag = null;
  document.querySelectorAll(".flag-card").forEach(el => el.classList.remove("active"));
  document.getElementById("statFlag").textContent = "—";
  await esp32Request("/flag/stop", t("stop_flag"));
}

/* ═══════════════════════════════════════════════════════════════
   CENAS RÁPIDAS
   ═══════════════════════════════════════════════════════════════ */
async function applyScene(scene) {
  const scenes = {
    relax: { color:"#ff7700", brightness:120, effect:null,      desc:"🌅" },
    focus: { color:"#ffffff", brightness:255, effect:null,      desc:"💡" },
    party: { color:"#ff00ff", brightness:255, effect:"rainbow", desc:"🎉" },
    night: { color:"#ff1100", brightness:30,  effect:"fade",    desc:"🌙" },
  };
  const cfg = scenes[scene];
  if (!cfg) return;

  setColor("led", cfg.color);
  document.getElementById("ledBrightness").value = cfg.brightness;
  updateBrightLabel(cfg.brightness, "ledBrightVal");
  await esp32Request(`/led/brightness?value=${cfg.brightness}`);

  if (cfg.effect) await applyEffect(cfg.effect);
  else await stopEffect();

  // Ligar LEDs
  document.getElementById("ledToggle").checked = true;
  await toggleLED(true);

  showToast(`${cfg.desc} ${t("scene_" + scene)}`, "success");
}

/* ═══════════════════════════════════════════════════════════════
   CONTROLO MESTRE
   ═══════════════════════════════════════════════════════════════ */
async function masterToggle() {
  state.master = !state.master;
  document.getElementById("masterBtn").classList.toggle("on", state.master);

  if (state.master) {
    document.getElementById("ledToggle").checked = true;
    await toggleLED(true);
    await shellyAllOn();
  } else {
    document.getElementById("ledToggle").checked = false;
    await toggleLED(false);
    await shellyAllOff();
    await stopEffect();
  }
}

/* ═══════════════════════════════════════════════════════════════
   NAVEGAÇÃO
   ═══════════════════════════════════════════════════════════════ */
const SECTION_META = {
  dashboard: { title:"Dashboard",         sub:"stat_strip" },
  strip:     { title:"nav_strip",         sub:"" },
  bulbs:     { title:"nav_bulbs",         sub:"" },
  effects:   { title:"nav_effects",       sub:"" },
  flags:     { title:"nav_flags",         sub:"" },
  settings:  { title:"settings_title",    sub:"" },
  about:     { title:"nav_about",         sub:"" },
};

function showSection(name, navEl) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  const target = document.getElementById(`section-${name}`);
  if (target) target.classList.remove("hidden");

  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  if (navEl) navEl.classList.add("active");

  const meta = SECTION_META[name];
  if (meta) {
    document.getElementById("pageTitle").textContent = t(meta.title) || meta.title;
    document.getElementById("pageSub").textContent   = meta.sub ? t(meta.sub) : "";
  }

  if (window.innerWidth <= 700) toggleSidebar(false);
  if (window.lucide) lucide.createIcons();
}

function toggleSidebar(forceClose) {
  const sidebar  = document.getElementById("sidebar");
  const overlay  = document.getElementById("overlay");
  const isOpen   = sidebar.classList.contains("open");

  if (forceClose === false || isOpen) {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  } else {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  }
}

/* ═══════════════════════════════════════════════════════════════
   SISTEMA DE TRADUÇÕES
   ═══════════════════════════════════════════════════════════════ */
function t(key) {
  return (TRANSLATIONS[state.lang] || TRANSLATIONS.pt)[key] || key;
}

function setLang(lang) {
  state.lang = lang;

  // Atualizar botões ativos
  document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.remove("active"));
  const flags = { pt:"🇵🇹", en:"🇬🇧", de:"🇩🇪", fr:"🇫🇷", es:"🇪🇸" };
  document.querySelectorAll(".lang-btn").forEach(btn => {
    Object.entries(flags).forEach(([l, f]) => {
      if (btn.textContent.trim() === f) btn.classList.toggle("active", l === lang);
    });
  });

  applyTranslations();
  buildBulbCards(); // recriar com nova língua
  buildShellyIpFields();
  syncUI();
  if (window.lucide) lucide.createIcons();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val && val !== key) el.textContent = val;
  });

  // Status text
  const statusText = document.getElementById("statusText");
  if (statusText) {
    statusText.textContent = state.esp32Ok ? `${t("connected")} — ${ESP32_IP}` : t("connecting");
  }
}

/* ═══════════════════════════════════════════════════════════════
   SINCRONIZAÇÃO DA INTERFACE
   ═══════════════════════════════════════════════════════════════ */
function syncUI() {
  // LED stat
  const ledStatus = document.getElementById("statLedStatus");
  const ledDot    = document.getElementById("statLedDot");
  if (ledStatus) ledStatus.textContent = state.led.on ? "ON" : "OFF";
  if (ledDot)    ledDot.classList.toggle("on", state.led.on);

  // Bulbs stat
  const onCount   = state.bulbs.filter(b => b.on).length;
  const bulbsOn   = document.getElementById("statBulbsOn");
  const bulbsDot  = document.getElementById("statBulbsDot");
  if (bulbsOn)  bulbsOn.textContent = `${onCount}/${SHELLY_IPS.length}`;
  if (bulbsDot) bulbsDot.classList.toggle("on", onCount > 0);

  // Quick preview
  const qPreview = document.getElementById("qLedPreview");
  if (qPreview) qPreview.style.background = state.led.color;

  // Ícones das lâmpadas
  SHELLY_IPS.forEach((_, i) => {
    const icon = document.getElementById(`bulbIcon${i+1}`);
    if (icon) icon.classList.toggle("on", state.bulbs[i].on);
  });

  // Color bars
  updateColorBars();

  // IPs nas definições
  const dispEsp = document.getElementById("displayEspIp");
  if (dispEsp) dispEsp.textContent = ESP32_IP;
}

function updateColorBars() {
  const bar = document.getElementById("ledColorBar");
  if (bar) bar.style.background = state.led.color;

  SHELLY_IPS.forEach((_, i) => {
    const b = document.getElementById(`bulb${i+1}ColorBar`);
    if (b) b.style.background = state.bulbs[i].color;
  });
}

/* ═══════════════════════════════════════════════════════════════
   DEFINIÇÕES — CAMPOS DE IP
   ═══════════════════════════════════════════════════════════════ */
function buildShellyIpFields() {
  const container = document.getElementById("shellyIpFields");
  if (!container) return;

  container.innerHTML = SHELLY_IPS.map((ip, i) => {
    const n = i + 1;
    return `
    <div class="settings-field">
      <label>${t("bulb_label")} ${n}</label>
      <div class="settings-row">
        <code class="code-tag" id="displayBulb${n}Ip">${ip}</code>
        <button class="btn-edit" onclick="editBulbIp(${n})">${t("edit")}</button>
      </div>
      <input type="text" class="settings-input hidden" id="bulb${n}IpInput"
        placeholder="${ip}" onblur="saveBulbIp(${n}, this.value)" />
    </div>`;
  }).join("");
}

function editEspIp() {
  const input = document.getElementById("espIpInput");
  input.value = ESP32_IP;
  input.classList.remove("hidden");
  input.focus();
}

function saveEspIp(value) {
  if (value && value.startsWith("http")) {
    document.getElementById("displayEspIp").textContent = value;
    document.getElementById("espIpInput").classList.add("hidden");
    showToast("IP ESP32 atualizado (sessão atual)", "info");
  }
}

function editBulbIp(index) {
  const input = document.getElementById(`bulb${index}IpInput`);
  input.value = SHELLY_IPS[index - 1] || "";
  input.classList.remove("hidden");
  input.focus();
}

function saveBulbIp(index, value) {
  if (value) {
    SHELLY_IPS[index - 1] = value;
    const disp = document.getElementById(`displayBulb${index}Ip`);
    if (disp) disp.textContent = value;
    document.getElementById(`bulb${index}IpInput`).classList.add("hidden");
    const lbl = document.getElementById(`bulbIpLabel${index}`);
    if (lbl) lbl.textContent = value;
    showToast(`${t("bulb_label")} ${index} IP atualizado`, "info");
  }
}

/* ═══════════════════════════════════════════════════════════════
   ESTADO DE LIGAÇÃO
   ═══════════════════════════════════════════════════════════════ */
function setConnectionStatus(ok) {
  state.esp32Ok = ok;
  const dot  = document.getElementById("statusDot");
  const text = document.getElementById("statusText");
  if (!dot || !text) return;
  dot.className  = "status-dot" + (ok ? " connected" : "");
  text.textContent = ok ? `${t("connected")} — ${ESP32_IP}` : t("disconnected");
}

/* ═══════════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════════ */
let toastTimer = null;

function showToast(msg, type = "info", ms = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), ms);
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function setColor(target, hex) {
  if (target === "led") {
    document.getElementById("ledColor").value = hex;
    state.led.color = hex;
    applyLEDColor();
  } else {
    // ex: "bulb1", "bulb3"
    const match = target.match(/bulb(\d+)/);
    if (match) {
      const n = parseInt(match[1]);
      const el = document.getElementById(`bulb${n}Color`);
      if (el) el.value = hex;
      state.bulbs[n - 1].color = hex;
      applyBulbColor(n);
    }
  }
}

function updateBrightLabel(value, elementId) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = value;
}

function hexToRGB(hex) {
  const c = hex.replace("#","");
  return {
    r: parseInt(c.substring(0,2), 16),
    g: parseInt(c.substring(2,4), 16),
    b: parseInt(c.substring(4,6), 16),
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ═══════════════════════════════════════════════════════════════
   DEFINIÇÕES — Password Wi-Fi + Modo Offline
   ═══════════════════════════════════════════════════════════════ */

let wifiPassVisible = false;
let offlineModeActive = false;

function toggleWifiPass() {
  const display = document.getElementById("displayWifiPass");
  const input   = document.getElementById("wifiPassInput");
  wifiPassVisible = !wifiPassVisible;
  if (wifiPassVisible) {
    input.classList.remove("hidden");
    input.focus();
    display.textContent = input.value || "••••••••";
  } else {
    input.classList.add("hidden");
    display.textContent = "••••••••";
  }
}

function saveWifiPass(value) {
  const display = document.getElementById("displayWifiPass");
  if (value) {
    display.textContent = "••••••••";
    showToast("⚠️ Alterar no esp32_code.ino e regravar", "info", 4000);
  }
  document.getElementById("wifiPassInput").classList.add("hidden");
  wifiPassVisible = false;
}

function toggleOfflineMode(isOn) {
  offlineModeActive = isOn;
  const label = document.getElementById("offlineModeLabel");
  if (label) label.textContent = isOn ? "Ativado — modo demonstração" : "Desativado";
  showToast(isOn ? "📶 Modo offline ativado" : "📶 Modo offline desativado", "info");
}

/* ═══════════════════════════════════════════════════════════════
   PASSWORD DE ACESSO À APP
   ═══════════════════════════════════════════════════════════════ */

function editAppPass() {
  const input = document.getElementById("appPassInput");
  input.classList.remove("hidden");
  input.value = "";
  input.focus();
}

function saveAppPass(value) {
  const input   = document.getElementById("appPassInput");
  const display = document.getElementById("displayAppPass");
  input.classList.add("hidden");
  if (value && value.length >= 4) {
    localStorage.setItem("fluxlight_pass", value);
    display.textContent = "••••••••";
    showToast("🔐 Password de acesso atualizada", "success");
  } else if (value) {
    showToast("❌ Password demasiado curta (mín. 4 caracteres)", "error");
  }
}

/* ═══════════════════════════════════════════════════════════════
   PASSWORD DE ACESSO — Sistema completo
   ═══════════════════════════════════════════════════════════════ */

const DEFAULT_PASS = "1234";

function getAppPassword() {
  return localStorage.getItem("fluxlight_pass") || DEFAULT_PASS;
}

function changeAppPassword() {
  const current  = document.getElementById("currentPassInput").value;
  const newPass  = document.getElementById("newPassInput").value;
  const confirm  = document.getElementById("confirmPassInput").value;
  const msgEl    = document.getElementById("passChangeMsg");

  msgEl.style.display = "block";

  if (!current || !newPass || !confirm) {
    msgEl.style.color = "var(--off)";
    msgEl.textContent = "❌ Preenche todos os campos.";
    return;
  }

  if (current !== getAppPassword()) {
    msgEl.style.color = "var(--off)";
    msgEl.textContent = "❌ Password atual incorreta.";
    return;
  }

  if (newPass.length < 4) {
    msgEl.style.color = "var(--off)";
    msgEl.textContent = "❌ A nova password deve ter pelo menos 4 caracteres.";
    return;
  }

  if (newPass !== confirm) {
    msgEl.style.color = "var(--off)";
    msgEl.textContent = "❌ As passwords não coincidem.";
    return;
  }

  localStorage.setItem("fluxlight_pass", newPass);
  msgEl.style.color = "var(--on)";
  msgEl.textContent = "✅ Password alterada com sucesso!";

  document.getElementById("currentPassInput").value = "";
  document.getElementById("newPassInput").value = "";
  document.getElementById("confirmPassInput").value = "";

  showToast("🔐 Password de acesso atualizada", "success");

  setTimeout(() => { msgEl.style.display = "none"; }, 3000);
}
