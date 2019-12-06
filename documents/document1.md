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

↑ `use Illuminate\Http\Request;` も忘れずに書いておく。


##### テストの実施

テストを実施する。

```
./vendor/bin/phpunit --testdox
```

#### ログインAPI

```
php artisan make:test LoginApiTest
```

`test/Feature/LoginApiTest.php` を編集

```php:LoginApiTest.php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class LoginApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_登録済みのユーザーを認証して返却する()
    {
        $response = $this->json('POST', route('login'), [
            'email' => $this->user->email,
            'password' => 'password',
        ]);
        $response
            ->assertStatus(200)
            ->assertJson(['name' => $this->user->name]);
        $this->assertAuthenticatedAs($this->user);
    }
}
```

`routes/api.php` に以下を追加

```php:api.php
Route::post('/login', 'Auth\LoginController@login')->name('login');
```

`app/Http/Controllers/Auth/LoginController.php` を編集

`LoginController` クラスに以下を追加する

```php:LoginController.php
    protected function authenticated(Request $request, $user)
    {
        return $user;
    }
```
↑ `use Illuminate\Http\Request;` を忘れずに書く。

#### ログアウトAPI

```
php artisan make:test LogoutApiTest
```

`tests/Feature/LogoutApiTest.php`

```php:LogoutApiTest.php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class LogoutApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_認証済みのユーザーをログアウトさせる()
    {
        $response = $this->actingAs($this->user)->json('POST', route('logout'));
        $response->assertStatus(200);
        $this->assertGuest();
    }
}
```

`routes/api.php` に以下を追加

```php:api.php
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
```

`app/Http/Controllers/Auth/LoginController.php` を編集

`LoginController` クラスに以下を追加

```php:LoginController.php
    protected function loggedOut(Request $request)
    {
        $request->session()->regenerate();
        return response()->json();
    }
```

---

### ヘッダーとフッター

#### ヘッダーコンポーネント

##### `Navbar.vue` を作成する

```
mkdir resources/js/components && touch resources/js/components/Navbar.vue
```

`resources/js/components/Navbar.vue` 

```js:Navbar.vue
<template>
  <nav class="navbar">
    <RouterLink to="/">
      Picture Uploader
    </RouterLink>
    <div class="navbar-menu">
      <div class="navbar-item">
        <button class="button">
          Submit a photo
        </button>
      </div>
      <span class="navbar-item">
        username
      </span>
      <div class="navbar-item">
        <RouterLink class="button" to="/login">
          Login / Register
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
```

#### フッターコンポーネント

##### `Footer.vue` を作成する

```
touch resources/js/components/Footer.vue
```

`resources/js/components/Footer.vue`

```js:Footer.vue
<template>
  <footer class="footer">
    <button class="button">Logout</button>
    <RouterLink class="button" to="/login">
      Login /Register
    </RouterLink>
  </footer>
</template>
```

#### `App.vue` の編集

`resources/js/App.vue`

```js:App.vue
<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <div class="container">
        <RouterView />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>
```
---

### タブ機能の実装

#### タブUIの追加

`resources/js/pages/Login.vue`

```js:Login.vue
<template>
  <div class="login">
    <ul class="tab">
      <li
        class="tab-item"
        :class="{'active':(tab === 0)}"
        @click="tab=0"
      >
        Login
      </li>
      <li
        class="tab-item"
        :class="{'active':(tab === 1)}"
        @click="tab=1"
      >
        Register
      </li>
    </ul>
    <div v-show="tab === 0">
      <form class="form" @submit.prevent="login">
        <div class="form-contents">
          <div class="form-items">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-item"
              id="email"
              autocomplete="email"
              v-model="loginForm.email"
            >
          </div>
          <div class="form-items">
            <label for="password">Password</label>
            <input
              type="text"
              class="form-item"
              id="password"
              autocomplete="current-password"
              v-model="loginForm.password"
            >
          </div>
        </div>
        <div type="form-button">
          <button type="submit">login</button>
        </div>
      </form>
    </div>
    <div v-show="tab === 1">
      <div>
        <form class="form" @submit.prevent="register">
          <div class="form-contents">
            <div class="form-items">
              <label for="username">Name</label>
              <input
                type="text"
                class="form-item"
                id="username"
                autocomplete="username"
                v-model="registerForm.name"
              >
            </div>
            <div class="form-items">
              <label for="email">Email</label>
              <input
                type="text"
                class="form-item"
                id="email"
                autocomplete="email"
                v-model="registerForm.email"
              >
            </div>
            <div class="form-items">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-item"
                id="password"
                autocomplete="new-password"
                v-model="registerForm.password"
              >
            </div>
            <div class="form-items">
              <label for="password-confirmation">Name</label>
              <input
                type="password"
                class="form-item"
                id="password-confirmation"
                autocomplete="new-password"
                v-model="registerForm.password_confirmation"
              >
            </div>
          </div>
          <div class="form-button">
            <button type="submit" >Rgister</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      tab: 0,
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      }
    }
  },
  methods: {
    login(){
      console.log(this.loginForm)
    },
    register(){
      console.log(this.registerForm)
    }
  }
}
</script>
```

---

### Vuexの導入

#### インストール

```
npm install --save-dev vuex
```

#### ストアの作成

`resources/js/store/auth.js` の作成

```
mkdir resources/js/store && touch resources/js/store/auth.js
```

`resources/js/store/auth.js` の編集

```js:auth.js
const state = {}
const getters = {}
const mutations = {}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

`resources/js/store/index.js` の作成

```
touch resources/js/store/index.js
```

`resources/js/store/index.js` の編集

```js:index.js
import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth
  }
})

export default store
```

`resources/js/app.js` でストアを読み込む。

```js:app.js
import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App />'
})
```

---

### CSRF対策

`resources/js/util.js` を作成する。

```
touch resources/js/util.js
```

`resources/js/util.js` を編集する。

```js:util.js
/**
 * @param {String} searchKey 検索するキー
 * @returns {String} キーに対応する値
 */
export function getCookieValue(searchKey){
  if (typeof searchKey === 'undefined') {
    return ''
  }
  let val = ''
  document.cookie.split(';').forEach(cookie=>{
    const [key, value] = cookie.split('=')
    if (key === searchKey) {
      return val = value
    }
  })
  return val
}
```

`resources/js/bootstrap.js` に以下を追加する。

```js:bootstrap.js
import { getCookieValue } from './util'

window.axios.interceptors.request.use(config=>{
  config.headers['X-XSRF-TOKEN'] = getCookieValue('XSRF-TOKEN')
  return config
})
```

`resources/js/app.js` に以下を追加する。

```js:app.js
import './bootstrap'
```

---

### 会員登録

#### マイグレーション

```
php artisan migrate
```

#### ストアの実装

##### ステート

`user` を追加

`resources/js/store/auth.js`

```js:auth.js
const state = {
    user: null
}
```

##### ミューテーション

`setUser` を追加

`resources/js/store/auth.js`

```js:auth.js
const mutations = {
  setUser(state, user){
    state.user = user
  }
}
```

##### アクション

`register` アクションを追加

`resources/js/store/auth.js`

```js:auth.js
const actions = {
  async register(context, data){
    const response = await axios.post('/api/register', data)
    context.commit('setUser', response.data)
  }
}
```

#### コンポーネントの実装

`resources/js/pages/Login.vue ` の `register` メソッドを編集する。

```js:Login.vue
async register(){
    await this.$store.dispatch('auth/register', this.registerForm)
    this.$router.push('/')
}
```

---

### ログイン

##### アクション

`login` アクションを追加

`resources/js/store/auth.js`

```js:auth.js
const actions = {
  async register(context, data){
    const response = await axios.post('/api/register', data)
    context.commit('setUser', response.data)
  },
  async login(context, data){
    const response = await axios.post('/api/login', data)
    context.commit('setUser', response.data)
  }
}
```

#### コンポーネントの実装

`resources/js/pages/Login.vue` の `login` メソッドを編集する。

```js
async login(){
    await this.$store.dispatch('auth/login', this.registerForm)
    this.$router.push('/')
}
```
---

### ログアウト

#### アクション

`resources/js/store/auth.js`

```js:auth.js
const actions = {
  async register(context, data){
    const response = await axios.post('/api/register', data)
    context.commit('setUser', response.data)
  },
  async login(context, data){
    const response = await axios.post('/api/login', data)
    context.commit('setUser', response.data)
  },
  async logout(context){
    const response = await axios.post('/api/logout')
    context.commit('setUser', null)
  }
}
```

#### コンポーネントの実装

`resources/js/components/Footer.vue`

```js:Footer.vue
<template>
  <footer class="footer">
    <button class="button" @click="logout">Logout</button>
    <RouterLink class="button" to="/login">
      Login /Register
    </RouterLink>
  </footer>
</template>

<script>
export default {
  methods: {
    async logout(){
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>
```
---

### ステートによる要素の出し分け

#### ゲッターの追加

`resources/js/store/auth.js` にゲッターを追加する。

```js:auth.js
const getters = {
  check: state => !! state.user,
  username: state => state.user ? state.user.name : ''
}
```

#### ナビゲーションバー

`resources/js/components/Navbar.vue`

```js:Navbar.vue
<template>
  <nav class="navbar">
    <RouterLink to="/">
      Picture Uploader
    </RouterLink>
    <div class="navbar-menu">
      <div v-if="isLogin" class="navbar-item">
        <button class="button">
          Submit a photo
        </button>
      </div>
      <span v-if="isLogin" class="navbar-item">
        {{ username }}
      </span>
      <div v-else class="navbar-item">
        <RouterLink class="button" to="/login">
          Login / Register
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    isLogin(){
      return this.$store.getters['auth/check']
    },
    username(){
      return this.$store.getters['auth/username']
    }
  }
}
</script>
```

#### フッター

`resources/js/components/Footer.vue`

```js:Footer.vue
<template>
  <footer class="footer">
    <button v-if="isLogin" class="button" @click="logout">Logout</button>
    <RouterLink v-else class="button" to="/login">
      Login / Register
    </RouterLink>
  </footer>
</template>

<script>
export default {
  methods: {
    async logout(){
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  },
  computed: {
    isLogin(){
      return this.$store.getters['auth/check']
    }
  }
}
</script>
```
---

### 認証状態の維持

#### ユーザー取得API

##### テスト

```
php artisan make:test UserApiTest
```

`tests/Feature/UserApiTest.php` を編集する。

```php:UserApiTest.php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;

class UserApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_ログイン中のユーザーを返却する()
    {
        $response = $this->actingAs($this->user)->json('GET', route('user'));
        $response->assertStatus(200)->assertJson([
            'name' => $this->user->name,
        ]);
    }

    /**
     * @test
     */
    public function should_ログインされていない場合は空文字を返却する()
    {
        $response = $this->json('GET', route('user'));
        $response->assertStatus(200);
        $this->assertEquals("", $response->content());
    }
}
```

##### 実装

`routes/api.php` を編集する。

```php:api.php
<?php

use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/register', 'Auth\RegisterController@register')->name('register');
Route::post('/login', 'Auth\LoginController@login')->name('login');
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
Route::get('/user', function(){
    return Auth::user();
})->name('user');
```

#### 起動時のログインチェック

`resources/js/store/auth.js` に `currentUser` アクションを追加する。

```js:auth.js
const state = {
  user: null
}
const getters = {
  check: state => !! state.user,
  username: state => state.user ? state.user.name : ''
}
const mutations = {
  setUser(state, user){
    state.user = user
  }
}
const actions = {
  async register(context, data){
    const response = await axios.post('/api/register', data)
    context.commit('setUser', response.data)
  },
  async login(context, data){
    const response = await axios.post('/api/login', data)
    context.commit('setUser', response.data)
  },
  async logout(context){
    const response = await axios.post('/api/logout')
    context.commit('setUser', null)
  },
  async currentUser(context){
    const response = await axios.get('/api/user')
    const user = response.data || null
    context.commit('setUser', user)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

`resources/js/app.js` を編集し、Vueインスタンス生成前に `currentUser` アクションを呼び出すようにする。

```js:app.js
import './bootstrap'
import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'

const createApp = async() => {
  await store.dispatch('auth/currentUser')
  new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App />'
  })
}

createApp()
```

`currentUser` アクションの非同期処理が終わってからVueインスタンスが生成される。

非同期処理を `await` させるためには、 `async` メソッドの内部にいる必要があるため、起動処理を `createApp` 関数にまとめ、最後に呼び出している。


#### ミドルウェア

`app/Http/Middleware/RedirectIfAuthenticated.php`

ログインユーザー返却APIにリダイレクトするように編集する。

```php:RedirectIfAuthenticated.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->check()) {
            return redirect()->route('user');
        }

        return $next($request);
    }
}
```
---

### ナビゲーションガード

ログイン状態でログインページにアクセスした場合は、トップページに移動させるようにする。

[グローバルガード](https://router.vuejs.org/ja/guide/advanced/navigation-guards.html#%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%82%AC%E3%83%BC%E3%83%89)

> リダイレクトもしくはキャンセルによって遷移をガードするために主に使用されます。

#### ルート定義にナビゲーション

`resources/js/router.js` で `store` を読み込む。

```js:router.js
import Vue from'vue'
import VueRouter from 'vue-router'

import PhotoList from './pages/PhotoList.vue'
import Login from './pages/Login.vue'

import store from './store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: PhotoList
  },
  {
    path: '/login',
    component: Login,
    beforeEnter(to, from, next){
      if(store.getters['auth/check']){
        next('/')
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
```

`beforeEnter` 関数を使う。

- 第一引数 `to` はアクセスされようとしているルートのルートオブジェクト
- 第二引数 `from` はアクセス元のルート
- 第三引数 `next` はページの繊維先を決める関数

`next` の引数を指定しなければ、そのままページコンポーネントが切り替わる。

引数を指定して `next()` を呼ぶと、切り替わるはずだったページコンポーネントは生成されずに、引数のページに切り替わる。

---

### エラーハンドリング

- システムエラー
- バリデーションエラー
- 認証エラー
- Not Found エラー

#### システムエラー

500番エラー（Internal Internal Server Error）

- エラーコンポーネントの追加
- `error` ストアモジュールを追加
- `auth` モジュールでエラーが発生したときに `error` モジュールのステートを更新
- ルートコンポーネント `App.vue` で `error` モジュールのステートを `watch`
- 特定のエラーコードであればエラーページへ移動

##### システムエラーページ

`resources/js/pages/errors/System.vue` を作成する。

これがシステムエラーページを表すコンポーネント。

```
mkdir resources/js/pages/errors && touch resources/js/pages/errors/System.vue
```

```js:System.vue
<template>
  <p>システムエラーが発生しました。</p>
</template>
```

`resources/js/router.js` にシステムエラーのルート定義を追加する。

```js:router.js
import Vue from'vue'
import VueRouter from 'vue-router'
import PhotoList from './pages/PhotoList.vue'
import Login from './pages/Login.vue'
import store from './store'
import SystemError from './pages/errors/System.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: PhotoList
  },
  {
    path: '/login',
    component: Login,
    beforeEnter(to, from, next){
      if(store.getters['auth/check']){
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/500',
    component: SystemError,
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
```

##### レスポンスコード定義
`resources/js/util.js`

```js:util.js
export const OK = 200
export const CREATED = 201
export const INTERNAL_SERVER_ERROR = 500
```

`resources/js/store/error.js` を作成し、 `error` ストアモジュールを追加する。

```
touch resources/js/store/error.js
```

`resources/js/store/error.js`

```js:error.js
const state = {
  code: null
}

const mutations = {
  setCode(state, code){
    state.code = code
  }
}

export default {
  namespase: true,
  state,
  mutations
}
```

`resources/js/store/index.js` で `error` モジュールを読み込む。

```js:indexjs
import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import error from './error'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    error,
  }
})

export default store
```

##### auth ストア

`resources/js/store/auth.js` に、API呼び出しが成功したかどうかを示す `apiStatus` ステートを追加し、ミューテーションも追加する。

```js:auth.js
const state = {
  user: null,
  apiStatus: null
}

const mutations = {
  setUser(state, user){
    state.user = user
  },
  setApiStatus(state, status){
    state.apiStatus = status
  }
}
```

ステータスコードを読み込む。

`resources/js/store/auth.js`

```js:auth.js
import {OK} from '../util'
```

アクションを編集する。

`resources/js/store/auth.js`

```js:auth.js
async login(context, data){
  context.commit('setApiStatus', null)
  const response = await axios.post('/api/login', data).catch(err => err.response || err)
  if (response.status === OK) {
    context.commit('setApiStatus', true)
    context.commit('setUser', response.data)
    return faulse
  }
  context.commit('setApiStatus', faulse)
  context.commit('error/setCode', response.status, {root: true})
},
```

##### ページコンポーネント

通信失敗の場合、( `apiStatus` が `false` の場合) トップページへの移動処理を行わない制御

`resources/js/pages/Login.vue` の算出プロパティで `auth` モジュールの `apiStatus` ステートを参照する。

```js:Login.vue
computed: {
  apiStatus(){
    return this.$store.state.auth.apiStatus
  }
},
```

`resources/js/pages/Login.vue` で `apiStatus` が `true` の場合のみトップページに移動するようにする。

```js:login.vue
async login(){
  await this.$store.dispatch('auth/login', this.loginForm)
  if (this.apiStatus) {
    this.$router.push('/')
  }
},
```

##### ルートコンポーネント

`resources/js/App.vue` で `error` モジュールのステートを監視し、 `INTERNAL_SERVER_ERROR` の場合に、エラーページへ移動させる。

```js:App.vue
import {INTERNAL_SERVER_ERROR} from './util'
```

`INTERNAL_SERVER_ERROR` を読み込み、以下を追加する。

```js:App.vue
computed: {
    errorCode(){
      return this.$store.state.error.code
    },
  },
  watch: {
    errorCode: {
      handler(val){
        if (val === INTERNAL_SERVER_ERROR) {
          this.$router.push('/500')
        }
      },
      immediate: true
    },
    $route(){
      this.$store.commit('error/setCode', null)
    },
  },
```

#### バリデーションエラー

`auth` ストアモジュールにエラーメッセージを入れるステートを追加して、ページコンポーネント側で参照して表示させる。

##### レスポンスコード定義

Laravel はバリデーションエラーでは422をレスポンスするため、

`resources/js/util.js` にレスポンスコードの定義を追記する。

```js:util.js
export const UNPROCESSABLE_ENTITY = 422
```

##### authストア

`resources/js/store/auth.js` でステータスコードを読み込む。

```js:auth.js
import {OK,UNPROCESSABLE_ENTITY} from '../util'
```

`resources/js/store/auth.js` で、 `loginErrorMessages` ステートを追加し、ミューテーションも追加する。

```js:auth.js
const state = {
  user: null,
  apiStatus: null,
  loginErrorMessages: null,
}
```

`resources/js/store/auth.js` で、

ステータスコードが `UNPROCESSABLE_ENTITY` の場合は、 `error/setCode` の代わりに、 `setLoginErrorMessages` をエラーメッセージにセットする。

```js:auth.js
async login(context, data){
  context.commit('setApiStatus', null)
  const response = await axios.post('/api/login', data).catch(err => err.response || err)
  if (response.status === OK) {
    context.commit('setApiStatus', true)
    context.commit('setUser', response.data)
    return false
  }
  context.commit('setApiStatus', false)
  if (response.status === UNPROCESSABLE_ENTITY) {
    context.commit('setLoginErrorMessages', response.data.errors)
  } else {
    context.commit('error/setCode', response.status, {root: true})
  }
},
```

##### ページコンポーネント

算出プロパティで `loginErrorMessages` を参照する。

`resources/js/pages/Login.vue` で `mapState` を読み込む。

```js:Login.vue
import {mapState} from 'vuex'
```

`resources/js/pages/Login.vue` 

```js:Login.vue
computed: {
  ...mapState({
    apiStatus: state => state.auth.apiStatus,
    loginErrors: state => state.auth.loginErrorMessages,
  }),
},
```

`resources/js/pages/Login.vue` にエラーメッセージの表示欄を追加する。

```js:Login.vue
<form class="form" @submit.prevent="login">
  <div v-if="loginErrors" class="errors">
    <ul v-if="loginErrors.email">
      <li v-for="msg in loginErrors.email" :key="msg">{{ msg }}</li>
    </ul>
    <ul v-if="loginErrors.password">
      <li v-for="msg in loginErrors.password" :key="msg">{{ msg }}</li>
    </ul>
  </div>
```

---

### ログイン以外の機能にも適用

#### bootstrap

`resources/js/bootstrap.js` でレスポンスを受けた後の処理を上書きする。

- 第一引数が成功した時の処理。そのまま `response` を返す。
- 第二引数が失敗した時の処理。

```js:bootstrap.js
window.axios.interceptors.response.use(
  response => response,
  error => error.response || error
)
```

#### authストア

`resources/js/store/auth.js`

```js:auth.js
import {OK,CREATED,UNPROCESSABLE_ENTITY} from '../util'

const state = {
  user: null,
  apiStatus: null,
  loginErrorMessages: null,
  RegisterErrorMessages: null,
}
const getters = {
  check: state => !! state.user,
  username: state => state.user ? state.user.name : ''
}
const mutations = {
  setUser(state, user){
    state.user = user
  },
  setApiStatus(state, status){
    state.apiStatus = status
  },
  setLoginErrorMessages(state, messages){
    state.loginErrorMessages = messages
  },
  setRegisterErrorMessages(state, messages){
    state.RegisterErrorMessages = messages
  }
}
const actions = {
  // 会員登録
  async register(context, data){
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/register', data)
    if (response.status === CREATED) {
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data)
      return false
    }
    context.commit('setApiStatus', false)
    if (response.status === UNPROCESSABLE_ENTITY) {
      context.commit('setRegisterErrorMessages', response.data.errors)
    } else {
      context.commit('error/setCode', response.status, {root: true})
    }
  },
  // ログイン
  async login(context, data){
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/login', data).catch(err => err.response || err)
    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data)
      return false
    }
    context.commit('setApiStatus', false)
    if (response.status === UNPROCESSABLE_ENTITY) {
      context.commit('setLoginErrorMessages', response.data.errors)
    } else {
      context.commit('error/setCode', response.status, {root: true})
    }
  },
  // ログアウト
  async logout(context){
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/logout')
    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', null)
      return false
    }
    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, {root: true})
  },
  // ログインユーザーチェック
  async currentUser(context){
    context.commit('setApiStatus', null)
    const response = await axios.get('/api/user')
    const user = response.data || null
    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', user)
      return false
    }
    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, {root: true})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

#### 会員登録 & ログアウト

`resources/js/pages/Login.vue`

```js:Login.vue
<template>
  <div class="login">
    <ul class="tab">
      <li
        class="tab-item"
        :class="{'active':(tab === 0)}"
        @click="tab=0"
      >
        Login
      </li>
      <li
        class="tab-item"
        :class="{'active':(tab === 1)}"
        @click="tab=1"
      >
        Register
      </li>
    </ul>
    <div v-show="tab === 0">
      <form class="form" @submit.prevent="login">
        <div v-if="loginErrors" class="errors">
          <ul v-if="loginErrors.email">
            <li v-for="msg in loginErrors.email" :key="msg">{{ msg }}</li>
          </ul>
          <ul v-if="loginErrors.password">
            <li v-for="msg in loginErrors.password" :key="msg">{{ msg }}</li>
          </ul>
        </div>
        <div class="form-contents">
          <div class="form-items">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-item"
              id="email"
              autocomplete="email"
              v-model="loginForm.email"
            >
          </div>
          <div class="form-items">
            <label for="password">Password</label>
            <input
              type="text"
              class="form-item"
              id="password"
              autocomplete="current-password"
              v-model="loginForm.password"
            >
          </div>
        </div>
        <div type="form-button">
          <button type="submit">login</button>
        </div>
      </form>
    </div>
    <div v-show="tab === 1">
      <div>
        <form class="form" @submit.prevent="register">
          <div class="form-contents">
            <div v-if="registerErrors" class="errors">
              <ul v-if="registerErrors.name">
                <li v-for="msg in registerErrors.name" :key="msg">{{ msg }}</li>
              </ul>
              <ul v-if="registerErrors.email">
                <li v-for="msg in registerErrors.email" :key="msg">{{ msg }}</li>
              </ul>
              <ul v-if="registerErrors.password">
                <li v-for="msg in registerErrors.password" :key="msg">{{ msg }}</li>
              </ul>
            </div>
            <div class="form-items">
              <label for="username">Name</label>
              <input
                type="text"
                class="form-item"
                id="username"
                autocomplete="username"
                v-model="registerForm.name"
              >
            </div>
            <div class="form-items">
              <label for="email">Email</label>
              <input
                type="text"
                class="form-item"
                id="email"
                autocomplete="email"
                v-model="registerForm.email"
              >
            </div>
            <div class="form-items">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-item"
                id="password"
                autocomplete="new-password"
                v-model="registerForm.password"
              >
            </div>
            <div class="form-items">
              <label for="password-confirmation">Name</label>
              <input
                type="password"
                class="form-item"
                id="password-confirmation"
                autocomplete="new-password"
                v-model="registerForm.password_confirmation"
              >
            </div>
          </div>
          <div class="form-button">
            <button type="submit" >Rgister</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  data(){
    return {
      tab: 0,
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      }
    }
  },
  methods: {
    async logout(){
      await this.$store.dispatch('auth/logout')
      if (this.apiStatus) {
        this.$router.push('/login')
      }
    },
    async login(){
      await this.$store.dispatch('auth/login', this.loginForm)
      if (this.apiStatus) {
        this.$router.push('/')
      }
    },
    async register(){
      await this.$store.dispatch('auth/register', this.registerForm)
      if (this.apiStatus) {
        this.$router.push('/')
      }
    },
    clearError(){
      this.$store.commit('auth/setLoginErrorMessages', null)
      this.$store.commit('auth/registerErrorMessages', null)
    }
  },
  created(){
    this.clearError()
  },
  computed: {
    ...mapState({
      apiStatus: state => state.auth.apiStatus,
      loginErrors: state => state.auth.loginErrorMessages,
      registerErrors: state => state.auth.registerErrorMessages,
    }),
    ...mapGetters({
      isLogin: 'auth/check'
    }),
  },
}
</script>
```

---

## 写真投稿 Web API
### テスト  
テストコードを作成

```
php artisan make:test PhotoSubmitApiTest
```

`tests/Feature/PhotoSubmitApiTest.php`  

```php:PhotoSubmitApiTest.php
<?php

namespace Tests\Feature;

use App\Photo;
use App\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PhotoSubmitApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_ファイルをアップロードできる()
    {
        Storage::fake('s3');
        $response = $this->actingAs($this->user)->json('POST', route('photo.create'), [
            'photo' => UploadedFile::fake()->image('photo.jpg')
        ]);
        $response->assertStatus(201);
        $photo = Photo::first();
        $this->assertRegExp('/^[0-9a-zA-Z-_]{12}$/', $photo->id);
        Storage::cloud()->assertExists($photo->filename);
    }
    /**
     * @test
     */
    public function should_データベースエラーの場合はファイルを保存しない()
    {
        Schema::drop('photos');
        Storage::fake('s3');
        $response = $this->actingAs($this->user)->json('POST', route('photo.create'), [
            'photo' => UploadedFile::fake()->image('photo.jpg'),
        ]);
        $response->assertStatus(500);
        $this->assertEquals(0, count(Storage::cloud()->files));
    }

    /**
     * @test
     */
    public function should_ファイル保存エラーの場合はDBへの挿入はしない()
    {
        Storage::shouldRecieve('cloud')->once()->andReturnNull();
        $response = $this->actingAs($this->user)->json('POST', route('photo.create'), [
            'photo' => UploadedFile::fake()->image('photo.jpg'),
        ]);
        $response->assertStatus(500);
        $this->assertEmpty(Photo::all());
    }
}
```

---

### APIの実装
#### 各ファイルを作成

```
php artisan make:model -m -c -r Photo
php artisan make:model -m -c -r Like
php artisan make:model -m -c -r Comment
```

#### マイグレーション

photos, likes, comments table マイグレーションファイルを編集し、実行する。

```
php artisan migrate:fresh
```

#### モデル
`app/Photo.php`

```php:Photo.php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    /**
     * プライマリーキーの型
     */
    protected $keyType = 'string';

    /**
     * IDの桁数
     */
    const ID_LENGTH = 12;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        if (! array_get($this->attributes, 'id')) {
            $this->setId();
        }
    }

    /**
     * ランダムなID値をid属性に代入する
     */
    private function setId()
    {
        $this->attributes['id'] = $this->getRandomId();
    }

    /**
     * ランダムなID値を生成する
     * @return string
     */
    private function getRandomId()
    {
        $characters = array_merge(
            range(0, 9), range('a', 'z'),
            range('A', 'Z'), ['-', '_']
        );

        $length = count($characters);

        $id = "";

        for ($i=0; $i < self::ID_LENGTH; $i++) {
            $id .= $characters[random_int(0, $length -1)];
        }

        return $id;
    }
}
```

`App/User.php` に追加

```php:User.php
/**
 * リレーションシップ - photosテーブル
 * @return \Illuminate\Database\Eloquent\Relations\HasMany
 */
public function photos()
{
    return $this->hasMany('App\Photo');
}
```

#### ルーティング
`routes/api.php`

```php:api.php
Route::post('/photos', 'PhotoController@create')->name('photo.create');
```

#### フォームリクエスト

```
php artisan make:request StorePhoto
```

`app/Http/Requests/StorePhoto.php`

```php:StorePhoto.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhoto extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'photo' => 'required|file|mimes:jpg,jpeg,png,gif'
        ];
    }
}
```

#### コントローラー

`app/Http/Controllers/PhotoController.php` で

```php:PhotoController.php
use App\Photo;
use Illuminate\Http\Request;
use App\Http\Requests\StorePhoto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
```

それぞれ読み込み、 `create` メソッドを追加する。

```php:PhotoController.php
/**
 * Show the form for creating a new resource.
 * @param StorePhoto $request
 * @return \Illuminate\Http\Response
 */
public function create(StorePhoto $request)
{
    // 投稿写真の拡張子を取得する
    $extension = $request->photo->extension();
    $photo = new Photo();
    // ランダムな値と拡張子を組み合わせてファイル名にする
    $photo->filename = $photo->id . '.' . $extension;
    // s3にファイルを公開状態で保存する
    Storage::cloud()->putFileAs('', $request->photo, $photo->filename, 'public');
    // DBエラー時にファイル削除を行うため、トランザクションを利用する
    DB::beginTransaction();

    try {
        Auth::user()->photos()->save($photo);
        DB::commit();
    } catch(\Exception $exception) {
        DB::rollBack();
        // DBとの不整合を避けるためアップロードしたファイルを削除
        Storage::cloud()->delete($photo->filename);
        throw $exception;
    }
    // リソースの新規作成なのでレスポンスコードは201(CREATED)を返却する
    return response($photo, 201);
}
```

#### テストの実行

```
./vendor/bin/phpunit --testdox
```

#### S3操作ライブラリ

```
composer require league/flysystem-aws-s3-v3
```

---

### ファイルコンポーネント作成
#### PhotoForm
`PhotoForm.vue` を作成する。

```
resources/js/components/PhotoForm.vue
```

```js:PhotoForm.vue
<template>
  <div v-show="value" class="photo-form">
    <h2 class="title">Submit a photo</h2>
    <form class="form">
      <input type="file">
      <div>
        <button type="submit" class="button">submit</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    }
  }
}
</script>
```
#### Navbar
`resources/js/components/Navbar.vue`

```js:Navbar.vue
<template>
  <nav class="navbar">
    <RouterLink to="/">
      Picture Uploader
    </RouterLink>
    <div class="navbar-menu">
      <div v-if="isLogin" class="navbar-item">
        <button @click="showForm = ! showForm" class="button">
          Submit a photo
        </button>
      </div>
      <span v-if="isLogin" class="navbar-item">
        {{ username }}
      </span>
      <div v-else class="navbar-item">
        <RouterLink class="button" to="/login">
          Login / Register
        </RouterLink>
      </div>
    </div>
    <PhotoForm v-model="showForm" />
  </nav>
</template>

<script>
import PhotoForm from './PhotoForm'
export default {
  components: {
    PhotoForm,
  },
  data(){
    return{
      showForm: false,
    }
  },
  computed: {
    isLogin(){
      return this.$store.getters['auth/check']
    },
    username(){
      return this.$store.getters['auth/username']
    }
  }
}
</script>
```

### ファイルプレビュー
`resources/js/components/PhotoForm.vue`

```js:PhotoForm.vue
<template>
  <div v-show="value" class="photo-form">
    <h2 class="title">Submit a photo</h2>
    <form class="form">
      <input class="form-item" type="file" @change="onFileChange">
      <output class="form-output" v-if="preview">
        <img :src="preview" alt="">
      </output>
      <div class="form-item">
        <button type="submit" class="button">submit</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    }
  },
  data(){
    return {
      preview: null,
    }
  },
  methods: {
    onFileChange(event){
      if (event.target.files.length === 0) {
        this.reset()
        return false
      }
      if (!event.target.files[0].type.match('image.*')) {
        this.reset()
        return false
      }
      const reader = new FileReader()
      reader.onload = e => {
        this.preview = e.target.result
      }
      reader.readAsDataURL(event.target.files[0])
    },
    reset(){
      this.preview = '',
      this.$el.querySelector('input[type="file"]').value = null
    }
  },
}
</script>
```

### ファイル送信
#### API呼び出し
`resources/js/components/PhotoForm.vue`

```js:PhotoForm.vue
<template>
  <div v-show="value" class="photo-form">
    <h2 class="title">Submit a photo</h2>
    <form class="form" @submit.prevent="submit">
      <input class="form-item" type="file" @change="onFileChange">
      <output class="form-output" v-if="preview">
        <img :src="preview" alt="">
      </output>
      <div class="form-item">
        <button type="submit" class="button">submit</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    }
  },
  data(){
    return {
      preview: null,
      photo: null,
    }
  },
  methods: {
    onFileChange(event){
      if (event.target.files.length === 0) {
        this.reset()
        return false
      }
      if (!event.target.files[0].type.match('image.*')) {
        this.reset()
        return false
      }
      const reader = new FileReader()
      reader.onload = e => {
        this.preview = e.target.result
      }
      this.photo = event.target.files[0]
      reader.readAsDataURL(this.photo)
    },
    reset(){
      this.preview = '',
      this.photo = null
      this.$el.querySelector('input[type="file"]').value = null
    },
    async submit(){
      const formData = new FormData()
      formData.append('photo', this.photo)
      const response = await axiot.post('/api/photos', formData)
      this.reset()
      this.$emit('input', false)
    }
  },
}
</script>
```

#### 投稿完了後のページ遷移
##### 遷移先のページ作成

```
touch resources/js/pages/PhotoDetail.vue
```

`resources/js/pages/PhotoDetail.vue`

```js:PhotoDetail.vue
<template>
  <h1>Photo Detail</h1>
</template>
```

#### ルーティング & エラー処理
`resources/js/router.js`

```js:router.js
<template>
  <div v-show="value" class="photo-form">
    <h2 class="title">Submit a photo</h2>
    <form class="form" @submit.prevent="submit">
      <div class="errors" v-if="errors">
        <ul v-if="errors.photo">
          <li v-for="msg in errors.photo" :key="msg">
            {{ msg }}
          </li>
        </ul>
      </div>
      <input class="form-item" type="file" @change="onFileChange">
      <output class="form-output" v-if="preview">
        <img :src="preview" alt="">
      </output>
      <div class="form-item">
        <button type="submit" class="button">submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import {CREATED,UNPROCESSABLE_ENTITY} from '../util'
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    }
  },
  data(){
    return {
      preview: null,
      photo: null,
      errors: null,
    }
  },
  methods: {
    onFileChange(event){
      if (event.target.files.length === 0) {
        this.reset()
        return false
      }
      if (!event.target.files[0].type.match('image.*')) {
        this.reset()
        return false
      }
      const reader = new FileReader()
      reader.onload = e => {
        this.preview = e.target.result
      }
      this.photo = event.target.files[0]
      reader.readAsDataURL(this.photo)
    },
    reset(){
      this.preview = '',
      this.photo = null
      this.$el.querySelector('input[type="file"]').value = null
    },
    async submit(){
      const formData = new FormData()
      formData.append('photo', this.photo)
      const response = await axiot.post('/api/photos', formData)
      if (response.status === UNPROCESSABLE_ENTITY) {
        this.errors = response.data.errors
        return false
      }
      this.reset()
      this.$emit('input', false)
      if (response.status !== CREATED) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.$router.push(`/photos/${response.data.id}`)
    }
  },
}
</script>
```
### ローディング

```
touch resources/js/components/Loader.vue
```

`resources/js/components/Loader.vue`

```js:Loader.vue
<template>
  <div class="loader">
    <p class="loading-text">
      <slot>Loading...</slot>
    </p>
    <div class="loader-item">
      <div></div>
    </div>
  </div>
</template>
```

#### フォームコンポーネント
`resources/js/components/PhotoForm.vue`

```js:PhotoForm.vue
<template>
  <div v-show="value" class="photo-form">
    <h2 class="title">Submit a photo</h2>
    <div class="panel" v-show="loading">
      <Loader>Sending your photo...</Loader>
    </div>
    <form v-show="! loading" class="form" @submit.prevent="submit">
      <div class="errors" v-if="errors">
        <ul v-if="errors.photo">
          <li v-for="msg in errors.photo" :key="msg">
            {{ msg }}
          </li>
        </ul>
      </div>
      <input class="form-item" type="file" @change="onFileChange">
      <output class="form-output" v-if="preview">
        <img :src="preview" alt="">
      </output>
      <div class="form-item">
        <button type="submit" class="button">submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import {CREATED,UNPROCESSABLE_ENTITY} from '../util'
import Loader from './Loader.vue'

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    }
  },
  data(){
    return {
      loading: false,
      preview: null,
      photo: null,
      errors: null,
    }
  },
  methods: {
    components: {
      Loader,
    },
    onFileChange(event){
      if (event.target.files.length === 0) {
        this.reset()
        return false
      }
      if (!event.target.files[0].type.match('image.*')) {
        this.reset()
        return false
      }
      const reader = new FileReader()
      reader.onload = e => {
        this.preview = e.target.result
      }
      this.photo = event.target.files[0]
      reader.readAsDataURL(this.photo)
    },
    reset(){
      this.preview = '',
      this.photo = null
      this.$el.querySelector('input[type="file"]').value = null
    },
    async submit(){
      this.loading = true
      const formData = new FormData()
      formData.append('photo', this.photo)
      const response = await axiot.post('/api/photos', formData)
      this.loading = false
      if (response.status === UNPROCESSABLE_ENTITY) {
        this.errors = response.data.errors
        return false
      }
      this.reset()
      this.$emit('input', false)
      if (response.status !== CREATED) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.$router.push(`/photos/${response.data.id}`)
    }
  },
}
</script>
```

#### サクセスページ
##### メッセージストア作成

```
touch resources/js/store/message.js
```

`resources/js/store/message.js`

```js:message.js
const state = {
  content: ''
}

const mutations = {
  setContent(state, {content,timeout}){
    state.content = content
    if (typeof timeout === 'undefined') {
      timeout = 3000
    }
    setTimeout(() => (state.content = ''), timeout)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
```

`resources/js/store/index.js` で `message` モジュールを読み込む  

```js:index.js
import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import error from './error'
import message from './message'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    error,
    message,
  }
})

export default store
```

### コンポーネント構成
#### メッセージコンポーネント

`resources/js/components/Message.vue`

```js:Message.vue
<template>
  <div class="message" v-show="message">
    {{ message }}
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  computed: {
    ...mapState({
      message: state => state.message.content
    })
  }
}
</script>
```

#### フォームコンポーネント

`resources/js/components/PhotoForm.vue`

```js:PhotoForm.vue
async submit(){
  this.loading = true
  const formData = new FormData()
  formData.append('photo', this.photo)
  const response = await axiot.post('/api/photos', formData)
  this.loading = false
  if (response.status === UNPROCESSABLE_ENTITY) {
    this.errors = response.data.errors
    return false
  }
  this.reset()
  this.$emit('input', false)
  if (response.status !== CREATED) {
    this.$store.commit('error/setCode', response.status)
    return false
  }
  this.$store.commit('message/setContent', {
    contengt: '写真が投稿されました！',
    timeout: 6000
  })
  this.$router.push(`/photos/${response.data.id}`)
}
```

#### ルートコンポーネント

`resources/js/App.vue`

```js:App.vue
<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <div class="container">
        <Message />
        <RouterView />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Message from './components/Message.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import {INTERNAL_SERVER_ERROR} from './util'

export default {
  components: {
    Message,
    Navbar,
    Footer
  },
  computed: {
    errorCode(){
      return this.$store.state.error.code
    },
  },
  watch: {
    errorCode: {
      handler(val){
        if (val === INTERNAL_SERVER_ERROR) {
          this.$router.push('/500')
        }
      },
      immediate: true
    },
    $route(){
      this.$store.commit('error/setCode', null)
    },
  },
}
</script>
```

---

### JSONレスポンス
#### テストコード
##### ファクトリ
テストコード作成のためのファクトリを作る  

```
php artisan make:factory PhotoFactory
```

`database/factories/PhotoFactory.php`

```php:PhotoFactory.php
<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Faker\Generator as Faker;

$factory->define(App\Photo::class, function (Faker $faker) {
    return [
        //
        'id' => str_random(12),
        'user_id' => function () {
            return factory(App\User::class)->create()->id;
        },
        'filename' => str_random(12).'jpg',
        'created_at' => $faker->dateTime(),
        'updated_at' => $faker->dateTime(),
    ];
});
```

##### テストケース
テストを作る  

```
php artisan make:test PhotoListApiTest
```

`tests/Feature/PhotoListApiTest.php`

```php:PhotoListApiTest.php
<?php

namespace Tests\Feature;

use App\Photo;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PhotoListApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function should_正しい構造のJSONを返却する()
    {
        factory(Photo::class, 5)->create();
        $response = $this->json('GET', route('photo.index'));
        $photos = Photo::with(['owner'])->orderby('created_at', 'desc')->get();
        $expected_data = $photos->map(function($photo){
            return [
                'id' => $photo->id,
                'url' => $photo->url,
                'owner' => [
                    'name' => $photo->name,
                ],
            ];
        })->all();
        $response
        ->assertStatus(200)
        ->assertJsonCount(5, 'data')
        ->assertJsonFragment([
            'data' => $expected_data,
        ]);
    }
}
```

#### APIの実装
##### ルーティング
`routes/api.php` に追加する  

```php:api.php
Route::get('/photos', 'PhotoController@index')->name('photo.index');
```

##### Photoモデル
###### リレーションシップ & URLアクセサ
`app/Photo.php` に `owner` メソッドを追加  

```php:Photo.php
/**
 * リレーションシップ usersテーブル
 * @return \Illuminate\Database\Eloquent\Relations\BelongsTo 
 */
public function owner()
{
    return $this->belongsTo('App\User','user_id','id','users');
}

/**
 * アクセサ - url
 * @return string
 */
public function getUrlAttribute()
{
    return Storage::cloud()->url($this->attributes['filename']);
}

/**
 * JSONに含める属性
 */
protected $appends = [
    'url',
];

protected $visible = [
    'id', 'owner', 'url',
];
```

##### Userモデル
`app/User.php` を編集する

```php:User.php
/**
  * The attributes that should be hidden for arrays.
  *
  * @var array
  */
protected $hidden = [
    'password', 'remember_token',
];
```

を削除して、

```php:User.php
/**
 * JSONに含める属性
 * @var array
 */
protected $visible = [
    'name',
];
```

を追加する。

##### コントローラー
`app/Http/Controllers/PhotoController.php`

```php:PhotoController.php
public function index()
{
    $photos = Photo::with(['owner'])->orderBy(Photo::CREATED_AT, 'desc')->paginate();
    return $photos;
}
```
テスト実行する。  

```
./vendor/bin/phpunit --testdox
```

---

### ダウンロードリンク
#### ルート定義
`routes/web.php`  

```php:web.php
Route::get('/photos/{photo}/download', 'PhotoController@download');
```

#### コントローラー
`app/Http/Controllers/PhotoController.php`  

```php:PhotoController.php
public function __construct()
{
    // 認証が必要
    $this->middleware('auth')->except(['index', 'download']);
}

/**
 * 写真ダウンロード
 * @param Photo $photo
 * @return \Illuminate\Http\Response
 */
public function download(Photo $photo)
{
    // 写真の存在チェック
    if (! Storage::cloud()->exists($photo->filename)) {
        abort(404);
    }
    $headers = [
        'Content-Type' => 'application/octet-stream',
        'Content-Disposition' => 'attachment; filename="'.$photo->filename.'"',
    ];
    return response(Storage::cloud()->get($photo->filename), 200, $headers);
}
```
`/photos/{写真ID}/download` にアクセスして写真をダウンロードできるか確かめる。  

---

### Photoコンポーネント

```
touch resources/js/components/Photo.vue
```

`resources/js/components/Photo.vue`  

```js:Photo.vue
<template>
  <div class="photo">
    <figure class="photo-wrapper">
      <img
        :src="item.url"
        :alt="`Photo by ${item.owner.name}`"
        class="photo-image"
      >
    </figure>
    <RouterLink
      class="photo-overlay"
      :to="`/photos/${item.id}`"
      :title="`View the photo by ${item.owner.name}`"
    >
      <div class="photo-controls">
        <button
          class="photo-action"
          title="Like photo"
        >
          0
        </button>
        <a
          :href="`/photos/${item.id}/download`"
          @click.stop
          title="Download photo"
          class="photo-action"
        >
          ダウンロード
        </a>
      </div>
      <div class="photo-username">
        {{ item.owner.name }}
      </div>
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
  }
}
</script>
```

---

### PhotoListコンポーネント  
`resources/js/pages/PhotoList.vue`

```js:PhotoList.vue
<template>
  <div class="photo-list">
    <Photo
      class="photo-item"
      v-for="photo in photos"
      :key="photo.id"
      :item="photo"
    >
    </Photo>
  </div>
</template>

<script>
import {OK} from '../util'
import Photo from '../components/Photo.vue'
export default {
  components: {
    Photo
  },
  data(){
    return {
      photos: []
    }
  },
  methods: {
    async fetchPhotos(){
      const response = await axios.get('/api/photos')

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.photos = response.data.data
    }
  },
  watch: {
    $route: {
      async handler(){
        await this.fetchPhotos()
      },
      immediate: true
    }
  }
}
</script>
```

---

### ページネーション
#### ルート定義
`resources/js/router.js`  

```js:router.js
{
  path: '/',
  component: PhotoList,
  props: route => {
    const page = route.query.page
    return {
      page: /^[1-9][0-9]*$/.test(page)?page*1:1
    }
  }
},
```

```
touch resources/js/components/Pagination.vue
```

`resources/js/components/Pagination.vue`

```js:Pagination.vue
<template>
  <div class="pagination">
    <RouterLink
      v-if="! isFirstPage"
      :to="`/?page=${currentPage - 1}`"
      class="button"
    >
      prev
    </RouterLink>
    <RouterLink
      v-if="! isLastPage"
      :to="`/?page=${currentPage + 1}`"
      class="button"
    >
      next
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    lastPage: {
      type: Number,
      required: true,
    }
  },
  computed: {
    isFirstPage(){
      return this.currentPage === 1
    },
    isLastPage(){
      return this.currentPage === this.lastPage
    }
  }
}
</script>
```

`resources/js/pages/PhotoList.vue`

```js:PhotoList.vue
<template>
  <div class="photo-list">
    <Photo
      class="photo-item"
      v-for="photo in photos"
      :key="photo.id"
      :item="photo"
    >
    </Photo>
    <Pagination
      :current-page="currentPage"
      :last-page="lastPage"
    />
  </div>
</template>

<script>
import {OK} from '../util'
import Photo from '../components/Photo.vue'
import Pagination from '../components/Pagination.vue'
export default {
  components: {
    Photo,
    Pagination,
  },
  data(){
    return {
      photos: [],
      currentPage: 0,
      lastPage: 0,
    }
  },
  methods: {
    async fetchPhotos(){
      const response = await axios.get('/api/photos')

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.photos = response.data.data
      this.currentPage = response.data.current_page
      this.lastPage = response.data.last_page
    }
  },
  watch: {
    $route: {
      async handler(){
        await this.fetchPhotos()
      },
      immediate: true
    }
  }
}
</script>
```
---

### Web API
#### テスト

```
php artisan make:test PhotoDetailApiTest
```

`tests/Feature/PhotoDetailApiTest.php`

```php:PhotoDetailApiTest.php
<?php

namespace Tests\Feature;

use App\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhotoDetailApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function should_正しい構造のJSONを返却する()
    {
        factory(Photo::class)->create();
        $photo = Photo::first();
        $response = $this->json('GET',route('photo.show',[
            'id' =>  $photo->id,
        ]));
        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $photo->id,
                'url' => $photo->url,
                'owner' => [
                    'name' => $photo->owner->name,
                ],
            ],
        );
    }
}
```

#### ルート定義
`routes/api.php`  

```php:api.php
Route::get('/photos/{id}', 'PhotoController@show')->name('photo.show');
```

`app/Http/Controllers/PhotoController.php`  に `show` メソッドを追加  
`show` の認証必要も外す。

```php:PhotoController.php
public function __construct()
{
    // 認証が必要
    $this->middleware('auth')->except(['index', 'download', 'show']);
}
/**
 * 写真詳細
 * @param  string $id
 * @return Photo
 */
public function show(string $id)
{
    $photo = Photo::where('id', $id)->with(['owner'])->first();
    return $photo ?? abort(404);
}
```
---

### フロントエンド
#### PhotoDetailコンポーネント

`resources/js/pages/PhotoDetail.vue`

```js:PhotoDetail.vue
<template>
  <div
    v-if="photo"
    class="photo-detail"
    :class="{'photo-detail-column': fullWidth}"
  >
    <figure
      class="photo-detail-contents"
    >
      <img
        :src="photo.url"
        @click="fullWidth = ! fullWidth"
        alt=""
        width="100%"
        height="100%"
      >
      <figcaption>Posted by {{ photo.owner.name }}</figcaption>
    </figure>
    <div class="photo-detail-contents">
      <button>0</button>
      <a
        :href="`/photos/${photo.id}/download`"
        class="button"
        title="Download photo"
      >
        Download
      </a>
      <h2>
        Comments
      </h2>
    </div>
  </div>
</template>

<script>
import {OK} from '../util'
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data(){
    return{
      photo: null,
      fullWidth: false,
    }
  },
  methods: {
    async fetchPhoto(){
      const response = await axios.get(`/api/photos/${this.id}`)

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.photo = response.data
    },
  },
  watch: {
    $route: {
      async handler(){
        await this.fetchPhoto()
      },
      immediate: true,
    }
  }
}
</script>
```

---

### Web API
#### テスト

```
php artisan make:factory CommentFactory
```

`database/factories/CommentFactory.php`

```php:CommentFactory.php
<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Comment;
use App\User;
use Faker\Generator as Faker;

$factory->define(Comment::class, function (Faker $faker) {
    return [
        'content' => substr($faker->text, 0, 500),
        'user_id' => function(){
            return factory(User::class)->create()->id;
        }
    ];
});
```

#### 写真詳細取得テストケース

`tests/Feature/PhotoDetailApiTest.php`

```php:PhotoDetailApiTest.php
<?php

namespace Tests\Feature;

use App\Comment;
use App\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhotoDetailApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function should_正しい構造のJSONを返却する()
    {
        factory(Photo::class)->create()->each(function($photo){
            $photo->comments()->saveMany(factory(Comment::class, 3)->make());
        });
        $photo = Photo::first();
        $response = $this->json('GET',route('photo.show',[
            'id' =>  $photo->id,
        ]));
        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $photo->id,
                'url' => $photo->url,
                'owner' => [
                    'name' => $photo->owner->name,
                ],
                'comment' => $photo->comments
                                ->sortByDesc('id')
                                ->map(function($comment){
                                    return [
                                        'author' => [
                                            'name' => $comment->author->name,
                                        ],
                                        'content' => $comment->content,
                                    ];
                                })
                                ->all(),
            ],
        );
    }
}
```

#### コメント投稿テストケース

```
php artisan make:test AddCommentApiTest
```

`tests/Feature/AddCommentApiTest.php`

```php:AddCommentApiTest.php
<?php

namespace Tests\Feature;

use App\User;
use App\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AddCommentApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        // テストユーザー作成
        $this->user = factory(User::class)->create();
    }

    /**
     * @test
     */
    public function should_コメントを追加できる()
    {
        factory(Photo::class)->create();
        $photo = Photo::first();
        $content = 'sample content';
        $response = $this
            ->actingAs($this->user)
            ->json('POST', route('photo.comment', [
                'photo' => $photo->id,
            ]), compact('content'));
        $comments = $photo->comments()->get();
        $response->assertStatus(201)
                ->assertJsonFragment([
                    'author' => [
                        'name' => $this->user->name,
                    ],
                    'content' -> $content,
                ]);
        $this->assertEquals(1, $comments->count());
        $this->assertEquals($count, $comments[0]->content);
    }
}
```

#### ルート定義

`routes/api.php`

```php:api.php
Route::post('/photos/{photo}/comments', 'PhotoController@addComment')->name('photo.comment');
```

#### モデルクラス

`app/Comment.php`

```php:Comment.php
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /** JSONに含める属性 */
    protected $visible = [
        'author', 'content',
    ];

    /**
     * リレーションシップ - usersテーブル
     * @return Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function author()
    {
        return $this->belongsTo('App\User', 'user_id', 'id', 'users');
    }
}
```

#### Photo
`app/Photo.php`

```php:Photo.php
protected $visible = [
    'id', 'owner', 'url', 'comments',
];

/**
 * リレーションシップ - commentsテーブル
 * @return Illuminate\Database\Eloquent\Relations\HasMany
 */
public function comments()
{
    return $this->hasMany('App\Comment')->orderBy('id', 'desc');
}
```

#### フォームリクエスト

```
php artisan make:request StoreComment
```

`app/Http/Requests/StoreComment.php`

```php:StoreComment.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComment extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'content' => 'required|max:500',
        ];
    }
}
```

#### コントローラー
##### コメント投稿
`app/Http/Controllers/PhotoController.php`

```php:PhotoController.php
/**
 * コメント投稿
 * @param Photo $photo
 * @param StoreComment $request
 * @return Illuminate\Http\Response
 */
public function addComment(Photo $photo, StoreComment $request)
{
    $comment = new Comment();
    $comment->content = $request->get('content');
    $comment->user_id = Auth::user()->id;
    $photo->comments()->save($comment);

    // authorリレーションをロードするためにコメントを取得し直す
    $new_comment = Comment::where('id', $comment->id)->with('author')->first();

    return response($new_comment, 201);
}
```
#### テスト実行

```
./vendor/bin/phpunit --testdox
```

#### 写真詳細

`app/Http/Controllers/PhotoController.php`  

```php:PhotoController.php
/**
 * 写真詳細
 * @param  string $id
 * @return Photo
 */
public function show(string $id)
{
    $photo = Photo::where('id', $id)->with(['owner', 'comments.author'])->first();
    return $photo ?? abort(404);
}
```

---

### フロントエンド
#### コメント投稿
`resources/js/pages/PhotoDetail.vue`  

```js:PhotoDetail.vue
<template>
  <div
    v-if="photo"
    class="photo-detail"
    :class="{'photo-detail-column': fullWidth}"
  >
    <figure
      class="photo-detail-contents"
    >
      <img
        :src="photo.url"
        @click="fullWidth = ! fullWidth"
        alt=""
        width="100%"
        height="100%"
      >
      <figcaption>Posted by {{ photo.owner.name }}</figcaption>
    </figure>
    <div class="photo-detail-contents">
      <button>0</button>
      <a
        :href="`/photos/${photo.id}/download`"
        class="button"
        title="Download photo"
      >
        Download
      </a>
      <h2 class="photo-detail-title">
        Comments
      </h2>
      <ul
        v-if="photo.comments.length > 0"
        class="photo-detail-comments"
      >
        <li
          v-for="comment in photo.comments"
          :key="comment.content"
          class="photo-detail-comment-item"
        >
          <p class="photo-detail-comment-body">
            {{ comment.content }}
          </p>
          <p class="photo-detail-comment-info">
            {{ comment.author.name }}
          </p>
        </li>
      </ul>
      <p v-else>No comments yet</p>
      <form
        @submit.prevent="addComment"
        class="form"
        v-if="isLogin"
      >
        <div class="errors" v-if="commentErrors">
          <ul v-if="commentErrors.content">
            <li
              v-for="msg in commentErrors.content"
              :key="msg"
            >
              {{ msg }}
            </li>
          </ul>
        </div>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-item"
          v-model="commentContent"
        ></textarea>
        <div class="form-button">
          <button type="submit" class="button">submit comment</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {OK, CREATED, UNPROCESSABLE_ENTITY} from '../util'
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data(){
    return{
      photo: null,
      fullWidth: false,
      commentContent: '',
      commentErrors: null,
    }
  },
  computed: {
    isLogin() {
      return this.$store.getters['auth/check']
    }
  },
  methods: {
    async fetchPhoto(){
      const response = await axios.get(`/api/photos/${this.id}`)

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.photo = response.data
    },
    async addComment(){
      const response = await axios.post(`/api/photos/${this.id}/comments`, {
        content: this.commentContent,
      })
      if (response.status === UNPROCESSABLE_ENTITY) {
        this.commentErrors = response.data.errors
        return false
      }
      this.commentContent = ''
      this.commentErrors = null
      if (response.status !== CREATED) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.$set(this.photo, 'comments', [
        response.data, ...this.photo.comments
      ])
    }
  },
  watch: {
    $route: {
      async handler(){
        await this.fetchPhoto()
      },
      immediate: true,
    }
  }
}
</script>
```

