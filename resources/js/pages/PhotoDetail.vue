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
      <button
        class="button"
        :class="{liked: photo.lied_by_user}"
        title="Like photo"
        @click="onLikeClick"
      >
        {{ photo.likes_count }}
      </button>
      <a
        :href="`/photos/${photo.id}/download`"
        class="button"
        title="Download photo"
      >
        Download
      </a>
      <h2 class="photo-detail-title">
        Comments
      </h2>
      <ul
        v-if="photo.comments.length > 0"
        class="photo-detail-comments"
      >
        <li
          v-for="comment in photo.comments"
          :key="comment.content"
          class="photo-detail-comment-item"
        >
          <p class="photo-detail-comment-body">
            {{ comment.content }}
          </p>
          <p class="photo-detail-comment-info">
            {{ comment.author.name }}
          </p>
        </li>
      </ul>
      <p v-else>No comments yet</p>
      <form
        @submit.prevent="addComment"
        class="form"
        v-if="isLogin"
      >
        <div class="errors" v-if="commentErrors">
          <ul v-if="commentErrors.content">
            <li
              v-for="msg in commentErrors.content"
              :key="msg"
            >
              {{ msg }}
            </li>
          </ul>
        </div>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-item"
          v-model="commentContent"
        ></textarea>
        <div class="form-button">
          <button type="submit" class="button">submit comment</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {OK, CREATED, UNPROCESSABLE_ENTITY} from '../util'
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
      commentContent: '',
      commentErrors: null,
    }
  },
  computed: {
    isLogin() {
      return this.$store.getters['auth/check']
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
    async addComment(){
      const response = await axios.post(`/api/photos/${this.id}/comments`, {
        content: this.commentContent,
      })
      if (response.status === UNPROCESSABLE_ENTITY) {
        this.commentErrors = response.data.errors
        return false
      }
      this.commentContent = ''
      this.commentErrors = null
      if (response.status !== CREATED) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.$set(this.photo, 'comments', [
        response.data, ...this.photo.comments
      ])
    },
    onLikeClick() {
      if (!this.isLogin) {
        alert('いいね機能を使うには、ログインしてください')
        return false
      }
      if (this.photo.liked_by_user) {
        this.unlike()
      } else {
        this.like()
      }
    },
    async like() {
      const response = await axios.put(`api/photos/${this.id}/like`)
      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }
      this.$set(this.photo, 'like_count', this.photo.likes_count + 1)
      this.$set(this.photo, 'liked_by_user', true)
    },
    async unlike() {
      const response = await axios.put(`api/photos/${this.id}/like`)
      if (response.status !== OK) {
        response.$store.commit('error/setCode', response.status)
        return false
      }
      this.$set(this.photo, 'likes_count')
    }
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
