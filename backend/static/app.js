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

async function loadHealth() {
  const response = await fetch("/api/health");
  const data = await response.json();
  const badge = document.getElementById("health-status");
  badge.textContent = data.status === "ok" ? "API online" : "API issue";
}

async function bootstrap() {
  await Promise.all([loadProject(), loadResources(), loadHealth()]);
}

bootstrap();
