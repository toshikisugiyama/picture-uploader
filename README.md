# 写真共有アプリ

### 環境

- Node v10.15.3
- npm 6.11.3
- PHP 7.3.11
- Laravel Framework 6.5.0
- React

### 機能一覧

- 写真一覧表示
- 写真投稿 (会員のみ)
- 写真にlikeをつける (会員のみ)
- 写真likeを外す (会員のみ)
- 写真コメント追加 (会員のみ)
- 写真like数表示
- 写真コメント表示
- 会員登録
- ログイン
- ログアウト (会員のみ)

### データベース設計

- users テーブル
- pictures テーブル
- likes テーブル
- comments テーブル

### テーブル

#### photos テーブル

|列名|型|PRIMARY|UNIQUE|NOT NULL|FOREIGN|
|:--|:--|:--|:--|:--|:--|
|id|bigInteger|Y|Y|Y||
|user_id|bigInteger||||Y|users(id)|
|filename|varchar(255)|||Y||
|created_at|timestamp|||||
|updated_at|timestamp|||||

#### comments テーブル

|列名|型|PRIMARY|UNIQUE|NOT NULL|FOREIGN|
|:--|:--|:--|:--|:--|:--|
|id|bigInteger|Y|Y|Y||
|photo_id|bigInteger|||Y|photos(id)|
|user_id|bigInteger|||Y|users(id)|
|content|text|||Y||
|created_at|timestamp|||||
|updated_at|timestamp|||||

#### likes テーブル

|列名|型|PRIMARY|UNIQUE|NOT NULL|FOREIGN|
|:--|:--|:--|:--|:--|:--|
|id|bigInteger|Y|Y|Y||
|photo_id|bigInteger|||Y|photos(id)|
|user_id|bigInteger|||Y|users(id)|
|created_at|timestamp|||||
|updated_at|timestamp||||

#### users テーブル

|列名|型|PRIMARY|UNIQUE|NOT NULL|FOREIGN|
|:--|:--|:--|:--|:--|:--|
|id|bigInteger|Y|Y|Y||
|name|varchar(255)|||Y||
|email|varchar(255)||Y|Y||
|password|varchar(255)||Y|Y||
|remember_token|varchar(100)|||||
|email_verified_at|timestamp|||||
|created_at|timestamp||||
|updated_at|timestamp||||

### ER図

![ER図](https://github.com/toshikisugiyama/picture-uploader/blob/master/er.jpg "ER図")

### URL 一覧

|URL|メソッド|認証|内容|
|:--|:--|:--|:--|
|/api/phptos|GET||写真一覧取得|
|/api/photos|POST|Y|写真投稿|
|/api/photos/{id}|GET||写真詳細取得|
|/api/photos/{id}/like|PUT|Y|写真いいね追加|
|/api/photos/{id}/like|DELETE|Y|写真いいね解除|
|/api/photos/{id}/comments|POST|Y|写真コメント追加|
|/api/register|POST||会員登録|
|/api/login|POST||ログイン|
|/api/login|POST|Y|ログアウト|
|/api/user|GET||認証ユーザ取得|
|/|GET||HTMLを最初に返却|
|/photos/{id}/download|GET||写真ダウンロード|

### フロントエンド

|URL|内容|
|:--|:--|
|/|写真一覧ページ|
|/photos/{id}|写真一覧ページ|
|/login|ログイン・会員登録ページ|

---

### 目次

#### [ドキュメント](https://github.com/toshikisugiyama/picture-uploader/blob/master/documents/document1.md)
