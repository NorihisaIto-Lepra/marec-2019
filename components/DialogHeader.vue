<template>
  <v-app-bar :color="color" absolute>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer />
    <v-tooltip bottom v-if="!disableClose">
      <template v-slot:activator="{ on }">
        <v-btn @click="$emit('close')" color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <span>閉じる</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'green'
    },
    title: {
      type: String,
      default: ''
    },
    disableClose: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.v-dialog > .v-card > .v-toolbar {
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>
