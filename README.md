# README.md
## 運用
* スプレッドシート "m_league_org_api" を更新
  - 更新は管理者画面よりおこなうことができる

## 開発
* サーバ立ち上げ
  * CROSエラーを回避するため
    * CROSとは、.jsがローカルファイルを読み込むことを禁止するセキュリティ制限
  ```
  python3 -m http.server 8000
  ※ index.htmlの配置場所で実行すること
  ```
* ブラウザを立ち上げる
  * localhost:8000にアクセス
* ブラウザ操作（画面更新）
  ```
  cmd + R
  ``` 
* サーバー停止
  ```
  ctrl + C
  ```

## デプロイ
### GitHub Pages(準備)
* GitHubにログインする
* 新しいリポジトリを作成する
  * 公開区分は"Public"にする
### GitHub Pages(初回)
* アップロード
  * 作成したリポジトリを開く
  * 画面中央あたりの青枠内のメニュー内
    * uploading an existing file.を選択
  * 対象ファイルを全てアップロード
    * ディレクトリ構成はそのまま
  * 画面下部の"Commit changes"を選択
* 公開設定
  * 画面上部の"Settings"を選択
  * 左メニューから"Pages"を選択
    * 項目"Build and deployment"内
      * 項目"Branch","None"を"main"に変更、"Save"
* 公開確認
  * 1-2分で公開される（上記設定でビルド開始）
  * 画面上部の"Actions"を選択
    * 緑ランプ、かつ、"pages build and deployment"で成功
* アクセス
  * 画面上部の"Settings"を選択
    * 画面中央トップの"Your site is live at..."の箇所がURL
### GitHub Pages(更新)
* リポジトリにアクセス
* 更新するディレクトリにアクセス
  * 画面上部右上にある"Add file"から"Upload files"を選択
  * 対象のファイルをアップロード
  * 画面下部の"Commit changes"欄
    * コミットコメントを入力
    * "Commit changes"を選択

