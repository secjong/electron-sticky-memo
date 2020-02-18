// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const root = fs.readdirSync('/');

console.log(root);
let s3 = new S3();
console.log(s3);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let childWindowArray = [];

function createMainWindow(){
  console.log(process.platform);
  console.log(process.versions['chrome']);
  console.log(process.versions['node']);
  console.log(process.versions['electron']);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Enable live reload for Electron too
require('electron-reload')(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(path.join(__dirname, 'node_modules', 'electron')),
  hardResetMethod: 'exit'
});



/* 
 * 통신은 ipc로 하고
 * 메인프로세스의 api를 호출하기 위해서는 remote 사용
 */

// ipc 통신
ipcMain.on('getChildWindows', (event, arg) => {
  console.log(arg);
  event.reply('getChildWindows', childWindowArray);
  //event.sender.send('getChildWindows', childWindowArray); // 위와같음
});

ipcMain.on('addChildWindow', (event, arg) => {
  console.log(arg);

  // 채번하기
  let id = childWindowArray.length+1;
  let memoObj = {id: id, content: "내용"+id};
  childWindowArray.push(memoObj);
  event.reply('addChildWindow', childWindowArray);
});