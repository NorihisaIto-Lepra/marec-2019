<template>
  <v-list
    three-line
    shaped
    color="background"
    light
    height="calc(100vh - 120px)"
    width="100%"
    style="overflow-y: scroll"
  >
    <v-list-item-group value="selected" color="facility">
      <v-list-item
        v-for="(item, i) in $store.state.facility.facilities"
        :key="i"
        @click="$emit('click', item)"
      >
        <v-list-item-avatar tile size="80">
          <v-img :src="item.data.image" contain />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            stye="overflow: ellipsis"
            v-html="'<span>' + item.data.name + '</span>'"
          ></v-list-item-title>
          <v-list-item-subtitle
            v-html="
              '<span>' + item.data.place + '</span><br/>' + item.data.memo
            "
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>
