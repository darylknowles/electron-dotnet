const { ConnectionBuilder } = require("electron-cgi");
const url = require("url");
const path = require("path");
const os = require("os");

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;

let window;
let connection;

const createWindow = () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
    });

    window.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true,
        }),
    );

    // window.openDevTools();

    window.on("closed", () => {
        connection.close();
        window = null;
    });

    window.webContents.on('did-finish-load', () => {

        let exeName; 

        if (os.platform() === 'WINDOWS') {
            exeName = "electron-dotnet.exe"; 
        } else {
            exeName = "electron-dotnet"; 
        }        

        connection = new ConnectionBuilder()
            .connectTo(`./core/bin/Debug/netcoreapp3.0/${exeName}`)
            .build();

        connection.onDisconnect = () => {
            console.log("lost");
        };

        connection.on('currentCount', (response) => {
            window.webContents.send('setCurrentCount', response);
            console.log(response);
        });

        connection.send("greeting", "World!", (response) => {
            window.webContents.send('setGreeting', response);
        });

        window.webContents.send('setRunLoop', "starting loop...");
        connection.send("runloop", 1000, (response) => {
            window.webContents.send('setRunLoop', response);
        });

    })

};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (window === null) {
        createWindow();
    }
});


