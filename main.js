const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os"); // Tempフォルダ用

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile("index.html");
}

// 動画ファイル選択
ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog({
    title: "動画ファイルを選択",
    filters: [
      { name: "動画ファイル", extensions: ["mp4", "mov", "avi", "mkv", "wmv"] }
    ],
    properties: ["openFile"]
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});

// 保存先フォルダ選択
ipcMain.handle("select-output-dir", async () => {
  const result = await dialog.showOpenDialog({
    title: "保存先フォルダを選択",
    properties: ["openDirectory"]
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});

// 変換処理（Tempフォルダに保存）
ipcMain.handle("convert", async (event, { filePath, formats, bitrate }) => {

  const codecMap = {
    mp3: "libmp3lame",
    aac: "aac",
    ogg: "libvorbis",
    opus: "libopus",
    wav: "pcm_s16le",
    flac: "flac",
    alac: "alac"
  };

  const autoBitrate = {
    wav: 1411,
    flac: 700,
    alac: 700
  };

  const results = [];

  for (const format of formats) {
    const codec = codecMap[format];

    let ffBitrate = bitrate;
    if (bitrate === "auto") {
      ffBitrate = autoBitrate[format] || 192;
    }

    // 一時フォルダに変換結果を作る
    const output = path.join(os.tmpdir(), `converted_${Date.now()}.${format}`);

    // 日本語パス対応
    const safeInput = `"${filePath.replace(/\\/g, "/")}"`;
    const safeOutput = `"${output.replace(/\\/g, "/")}"`;

    const cmd = `ffmpeg -i ${safeInput} -vn -acodec ${codec} -b:a ${ffBitrate}k ${safeOutput}`;

    console.log("実行コマンド:", cmd);

    await new Promise((resolve, reject) => {
      exec(cmd, (error) => {
        if (error) {
          console.error("ffmpeg エラー:", error);
          reject(error);
        } else {
          resolve();
        }
      });
    });

    results.push(output);
  }

  return results;
});

// 保存処理（Temp → ユーザー指定フォルダ）
ipcMain.handle("save-to-folder", async (event, { outputs, outputDir }) => {
  const savedFiles = [];

  for (const file of outputs) {
    const base = path.basename(file);
    const dest = path.join(outputDir, base);

    fs.copyFileSync(file, dest);
    savedFiles.push(dest);
  }

  return savedFiles;
});

app.whenReady().then(createWindow);
