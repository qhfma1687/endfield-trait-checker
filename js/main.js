// =============================
// 상태 관리
// =============================
const State = {
  weapons: [],
  selected: new Set(),
  node: null
};

// =============================
// 로컬 저장
// =============================
function saveState() {
  localStorage.setItem("selectedWeapons", JSON.stringify([...State.selected]));
}

function loadState() {
  const saved = JSON.parse(localStorage.getItem("selectedWeapons") || "[]");
  State.selected = new Set(saved);
}

// =============================
// 초기화
// =============================
async function init() {
  try {
    loadState();

    const res = await fetch("./data/weapons.json");
    if (!res.ok) throw new Error("JSON load failed");

    State.weapons = await res.json();

    renderWeapons();
    renderNodes();
    renderResults();

    document.getElementById("search").addEventListener("input", renderWeapons);

  } catch (e) {
    console.error("초기화 실패:", e);
    alert("데이터 로딩 실패. 콘솔을 확인하세요.");
  }
}

init();


// =============================
// 무기 목록 렌더링
// =============================
function renderWeapons() {
  const list = document.getElementById("weaponList");
  const keyword = document.getElementById("search").value.toLowerCase();

  list.innerHTML = "";

  State.weapons
    .filter(w => w.무기명.toLowerCase().includes(keyword))
    .forEach(w => {

      const card = document.createElement("div");
      card.className = "weapon-card";

      if (State.selected.has(w.무기명)) {
        card.classList.add("selected");
      }

      card.innerHTML = `
        <b>${w.무기명}</b> (${w.무기군})<br/>
        ${w.스탯1} / ${w.스탯2} / ${w.스탯3}
      `;

      card.onclick = () => {
        if (State.selected.has(w.무기명)) {
          State.selected.delete(w.무기명);
        } else {
          State.selected.add(w.무기명);
        }

        saveState();
        renderWeapons();
        renderResults();
      };

      list.appendChild(card);
    });
}


// =============================
// 응집점(노드) 목록 생성
// =============================
function renderNodes() {
  const select = document.getElementById("nodeSelect");

  const nodeSet = new Set();

  State.weapons.forEach(w => {
    nodeSet.add(w.스탯3);
  });

  const nodes = [...nodeSet];

  if (nodes.length === 0) return;

  State.node = nodes[0];

  select.innerHTML = nodes
    .map(n => `<option value="${n}">${n}</option>`)
    .join("");

  select.value = State.node;

  select.onchange = (e) => {
    State.node = e.target.value;
    renderResults();
  };
}


// =============================
// 결과 계산
// =============================
function renderResults() {

  const resultDiv = document.getElementById("result");

  const selectedWeapons = State.weapons.filter(w =>
    State.selected.has(w.무기명)
  );

  if (selectedWeapons.length === 0) {
    resultDiv.innerHTML = "무기를 선택하세요.";
    return;
  }

  const statCount = {};

  selectedWeapons.forEach(w => {
    [w.스탯1, w.스탯2, w.스탯3].forEach(stat => {
      statCount[stat] = (statCount[stat] || 0) + 1;
    });
  });

  const sorted = Object.entries(statCount)
    .sort((a, b) => b[1] - a[1]);

  resultDiv.innerHTML = `
    <h3>최적 각인권 옵션</h3>
    ${sorted
      .map(([stat, count]) => `<div>${stat} : ${count}</div>`)
      .join("")}
  `;
}
