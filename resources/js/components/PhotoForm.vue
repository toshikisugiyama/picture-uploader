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
