import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
 
let getSize = []
let getPosition = []
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9081'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    frame: false,
    useContentSize: true,
    width: 1220,
    height: 800,
    minWidth: 1230,
    minHeight: 770,
    // width: 1366,
    // height: 768,
    // minWidth: 800,
    // minHeight: 600,
    show: false,
    // transparent:true
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    },
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(winURL);
 

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.on('did-finish-load', () => {
    mainWindow.setZoomFactor(1);
    mainWindow.setVisualZoomLevelLimits(1, 1);
    mainWindow.setLayoutZoomLevelLimits(0, 0);
  });

  // 加载好html再呈现window，避免白屏
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });


  // mainWindow.webContents.openDevTools({ detach: true });

  if (process.platform === 'darwin') {
    const template = [
      {
        label: "程序",
        submenu: [
          { label: "退出程序", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]
      }, 
      {
        label: "操作",
        submenu: [
          { label: "复制", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "黏贴", accelerator: "CmdOrCtrl+V", selector: "paste:" }
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }
}

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdatesAndNotify();
  // autoUpdater.checkForUpdatesAndNotify();
  createWindow();
  // mainWindow.openDevTools();

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * 边框
 */
// 窗口最小化
ipcMain.on('reMax-window', () => {
  if (mainWindow.isMaximized()) {

    if (getPosition && getPosition.length > 0) {
      mainWindow.setPosition(getPosition[0], getPosition[1])
    }
    console.log('reMax-window getSize', getSize)
    if (getSize && getSize.length > 0) {
      mainWindow.setSize(getSize[0], getSize[1])
    } else {
      mainWindow.setSize(1230, 770)
    }

  } else {
    getPosition = mainWindow.getPosition()
    // console.log(getPosition);
    // storage.setItem(`getPosition`, JSON.stringify(getPosition));
    getSize= mainWindow.getSize()
    mainWindow.maximize();
  }
});



// 窗口最小化
ipcMain.on('min-window', () => {
  mainWindow.minimize();
});
// 窗口最大化
ipcMain.on('max-window', () => {
  console.log(mainWindow)
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});
// 关闭
ipcMain.on('close-window', () => {
  mainWindow.close();
});









//开关监听
ipcMain.on('exitw', function (event, arg) {//监听渲染进程发送的mainCheck
  console.log('exitw-----', arg);// prints "ping"
  mainWindow.webContents.send('exitwMsg', arg); //主进程发送消息ping
});
//开关监听
ipcMain.on('exitNow', function (event, arg) {//监听渲染进程发送的mainCheck
  console.log('exitNow-----', arg);// prints "ping"
  mainWindow.webContents.send('exitNowMsg', arg); //主进程发送消息ping
});
//开关监听
ipcMain.on('mainCheck', function (event, arg) {//监听渲染进程发送的mainCheck
  console.log('开关监听监听成功-----', arg);// prints "ping"
  mainWindow.webContents.send('mainCheckMsg', arg); //主进程发送消息ping
});

process.on('warning', (e) => {
  console.log(e.stack)
})
//对冲消息监听
ipcMain.on('message', function (event, arg) {//监听渲染进程发送的message 
  console.log('对冲消息监听成功-----', arg);// prints "ping"
  mainWindow.webContents.send('hedgeMsg', arg); //主进程发送消息ping
});
/**
 * 导出下载
 */
ipcMain.on('download', (event, downloadPath) => {
  mainWindow.webContents.downloadURL(downloadPath);
  mainWindow.webContents.session.once('will-download', (event, item) => {
    item.once('done', (event, state) => {
      // 成功的话 state为completed 取消的话 state为cancelled
      mainWindow.webContents.send('downstate', state);
    });
  });
});


/**
 * 自动更新
 */

function sendUpdateMessage(message, data) {
  mainWindow.webContents.send('update-message', { message, data });
}

// 阻止程序关闭自动安装升级
autoUpdater.autoInstallOnAppQuit = false;

autoUpdater.on('error', data => {
  sendUpdateMessage('error', data);
});

/* // 检查更新
autoUpdater.on('checking-for-update', data => {
  sendUpdateMessage('checking-for-update', data);
});*/

// 有可用更新
autoUpdater.on('update-available', data => {
  sendUpdateMessage('update-available', data);
});

// 已经最新
autoUpdater.on('update-not-available', data => {
  sendUpdateMessage('update-not-available', data);
});

// 更新下载进度事件
autoUpdater.on('download-progress', data => {
  sendUpdateMessage('download-progress', data);
});
// 更新下载完成事件(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate)
autoUpdater.on('update-downloaded', () => {
  sendUpdateMessage('update-downloaded', {});
  ipcMain.once('update-now', () => {
    autoUpdater.quitAndInstall();
  });
});
