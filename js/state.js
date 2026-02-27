const State = {
  weapons: [],
  selected: new Set(),
  node: null,
  priority: null
};

function loadState() {
  const saved = localStorage.getItem("selectedWeapons");
  if (saved) {
    State.selected = new Set(JSON.parse(saved));
  }
}

function saveState() {
  localStorage.setItem(
    "selectedWeapons",
    JSON.stringify([...State.selected])
  );
}