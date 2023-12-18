var header = document.querySelector("header");
var headerBtn = document.querySelector(".imgBtn");
var hModal = document.querySelector(".headerModal");
headerBtn.addEventListener("click", function () {
  hModal.classList.toggle("moveModal");
  hModal.classList.toggle("flex");
  headerBtn.classList.toggle("move");
});
