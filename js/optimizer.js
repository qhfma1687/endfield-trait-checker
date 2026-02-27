function getSelectedWeapons() {
  return State.weapons.filter(w => State.selected.has(w.id));
}

function filterByNode(node) {
  return getSelectedWeapons().filter(w => w.node === node);
}

function calculateBestOption(node) {
  const filtered = filterByNode(node);
  const counter = {};

  filtered.forEach(w => {
    w.traits.forEach(trait => {
      counter[trait] = (counter[trait] || 0) + 1;
    });
  });

  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1]);
}

function calculateWithPriority(node, priorityId) {
  const filtered = filterByNode(node);
  const priority = filtered.find(w => w.id === priorityId);
  if (!priority) return [];

  const result = [];

  priority.traits.forEach(trait => {
    const count = filtered.filter(w =>
      w.traits.includes(trait)
    ).length;

    result.push([trait, count]);
  });

  return result.sort((a, b) => b[1] - a[1]);
}