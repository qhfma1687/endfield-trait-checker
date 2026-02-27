async function init() {
  loadState();

  const res = await fetch("data/weapons.json");
  State.weapons = await res.json();

  renderWeapons();
  renderNodes();
  renderResults();

  document.getElementById("search").oninput = renderWeapons;
}


init();
