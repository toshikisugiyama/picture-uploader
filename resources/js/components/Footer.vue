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
