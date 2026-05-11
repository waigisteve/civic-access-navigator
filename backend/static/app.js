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
const RESOURCE_CACHE_KEY = "can_resource_cache_v1";
const ACCOUNTABILITY_QUEUE_KEY = "can_accountability_queue_v1";

const VOICE_SUMMARY = {
  kenya: "Kenya pilot. Civic Access Navigator helps users find trusted peace and civic guidance, with grounded answers, business-ready controls, and a region-aware interface.",
  "east-africa": "East Africa view. The same product expands into a regional layer with language switching, voiceover, and shared accountability features.",
  africa: "Africa view. The platform scales across countries while keeping the local meaning of peace, language, and trust at the center.",
};

let currentRegion = "kenya";
let currentLanguage = "en";
let currentZone = "english";
let currentCountry = "Kenya";
let currentScenario = "resident";
let currentIncident = null;
let currentScenarioDetail = null;
let currentIncidentDetail = null;
let currentActionPoint = null;
let liteModeEnabled = false;
let safeModeEnabled = false;
let speechUtterance = null;
let resourceCache = [];
let availableVoices = [];
let workflowCatalog = [];
const workflowDetailCache = new Map();

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

function setPressed(node, pressed) {
  if (node) {
    node.setAttribute("aria-pressed", pressed ? "true" : "false");
    node.classList.toggle("is-active", pressed);
  }
}

function getScenarioPack(pack) {
  return currentScenario === "idp"
    ? { label: pack.scenarioIdp, copy: pack.scenarioIdpCopy }
    : currentScenario === "refugee"
      ? { label: pack.scenarioRefugee, copy: pack.scenarioRefugeeCopy }
      : { label: pack.scenarioResident, copy: pack.scenarioResidentCopy };
}

function getConnectivityLabel(pack) {
  return liteModeEnabled ? pack.contextConnectivityLite : pack.contextConnectivityStandard;
}

function getSafetyLabel(pack) {
  return safeModeEnabled ? pack.contextSafetySafe : pack.contextSafetyStandard;
}

function applyAccessModes() {
  document.body.classList.toggle("lite-mode", liteModeEnabled);
  document.body.classList.toggle("safe-mode", safeModeEnabled);
  const liteToggle = document.getElementById("lite-mode-toggle");
  const safeToggle = document.getElementById("safe-mode-toggle");
  setPressed(liteToggle, liteModeEnabled);
  setPressed(safeToggle, safeModeEnabled);

  const nearbyHero = document.getElementById("hero-nearby-open");
  const nearbyToggle = document.getElementById("nearby-toggle");
  if (nearbyHero) {
    nearbyHero.hidden = safeModeEnabled;
  }
  if (nearbyToggle) {
    nearbyToggle.hidden = safeModeEnabled;
  }

  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const status = document.getElementById("nearby-status");
  if (safeModeEnabled && status) {
    status.textContent = pack.nearbySafeMode;
  } else if (status) {
    status.textContent = pack.nearbyStatus;
  }

  updateContextPanel();
}

function updateContextPanel() {
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const scenario = getScenarioPack(pack);
  setText("scenario-heading", pack.scenarioHeading);
  setText("scenario-status", scenario.label);
  setText("scenario-copy", scenario.copy);
  setText("safe-mode-note", pack.safeModeNote);
  setText("context-country-label", pack.contextCountryLabel);
  setText("context-country-value", currentCountry);
  setText("context-language-label", pack.contextLanguageLabel);
  setText("context-language-value", LANGUAGE_LABELS[currentLanguage] || pack.contextLanguageFallback);
  setText("context-scenario-label", pack.contextScenarioLabel);
  setText("context-scenario-value", scenario.label);
  setText("context-connectivity-label", pack.contextConnectivityLabel);
  setText("context-connectivity-value", getConnectivityLabel(pack));
  setText("context-safety-label", pack.contextSafetyLabel);
  setText("context-safety-value", getSafetyLabel(pack));
}

function getScenarioData(scenarioCode = currentScenario) {
  return workflowCatalog.find((item) => item.code === scenarioCode) || null;
}

function getLocalizedIncidentFallback(pack, incidentCode) {
  return getIncidentDefinition(pack, incidentCode);
}

async function loadWorkflowCatalog() {
  try {
    const response = await fetch("/api/workflows");
    const data = await response.json();
    workflowCatalog = Array.isArray(data.scenarios) ? data.scenarios : [];
    currentScenarioDetail = getScenarioData(currentScenario);
  } catch {
    workflowCatalog = [];
    currentScenarioDetail = null;
  }
}

async function loadWorkflowIncidentDetail(scenarioCode, incidentCode) {
  if (!scenarioCode || !incidentCode) {
    currentIncidentDetail = null;
    return null;
  }
  const cacheKey = `${scenarioCode}:${incidentCode}`;
  if (workflowDetailCache.has(cacheKey)) {
    currentIncidentDetail = workflowDetailCache.get(cacheKey);
    return currentIncidentDetail;
  }
  try {
    const response = await fetch(`/api/workflows/${encodeURIComponent(scenarioCode)}/${encodeURIComponent(incidentCode)}`);
    if (!response.ok) {
      currentIncidentDetail = null;
      return null;
    }
    const data = await response.json();
    workflowDetailCache.set(cacheKey, data);
    currentIncidentDetail = data;
    return data;
  } catch {
    currentIncidentDetail = null;
    return null;
  }
}

function renderIncidentWorkflows() {
  const grid = document.getElementById("incident-grid");
  if (!grid) {
    return;
  }
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const scenario = getScenarioData(currentScenario);
  currentScenarioDetail = scenario;
  setText("workflow-copy", scenario?.summary || pack.workflowCopy);
  const incidents = Array.isArray(scenario?.incidents) ? scenario.incidents : [];
  grid.innerHTML = "";
  if (incidents.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cta-empty";
    empty.textContent = pack.botServiceFallback;
    grid.appendChild(empty);
    return;
  }
  for (const incident of incidents) {
    const fallback = getLocalizedIncidentFallback(pack, incident.code);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `incident-card${currentIncident === incident.code ? " is-active" : ""}`;
    button.dataset.incident = incident.code;
    button.innerHTML = `<strong>${incident.title || fallback.title}</strong><span>${incident.summary || fallback.copy}</span>`;
    button.addEventListener("click", async () => {
      currentIncident = incident.code;
      await loadWorkflowIncidentDetail(currentScenario, currentIncident);
      renderIncidentWorkflows();
      renderCtaPanel();
    });
    grid.appendChild(button);
  }
}

function renderCtaPanel() {
  const grid = document.getElementById("cta-grid");
  if (!grid) {
    return;
  }
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const selectedTitle = currentIncidentDetail?.incident?.title
    || (currentIncident ? getIncidentDefinition(pack, currentIncident).title : "");
  setText("workflow-status", selectedTitle || pack.workflowStatus);
  setText("cta-copy", currentIncident ? pack.ctaCopyReady : pack.ctaCopyIdle);
  grid.innerHTML = "";
  if (!currentIncident) {
    currentActionPoint = null;
    hideActionForm();
    const empty = document.createElement("div");
    empty.className = "cta-empty";
    empty.textContent = pack.ctaEmpty;
    grid.appendChild(empty);
    return;
  }
  const incident = currentIncidentDetail?.incident;
  const actionPoints = Array.isArray(incident?.action_points) ? incident.action_points : [];
  if (actionPoints.length === 0) {
    currentActionPoint = null;
    hideActionForm();
    const empty = document.createElement("div");
    empty.className = "cta-empty";
    empty.textContent = pack.botServiceFallback;
    grid.appendChild(empty);
    return;
  }
  for (const actionPoint of actionPoints) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cta-card";
    card.innerHTML = `<strong>${actionPoint.title}</strong><span>${actionPoint.description}</span>`;
    card.addEventListener("click", () => handleWorkflowAction(actionPoint, pack));
    grid.appendChild(card);
  }
}

function renderQueue() {
  const list = document.getElementById("queue-list");
  if (!list) {
    return;
  }
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const queue = readAccountabilityQueue();
  list.innerHTML = "";
  if (queue.length === 0) {
    const empty = document.createElement("div");
    empty.className = "queue-empty";
    empty.textContent = pack.queueEmpty;
    list.appendChild(empty);
    return;
  }
  for (const entry of queue.slice().reverse()) {
    const row = document.createElement("article");
    row.className = "queue-item";
    row.innerHTML = `
      <strong>${entry.title}</strong>
      <span>${entry.note}</span>
      <small>${entry.status}</small>
    `;
    list.appendChild(row);
  }
}

function enqueueAccountabilityAction(title, note) {
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;
  const queue = readAccountabilityQueue();
  queue.push({
    title,
    note,
    status: pack.queuePendingStatus,
    created_at: new Date().toISOString(),
  });
  writeAccountabilityQueue(queue);
  renderQueue();
}

function handleWorkflowAction(actionPoint, pack) {
  if (!actionPoint) {
    return;
  }
  currentActionPoint = actionPoint;
  renderActionForm();
}

function hideActionForm() {
  const card = document.getElementById("action-form-card");
  if (card) {
    card.hidden = true;
  }
}

function renderActionForm() {
  const card = document.getElementById("action-form-card");
  const title = document.getElementById("action-form-title");
  const status = document.getElementById("action-form-status");
  const copy = document.getElementById("action-form-copy");
  const textarea = document.getElementById("action-report-text");
  const alias = document.getElementById("action-alias");
  const contact = document.getElementById("action-contact-preference");
  const sourceList = document.getElementById("action-source-list");
  const saveButton = document.getElementById("action-save-button");
  if (!card || !title || !status || !copy || !textarea || !alias || !contact || !sourceList || !saveButton) {
    return;
  }
  if (!currentActionPoint || !currentIncidentDetail?.incident) {
    card.hidden = true;
    return;
  }
  const incident = currentIncidentDetail.incident;
  title.textContent = currentActionPoint.title;
  status.textContent = `${incident.risk_level || "n/a"} risk`;
  copy.textContent = currentActionPoint.description;
  textarea.value = "";
  alias.value = "";
  contact.value = safeModeEnabled ? "anonymous" : "anonymous";
  saveButton.textContent = "Save report";
  textarea.placeholder = `Describe what happened during "${incident.title}". Include the place, time, what was demanded or refused, and what next step you need.`;
  alias.placeholder = safeModeEnabled ? "Alias only" : "Alias or leave blank";
  sourceList.innerHTML = "";
  for (const source of incident.sources || []) {
    const row = document.createElement("div");
    row.className = "action-source-item";
    row.innerHTML = `<strong>${source.title}</strong><br /><a href="${source.url}" target="_blank" rel="noreferrer">${source.url}</a>`;
    sourceList.appendChild(row);
  }
  card.hidden = false;
}

function wireActionForm() {
  const form = document.getElementById("action-form");
  const textarea = document.getElementById("action-report-text");
  const alias = document.getElementById("action-alias");
  const contact = document.getElementById("action-contact-preference");
  const status = document.getElementById("action-form-status");
  const saveButton = document.getElementById("action-save-button");
  if (!form || !textarea || !alias || !contact || !status || !saveButton) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentActionPoint || !currentIncidentDetail?.incident) {
      return;
    }
    const reportText = textarea.value.trim();
    if (!reportText) {
      status.textContent = "Add incident details first";
      return;
    }

    const payload = {
      scenario_code: currentScenario,
      incident_code: currentIncident,
      action_code: currentActionPoint.code,
      action_title: currentActionPoint.title,
      report_text: reportText,
      contact_preference: contact.value,
      submitter_alias: alias.value.trim() || null,
      region: currentIncidentDetail.incident.region || currentRegion,
      language: currentLanguage,
      safe_mode: safeModeEnabled,
      lite_mode: liteModeEnabled,
      status: currentActionPoint.channel === "queue" ? "queued" : "submitted",
    };

    saveButton.disabled = true;
    status.textContent = "Saving...";
    try {
      const response = await fetch("/api/workflows/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("save_failed");
      }
      const data = await response.json();
      if (payload.status === "queued") {
        enqueueAccountabilityAction(currentActionPoint.title, reportText);
      }
      status.textContent = `Saved to DB #${data.item?.id || ""}`.trim();
      textarea.value = "";
      alias.value = "";
    } catch {
      enqueueAccountabilityAction(currentActionPoint.title, reportText);
      status.textContent = "Saved locally. Will send when connected.";
    } finally {
      saveButton.disabled = false;
    }
  });
}

function localizeResource(item) {
  const translated = RESOURCE_TRANSLATIONS[item.title]?.[currentLanguage];
  return translated ? { ...item, ...translated } : item;
}

function readResourceCache() {
  try {
    const raw = window.localStorage.getItem(RESOURCE_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeResourceCache(items) {
  try {
    window.localStorage.setItem(RESOURCE_CACHE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage failures in locked-down browsers.
  }
}

function readAccountabilityQueue() {
  try {
    const raw = window.localStorage.getItem(ACCOUNTABILITY_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAccountabilityQueue(items) {
  try {
    window.localStorage.setItem(ACCOUNTABILITY_QUEUE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage failures.
  }
}

function seedChatFeed(force = false) {
  const feed = document.getElementById("chat-feed");
  if (!feed) {
    return;
  }
  if (!force && feed.children.length > 0) {
    return;
  }
  feed.innerHTML = "";
  const pack = LANG.copy[currentLanguage] || LANG.copy.en;

  const tryBubble = document.createElement("div");
  tryBubble.className = "chat-bubble bot";
  tryBubble.id = "bot-try";
  tryBubble.textContent = pack.botTry;

  const followupBubble = document.createElement("div");
  followupBubble.className = "chat-bubble user";
  followupBubble.id = "bot-followup";
  followupBubble.textContent = pack.botFollowup;

  const welcomeBubble = document.createElement("div");
  welcomeBubble.className = "chat-bubble bot";
  const welcomeCopy = document.createElement("p");
  welcomeCopy.id = "chat-welcome";
  welcomeCopy.textContent = pack.chatWelcome;
  welcomeBubble.appendChild(welcomeCopy);

  feed.appendChild(tryBubble);
  feed.appendChild(followupBubble);
  feed.appendChild(welcomeBubble);
}

function getIncidentDefinition(pack, id) {
  const lookup = {
    checkpoint: { title: pack.incidentCheckpointTitle, copy: pack.incidentCheckpointCopy },
    denied_aid: { title: pack.incidentDeniedAidTitle, copy: pack.incidentDeniedAidCopy },
    report_abuse: { title: pack.incidentReportAbuseTitle, copy: pack.incidentReportAbuseCopy },
    nearest_help: { title: pack.incidentNearestHelpTitle, copy: pack.incidentNearestHelpCopy },
    movement_risk: { title: pack.incidentMovementRiskTitle, copy: pack.incidentMovementRiskCopy },
    lost_documents: { title: pack.incidentLostDocumentsTitle, copy: pack.incidentLostDocumentsCopy },
    border_delay: { title: pack.incidentBorderDelayTitle, copy: pack.incidentBorderDelayCopy },
  };
  return lookup[id] || { title: id, copy: "" };
}

function getCtaDefinition(pack, id) {
  const lookup = {
    rights_note: { title: pack.ctaRightsNoteTitle, copy: pack.ctaRightsNoteCopy },
    anonymous_report: { title: pack.ctaAnonymousReportTitle, copy: pack.ctaAnonymousReportCopy },
    legal_observer: { title: pack.ctaLegalObserverTitle, copy: pack.ctaLegalObserverCopy },
    aid_report: { title: pack.ctaAidReportTitle, copy: pack.ctaAidReportCopy },
    queue_case: { title: pack.ctaQueueCaseTitle, copy: pack.ctaQueueCaseCopy },
    open_nearby_help: { title: pack.ctaNearbyHelpTitle, copy: pack.ctaNearbyHelpCopy },
    safe_exit: { title: pack.ctaSafeExitTitle, copy: pack.ctaSafeExitCopy },
    safe_route_note: { title: pack.ctaSafeRouteTitle, copy: pack.ctaSafeRouteCopy },
    document_note: { title: pack.ctaDocumentNoteTitle, copy: pack.ctaDocumentNoteCopy },
    border_note: { title: pack.ctaBorderNoteTitle, copy: pack.ctaBorderNoteCopy },
  };
  return lookup[id] || { title: id, copy: "" };
}

function buildChatContextPrefix() {
  if (!currentIncidentDetail?.incident) {
    return "";
  }
  const incident = currentIncidentDetail.incident;
  const sourceTitles = (incident.sources || []).map((item) => item.title).join(", ");
  return [
    `Scenario: ${currentIncidentDetail.scenario?.title || currentScenario}`,
    `Incident: ${incident.title}`,
    `Risk level: ${incident.risk_level}`,
    `Region: ${incident.region}`,
    sourceTitles ? `Relevant sources: ${sourceTitles}` : "",
  ]
    .filter(Boolean)
    .join("\n");
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
  setText("lite-mode-toggle", pack.liteModeToggle);
  setText("safe-mode-toggle", pack.safeModeToggle);
  setText("quick-exit-toggle", pack.quickExit);
  setText("workflow-heading", pack.workflowHeading);
  setText("workflow-status", pack.workflowStatus);
  setText("workflow-copy", pack.workflowCopy);
  setText("cta-heading", pack.ctaHeading);
  setText("cta-copy", currentIncident ? pack.ctaCopyReady : pack.ctaCopyIdle);
  setText("queue-heading", pack.queueHeading);
  setText("queue-status", pack.queueStatus);
  setText("queue-copy", pack.queueCopy);
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
  setText("scenario-resident", pack.scenarioResident);
  setText("scenario-idp", pack.scenarioIdp);
  setText("scenario-refugee", pack.scenarioRefugee);
  updateContextPanel();
  applyAccessModes();
  renderIncidentWorkflows();
  renderCtaPanel();
  renderQueue();
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
  updateContextPanel();
  loadResources();
}

function wireAccessModes() {
  const liteToggle = document.getElementById("lite-mode-toggle");
  const safeToggle = document.getElementById("safe-mode-toggle");
  if (liteToggle) {
    liteToggle.addEventListener("click", () => {
      liteModeEnabled = !liteModeEnabled;
      applyAccessModes();
    });
  }
  if (safeToggle) {
    safeToggle.addEventListener("click", () => {
      safeModeEnabled = !safeModeEnabled;
      const chatFeed = document.getElementById("chat-feed");
      if (safeModeEnabled && chatFeed) {
        chatFeed.innerHTML = "";
        const hint = document.createElement("div");
        hint.className = "chat-bubble bot";
        hint.textContent = (LANG.copy[currentLanguage] || LANG.copy.en).safeModeChatReset;
        chatFeed.appendChild(hint);
      } else {
        seedChatFeed(true);
      }
      applyAccessModes();
      renderActionForm();
    });
  }
}

function wireScenarioSelector() {
  const buttons = document.querySelectorAll(".scenario-toggle-btn");
  for (const button of buttons) {
    button.addEventListener("click", async () => {
      currentScenario = button.dataset.scenario || "resident";
      currentScenarioDetail = getScenarioData(currentScenario);
      currentIncident = null;
      currentIncidentDetail = null;
      currentActionPoint = null;
      for (const other of buttons) {
        setPressed(other, other === button);
      }
      updateContextPanel();
      renderIncidentWorkflows();
      renderCtaPanel();
      const firstIncident = currentScenarioDetail?.incidents?.[0]?.code;
      if (firstIncident) {
        currentIncident = firstIncident;
        await loadWorkflowIncidentDetail(currentScenario, currentIncident);
      }
      renderIncidentWorkflows();
      renderCtaPanel();
    });
  }
}

function wireQuickExit() {
  const button = document.getElementById("quick-exit-toggle");
  if (!button) {
    return;
  }
  button.addEventListener("click", () => {
    window.location.replace("https://www.google.com");
  });
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

  let items = [];
  try {
    const response = await fetch("/api/resources");
    const data = await response.json();
    items = Array.isArray(data.items) ? data.items : [];
    if (items.length > 0) {
      writeResourceCache(items);
    }
  } catch {
    items = readResourceCache();
  }

  if (items.length === 0) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${pack.resourcesHeading}</h3>
      <div class="meta">${getConnectivityLabel(pack)}</div>
      <p>${pack.botServiceFallback}</p>
    `;
    grid.appendChild(card);
    return;
  }

  for (const item of items) {
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
  const input = document.getElementById("bot-input");
  if (!toggle || !close || !windowNode) {
    return;
  }

  if (windowNode.parentElement !== document.body) {
    document.body.appendChild(windowNode);
    windowNode.classList.add("chat-window-portal");
  }

  const closeFloatingPanels = (except) => {
    const panels = [
      ["chat-window", "chat-toggle"],
      ["sos-panel", "sos-toggle"],
      ["nearby-panel", "nearby-toggle"],
    ];
    for (const [panelId, toggleId] of panels) {
      if (panelId === except) {
        continue;
      }
      const panel = document.getElementById(panelId);
      const panelToggle = document.getElementById(toggleId);
      if (panel) {
        panel.hidden = true;
      }
      if (panelToggle) {
        panelToggle.setAttribute("aria-expanded", "false");
      }
    }
  };

  const positionChat = () => {
    if (windowNode.hidden) {
      return;
    }
    const rect = toggle.getBoundingClientRect();
    const gutter = window.innerWidth <= 640 ? 12 : 16;
    const width = Math.min(window.innerWidth <= 640 ? 340 : 360, window.innerWidth - gutter * 2);
    const top = Math.round(rect.bottom + 12);
    const left = Math.max(gutter, Math.min(Math.round(rect.right - width), window.innerWidth - width - gutter));
    const maxHeight = Math.max(260, window.innerHeight - top - gutter);

    windowNode.style.left = `${left}px`;
    windowNode.style.top = `${top}px`;
    windowNode.style.right = "auto";
    windowNode.style.width = `${width}px`;
    windowNode.style.maxHeight = `${maxHeight}px`;
  };

  const openChat = () => {
    closeFloatingPanels("chat-window");
    seedChatFeed();
    windowNode.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    positionChat();
    if (input) {
      window.setTimeout(() => {
        input.focus({ preventScroll: true });
      }, 80);
    }
  };

  const closeChat = () => {
    windowNode.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  closeChat();

  toggle.addEventListener("click", () => {
    if (windowNode.hidden) {
      openChat();
      return;
    }
    closeChat();
  });
  close.addEventListener("click", closeChat);
  window.addEventListener("resize", positionChat);
  window.addEventListener("scroll", positionChat, { passive: true });
}

function wireSOSWidget() {
  const toggle = document.getElementById("sos-toggle");
  const panel = document.getElementById("sos-panel");
  const heroOpen = document.getElementById("hero-sos-open");
  if (!toggle || !panel) {
    return;
  }

  const setOpen = (open) => {
    const chat = document.getElementById("chat-window");
    const chatToggle = document.getElementById("chat-toggle");
    const nearby = document.getElementById("nearby-panel");
    const nearbyToggle = document.getElementById("nearby-toggle");
    if (open) {
      if (chat) chat.hidden = true;
      if (chatToggle) chatToggle.setAttribute("aria-expanded", "false");
      if (nearby) nearby.hidden = true;
      if (nearbyToggle) nearbyToggle.setAttribute("aria-expanded", "false");
    }
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
    const chat = document.getElementById("chat-window");
    const chatToggle = document.getElementById("chat-toggle");
    const sos = document.getElementById("sos-panel");
    const sosToggle = document.getElementById("sos-toggle");
    if (open) {
      if (chat) chat.hidden = true;
      if (chatToggle) chatToggle.setAttribute("aria-expanded", "false");
      if (sos) sos.hidden = true;
      if (sosToggle) sosToggle.setAttribute("aria-expanded", "false");
    }
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
      if (safeModeEnabled) {
        if (status) {
          status.textContent = pack.nearbySafeMode;
        }
        return;
      }
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
  const feed = document.getElementById("chat-feed");
  const voiceButton = document.getElementById("bot-voice");
  const voiceStatus = document.getElementById("bot-voice-status");
  const recognition = createVoiceRecognition();
  let listening = false;

  if (!form || !input || !feed) {
    return;
  }

  seedChatFeed();

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

    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = message;
    feed.appendChild(userBubble);
    input.value = "";
    feed.scrollTop = feed.scrollHeight;

    const contextPrefix = buildChatContextPrefix();
    const fullMessage = contextPrefix ? `${contextPrefix}\n\nUser question: ${message}` : message;

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: fullMessage,
        region: currentRegion,
        scenario: currentScenario,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const pack = LANG.copy[currentLanguage] || LANG.copy.en;
        const providerLabel = data.provider || "local";
        const modeLabel = data.mode || "fallback";
        const botBubble = document.createElement("div");
        botBubble.className = "chat-bubble bot";
        botBubble.textContent = `${data.answer || pack.botAnswerFallback}\n\n${pack.botAnsweredLabel}: ${providerLabel} · ${modeLabel}`;
        feed.appendChild(botBubble);

        if (Array.isArray(data.citations) && data.citations.length > 0) {
          const citationBubble = document.createElement("div");
          citationBubble.className = "chat-bubble bot citation";
          citationBubble.textContent = `${pack.botSourcesLabel}: ${data.citations.join(" | ")}`;
          feed.appendChild(citationBubble);
        }
        feed.scrollTop = feed.scrollHeight;
      })
      .catch(() => {
        const pack = LANG.copy[currentLanguage] || LANG.copy.en;
        const botBubble = document.createElement("div");
        botBubble.className = "chat-bubble bot";
        botBubble.textContent = pack.botServiceFallback;
        feed.appendChild(botBubble);
        feed.scrollTop = feed.scrollHeight;
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
  const chatWindow = document.getElementById("chat-window");
  const sosPanel = document.getElementById("sos-panel");
  const nearbyPanel = document.getElementById("nearby-panel");
  const chatToggle = document.getElementById("chat-toggle");
  const sosToggle = document.getElementById("sos-toggle");
  const nearbyToggle = document.getElementById("nearby-toggle");
  if (chatWindow) chatWindow.hidden = true;
  if (sosPanel) sosPanel.hidden = true;
  if (nearbyPanel) nearbyPanel.hidden = true;
  if (chatToggle) chatToggle.setAttribute("aria-expanded", "false");
  if (sosToggle) sosToggle.setAttribute("aria-expanded", "false");
  if (nearbyToggle) nearbyToggle.setAttribute("aria-expanded", "false");
  wireModeChips();
  applyLanguageUI(currentLanguage);
  wireAccessModes();
  wireScenarioSelector();
  wireRegionSelector();
  wireControlTabs();
  wireLanguageSwitcher();
  wireQuickExit();
  wireVoiceControls();
  wireFeedback();
  wireDetails();
  wireBusinessCards();
  wireChatWidget();
  wireSOSWidget();
  wireNearbyWidget();
  wireBotPreview();
  wireActionForm();
  await loadWorkflowCatalog();
  renderQueue();
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
  currentScenarioDetail = getScenarioData(currentScenario);
  const initialIncident = currentScenarioDetail?.incidents?.[0]?.code || null;
  if (initialIncident) {
    currentIncident = initialIncident;
    await loadWorkflowIncidentDetail(currentScenario, currentIncident);
  }
  renderIncidentWorkflows();
  renderCtaPanel();
  await Promise.all([loadResources(), loadHealth()]);
  await loadProject();
  setLanguage(currentLanguage);
}

bootstrap();
