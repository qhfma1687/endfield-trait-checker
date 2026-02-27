function renderWeapons() {
  const container = document.getElementById("weapon-list");
  container.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();

  State.weapons
    .filter(w => w.name.toLowerCase().includes(search))
    .forEach(w => {
      const div = document.createElement("div");
      div.className = "weapon-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = State.selected.has(w.id);

      checkbox.onchange = () => {
        if (checkbox.checked)
          State.selected.add(w.id);
        else
          State.selected.delete(w.id);

        saveState();
        renderResults();
      };

      div.appendChild(checkbox);
      div.appendChild(document.createTextNode(`${w.name} (${w.node})`));
      container.appendChild(div);
    });
}

function renderNodes() {
  const select = document.getElementById("node-select");
  const nodes = [...new Set(State.weapons.map(w => w.node))];

  nodes.forEach(node => {
    const option = document.createElement("option");
    option.value = node;
    option.textContent = node;
    select.appendChild(option);
  });

  select.onchange = () => {
    State.node = select.value;
    renderResults();
  };

  State.node = nodes[0];
}

function renderPriorityList() {
  const select = document.getElementById("priority-weapon");
  select.innerHTML = "";

  getSelectedWeapons().forEach(w => {
    const option = document.createElement("option");
    option.value = w.id;
    option.textContent = w.name;
    select.appendChild(option);
  });

  select.onchange = () => {
    State.priority = select.value;
    renderResults();
  };
}

function renderResults() {
  if (!State.node) return;

  const best = calculateBestOption(State.node);
  const bestDiv = document.getElementById("best-option");

  bestDiv.innerHTML = best
    .map(([trait, count], i) =>
      `<div class="${i === 0 ? "highlight" : ""}">
        ${trait} (${count}개)
       </div>`
    ).join("");

  renderPriorityList();

  if (!State.priority) return;

  const priorityResult = calculateWithPriority(State.node, State.priority);
  const prDiv = document.getElementById("priority-result");

  prDiv.innerHTML = priorityResult
    .map(([trait, count], i) =>
      `<div class="${i === 0 ? "highlight" : ""}">
        ${trait} (${count}개)
       </div>`
    ).join("");
}