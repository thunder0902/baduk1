let names = localStorage.getItem("names");
names = names ? JSON.parse(names) : [];
console.log(names);
const nameInput = document.querySelector(".nameInput");
const nameBtn = document.querySelector(".nameBtn");
const listBox = document.querySelector(".listBox");
const titleInput = document.querySelector(".title");
const titleBtn = document.querySelector(".titleBtn");
var trueFalse = true;

// 제목 함수
function addTitle(title) {
  localStorage.setItem("title", title);
  updateTitleDisplay(); // 제목이 변경될 때마다 호출
}

// 제목 디스플레이 업데이트 함수
function updateTitleDisplay() {
  const title = localStorage.getItem("title");
  if (title) {
    document.querySelector(".titleName").innerHTML = title;
  }
}
document.querySelector(".hideon").addEventListener("click", function () {
  document.querySelectorAll("header").forEach(function (button) {
    button.classList.toggle("hide");
    document.querySelector(".titleName").classList.toggle("unset");
    if (trueFalse == true) {
      document.querySelector(".hideon").innerHTML = "출력모드OFF";
      trueFalse = false;
    } else {
      document.querySelector(".hideon").innerHTML = "출력모드ON";
      trueFalse = true;
    }
  });
});
// document.querySelector(".changeTitle").addEventListener("click", function () {
//   document.querySelector(".hideInput").classList.add("show");
//   document.querySelector(".changeTitle").style.display = "none";
// });
// 제목 변경 이벤트 리스너
titleBtn.addEventListener("click", function () {
  const titleValue = titleInput.value;
  addTitle(titleValue);
  titleInput.value = "";
  document.querySelector(".hideInput").classList.remove("show");
  document.querySelector(".changeTitle").style.display = "block";
});

// 페이지 로드 시 제목 설정
if (localStorage.getItem("title") != null) {
  updateTitleDisplay();
}

// 이름을 추가하는 함수
function addName(name) {
  let names = localStorage.getItem("names");
  names = names ? JSON.parse(names) : [];
  names.push(name);
  localStorage.setItem("names", JSON.stringify(names));
}

// list에 저장된 이름 표시
function updateList() {
  listBox.innerHTML = "";
  let names = localStorage.getItem("names");
  names = names ? JSON.parse(names) : [];
  names.forEach((item, index) => {
    const temp = `<li class="nameListStatus">${item}<button class="nameBtn" data-index="${index}">삭제</button></li>`;
    listBox.insertAdjacentHTML("beforeend", temp);
  });
  listBox.insertAdjacentHTML(
    "beforeend",
    `<button class="closeBtn">닫기</button>`
  );
  document.querySelector(".closeBtn").addEventListener("click", function () {
    listBox.classList.remove("show");
  });
}

// 리스트 전체에 대한 이벤트 위임을 사용하여 삭제 처리
listBox.addEventListener("click", function (e) {
  if (e.target.className === "nameBtn") {
    const index = e.target.getAttribute("data-index");
    removeName(index);
  }
});

// 이름 삭제 로직
function removeName(index) {
  let names = localStorage.getItem("names");
  names = names ? JSON.parse(names) : [];
  names.splice(index, 1); // 해당 인덱스의 이름 제거
  localStorage.setItem("names", JSON.stringify(names));
  updateList(); // 리스트 업데이트
}

// 이름 입력 버튼
nameBtn.addEventListener("click", function () {
  listBox.classList.add("show");
  const nameValue = nameInput.value;
  addName(nameValue);
  nameInput.value = "";
  updateList();
});

function getStorageKey(index1, index2) {
  // 각 매치에 대해 고유한 키를 생성
  return `result-${index1}-${index2}`;
}
const playerStats = {};

function handleDropdownChange(playerIndex, matchIndex) {
  return function (event) {
    const result = event.target.value;
    const storageKey = getStorageKey(playerIndex, matchIndex);
    const reverseStorageKey = getStorageKey(matchIndex, playerIndex);
    const previousResult = localStorage.getItem(storageKey);
    const reverseResult =
      result === "승" ? "패" : result === "패" ? "승" : "null";

    // 대칭되는 드롭다운 옵션 자동 변경
    const reverseSelectId = `select-${matchIndex}-${playerIndex}`;
    const reverseSelectElement = document.getElementById(reverseSelectId);
    if (reverseSelectElement) {
      reverseSelectElement.value = reverseResult;
      reverseSelectElement.parentNode.style.backgroundColor =
        reverseResult === "승"
          ? "red"
          : reverseResult === "패"
          ? "green"
          : "transparent";
      localStorage.setItem(reverseStorageKey, reverseResult);
    }
    // 승/패 통계 업데이트
    if (previousResult) {
      updatePlayerStats(playerIndex, previousResult, "null");
      updatePlayerStats(
        matchIndex,
        previousResult === "승"
          ? "패"
          : previousResult === "패"
          ? "승"
          : "null",
        "null"
      );
    }

    updatePlayerStats(playerIndex, "null", result);
    updatePlayerStats(
      matchIndex,
      "null",
      result === "승" ? "패" : result === "패" ? "승" : "null"
    );

    localStorage.setItem(storageKey, result);

    // 실시간 색상 반영
    event.target.parentNode.style.backgroundColor =
      result === "승" ? "red" : result === "패" ? "green" : "transparent";
    // 승패 카운트 저장
    savePlayerStats();
    updateResultsDisplay();
  };
}

function updatePlayerStats(playerIndex, oldResult, newResult) {
  if (!playerStats[playerIndex]) {
    playerStats[playerIndex] = { wins: 0, losses: 0 };
  }

  // 이전 결과에 따라 감소
  if (oldResult === "승") {
    playerStats[playerIndex].wins--;
  } else if (oldResult === "패") {
    playerStats[playerIndex].losses--;
  }

  // 새로운 결과에 따라 증가
  if (newResult === "승") {
    playerStats[playerIndex].wins++;
  } else if (newResult === "패") {
    playerStats[playerIndex].losses++;
  }
}
// 나머지 코드는 동일하게 유지됩니다.
document.addEventListener("DOMContentLoaded", function () {
  loadPlayerStats(); // 통계 먼저 불러오기
  mkTable(); // 이후에 테이블 생성
});

function mkTable() {
  let names = localStorage.getItem("names");
  names = names ? JSON.parse(names) : [];
  const tableSection = document.querySelector(".tableSection");
  document.getElementById("table").style.gridTemplateColumns = `repeat(${
    names.length + 2
  }, 1fr)`;
  if (names.length > 0) {
    tableSection.style.display = "grid";
  }

  for (var i = 0; i < names.length + 1; i++) {
    for (var j = 0; j < names.length + 2; j++) {
      const result = localStorage.getItem(getStorageKey(i, j));
      if (i == 0 && j == 0) {
        tableSection.insertAdjacentHTML(
          "beforeend",
          `<div class="multiBoxNull"></div>`
        );
      } else if (i === 0 && j === names.length + 1) {
        tableSection.insertAdjacentHTML(
          "beforeend",
          `<div class="multiBox"></div>`
        );
      } else if (i == j) {
        tableSection.insertAdjacentHTML(
          "beforeend",
          `<div class="multiBoxNull"></div>`
        );
      } else if (i == 0 && j != 0) {
        tableSection.insertAdjacentHTML(
          "beforeend",
          `<div class="first-column multiBox">${names[j - 1]}</div>`
        );
      } else if (i != 0 && j == 0) {
        tableSection.insertAdjacentHTML(
          "beforeend",
          `<div class="first-row multiBox">${names[i - 1]}</div>`
        );
      } else if (i != 0 && j == names.length + 1) {
        const statsId = `statsDisplay-${i}`;
        // 플레이어 통계를 여기서 초기화하지 않습니다.
        const statsDiv = `<div class="multiBox" id="${statsId}">승 : 0, 패 : 0 </div>`;
        tableSection.insertAdjacentHTML("beforeend", statsDiv);
      } else {
        // 드롭다운 생성 및 초기 색상 설정
        const selectId = `select-${i}-${j}`;
        const result = localStorage.getItem(getStorageKey(i, j));
        const div = `<div class="multiBox">
            <div class="roundBox" style="background-color: ${
              result === "승"
                ? "red"
                : result === "패"
                ? "green"
                : "transparent"
            }">
            <select name="match" id="${selectId}">
                            <option value="null" ${
                              result === "null" ? "selected" : ""
                            }></option>
                            <option value="승" ${
                              result === "승" ? "selected" : ""
                            }>승</option>
                            <option value="패" ${
                              result === "패" ? "selected" : ""
                            }>패</option>
                          </select>
                        </div>
                      </div>`;
        tableSection.insertAdjacentHTML("beforeend", div);
        document
          .getElementById(selectId)
          .addEventListener("change", handleDropdownChange(i, j));
      }
    }
  }
  updateResultsDisplay();
}
// 승패 카운트를 로컬 스토리지에 저장하는 함수
function savePlayerStats() {
  localStorage.setItem("playerStats", JSON.stringify(playerStats));
}
// 페이지 로드 시 승패 카운트를 복원하는 함수
function loadPlayerStats() {
  const savedStats = localStorage.getItem("playerStats");
  if (savedStats) {
    Object.assign(playerStats, JSON.parse(savedStats));
  }
}
function updateResultsDisplay() {
  Object.keys(playerStats).forEach((playerIndex) => {
    // 각 플레이어의 승/패 카운트 업데이트
    const statsId = `statsDisplay-${playerIndex}`;
    const statsDiv = document.getElementById(statsId);
    if (statsDiv) {
      const stats = playerStats[playerIndex] || { wins: 0, losses: 0 };
      statsDiv.textContent = `승 : ${stats.wins}, 패 : ${stats.losses}`;
    }
  });
}
const { jsPDF } = window.jspdf;
document.querySelector("#yourButtonId").addEventListener("click", function () {
  html2canvas(document.querySelector("body")).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    // 가로 방향으로 PDF 생성
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    // 이미지를 PDF 페이지에 꽉 차게 추가
    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

    // PDF 파일 저장
    pdf.save("table.pdf");
  });
});

// document.addEventListener("DOMContentLoaded", loadPlayerStats);
document.querySelector(".tBtn").addEventListener("click", function () {
  location.reload();
});
