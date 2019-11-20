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
    async login(){
      await this.$store.dispatch('auth/login', this.loginForm)
      if (this.apiStatus) {
        this.$router.push('/')
      }
    },
    async register(){
      await this.$store.dispatch('auth/register', this.registerForm)
      this.$router.push('/')
    },
  },
  computed: {
    apiStatus(){
      return this.$store.state.auth.apiStatus
    }
  },
}
</script>
