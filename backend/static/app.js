const REGION_COPY = {
  kenya: "Start with Kenya, then expand to East Africa and the wider continent.",
  "east-africa": "Connect Kenya to neighboring regional patterns and cross-border peacebuilding context.",
  africa: "Use the same interaction model across the continent with region-specific source sets.",
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
  const buttons = document.querySelectorAll(".language-pill");
  const copy = document.getElementById("language-copy");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      currentLanguage = button.dataset.language;
      for (const other of buttons) {
        other.classList.toggle("is-active", other === button);
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      }
      copy.textContent = LANGUAGE_COPY[currentLanguage];
    });
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
  document.getElementById("detail-summary").textContent = summary;
  document.getElementById("detail-eyebrow").textContent = eyebrow;
  const metaNode = document.getElementById("detail-meta");
  metaNode.innerHTML = "";
  for (const line of meta) {
    const row = document.createElement("div");
    row.textContent = line;
    metaNode.appendChild(row);
  }
  overlay.hidden = false;
}

function closeDetail() {
  document.getElementById("detail-overlay").hidden = true;
}

function wireDetails() {
  const overlay = document.getElementById("detail-overlay");
  document.getElementById("detail-close").addEventListener("click", closeDetail);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
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
        [`Theme: ${item.theme}`, `Audience: ${item.audience}`, `Region: ${currentRegion}`],
        "Resource detail"
      );
    });
    grid.appendChild(card);
  }
}

function wireRegionSelector() {
  const buttons = document.querySelectorAll(".region-pill");
  const note = document.getElementById("region-note");

  for (const button of buttons) {
    button.addEventListener("click", () => {
      currentRegion = REGION_MAP[button.dataset.region];
      for (const other of buttons) {
        other.classList.toggle("is-active", other === button);
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      }

      const region = button.dataset.region;
      note.textContent = REGION_COPY[region];
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
