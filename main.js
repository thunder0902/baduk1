document.addEventListener("DOMContentLoaded", function () {
  var mainTitleBtn = document.querySelector(".mainTitleBtn");
  var mainTitleBox = document.querySelector(".mainTitleBox");
  var mkTable = document.querySelector(".mkTable");
  var usrInput = document.querySelector(".usrInput");
  var mainSpace = document.querySelector(".mainSpace");
  var namesList = [];
  let title;

  // 제목 입력 버튼 이벤트 리스너
  mainTitleBox.addEventListener("change", (e) => {
    title = e.target.value;
  });

  // 수정 버튼을 생성하고 이벤트 리스너를 추가하는 함수
  function createTitleAndEditButton() {
    mainTitleBox.classList.add("hide");
    mainTitleBtn.classList.add("hide");

    // 기존의 h1 제목 요소를 찾거나 새로운 것을 생성합니다.
    let nameElement =
      document.querySelector("header h1") || document.createElement("h1");
    nameElement.textContent = title; // 입력된 제목으로 설정합니다.
    nameElement.classList.add("headerTitle"); // 클래스 추가

    // 만약 h1 요소가 새로 생성된 경우에만 header에 추가합니다.
    if (!nameElement.parentElement) {
      document.querySelector("header").appendChild(nameElement);
    }

    // 수정 버튼 생성 및 이벤트 리스너 추가
    let editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.classList.add("editTitleBtn");
    document.querySelector(".btnList").appendChild(editBtn);

    // 수정 버튼 클릭 이벤트 리스너
    editBtn.addEventListener("click", function () {
      // 제목을 다시 편집 가능하게 만듭니다.
      nameElement.remove(); // 기존의 h1 요소 제거
      editBtn.remove(); // 수정 버튼 제거
      mainTitleBox.value = title; // input에 현재 제목을 기본값으로 설정
      mainTitleBox.classList.remove("hide");
      mainTitleBtn.classList.remove("hide");
    });
    saveData();
  }
  // 팝업 생성 함수
  function createPopup() {
    var popupExists = document.querySelector(".popup");
    if (!popupExists) {
      var popupTemp = `
          <div class="popup">
            <div class="popupContainer">
              <div class="inputGroup">
                <input id="nameInput" type="text" class="nameInput" placeholder="여기에 이름을 입력하세요" />
                <button class="addButton">추가</button>
              </div>
              <ul class="inputList"></ul>
              <button class="closePopup">확인</button>
            </div>
          </div>`;
      document.body.insertAdjacentHTML("beforeend", popupTemp);

      document
        .querySelector(".closePopup")
        .addEventListener("click", closePopup);
      document
        .querySelector(".addButton")
        .addEventListener("click", addNameToList);
    } else {
      popupExists.classList.remove("hide");
    }
  }

  // 이름 추가 함수
  function addNameToList() {
    var nameInput = document.querySelector(".nameInput");
    var nameInputValue = nameInput.value.trim();
    if (nameInputValue && !namesList.includes(nameInputValue)) {
      namesList.push(nameInputValue);
      nameInput.value = "";
      saveData();
      updateNamesList();
    }
  }

  // 이름 목록 업데이트 함수
  function updateNamesList() {
    var inputList = document.querySelector(".inputList");
    inputList.innerHTML = "";
    namesList.forEach((name, index) => {
      var listItem = document.createElement("li");
      listItem.innerHTML = `<span>${name}</span><button class="removeBtn" data-index="${index}">삭제</button>`;
      inputList.appendChild(listItem);
    });
  }

  // 이름 삭제 함수
  function removeNameFromList(button) {
    var indexToRemove = parseInt(button.dataset.index, 10);
    namesList.splice(indexToRemove, 1);
    saveData();
    updateNamesList();
  }

  // 팝업 닫기 함수
  function closePopup() {
    var popup = document.querySelector(".popup");
    if (popup) {
      popup.classList.add("hide");
    }
  }

  // 대진표 그리드 생성 함수
  function createTableGrid() {
    mainSpace.innerHTML = ""; // 기존의 테이블을 제거합니다.
    var table = document.createElement("table");
    var thead = table.createTHead();
    var tbody = table.createTBody();
    var headerRow = thead.insertRow();

    headerRow.appendChild(document.createElement("th")); // 첫 번째 빈 셀
    namesList.forEach((name) => {
      var th = document.createElement("th");
      th.textContent = name;
      headerRow.appendChild(th);
    });
    headerRow.appendChild(document.createElement("th")); // 결과 열

    namesList.forEach((name, rowIndex) => {
      var row = tbody.insertRow();
      var headerCell = row.insertCell();
      headerCell.textContent = name;

      namesList.forEach((_, colIndex) => {
        var cell = row.insertCell();
        if (colIndex === rowIndex) {
          cell.textContent = "";
          cell.style.backgroundColor = "#66abd2";
        } else {
          var select = document.createElement("select");
          var defaultOption = new Option("--", "");
          var optionWin = new Option("승", "win");
          var optionLose = new Option("패", "lose");
          select.appendChild(defaultOption);
          select.appendChild(optionWin);
          select.appendChild(optionLose);

          select.addEventListener("change", function () {
            handleResultChange(rowIndex, colIndex, this.value, tbody);
          });

          cell.appendChild(select);
        }
      });

      var resultCell = row.insertCell();
      resultCell.textContent = "승: 0, 패: 0";
    });

    mainSpace.appendChild(table);
  }
  // 데이터 저장 함수
  function saveData() {
    const tableData = {
      title: title,
      namesList: namesList,
      results: [],
    };

    document
      .querySelectorAll(".mainSpace table tbody tr")
      .forEach((row, rowIndex) => {
        const rowResults = [];
        row.querySelectorAll("td select").forEach((select, colIndex) => {
          rowResults.push(select.value);
        });
        tableData.results.push(rowResults);
      });

    localStorage.setItem("tableData", JSON.stringify(tableData));
  }
  // 데이터 불러오기 함수
  function loadData() {
    const storedData = localStorage.getItem("tableData");
    if (storedData) {
      const tableData = JSON.parse(storedData);
      title = tableData.title; // 제목을 불러와서 변수에 저장
      namesList = tableData.namesList;
      createTableGrid(); // 대진표 생성
      if (title) {
        let titleElement = document.querySelector("header h1");
        if (!titleElement) {
          titleElement = document.createElement("h1");
          document
            .querySelector("header")
            .insertBefore(
              titleElement,
              document.querySelector("header").firstChild
            );
          document.querySelector("header h1").classList.add("headerTitle");
        }
        titleElement.textContent = title;

        // 수정 버튼과 입력 필드를 숨깁니다.
        mainTitleBox.classList.add("hide");
        mainTitleBtn.classList.add("hide");
      }
      // 저장된 결과를 대진표에 반영
      const tbody = document.querySelector(".mainSpace table tbody");
      if (tableData.results && tableData.results.length > 0) {
        tbody.querySelectorAll("tr").forEach((row, rowIndex) => {
          // results 배열에 rowIndex에 해당하는 배열이 있는지 확인합니다.
          const rowResults = tableData.results[rowIndex];
          if (rowResults) {
            const selects = row.querySelectorAll("td select");
            selects.forEach((select, colIndex) => {
              // rowResults 배열에 colIndex에 해당하는 값이 있는지 확인합니다.
              const resultValue = rowResults[colIndex];
              if (select && resultValue !== undefined) {
                select.value = resultValue;
                // ...
              }
            });
          }
        });
      }
      updateResults(tbody); // 결과를 업데이트합니다.
    }
  }

  loadData();
  // 삭제버튼
  var deleteTableBtn = document.querySelector(".deleteTable");
  deleteTableBtn.addEventListener("click", deleteTable);
  function deleteTable() {
    // 로컬 저장소에서 대진표 데이터 삭제
    localStorage.removeItem("tableData");

    // 페이지에서 대진표 요소 삭제
    var table = document.querySelector(".mainSpace table");
    if (table) {
      table.remove();
    }

    // 참가자 목록과 타이틀 초기화
    namesList = [];
    title = "";

    // 제목 요소가 있으면 제거
    var titleElement = document.querySelector("h1");
    if (titleElement) {
      titleElement.remove();
    }

    // 제목 입력 필드와 버튼을 다시 표시
    mainTitleBox.classList.remove("hide");
    mainTitleBtn.classList.remove("hide");

    // 참가자 목록을 비웁니다.
    var inputList = document.querySelector(".inputList");
    if (inputList) {
      inputList.innerHTML = "";
    }

    // 제목 입력 필드를 비웁니다.
    mainTitleBox.value = "";
  }
  // 결과 변경 핸들러
  function handleResultChange(row, col, result, tbody) {
    // 현재 선택한 셀
    var currentCell = tbody.rows[row].cells[col + 1];
    var opponentCell =
      tbody.rows[col] && tbody.rows[col].cells[row + 1]
        ? tbody.rows[col].cells[row + 1].querySelector("select")
        : null;

    if (result === "win") {
      opponentCell.value = "lose";
      currentCell.style.backgroundColor = "red"; // 승리일 때 빨간색
      tbody.rows[col].cells[row + 1].style.backgroundColor = "green"; // 상대방 셀은 초록색 (패배)
    } else if (result === "lose") {
      opponentCell.value = "win";
      currentCell.style.backgroundColor = "green"; // 패배일 때 초록색
      tbody.rows[col].cells[row + 1].style.backgroundColor = "red"; // 상대방 셀은 빨간색 (승리)
    } else {
      opponentCell.value = "";
      currentCell.style.backgroundColor = ""; // 결과가 '--' 일 때 배경색 제거
      tbody.rows[col].cells[row + 1].style.backgroundColor = ""; // 상대방 셀 배경색도 제거
    }
    saveData(); // 변경사항 저장
    updateResults(tbody);
  }

  // 결과 업데이트 함수
  function updateResults(tbody) {
    var wins = new Array(namesList.length).fill(0);
    var losses = new Array(namesList.length).fill(0);

    // 행과 열을 순회하면서 승패를 계산합니다.
    for (let row = 0; row < tbody.rows.length; row++) {
      for (let col = 0; col < row; col++) {
        // row가 col보다 클 때만 검사합니다.
        let select = tbody.rows[row].cells[col + 1].querySelector("select"); // +1은 header cell을 건너뛰기 위함입니다.
        if (select) {
          let result = select.value;
          if (result === "win") {
            wins[row]++;
            losses[col]++;
          } else if (result === "lose") {
            losses[row]++;
            wins[col]++;
          }
        }
      }
    }

    // 계산된 승패를 결과 셀에 반영합니다.
    for (let i = 0; i < namesList.length; i++) {
      let resultCell = tbody.rows[i].cells[namesList.length + 1]; // 마지막 셀에 결과를 표시합니다.
      resultCell.textContent = `승: ${wins[i]}, 패: ${losses[i]}`;
    }
  }
  // 이벤트 리스너 등록
  document.body.addEventListener("click", function (event) {
    if (event.target.className === "removeBtn") {
      removeNameFromList(event.target);
    }
  });

  mainTitleBtn.addEventListener("click", createTitleAndEditButton);
  mkTable.addEventListener("click", createTableGrid);
  usrInput.addEventListener("click", createPopup);
});
