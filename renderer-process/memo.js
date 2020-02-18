const path = require('path');
const {ipcRenderer, remote} = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  // 닫기버튼
  document.getElementById("closeBtn").addEventListener("click", () => {
    window.close();
  });

  // textarea 입력시
  document.getElementById("contentArea").addEventListener("keyup", resizeToContent);

});

// 리사이즈시
window.addEventListener("resize", resizeToScroll);

function resizeToContent(obj) {
  let height = window.innerHeight;
  document.getElementById("contentArea").style.height = height;
};

function resizeToScroll(obj) {
  let height = window.innerHeight;
  document.getElementById("contentArea").style.height = height+"px";
};
