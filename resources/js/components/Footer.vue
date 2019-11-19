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
