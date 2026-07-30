# MooVoice  
動画ファイルから音声ファイルを簡単に抽出できる、シンプルなデスクトップアプリ。  
初心者でも直感的に使える UI を備えています。  
名前は AI に考えてもらいました笑

## 🎧 機能

- 動画ファイル（mp4 / mov / avi / mkv / wmv）を選択  
- 音声形式を選択（mp3 / aac / ogg / opus / wav / flac / alac）  
- 形式に応じたビットレート選択（固定 or 自動）  
- FFmpeg を使った高速・高品質な音声抽出  
- 変換結果は一時フォルダに保存  
- ユーザーが選んだ保存先フォルダへコピー  
- 日本語パス・OneDrive パスにも対応  
- シンプルで軽量な UI  

## 📦 インストール方法

### 1. リポジトリをクローン
```bash
git clone https://github.com/yourname/MooVoice.git
cd MooVoice
```

### 2. 依存関係をインストール
```bash
npm install
```

### 3. Electron をインストール
```bash
npm install electron
```

### 4. FFmpeg をインストール
Windows: https://www.gyan.dev/ffmpeg/builds/

ダウンロードした ffmpeg フォルダ内の `bin/ffmpeg.exe` を PATH に追加しておく

### 5. アプリを起動
```bash
npm start
```

## 🚀 使い方

### 0. アプリを起動する
```bash
npm start
```

1. 「動画ファイルを選択」ボタンから動画を選ぶ  
2. 変換したい音声形式を選ぶ  
3. ビットレートを選ぶ  
4. 「変換する」を押す  
5. 変換完了後、保存先フォルダを選ぶ  

## 📁 ディレクトリ構成

```
MooVoice/
├── main.js          # メインプロセス
├── preload.js       # IPC ブリッジ
├── index.html       # UI
├── style.css        # UI スタイル
├── package.json     # 依存関係・起動スクリプト
└── README.md
```

## 🔧 注意点

- FFmpeg が PATH に入っていないと変換できません  
- 日本語パス対応済みですが、環境によっては PowerShell が必要な場合があります  
- 変換結果は一時フォルダに生成されます  

## 🔧 関数の説明（index.html内のscript / main.js / preload.js）

---

### 🎨 Renderer（index.html 内 `<script>`）

#### `selectBtn.onclick`
動画ファイル選択ダイアログを開く。  
`window.api.selectFile()` を呼び出し、選択されたパスを UI に反映する。

#### `formatSelect.onchange`
選択された音声形式に応じて、ビットレート候補を自動で更新する。  
`wav / flac / alac` は自動固定のためビットレート選択を無効化。

#### `convertBtn.onclick`
音声変換処理のメイン関数。  
1. 進行中表示を ON  
2. `window.api.convert()` を呼び出し FFmpeg で変換  
3. 保存先フォルダを `window.api.selectOutputDir()` で選択  
4. `window.api.saveToFolder()` でコピー  
5. 完了メッセージを表示

---

### 🖥 Main Process（main.js）

#### `ipcMain.handle("select-file")`
動画ファイル選択ダイアログを表示し、選択されたファイルパスを返す。

#### `ipcMain.handle("select-output-dir")`
保存先フォルダ選択ダイアログを表示し、選択されたフォルダパスを返す。

#### `ipcMain.handle("convert")`
FFmpeg を使って音声抽出を行うメイン処理。

- `codecMap`：形式ごとのコーデック  
- `autoBitrate`：自動ビットレート  
- 一時フォルダ（`os.tmpdir()`）に変換結果を保存  
- 日本語パス対応のため `"..."` でパスを囲む  
- `exec()` で FFmpeg コマンドを実行  
- 変換されたファイルパスを配列で返す

#### `ipcMain.handle("save-to-folder")`
変換されたファイルをユーザー指定フォルダへコピーする処理。  
コピー後の保存パス一覧を返す。

---

### 🔌 Preload（preload.js）

#### `window.api.selectFile()`
Main の `select-file` を呼び出し、動画ファイルパスを取得。

#### `window.api.selectOutputDir()`
保存先フォルダ選択ダイアログを呼び出す。

#### `window.api.convert(data)`
Main の `convert` を呼び出し、FFmpeg 変換を実行する。

#### `window.api.saveToFolder(data)`
変換結果を指定フォルダへコピーする。

## ✨ 作者

**たいが**  
まだまだ未熟なのでへんなバグとかコードが変なところあるかもですが、ご了承を。
