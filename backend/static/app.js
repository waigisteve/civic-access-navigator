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

function setLanguage(language) {
  const pack = LANG.copy[language] || LANG.copy.en;
  currentLanguage = language;
  applyLanguageUI(language);
  document.documentElement.dataset.language = language;
  document.documentElement.style.setProperty("--accent", REGION_THEME[currentRegion].accent);
  document.documentElement.style.setProperty("--accent-soft", REGION_THEME[currentRegion].accentSoft);
  document.documentElement.style.setProperty("--bg", REGION_THEME[currentRegion].bg);
  setText("header-kicker", pack.headerKicker);
  setText("hero-eyebrow", pack.heroEyebrow);
  setText("hero-intro", pack.heroIntro);
  setText("region-note", pack.regionNote);
  setText("map-title", pack.mapTitle);
  setText("map-status", pack.mapStatus);
  setText("country-heading", pack.countryHeading);
  setText("country-status", pack.countrySelectStatus);
  setText("country-copy", currentCountry === "Kenya" ? pack.countryKenyaPilot : `${currentCountry} ${pack.countryPrototype}`);
  setText("business-heading", pack.businessHeading);
  setText("pilot-status", pack.pilotStatus);
  setText("project-heading", pack.projectHeading);
  setText("tracks-heading", pack.tracksHeading);
  setText("resources-heading", pack.resourcesHeading);
  setText("bot-heading", pack.botHeading);
  setText("bot-intro", pack.botIntro);
  setText("bot-try", pack.botTry);
  setText("bot-followup", pack.botFollowup);
  setText("expansion-heading", pack.expansionHeading);
  setText("business-case-heading", pack.businessCaseHeading);
  setText("deliverables-heading", pack.deliverablesHeading);
  setText("control-languages", pack.controlLanguages);
  setText("control-voice", pack.controlVoice);
  setText("control-feedback", pack.controlFeedback);
  setText("control-pilots", pack.controlPilots);
  setText("language-copy", pack.languageCopy);
  setText("feedback-copy", pack.feedbackCopy);
  setText("feedback-clear-title", pack.feedbackClearTitle);
  setText("feedback-clear-copy", pack.feedbackClearCopy);
  setText("feedback-useful-title", pack.feedbackUsefulTitle);
  setText("feedback-useful-copy", pack.feedbackUsefulCopy);
  setText("feedback-needs-work-title", pack.feedbackNeedsWorkTitle);
  setText("feedback-needs-work-copy", pack.feedbackNeedsWorkCopy);
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
  setText("detail-summary-label", pack.detailSummary);
  setText("detail-context-label", pack.detailContext);
  const botInput = document.getElementById("bot-input");
  if (botInput) botInput.placeholder = pack.botPlaceholder;
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
  speechUtterance = new SpeechSynthesisUtterance(
    `${LANGUAGE_LABELS[currentLanguage]}. ${pack.heroEyebrow}. ${pack.projectSummary}`
  );
  speechUtterance.lang = currentLanguage;
  speechUtterance.rate = 1;
  speechUtterance.pitch = 1;
  window.speechSynthesis.speak(speechUtterance);
}

function stopVoiceover() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function wireVoiceControls() {
  document.getElementById("voice-play").addEventListener("click", speakSummary);
  document.getElementById("voice-stop").addEventListener("click", stopVoiceover);
}

function wireFeedback() {
  const cards = document.querySelectorAll(".feedback-card");
  const copy = document.getElementById("feedback-copy");
  const feedbackText = {
    clear: "Clear feedback helps us refine layout, wording, and sponsor-ready presentation.",
    useful: "Useful feedback signals the current design is strong enough for pilot review.",
    "needs-work": "Needs work feedback captures where the prototype should sharpen before field testing.",
  };

  for (const card of cards) {
    card.addEventListener("click", () => {
      for (const other of cards) {
        other.classList.toggle("is-active", other === card);
      }
      copy.textContent = feedbackText[card.dataset.feedback];
    });
  }
}

function openDetail(title, summary, meta, eyebrow = "Detail view") {
  const overlay = document.getElementById("detail-overlay");
  document.getElementById("detail-title").textContent = title;
  const summaryNode = document.getElementById("detail-summary");
  summaryNode.textContent =
    summary || "This detail view shows the expanded pitch context, region focus, and the business rationale behind the selected item.";
  document.getElementById("detail-eyebrow").textContent = eyebrow;
  const metaNode = document.getElementById("detail-meta");
  metaNode.innerHTML = "";
  const details = Array.isArray(meta) && meta.length > 0 ? meta : ["No extra metadata provided."];
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
      const title = card.querySelector("h3")?.textContent || "Business detail";
      const summary = card.querySelector("p")?.textContent || "";
      openDetail(
        title,
        summary,
        [
          "Format: sponsor-ready business case",
          "Use case: pitch, pilot, and decision-making support",
          "Interaction: click-to-open detail popout",
        ],
        "Business case"
      );
    });
  });
}

async function loadResources() {
  const grid = document.getElementById("resource-grid");
  grid.innerHTML = "";
  if (currentCountry !== "Kenya") {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${currentCountry} dry run</h3>
      <div class="meta">${currentZone} · prototype only</div>
      <p>The Africa zoning works here, but the content layer is only populated for Kenya in this build.</p>
    `;
    grid.appendChild(card);
    return;
  }

  const response = await fetch("/api/resources");
  const data = await response.json();

  for (const item of data.items) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <div class="meta">${item.theme} · ${item.audience}</div>
      <p>${item.summary}</p>
    `;
    card.addEventListener("click", () => {
      openDetail(
        item.title,
        item.summary,
        [`Theme: ${item.theme}`, `Audience: ${item.audience}`, `Region view: ${currentRegion}`],
        "Resource detail"
      );
    });
    grid.appendChild(card);
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
  const feed = document.getElementById("chat-feed");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) {
      return;
    }

    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = message;
    feed.appendChild(userBubble);

    input.value = "";
    feed.scrollTop = feed.scrollHeight;

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
        const botBubble = document.createElement("div");
        botBubble.className = "chat-bubble bot";
        botBubble.textContent = `${data.answer || "I could not generate a grounded answer."}\n\nAnswered by: ${data.provider || "local"}`;
        feed.appendChild(botBubble);

        if (Array.isArray(data.citations) && data.citations.length > 0) {
          const citationBubble = document.createElement("div");
          citationBubble.className = "chat-bubble bot citation";
          citationBubble.textContent = `Sources: ${data.citations.join(" | ")}`;
          feed.appendChild(citationBubble);
        }

        feed.scrollTop = feed.scrollHeight;
      })
      .catch(() => {
        const botBubble = document.createElement("div");
        botBubble.className = "chat-bubble bot";
        botBubble.textContent = "I could not reach the grounded answer service just now.";
        feed.appendChild(botBubble);
      });
  });
}

async function loadHealth() {
  const response = await fetch("/api/health");
  const data = await response.json();
  const badge = document.getElementById("health-status");
  badge.textContent = data.status === "ok" ? "API online" : "API issue";
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
  wireBotPreview();
  renderZoneMap();
  renderCountries();
  setZone(currentZone);
  await Promise.all([loadResources(), loadHealth()]);
  await loadProject();
  setLanguage(currentLanguage);
}

bootstrap();
