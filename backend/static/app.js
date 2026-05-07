const REGION_COPY = {
  kenya: "Start with Kenya, then expand to East Africa and the wider continent.",
  "east-africa": "Connect Kenya to neighboring regional patterns and cross-border peacebuilding context.",
  africa: "Use the same interaction model across the continent with region-specific source sets.",
};

const REGION_THEME = {
  kenya: {
    accent: "#0b6e4f",
    accentSoft: "#d9efe6",
    bg: "#f4efe6",
  },
  "east-africa": {
    accent: "#1f4966",
    accentSoft: "#dce9f2",
    bg: "#f1f5f8",
  },
  africa: {
    accent: "#cb9b31",
    accentSoft: "#f5e9c8",
    bg: "#f7f0df",
  },
};

const REGION_LANGUAGE = {
  kenya: "sw",
  "east-africa": "en",
  africa: "fr",
};

const REGION_MAP = {
  kenya: "kenya",
  "east-africa": "east-africa",
  africa: "africa",
};

const ZONES = {
  swahili: {
    language: "sw",
    label: "Swahili-speaking",
    noteKey: "mapSwahili",
    countries: ["Kenya", "Tanzania", "Uganda", "Rwanda", "DR Congo"],
    accent: "#0b6e4f",
    accentSoft: "#d9efe6",
  },
  english: {
    language: "en",
    label: "English-speaking",
    noteKey: "mapEnglish",
    countries: ["Kenya", "Uganda", "Nigeria", "Ghana", "South Africa"],
    accent: "#1f4966",
    accentSoft: "#dce9f2",
  },
  french: {
    language: "fr",
    label: "French-speaking",
    noteKey: "mapFrench",
    countries: ["DR Congo", "Senegal", "Cote d'Ivoire", "Cameroon", "Benin"],
    accent: "#7a5c11",
    accentSoft: "#f5e9c8",
  },
  arabic: {
    language: "ar",
    label: "Arabic-speaking",
    noteKey: "mapArabic",
    countries: ["Sudan", "Egypt", "Morocco", "Algeria", "Somalia"],
    accent: "#8b3d62",
    accentSoft: "#f2dce7",
  },
};

const RESOURCE_TRANSLATIONS = {
  "Know Your Civic Rights": {
    en: {
      title: "Know Your Civic Rights",
      theme: "Rights and Dignity",
      audience: "General public",
      summary: "A plain-language starter for understanding civic rights and the role of public-interest information.",
    },
    sw: {
      title: "Fahamu haki zako za kiraia",
      theme: "Haki na hadhi",
      audience: "Wananchi wote",
      summary: "Mwongozo wa lugha rahisi wa kuelewa haki za kiraia na nafasi ya taarifa za maslahi ya umma.",
    },
    fr: {
      title: "Comprendre ses droits civiques",
      theme: "Droits et dignite",
      audience: "Grand public",
      summary: "Une introduction en langage simple pour comprendre les droits civiques et le role des informations d'interet public.",
    },
    ar: {
      title: "اعرف حقوقك المدنية",
      theme: "الحقوق والكرامة",
      audience: "عموم المواطنين",
      summary: "مدخل بلغة بسيطة لفهم الحقوق المدنية ودور المعلومات ذات المصلحة العامة.",
    },
  },
  "Community Participation Toolkit": {
    en: {
      title: "Community Participation Toolkit",
      theme: "Democratic Practice",
      audience: "Community groups",
      summary: "A guide to understanding participation channels, local engagement, and accountability pathways.",
    },
    sw: {
      title: "Zana ya ushiriki wa jamii",
      theme: "Utendaji wa kidemokrasia",
      audience: "Makundi ya jamii",
      summary: "Mwongozo wa kuelewa njia za ushiriki, ushirikiano wa eneo, na njia za uwajibikaji.",
    },
    fr: {
      title: "Boite a outils de participation communautaire",
      theme: "Pratique democratique",
      audience: "Groupes communautaires",
      summary: "Guide pour comprendre les canaux de participation, l'engagement local et les parcours de redevabilite.",
    },
    ar: {
      title: "أدوات المشاركة المجتمعية",
      theme: "الممارسة الديمقراطية",
      audience: "المجموعات المجتمعية",
      summary: "دليل لفهم قنوات المشاركة والانخراط المحلي ومسارات المساءلة.",
    },
  },
  "Governance Equity Brief": {
    en: {
      title: "Governance Equity Brief",
      theme: "Equity in Governance",
      audience: "Researchers and advocates",
      summary: "A concise overview of why equal access to governance information matters for fair public participation.",
    },
    sw: {
      title: "Muhtasari wa usawa katika utawala",
      theme: "Usawa katika utawala",
      audience: "Watafiti na watetezi",
      summary: "Muhtasari mfupi wa kwa nini upatikanaji sawa wa taarifa za utawala ni muhimu kwa ushiriki wa umma wenye haki.",
    },
    fr: {
      title: "Note sur l'equite dans la gouvernance",
      theme: "Equite dans la gouvernance",
      audience: "Chercheurs et defenseurs",
      summary: "Bref apercu de l'importance d'un acces equitable aux informations de gouvernance pour une participation publique juste.",
    },
    ar: {
      title: "موجز الإنصاف في الحوكمة",
      theme: "الإنصاف في الحوكمة",
      audience: "الباحثون والمدافعون",
      summary: "نظرة موجزة على أهمية الوصول المتكافئ إلى معلومات الحوكمة من أجل مشاركة عامة عادلة.",
    },
  },
};

const LANG = window.CAN_I18N;
const LANGUAGE_COPY = Object.fromEntries(Object.entries(LANG.copy).map(([key, value]) => [key, value.languageCopy]));
const LANGUAGE_LABELS = Object.fromEntries(Object.entries(LANG.languages).map(([key, value]) => [key, value.label]));

const VOICE_SUMMARY = {
  kenya: "Kenya pilot. Civic Access Navigator helps users find trusted peace and civic guidance, with grounded answers, business-ready controls, and a region-aware interface.",
  "east-africa": "East Africa view. The same product expands into a regional layer with language switching, voiceover, and shared accountability features.",
  africa: "Africa view. The platform scales across countries while keeping the local meaning of peace, language, and trust at the center.",
};

let currentRegion = "kenya";
let currentLanguage = "en";
let currentZone = "english";
let currentCountry = "Kenya";
let speechUtterance = null;
let resourceCache = [];
let availableVoices = [];
let chatMessages = [];
let chatPage = 0;
const CHAT_PAGE_SIZE = 4;

async function loadProject() {
  const response = await fetch("/api/project");
  const data = await response.json();
  const summary = document.getElementById("project-summary");
  const missionFocus = document.getElementById("mission-focus");
  summary.textContent = data.summary;
  missionFocus.innerHTML = "";

  for (const item of data.mission_focus) {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    missionFocus.appendChild(listItem);
  }
}

function wireModeChips() {
  const chips = document.querySelectorAll(".mode-chip");
  for (const chip of chips) {
    chip.addEventListener("click", () => {
      for (const other of chips) {
        other.classList.toggle("is-active", other === chip);
      }
    });
  }
}

function setControlPane(name) {
  const tabs = document.querySelectorAll(".control-tab");
  const panes = document.querySelectorAll(".control-pane");
  for (const tab of tabs) {
    const active = tab.dataset.control === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  }
  for (const pane of panes) {
    pane.classList.toggle("is-active", pane.dataset.pane === name);
  }
}

function wireControlTabs() {
  const tabs = document.querySelectorAll(".control-tab");
  for (const tab of tabs) {
    tab.addEventListener("click", () => setControlPane(tab.dataset.control));
  }
}

function applyLanguageUI(language) {
  document.documentElement.lang = language;
  document.documentElement.dir = LANG.languages[language]?.dir || "ltr";
  const buttons = document.querySelectorAll(".language-toggle-btn, .language-pill");
  for (const button of buttons) {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node && typeof value === "string") {
    node.textContent = value;
  }
}

function getChatPageCount() {
  return Math.max(1, Math.ceil(chatMessages.length / CHAT_PAGE_SIZE));
}

function renderChatFeed() {
  const feed = document.getElementById("chat-feed");
  const prev = document.getElementById("chat-prev");
  const next = document.getElementById("chat-next");
  const status = document.getElementById("chat-page-status");
  if (!feed) {
    return;
  }
  const pageCount = getChatPageCount();
  if (chatPage > pageCount - 1) {
    chatPage = pageCount - 1;
  }
  const start = chatPage * CHAT_PAGE_SIZE;
  const pageItems = chatMessages.slice(start, start + CHAT_PAGE_SIZE);
  feed.innerHTML = "";
  for (const item of pageItems) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${item.role}${item.citation ? " citation" : ""}`;
    bubble.textContent = item.text;
    feed.appendChild(bubble);
  }
  if (prev) {
    prev.disabled = chatPage === 0;
  }
  if (next) {
    next.disabled = chatPage >= pageCount - 1;
  }
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  if (status) {
    status.textContent = `${pack.chatPage} ${chatPage + 1} ${pack.chatPageOf} ${pageCount}`;
  }
  feed.scrollTop = 0;
}

function appendChatMessage(role, text, citation = false) {
  chatMessages.push({ role, text, citation });
  chatPage = getChatPageCount() - 1;
  renderChatFeed();
}

function initializeChatFeed() {
  const feed = document.getElementById("chat-feed");
  if (!feed) {
    return;
  }
  chatMessages = Array.from(feed.children).map((node) => ({
    role: node.classList.contains("user") ? "user" : "bot",
    text: node.textContent?.trim() || "",
    citation: node.classList.contains("citation"),
  }));
  chatPage = getChatPageCount() - 1;
  renderChatFeed();
}

function localizeResource(item) {
  const translated = RESOURCE_TRANSLATIONS[item.title]?.[currentLanguage];
  return translated ? { ...item, ...translated } : item;
}

function setLanguage(language) {
  const pack = LANG.copy[language] || LANG.copy.en;
  currentLanguage = language;
  document.body.classList.add("ui-ready");
  applyLanguageUI(language);
  document.documentElement.dataset.language = language;
  document.documentElement.style.setProperty("--accent", REGION_THEME[currentRegion].accent);
  document.documentElement.style.setProperty("--accent-soft", REGION_THEME[currentRegion].accentSoft);
  document.documentElement.style.setProperty("--bg", REGION_THEME[currentRegion].bg);
  setText("header-kicker", pack.headerKicker);
  setText("hero-eyebrow", pack.heroEyebrow);
  setText("hero-intro", pack.heroIntro);
  setText("region-note", pack.regionNote);
  setText("osf-link-text", pack.osfLinkText);
  setText("hero-osf-link", pack.heroOsfLink);
  setText("hero-sos-open", pack.heroSosOpen);
  setText("hero-nearby-open", pack.nearbyToggle);
  setText("map-title", pack.mapTitle);
  setText("map-status", pack.mapStatus);
  setText("country-heading", pack.countryHeading);
  setText("country-status", pack.countrySelectStatus);
  setText("country-copy", currentCountry === "Kenya" ? pack.countryKenyaPilot : `${currentCountry} ${pack.countryPrototype}`);
  setText("legend-swahili", pack.legendSwahili);
  setText("legend-english", pack.legendEnglish);
  setText("legend-french", pack.legendFrench);
  setText("legend-arabic", pack.legendArabic);
  setText("business-heading", pack.businessHeading);
  setText("pilot-status", pack.pilotStatus);
  setText("project-heading", pack.projectHeading);
  setText("tracks-heading", pack.tracksHeading);
  setText("resources-heading", pack.resourcesHeading);
  setText("bot-heading", pack.botHeading);
  setText("bot-intro", pack.botIntro);
  setText("bot-try", pack.botTry);
  setText("bot-followup", pack.botFollowup);
  setText("chat-welcome", pack.chatWelcome);
  setText("chat-label", pack.chatLabel);
  setText("chat-title", pack.chatTitle);
  const chatToggle = document.getElementById("chat-toggle");
  if (chatToggle) {
    chatToggle.title = pack.chatLabel;
  }
  setText("expansion-heading", pack.expansionHeading);
  setText("business-case-heading", pack.businessCaseHeading);
  setText("deliverables-heading", pack.deliverablesHeading);
  setText("control-languages", pack.controlLanguages);
  setText("control-voice", pack.controlVoice);
  setText("control-feedback", pack.controlFeedback);
  setText("control-pilots", pack.controlPilots);
  setText("language-copy", pack.languageCopy);
  setText("voice-play", pack.voicePlay);
  setText("voice-stop", pack.voiceStop);
  setText("voice-copy", pack.voiceCopy);
  setText("bot-voice", pack.botVoiceQuery);
  setText("bot-voice-status", pack.botVoiceHint);
  setText("feedback-copy", pack.feedbackCopy);
  setText("feedback-clear-title", pack.feedbackClearTitle);
  setText("feedback-clear-copy", pack.feedbackClearCopy);
  setText("feedback-useful-title", pack.feedbackUsefulTitle);
  setText("feedback-useful-copy", pack.feedbackUsefulCopy);
  setText("feedback-needs-work-title", pack.feedbackNeedsWorkTitle);
  setText("feedback-needs-work-copy", pack.feedbackNeedsWorkCopy);
  const previewStatus = document.querySelector(".status.status-dark");
  if (previewStatus && previewStatus.textContent === "Preview") {
    previewStatus.textContent = pack.previewLabel || previewStatus.textContent;
  }
  setText("project-summary", pack.projectSummary);
  const missionFocus = document.getElementById("mission-focus");
  if (missionFocus) {
    missionFocus.innerHTML = "";
    for (const item of pack.tracks) {
      const li = document.createElement("li");
      li.textContent = item;
      missionFocus.appendChild(li);
    }
  }
  setText("expansion-one-title", pack.expansionOneTitle);
  setText("expansion-one-copy", pack.expansionOneCopy);
  setText("expansion-two-title", pack.expansionTwoTitle);
  setText("expansion-two-copy", pack.expansionTwoCopy);
  setText("expansion-three-title", pack.expansionThreeTitle);
  setText("expansion-three-copy", pack.expansionThreeCopy);
  setText("business-one-title", pack.businessOneTitle);
  setText("business-one-copy", pack.businessOneCopy);
  setText("business-two-title", pack.businessTwoTitle);
  setText("business-two-copy", pack.businessTwoCopy);
  setText("business-three-title", pack.businessThreeTitle);
  setText("business-three-copy", pack.businessThreeCopy);
  setText("business-four-title", pack.businessFourTitle);
  setText("business-four-copy", pack.businessFourCopy);
  setText("impact-partner-label", pack.impactLabel);
  setText("prototype-zone-label", pack.prototypeLabel);
  setText("next-build-label", pack.nextBuildLabel);
  setText("deliverable-project-plan", pack.projectPlan);
  setText("deliverable-pitch", pack.pitch);
  setText("deliverable-demo-script", pack.demoScript);
  setText("deliverable-proposal", pack.proposal);
  setText("deliverable-alignment", pack.themeFit);
  setText("sos-toggle", pack.heroSosOpen);
  setText("sos-title", pack.sosTitle);
  setText("sos-intro", pack.sosIntro);
  setText("sos-email", pack.sosEmail);
  setText("sos-sms", pack.sosSms);
  setText("sos-call", pack.sosCall);
  setText("sos-note", pack.sosNote);
  setText("nearby-toggle", pack.nearbyToggle);
  setText("nearby-title", pack.nearbyTitle);
  setText("nearby-intro", pack.nearbyIntro);
  setText("nearby-status", pack.nearbyStatus);
  setText("nearby-locate", pack.nearbyLocate);
  setText("nearby-police", pack.nearbyPolice);
  setText("nearby-hospital", pack.nearbyHospital);
  setText("nearby-school", pack.nearbySchool);
  setText("nearby-camp", pack.nearbyCamp);
  setText("nearby-note", pack.nearbyNote);
  setText("detail-summary-label", pack.detailSummary);
  setText("detail-context-label", pack.detailContext);
  const botInput = document.getElementById("bot-input");
  if (botInput) botInput.placeholder = pack.botPlaceholder;
  setText("chat-prev", pack.chatPrev);
  setText("chat-next", pack.chatNext);
  renderChatFeed();
  const pilotOneTitle = document.getElementById("pilot-one-title");
  const pilotOneCopy = document.getElementById("pilot-one-copy");
  const pilotTwoTitle = document.getElementById("pilot-two-title");
  const pilotTwoCopy = document.getElementById("pilot-two-copy");
  const pilotThreeTitle = document.getElementById("pilot-three-title");
  const pilotThreeCopy = document.getElementById("pilot-three-copy");
  if (pilotOneTitle) pilotOneTitle.textContent = pack.pilotOneTitle;
  if (pilotOneCopy) pilotOneCopy.textContent = pack.pilotOneCopy;
  if (pilotTwoTitle) pilotTwoTitle.textContent = pack.pilotTwoTitle;
  if (pilotTwoCopy) pilotTwoCopy.textContent = pack.pilotTwoCopy;
  if (pilotThreeTitle) pilotThreeTitle.textContent = pack.pilotThreeTitle;
  if (pilotThreeCopy) pilotThreeCopy.textContent = pack.pilotThreeCopy;
  const title = document.querySelector("title");
  if (title) title.textContent = `Civic Access Navigator · ${LANGUAGE_LABELS[language] || "English"}`;
  void loadResources();
  void loadHealth();
}

function renderZoneMap() {
  const mapZones = document.getElementById("map-zones");
  mapZones.innerHTML = "";
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  for (const [zoneId, zone] of Object.entries(ZONES)) {
    const button = document.createElement("button");
    button.className = `map-zone ${zoneId}${currentZone === zoneId ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.zone = zoneId;
    button.dataset.language = zone.language;
    button.setAttribute("aria-pressed", currentZone === zoneId ? "true" : "false");
    button.innerHTML = `
      <span class="zone-dot"></span>
      <strong>${pack[zoneId === "swahili" ? "zoneSwahiliTitle" : zoneId === "english" ? "zoneEnglishTitle" : zoneId === "french" ? "zoneFrenchTitle" : "zoneArabicTitle"]}</strong>
      <small>${pack[zoneId === "swahili" ? "zoneSwahiliCopy" : zoneId === "english" ? "zoneEnglishCopy" : zoneId === "french" ? "zoneFrenchCopy" : "zoneArabicCopy"]}</small>
    `;
    button.addEventListener("click", () => setZone(zoneId));
    mapZones.appendChild(button);
  }
}

function renderCountries() {
  const strip = document.getElementById("country-strip");
  strip.innerHTML = "";
  const zone = ZONES[currentZone];
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  for (const country of zone.countries) {
    const chip = document.createElement("button");
    chip.className = `country-chip${currentCountry === country ? " is-active" : ""}`;
    chip.type = "button";
    chip.dataset.country = country;
    chip.innerHTML = `<strong>${country}</strong>${country === "Kenya" ? `<small>${pack.countryPilotData}</small>` : `<small>${pack.countryPrototype}</small>`}`;
    chip.addEventListener("click", () => setCountry(country));
    strip.appendChild(chip);
  }
}

function setZone(zoneId) {
  currentZone = zoneId;
  const zone = ZONES[zoneId];
  currentCountry = zone.countries.includes("Kenya") ? "Kenya" : zone.countries[0];
  currentLanguage = zone.language;
  renderZoneMap();
  renderCountries();
  setLanguage(zone.language);
  const mapStatus = document.getElementById("map-status");
  mapStatus.textContent = LANG.copy[currentLanguage][zone.noteKey];
  const countryStatus = document.getElementById("country-status");
  countryStatus.textContent = currentCountry === "Kenya" ? LANG.copy[currentLanguage].mapKenya : `${currentCountry} ${LANG.copy[currentLanguage].countryPrototype}`;
  const countryCopy = document.getElementById("country-copy");
  countryCopy.textContent =
      currentCountry === "Kenya"
      ? LANG.copy[currentLanguage].countryKenyaPilot
      : `${currentCountry}: ${LANG.copy[currentLanguage].countryPrototype}`;
}

function setCountry(country) {
  currentCountry = country;
  renderCountries();
  const countryStatus = document.getElementById("country-status");
  const countryCopy = document.getElementById("country-copy");
  if (country === "Kenya") {
    countryStatus.textContent = LANG.copy[currentLanguage].mapKenya;
    countryCopy.textContent = LANG.copy[currentLanguage].countryKenyaPilot;
  } else {
    countryStatus.textContent = `${country} ${LANG.copy[currentLanguage].countryPrototype}`;
    countryCopy.textContent = `${country}: ${LANG.copy[currentLanguage].countryPrototype}`;
  }
  loadResources();
}

function wireLanguageSwitcher() {
  const buttons = document.querySelectorAll(".language-pill, .language-toggle-btn");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const zoneId = Object.keys(ZONES).find((key) => ZONES[key].language === button.dataset.language);
      if (zoneId) {
        setZone(zoneId);
      } else {
        setLanguage(button.dataset.language);
      }
    });
  }
}
function speakSummary() {
  if (!("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const voicePack = {
    en: `${pack.heroEyebrow}. ${pack.projectSummary}`,
    sw: `Karibu. ${pack.projectSummary}`,
    fr: `Bienvenue. ${pack.projectSummary}`,
    ar: `مرحبا. ${pack.projectSummary}`,
  };
  speechUtterance = new SpeechSynthesisUtterance(voicePack[currentLanguage] || voicePack.en);
  speechUtterance.lang = currentLanguage;
  speechUtterance.voice = pickVoiceForLanguage(currentLanguage);
  speechUtterance.rate = 1;
  speechUtterance.pitch = 1;
  window.speechSynthesis.speak(speechUtterance);
}

function pickVoiceForLanguage(language) {
  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  const candidates = voices.filter((voice) => {
    const lang = (voice.lang || "").toLowerCase();
    const name = (voice.name || "").toLowerCase();
    if (language === "sw") return lang.startsWith("sw") || name.includes("swahili");
    if (language === "fr") return lang.startsWith("fr") || name.includes("french");
    if (language === "ar") return lang.startsWith("ar") || name.includes("arabic");
    return lang.startsWith("en");
  });
  return candidates[0] || voices.find((voice) => (voice.lang || "").toLowerCase().startsWith(language)) || voices[0] || null;
}

function stopVoiceover() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function wireVoiceControls() {
  const play = document.getElementById("voice-play");
  const stop = document.getElementById("voice-stop");
  if (!play || !stop) {
    return;
  }
  play.addEventListener("click", speakSummary);
  stop.addEventListener("click", stopVoiceover);
}

function wireFeedback() {
  const cards = document.querySelectorAll(".feedback-card");
  const copy = document.getElementById("feedback-copy");
  if (!copy || cards.length === 0) {
    return;
  }

  for (const card of cards) {
    card.addEventListener("click", () => {
      for (const other of cards) {
        other.classList.toggle("is-active", other === card);
      }
      const pack = LANG.copy[currentLanguage] || LANG.copy.en;
      const titleKey =
        card.dataset.feedback === "clear"
          ? "feedbackClearTitle"
          : card.dataset.feedback === "useful"
            ? "feedbackUsefulTitle"
            : "feedbackNeedsWorkTitle";
      const copyKey =
        card.dataset.feedback === "clear"
          ? "feedbackClearCopy"
          : card.dataset.feedback === "useful"
            ? "feedbackUsefulCopy"
            : "feedbackNeedsWorkCopy";
      copy.textContent = `${pack[titleKey]} - ${pack[copyKey]}`;
    });
  }
}

function openDetail(title, summary, meta, eyebrow = "Detail view") {
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const overlay = document.getElementById("detail-overlay");
  document.getElementById("detail-title").textContent = title;
  const summaryNode = document.getElementById("detail-summary");
  summaryNode.textContent = summary || pack.detailFallback;
  document.getElementById("detail-eyebrow").textContent = eyebrow || pack.detailSummary;
  const metaNode = document.getElementById("detail-meta");
  metaNode.innerHTML = "";
  const details = Array.isArray(meta) && meta.length > 0 ? meta : [pack.detailNoMeta];
  for (const line of details) {
    const row = document.createElement("div");
    row.textContent = line;
    metaNode.appendChild(row);
  }
  overlay.hidden = false;
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  const overlay = document.getElementById("detail-overlay");
  overlay.hidden = true;
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

function wireDetails() {
  const overlay = document.getElementById("detail-overlay");
  document.getElementById("detail-close").addEventListener("click", closeDetail);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeDetail();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closeDetail();
    }
  });
}

function wireBusinessCards() {
  const cards = document.querySelectorAll(".business-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const pack = LANG.copy[currentLanguage] || LANG.copy.en;
      const title = card.querySelector("h3")?.textContent || "Business detail";
      const summary = card.querySelector("p")?.textContent || "";
      openDetail(
        title,
        summary,
        [
          `${pack.businessHeading}: ${pack.businessCaseHeading}`,
          `${pack.projectPlan}: ${pack.pitch}`,
          `${pack.controlPilots}: ${pack.pilotStatus}`,
        ],
        pack.businessCaseHeading
      );
    });
  });
}

async function loadResources() {
  const grid = document.getElementById("resource-grid");
  grid.innerHTML = "";
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  if (currentCountry !== "Kenya") {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${currentCountry} ${pack.countryPrototype}</h3>
      <div class="meta">${pack.mapTitle} · ${pack.countryPrototype}</div>
      <p>${pack.countryKenyaPilot}</p>
    `;
    grid.appendChild(card);
    return;
  }

  const response = await fetch("/api/resources");
  const data = await response.json();

  for (const item of data.items) {
    const localized = localizeResource(item);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${localized.title}</h3>
      <div class="meta">${localized.theme} · ${localized.audience}</div>
      <p>${localized.summary}</p>
    `;
    card.addEventListener("click", () => {
      const detailPack = LANG.copy[currentLanguage] || LANG.copy.en;
      openDetail(
        localized.title,
        localized.summary,
        [
          `${detailPack.detailThemeLabel}: ${localized.theme}`,
          `${detailPack.detailAudienceLabel}: ${localized.audience}`,
          `${detailPack.detailRegionLabel}: ${currentRegion}`,
        ],
        detailPack.resourceDetail
      );
    });
    grid.appendChild(card);
  }
}

function getVoiceRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function createVoiceRecognition() {
  const Recognition = getVoiceRecognition();
  if (!Recognition) {
    return null;
  }
  const recognition = new Recognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

function wireChatWidget() {
  const toggle = document.getElementById("chat-toggle");
  const close = document.getElementById("chat-close");
  const windowNode = document.getElementById("chat-window");
  const prev = document.getElementById("chat-prev");
  const next = document.getElementById("chat-next");
  if (!toggle || !close || !windowNode) {
    return;
  }

  const openChat = () => {
    windowNode.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeChat = () => {
    windowNode.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    if (windowNode.hidden) {
      openChat();
      return;
    }
    closeChat();
  });
  close.addEventListener("click", closeChat);
  if (prev) {
    prev.addEventListener("click", () => {
      if (chatPage > 0) {
        chatPage -= 1;
        renderChatFeed();
      }
    });
  }
  if (next) {
    next.addEventListener("click", () => {
      if (chatPage < getChatPageCount() - 1) {
        chatPage += 1;
        renderChatFeed();
      }
    });
  }
}

function wireSOSWidget() {
  const toggle = document.getElementById("sos-toggle");
  const panel = document.getElementById("sos-panel");
  const heroOpen = document.getElementById("hero-sos-open");
  if (!toggle || !panel) {
    return;
  }

  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  if (heroOpen) {
    heroOpen.addEventListener("click", () => setOpen(true));
  }
}

function wireNearbyWidget() {
  const toggle = document.getElementById("nearby-toggle");
  const panel = document.getElementById("nearby-panel");
  const heroOpen = document.getElementById("hero-nearby-open");
  const locate = document.getElementById("nearby-locate");
  const status = document.getElementById("nearby-status");
  const police = document.getElementById("nearby-police");
  const hospital = document.getElementById("nearby-hospital");
  const school = document.getElementById("nearby-school");
  const camp = document.getElementById("nearby-camp");
  if (!toggle || !panel) {
    return;
  }

  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const updateLinks = (latitude, longitude) => {
    const queries = [
      [police, "police station near me"],
      [hospital, "hospital near me"],
      [school, "school near me"],
      [camp, "refugee camp near me"],
    ];
    for (const [node, query] of queries) {
      if (node) {
        node.href = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${latitude},${longitude},14z`;
      }
    }
  };

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  if (heroOpen) {
    heroOpen.addEventListener("click", () => setOpen(true));
  }

  if (locate) {
    locate.addEventListener("click", () => {
      const pack = LANG.copy[currentLanguage] || LANG.copy.en;
      if (!navigator.geolocation) {
        if (status) {
          status.textContent = pack.nearbyUnsupported;
        }
        return;
      }
      if (status) {
        status.textContent = pack.nearbyLocating;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLinks(position.coords.latitude, position.coords.longitude);
          if (status) {
            status.textContent = pack.nearbyReady;
          }
        },
        () => {
          if (status) {
            status.textContent = pack.nearbyDenied;
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      );
    });
  }
}

function wireRegionSelector() {
  const buttons = document.querySelectorAll(".region-pill");
  const note = document.getElementById("region-note");
  const mapStatus = document.getElementById("map-status");

  for (const button of buttons) {
    button.addEventListener("click", () => {
      currentRegion = REGION_MAP[button.dataset.region];
      for (const other of buttons) {
        other.classList.toggle("is-active", other === button);
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      }

      const region = button.dataset.region;
      note.textContent = REGION_COPY[region];
      mapStatus.textContent = LANG.copy[currentLanguage][
        region === "kenya" ? "mapKenya" : region === "east-africa" ? "mapEastAfrica" : "mapAfrica"
      ];
      document.documentElement.dataset.region = region;
      const theme = REGION_THEME[region];
      document.documentElement.style.setProperty("--accent", theme.accent);
      document.documentElement.style.setProperty("--accent-soft", theme.accentSoft);
      document.documentElement.style.setProperty("--bg", theme.bg);
      document.body.style.background =
        `linear-gradient(180deg, rgba(247, 243, 234, 0.82), rgba(239, 231, 216, 0.95)), url("/kenya-africa-bg.png")`;
      const mappedLanguage = REGION_LANGUAGE[region];
      setLanguage(mappedLanguage);
      const copyNode = document.getElementById("language-copy");
      if (copyNode) {
        copyNode.textContent = LANGUAGE_COPY[currentLanguage];
      }
    });
  }
}

function wireBotPreview() {
  const form = document.getElementById("bot-form");
  const input = document.getElementById("bot-input");
  const voiceButton = document.getElementById("bot-voice");
  const voiceStatus = document.getElementById("bot-voice-status");
  const recognition = createVoiceRecognition();
  let listening = false;

  const refreshVoiceUI = () => {
    const pack = LANG.copy[currentLanguage] || LANG.copy.en;
    if (voiceButton) {
      voiceButton.classList.toggle("is-active", listening);
      voiceButton.textContent = listening ? pack.voiceStop : pack.botVoiceQuery;
    }
    if (voiceStatus) {
      voiceStatus.textContent = listening ? pack.botVoiceListening : pack.botVoiceHint;
    }
  };

  if (voiceButton) {
    voiceButton.addEventListener("click", () => {
      const pack = LANG.copy[currentLanguage] || LANG.copy.en;
      if (!recognition) {
        if (voiceStatus) {
          voiceStatus.textContent = pack.botVoiceUnsupported;
        }
        return;
      }
      if (listening) {
        recognition.stop();
        listening = false;
        refreshVoiceUI();
        return;
      }

      recognition.lang = currentLanguage;
      recognition.onstart = () => {
        listening = true;
        refreshVoiceUI();
      };
      recognition.onerror = () => {
        listening = false;
        refreshVoiceUI();
      };
      recognition.onend = () => {
        listening = false;
        refreshVoiceUI();
      };
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (!transcript) {
          return;
        }
        input.value = transcript;
        form.requestSubmit();
      };
      try {
        recognition.start();
      } catch (_error) {
        listening = false;
        refreshVoiceUI();
        if (voiceStatus) {
          voiceStatus.textContent = pack.botVoiceUnsupported;
        }
      }
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) {
      return;
    }

    appendChatMessage("user", message);
    input.value = "";

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        region: currentRegion,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const pack = LANG.copy[currentLanguage] || LANG.copy.en;
        const providerLabel = data.provider || "local";
        const modeLabel = data.mode || "fallback";
        appendChatMessage("bot", `${data.answer || pack.botAnswerFallback}\n\n${pack.botAnsweredLabel}: ${providerLabel} · ${modeLabel}`);

        if (Array.isArray(data.citations) && data.citations.length > 0) {
          appendChatMessage("bot", `${pack.botSourcesLabel}: ${data.citations.join(" | ")}`, true);
        }
      })
      .catch(() => {
        const pack = LANG.copy[currentLanguage] || LANG.copy.en;
        appendChatMessage("bot", pack.botServiceFallback);
      });
  });
}

async function loadHealth() {
  const response = await fetch("/api/health");
  const data = await response.json();
  const badge = document.getElementById("health-status");
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  badge.textContent = data.status === "ok" ? pack.apiOnline : pack.apiIssue;
}

async function bootstrap() {
  wireModeChips();
  applyLanguageUI(currentLanguage);
  wireRegionSelector();
  wireControlTabs();
  wireLanguageSwitcher();
  wireVoiceControls();
  wireFeedback();
  wireDetails();
  wireBusinessCards();
  initializeChatFeed();
  wireChatWidget();
  wireSOSWidget();
  wireNearbyWidget();
  wireBotPreview();
  if ("speechSynthesis" in window) {
    const refreshVoices = () => {
      availableVoices = window.speechSynthesis.getVoices();
    };
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
  renderZoneMap();
  renderCountries();
  setZone(currentZone);
  await Promise.all([loadResources(), loadHealth()]);
  await loadProject();
  setLanguage(currentLanguage);
}

bootstrap();
