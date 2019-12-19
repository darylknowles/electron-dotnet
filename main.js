const { ConnectionBuilder } = require("electron-cgi");
const url = require("url");
const path = require("path");

const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;

let window;

function callDotNet(window) {
    // const connection = new ConnectionBuilder()
    //     .connectTo("dotnet", "run", "--project", "./core/Core")
    //     .build();

    const connection = new ConnectionBuilder()
        .connectTo("./core/bin/Debug/netcoreapp3.0/electron-dotnet.exe")
        .build();

    connection.onDisconnect = () => {
        console.log("lost");
    };

    connection.send("greeting", "World", (response) => {
        console.log(response);
        window.webContents.send('setGreeting', response);        
        connection.close();
    });

    connection.send("runloop", 150000, (response) => {
        console.log(response);
        window.webContents.send('setRunLoop', response);
        connection.close();
    });

    connection.on('theAnswer', (response) => {
        console.log(`The answer is ${response}`);
        window.webContents.send('setTheAnswer', response);        
    });

}

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

    window.openDevTools();
    
    window.on("closed", () => {
        window = null;
    });

    window.webContents.on('did-finish-load', () => {
        callDotNet(window);
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
