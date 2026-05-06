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

const LANGUAGE_COPY = {
  en: "English keeps the current sponsor-facing language crisp and direct.",
  sw: "Swahili makes the pilot feel local and ready for Kenya-first rollout.",
  fr: "French supports regional handoff across East and Central Africa.",
  ar: "Arabic supports broader expansion and more diverse field settings.",
};

const LANGUAGE_LABELS = {
  en: "English",
  sw: "Swahili",
  fr: "French",
  ar: "Arabic",
};

const VOICE_SUMMARY = {
  kenya: "Kenya pilot. Civic Access Navigator helps users find trusted peace and civic guidance, with grounded answers, business-ready controls, and a region-aware interface.",
  "east-africa": "East Africa view. The same product expands into a regional layer with language switching, voiceover, and shared accountability features.",
  africa: "Africa view. The platform scales across countries while keeping the local meaning of peace, language, and trust at the center.",
};

let currentRegion = "kenya";
let currentLanguage = "en";
let speechUtterance = null;

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

function wireLanguageSwitcher() {
  const buttons = document.querySelectorAll(".language-pill, .language-toggle-btn");
  const copy = document.getElementById("language-copy");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.language);
      copy.textContent = LANGUAGE_COPY[currentLanguage];
    });
  }
}

function applyLanguageUI(language) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  const buttons = document.querySelectorAll(".language-toggle-btn, .language-pill");
  for (const button of buttons) {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function setLanguage(language) {
  currentLanguage = language;
  applyLanguageUI(language);
  updateLocalizedText();
}

function updateLocalizedText() {
  const translations = {
    en: {
      kicker: "PeaceTech prototype",
      eyebrow: "PeaceTech prototype for Africa",
      intro:
        "A PeaceTech navigation tool for Kenya and Africa that adds region-aware guidance, curated peace and civic resources, and a lightweight assistant for deeper exploration.",
      mapTitle: "Regional Map",
      mapStatus: "Pick a color-coded zone",
      business: "Business Demo Controls",
      languages: "Languages",
      voice: "Voiceover",
      feedback: "Feedback",
      pilots: "Pilot Views",
      project: "Project Summary",
      tracks: "PeaceTech Tracks",
      resources: "Starter Resource Library",
      bot: "Navigator Bot",
      deliverables: "Capstone Deliverables",
      summary: "Summary",
      context: "Context",
      impact: "Impact partner",
      prototype: "Prototype zone",
      nextBuild: "Next build",
      interactivePilot: "Interactive pilot",
      projectPlan: "Project Plan",
      pitch: "Pitch",
      demoScript: "Demo Script",
      proposal: "Proposal",
      overview:
        "Switch the interface for pilots across countries without changing the core product.",
    },
    sw: {
      kicker: "Mfumo wa PeaceTech",
      eyebrow: "Mfumo wa PeaceTech kwa Afrika",
      intro:
        "Zana ya urambazaji ya PeaceTech kwa Kenya na Afrika inayobadilisha lugha, eneo, na mwongozo wa taarifa za amani na uraia.",
      mapTitle: "Ramani ya Kanda",
      mapStatus: "Chagua eneo lenye rangi",
      business: "Vidhibiti vya Onyesho la Biashara",
      languages: "Lugha",
      voice: "Sauti",
      feedback: "Maoni",
      pilots: "Mitazamo ya Jaribio",
      project: "Muhtasari wa Mradi",
      tracks: "Njia za PeaceTech",
      resources: "Maktaba ya Rasilimali",
      bot: "Msaidizi wa Navigator",
      deliverables: "Utoaji wa Mradi",
      summary: "Muhtasari",
      context: "Muktadha",
      impact: "Mshirika wa athari",
      prototype: "Eneo la mfano",
      nextBuild: "Ujenzi unaofuata",
      interactivePilot: "Jaribio la maingiliano",
      projectPlan: "Mpango wa Mradi",
      pitch: "Uwasilishaji",
      demoScript: "Hati ya Onyesho",
      proposal: "Pendekezo",
      overview:
        "Badilisha kiolesura kwa mataifa tofauti bila kubadili bidhaa kuu.",
    },
    fr: {
      kicker: "Prototype PeaceTech",
      eyebrow: "Prototype PeaceTech pour l’Afrique",
      intro:
        "Un outil de navigation PeaceTech pour le Kenya et l’Afrique, avec langue, région et guidance adaptées au contexte.",
      mapTitle: "Carte régionale",
      mapStatus: "Choisissez une zone colorée",
      business: "Contrôles de démonstration",
      languages: "Langues",
      voice: "Voix",
      feedback: "Retour",
      pilots: "Vues pilote",
      project: "Résumé du projet",
      tracks: "Axes PeaceTech",
      resources: "Bibliothèque de ressources",
      bot: "Bot Navigator",
      deliverables: "Livrables du projet",
      summary: "Résumé",
      context: "Contexte",
      impact: "Partenaire d'impact",
      prototype: "Zone pilote",
      nextBuild: "Prochaine étape",
      interactivePilot: "Pilote interactif",
      projectPlan: "Plan du projet",
      pitch: "Présentation",
      demoScript: "Script de démo",
      proposal: "Proposition",
      overview:
        "Adaptez l’interface selon le pays sans changer le produit principal.",
    },
    ar: {
      kicker: "نموذج PeaceTech",
      eyebrow: "نموذج PeaceTech لإفريقيا",
      intro:
        "أداة إرشاد PeaceTech لكينيا وإفريقيا مع لغة ومنطقة وخلفية صوتية تتغير حسب السياق.",
      mapTitle: "الخريطة الإقليمية",
      mapStatus: "اختر منطقة ملونة",
      business: "عناصر العرض التجاري",
      languages: "اللغة",
      voice: "الصوت",
      feedback: "التغذية",
      pilots: "واجهات التجربة",
      project: "ملخص المشروع",
      tracks: "مسارات PeaceTech",
      resources: "مكتبة الموارد",
      bot: "مساعد Navigator",
      deliverables: "مخرجات المشروع",
      summary: "الملخص",
      context: "السياق",
      impact: "الشريك المؤثر",
      prototype: "نطاق النموذج",
      nextBuild: "البناء التالي",
      interactivePilot: "تجربة تفاعلية",
      projectPlan: "خطة المشروع",
      pitch: "العرض",
      demoScript: "نص العرض",
      proposal: "المقترح",
      overview:
        "غيّر الواجهة حسب البلد مع بقاء المنتج الأساسي نفسه.",
    },
  };

  const copy = translations[language] || translations.en;
  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };
  setText("header-kicker", copy.kicker);
  setText("hero-eyebrow", copy.eyebrow);
  setText("hero-intro", copy.intro);
  setText("map-title", copy.mapTitle);
  setText("map-status", copy.mapStatus);
  setText("business-heading", copy.business);
  setText("pilot-status", copy.interactivePilot);
  setText("project-heading", copy.project);
  setText("tracks-heading", copy.tracks);
  setText("resources-heading", copy.resources);
  setText("bot-heading", copy.bot);
  setText("deliverables-heading", copy.deliverables);
  setText("detail-summary-label", copy.summary);
  setText("detail-context-label", copy.context);
  setText("impact-partner-label", copy.impact);
  setText("prototype-zone-label", copy.prototype);
  setText("next-build-label", copy.nextBuild);
  setText("control-languages", copy.languages);
  setText("control-voice", copy.voice);
  setText("control-feedback", copy.feedback);
  setText("control-pilots", copy.pilots);
  setText("deliverable-project-plan", copy.projectPlan);
  setText("deliverable-pitch", copy.pitch);
  setText("deliverable-demo-script", copy.demoScript);
  setText("deliverable-proposal", copy.proposal);
  const title = document.querySelector("title");
  if (title) {
    title.textContent = `Civic Access Navigator · ${LANGUAGE_LABELS[language] || "English"}`;
  }
}

function speakSummary() {
  if (!("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
  speechUtterance = new SpeechSynthesisUtterance(
    `${LANGUAGE_LABELS[currentLanguage]}. ${REGION_COPY[currentRegion]} ${VOICE_SUMMARY[currentRegion]}`
  );
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
  const response = await fetch("/api/resources");
  const data = await response.json();
  const grid = document.getElementById("resource-grid");
  grid.innerHTML = "";

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
  const buttons = document.querySelectorAll(".region-pill, .map-zone");
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
      mapStatus.textContent = `${button.dataset.label || button.textContent.trim()} selected`;
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
  updateLocalizedText();
  wireRegionSelector();
  wireControlTabs();
  wireLanguageSwitcher();
  wireVoiceControls();
  wireFeedback();
  wireDetails();
  wireBusinessCards();
  wireBotPreview();
  await Promise.all([loadProject(), loadResources(), loadHealth()]);
}

bootstrap();
