const { ConnectionBuilder } = require("electron-cgi");
const url = require("url");
const path = require("path");

import { app, BrowserWindow } from "electron";

let window: BrowserWindow | null;

const connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "./core/Core")
    .build();

connection.onDisconnect = () => {
    console.log("lost");
};

connection.send("greeting", "World from C#", (response: any) => {
    window.webContents.send("greeting", response);
    console.log(response);
    connection.close();
});

const createWindow = () => {
    window = new BrowserWindow({ width: 800, height: 600 });

    window.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true,
        }),
    );

    window.on("closed", () => {
        window = null;
    });
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
