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
