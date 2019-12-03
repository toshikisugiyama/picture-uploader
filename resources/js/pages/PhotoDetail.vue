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
