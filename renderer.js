// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// preload가 아닌 렌더러 프로세스에서 Node.js API 를 사용하려면 nodeIntegration: true 설정되어 있어야 함

const path = require('path');
const {ipcRenderer, remote} = require('electron');
// const {BrowserWindow} = require('electron').remote; // 메인프로세스의 모듈 접근법

window.addEventListener('DOMContentLoaded', () => {

  // 새 메모 만들기 버튼
  document.getElementById("newMemoBtn").addEventListener("click", () => {
    // 메인프로세스의 BrowserWindow 호출
    let childWindow = new remote.BrowserWindow({
      parent: remote.getCurrentWindow(), 
        width: 300,
        height: 400,
        frame: false,
        show: false,
        webPreferences: {
          preload: path.join(__dirname, 'renderer-process', 'memo.js'),
          nodeIntegration: true
        }
    });
    childWindow.loadFile(path.join(__dirname, 'views', 'memo.html'));
    childWindow.once('ready-to-show', () => {
      childWindow.show();
    });
    childWindow.webContents.openDevTools();
    addChildWindow();
  });

  // 세팅버튼
  document.getElementById("settingBtn").addEventListener("click", () => {
    alert("세팅");
  });

  // 닫기버튼
  document.getElementById("closeBtn").addEventListener("click", () => {
    window.close();
  });

  // 검색버튼
  document.getElementById("searchBtn").addEventListener("click", () => {
    getChildWindows();
  });

  getChildWindows();
});

// 메인프로세스에서 자식창을 가져옴
function getChildWindows(){
  let keyword = document.getElementById("keyword").value;
  ipcRenderer.send('getChildWindows', keyword);
}

ipcRenderer.on('getChildWindows', (event, arg) => {
  setCnt(arg);
});

// 메인프로세스에 자식창을 추가
function addChildWindow(){
  ipcRenderer.send('addChildWindow');
}

ipcRenderer.on('addChildWindow', (event, arg) => {
  setCnt(arg);
  setMemoList(arg);
});

function setCnt(arg){
  console.log(arg);
  document.getElementById('cnt').textContent = arg.length;
}

function setMemoList(arg){
  arg.forEach((item, index, thisArr) => {
    let node = document.createElement("LI");                 // Create a <li> node
    let textnode = document.createTextNode(item.content);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("memoList").appendChild(node);     // Append <li> to <ul> with id="myList"
  });
}

// 메모추가 => 메모장이 열림 => 파일을 생성 => 파일을 모두 읽음 => 파일목록을 반환 => 파일을 보여줌
// 모두 메인프로세스에서 하면 될듯... 원래 렌더러프로세스는 화면용이고, 메인프로세스에서 모든 로직을 처리하는게 맞음...