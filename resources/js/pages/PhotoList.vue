<template>
  <div class="photo-list-wrapper">
    <div class="photo-list">
      <Photo
        class="photo-item"
        v-for="photo in photos"
        :key="photo.id"
        :item="photo"
      >
      </Photo>
    </div>
    <Pagination
      :current-page="currentPage"
      :last-page="lastPage"
    />
  </div>
</template>

<script>
import {OK} from '../util'
import Photo from '../components/Photo.vue'
import Pagination from '../components/Pagination.vue'
export default {
  components: {
    Photo,
    Pagination,
  },
  data(){
    return {
      photos: [],
      currentPage: 0,
      lastPage: 0,
    }
  },
  methods: {
    async fetchPhotos(){
      const response = await axios.get('/api/photos')

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.photos = response.data.data
      this.currentPage = response.data.current_page
      this.lastPage = response.data.last_page
    }
  },
  watch: {
    $route: {
      async handler(){
        await this.fetchPhotos()
      },
      immediate: true
    }
  }
}
</script>
