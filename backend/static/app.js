const REGION_COPY = {
  kenya: "Start with Kenya, then expand to East Africa and the wider continent.",
  "east-africa": "Connect Kenya to neighboring regional patterns and cross-border civic context.",
  africa: "Use the same interaction model across the continent with region-specific source sets.",
};

const REGION_MAP = {
  kenya: "kenya",
  "east-africa": "east-africa",
  africa: "africa",
};

let currentRegion = "kenya";

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
        botBubble.textContent = data.answer || "I could not generate a grounded answer.";
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
  wireRegionSelector();
  wireBotPreview();
  await Promise.all([loadProject(), loadResources(), loadHealth()]);
}

bootstrap();
