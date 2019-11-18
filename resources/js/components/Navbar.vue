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
