<template>
  <div class="photo">
    <figure class="photo-wrapper">
      <img
        :src="item.url"
        :alt="`Photo by ${item.owner.name}`"
        class="photo-image"
        width="300px"
        height="300px"
      >
    </figure>
    <RouterLink
      class="photo-overlay"
      :to="`/photos/${item.id}`"
      :title="`View the photo by ${item.owner.name}`"
    >
      <div class="photo-controls">
        <button
          class="photo-action"
          title="Like photo"
          @click.prevent="like"
          :class="{ liked: item.liked_by_user }"
        >
          {{ item.likes_count }}
        </button>
        <a
          :href="`/photos/${item.id}/download`"
          @click.stop
          title="Download photo"
          class="photo-action"
        >
          ダウンロード
        </a>
      </div>
      <div class="photo-username">
        {{ item.owner.name }}
      </div>
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  methods: {
    like(){
      this.$emit('like', {
        id: this.item.id,
        liked: this.item.liked_by_user,
      })
    }
  }
}
</script>
