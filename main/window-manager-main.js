const { BrowserWindow, app } = require('electron');
const url = require('url');
const path = require('path');

const __DEV__ = process.env.NODE_ENV === 'development';

class WindowManagerMain {
    constructor() {
        this.windowOptions = {
            width: 560,
            height: 680,
            title: 'Linear Inequality Calculator',
            icon: __DEV__
                ? path.join(__dirname, '/../public/favicon.ico')
                : path.join(__dirname, `/../build/favicon.ico`),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                devTools: __DEV__,
                webSecurity: true,
                webgl: true,
                partition: 'persist:app',
                preload: path.join(__dirname, 'preload.js'),
            },
            maximizable: false,
            resizable: false,
            show: false,
        };
    }

    _getAppStartUrl() {
        if (__DEV__) {
            return `${process.env.APP_START_URL}/index.html`;
        }
        return url.format({
            pathname: path.join(__dirname, `/../build/index.html`),
            protocol: 'file:',
            slashes: true,
        });
    }

    createMainWindow() {
        this.mainWindow = new BrowserWindow(this.windowOptions);
        if (!__DEV__) {
            this.mainWindow.removeMenu();
        }
        this.mainWindow.loadURL(this._getAppStartUrl());
        this.mainWindow.on('ready-to-show', () => this.mainWindow.show());
    }

    run() {
        app.disableHardwareAcceleration();
        app.on('ready', () => {
            if (process.platform === 'win32') {
                app.setAppUserModelId('Calculator');
            }
            this.createMainWindow();
        });
        app.on('activate', function () {
            if (this.mainWindow === null) {
                this.createMainWindow();
            }
        });
    }
}

const windowManagerMain = new WindowManagerMain();
module.exports = windowManagerMain;
