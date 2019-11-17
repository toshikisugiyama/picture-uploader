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

![ER図](https://github.com/toshikisugiyama/picture-uploader/blob/develop/er.jpg "ER図")

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

### Laravel のインストール

```
laravel new picture_uploader
cd picture_uploader
valet link picture_uploader
```

`http://picture_uploader.test` でアクセスできる。

#### Laravel をインストールしたら...
##### 1. データベースを作る
###### postgreにログイン

```
psql -U postgres
Password for user postgres: 
psql (11.5, server 12.0)
WARNING: psql major version 11, server major version 12.
         Some psql features might not work.
Type "help" for help.

postgres=# create database picture_uploader;
CREATE DATABASE
postgres=# \q
```

##### 2. .env の編集
```
APP_NAME=PictureUploader
APP_URL=http://picture_uploader.test

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=picture_uploader
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

##### 3. app.php の編集
`'timezone'` と `'locale'` をそれぞれ `'Asia/Tokyo'` と `'ja'` に変更する。
```php:app.php
'timezone' => 'Asia/Tokyo',
'locale' => 'ja',
```

##### 4. .editorconfig の編集

```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 4
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml,js,json,html,scss,css,vue,blade.php}]
indent_size = 2
```

---

### フロントエンドの準備


#### webpack.mix.js を編集する

```js:webpack.mix.js
const mix = require('laravel-mix');
mix.browserSync({
  files: [
    "resources/views/index.blade.php",
    "public/css/app.css",
    "public/js/app.js"
  ],
  proxy: {
    target: "http://picture_uploader.test/"
  }
}).js('resources/js/app.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .version();
```

`npm run dev`

#### ルーティング

`routes/web.php` の編集

```php:web.php
<?php

Route::get('/{any?}', function () {
    return view('index');
})->where('any', '.+');
```

#### index.blade.php を作成する

```
touch resources/views/index.blade.php
```

#### index.blade.php を編集する

`resources/views/index.blade.php`

```php:index.blade.php
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{ config('app.name') }}</title>
  <script src="{{ mix('js/app.js') }}" deffer></script>
  <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body>
  <div id='app'></div>
</body>
</html>
```

#### app.js を編集する

`resources/js/app.js`

```js:app.js
import Vue from 'vue'

new Vue({
  el: '#app',
  template: '<h1>Hello world</h1>'
})
```

`npm run watch`

ブラウザに表示される。

---

### Vue Router

#### vue-router のインストール

```
npm install -D vue-router
```

#### ルートコンポーネントの作成

`resources/js/App.vue` を作成する

```
touch resources/js/App.js
```


`resources/js/App.vue` を編集する

```js:App.vue
<template>
  <div>
    <main>
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>
```

#### ページコンポーネント

`resources/js/pages` を作成する

```
mkdir resources/js/pages
```

`resources/js/pages/PhotoList.vue` と `resources/js/pages/Login.vue` を作成する

```
touch resources/js/pages/{PhotoList,Login}.vue
```

##### Login.vue の編集

`resources/js/pages/Login.vue`

```js:Login.vue
<template>
  <h1>Login</h1>
</template>
```

##### PhotoList.vue の編集

`resources/js/pages/PhotoList.vue`

```js:PhotoList.vue
<template>
  <h1>Photo List</h1>
</template>
```

#### ルーティング

##### router.js

`resources/js/router.js` を作成する

```
touch resources/js/router.js
```

`resources/js/router.js` を編集する

```js:router.js
import Vue from'vue'
import VueRouter from 'vue-router'

import PhotoList from './pages/PhotoList.vue'
import Login from './pages/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: PhotoList
  },
  {
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
```

history モードを使うとURLに`#`が付かなくなる。

##### app.js

`resources/js/app.js` を編集する

```js:app.js
import Vue from 'vue'
import router from './router'
import App from './App.vue'

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App />'
})
```

`/` で `PhotoList` ページ、

`/login` で `Login` ページにアクセスできる。

---

### API 用のルート
`RouteServiceProvider.php` の編集
```php:RouteServiceProvider.php
protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api.php'));
    }
```

この部分を以下のように変更

```php:RouteServiceProvider.php
protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('web')
             ->namespace($this->namespace)
             ->group(base_path('routes/api.php'));
    }
```

---
### テストの準備

#### インメモリのSQLite

##### `config/database.php` の `connections` に追加する。

`config/database.php`

```php:database.php
'sqlite_testing' => [
    'driver' => 'sqlite',
    'database' => ':memory:',
    'prefix' => '',
],
```

##### `phpunit.xml` を編集

`<server name="DB_CONNECTION" value="sqlite_testing"/>` を追加する。

```xml:phpunit.xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd"
         backupGlobals="false"
         backupStaticAttributes="false"
         bootstrap="vendor/autoload.php"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>

        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <filter>
        <whitelist processUncoveredFilesFromWhitelist="true">
            <directory suffix=".php">./app</directory>
        </whitelist>
    </filter>
    <php>
        <server name="APP_ENV" value="testing"/>
        <server name="DB_CONNECTION" value="sqlite_testing"/>
        <server name="BCRYPT_ROUNDS" value="4"/>
        <server name="CACHE_DRIVER" value="array"/>
        <server name="MAIL_DRIVER" value="array"/>
        <server name="QUEUE_CONNECTION" value="sync"/>
        <server name="SESSION_DRIVER" value="array"/>
    </php>
</phpunit>
```

#### 会員登録API
会員登録APIのテストケースを作成する

```
php artisan make:test RegisterApiTest
```
`RegisterApiTest.php` を編集する。
```php:RegisterApiTest.php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class RegisterApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function should_新しいユーザーを作成して返却する()
    {
        $data = [
            'name' => 'photo upload user',
            'email' => 'test@email.com',
            'password' => 'test1234',
            'password_confirmation' => 'test1234',
        ];
        $response = $this->json('POST', route('register'), $data);
        $user = User::first();
        $this->assertEquals($data['name'], $user->name);
        $response->assertStatus(201)->assertJson(['name' => $user->name]);
    }
}
```
##### ルート定義

`routes/api.php`

```php:api.php
Routes::post('/register', 'Auth\RegisterController@register')->name('register');
```

##### コントローラー

`app/Http/Controllers/Auth/RegisterController.php` の `RegisterController` クラスに `registered` メソッドを追加する。

```php:RgisterController.php
    protected function registered(Request $request, $user)
    {
        return $user;
    }
```

##### テストの実施

テストを実施する。

```
./vendor/bin/phpunit --testdox
```

##### ログインAPI


