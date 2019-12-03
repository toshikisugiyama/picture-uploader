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
              <label for="password-confirmation">Password(confirmation)</label>
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
