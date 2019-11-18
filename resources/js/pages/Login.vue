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
    <div v-show="tab === 0">Login Form</div>
    <div v-show="tab === 1">Register Form</div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      tab: 0
    }
  }
}
</script>
