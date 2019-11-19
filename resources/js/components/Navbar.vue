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
