<template>
  <v-app dark>
    <v-app-bar fixed app color="primary darken-2">
      <template v-if="$store.getters.getUserName">
        <v-btn
          color="facility"
          height="auto"
          width="32vw"
          class="ms-2"
          @click="switchFacility"
          :outlined="isShowingFacility"
        >
          <v-layout column>
            <v-flex>
              <span>設備</span>
            </v-flex>
            <v-flex>
              <v-icon>mdi-home</v-icon>
            </v-flex>
          </v-layout>
        </v-btn>
        <v-btn
          color="maintenance"
          height="auto"
          width="32vw"
          class="ms-2"
          @click="switchMaintenance"
          :outlined="isShowingMaintenance"
        >
          <v-layout column>
            <v-flex>
              <span>整備履歴</span>
            </v-flex>
            <v-flex>
              <v-icon>mdi-card-text</v-icon>
            </v-flex>
          </v-layout>
        </v-btn>
        <v-spacer />
        <v-btn outlined fab light small color="grey lighten-1" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-content class="background">
      <v-overlay :value="!isUserAuthChecked">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  },
  watch: {
    userUid(newVal, oldVal) {
      if (newVal === oldVal || !newVal) return
      this.$store.dispatch('facility/listen')
      this.$store.dispatch('maintenance/listen')
    }
  },
  computed: {
    isUserAuthChecked() {
      return this.$store.getters.isUserAuthChecked
    },
    userUid() {
      return this.$store.getters.getUserUid
    },
    isShowingFacility() {
      return this.$store.getters.isShowingFacility
    },
    isShowingMaintenance() {
      return this.$store.getters.isShowingMaintenance
    }
  },
  methods: {
    switchFacility() {
      this.$store.commit('changeShowing', 'facility')
    },
    switchMaintenance() {
      this.$store.commit('changeShowing', 'maintenance')
    },
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
