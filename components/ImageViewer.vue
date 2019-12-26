<template>
  <v-card>
    <v-carousel
      :continuous="false"
      height="calc(90vh - 100px)"
      show-arrows-on-hover
    >
      <v-carousel-item
        v-for="(item, i) in images"
        :key="i"
        style="position: relative"
      >
        <img :src="item" class="caroucel-img" />
      </v-carousel-item>
    </v-carousel>
    <v-btn block color="secondary" dark @click="$emit('add')">
      画像追加
    </v-btn>
  </v-card>
</template>
<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style>
.caroucel-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  object-fit: contain;
}
</style>
