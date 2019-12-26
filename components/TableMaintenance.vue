<template>
  <v-card tile>
    <v-card-title class="maintenance">
      <v-row>
        直近
        <v-text-field
          outlined
          style="max-width:60px;"
          type="number"
          v-model="monthBefore"
          @change="searchByMonth"
          hide-details
          dense
        />ヶ月の整備履歴
      </v-row>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" label="検索" single-line hide-details />
    </v-card-title>
    <v-data-table
      :search="search"
      :loading="isSearching"
      :items="itemsForTable"
      :headers="headers"
      item-key="id"
      light
      class="cyan lighten-5 elevation-1"
      @click:row="onClickRow"
    />
  </v-card>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      monthBefore: 1,
      search: '',
      headers: [
        {
          text: '設備',
          value: 'data.facilityName',
          align: 'left'
        },
        {
          text: 'メモ',
          value: 'data.memo'
        },
        { text: '日時', value: 'data.createdStr' }
      ]
    }
  },

  computed: {
    isSearching() {
      return this.$store.getters['maintenance/isSearching']
    },
    recentRecords() {
      return this.$store.getters['maintenance/getRecentRecords']
    },
    searchedRecords() {
      return this.$store.getters['maintenance/getSearchedRecords']
    },
    itemsForTable() {
      let result = []
      const target =
        this.monthBefore > 1 ? this.searchedRecords : this.recentRecords
      target.forEach(i => {
        result.push({
          id: i.id,
          data: {
            memo: i.data.memo,
            facility: i.data.facility,
            facilityName: this.$store.getters['facility/getFacilityNameById'](
              i.data.facility
            ),
            images: i.data.images,
            created: i.data.created,
            createdStr: this.$dayjs(i.data.created.toDate()).format(
              'YYYY/MM/DD HH:mm'
            )
          }
        })
      })
      return result
    }
  },
  methods: {
    onClickRow(e) {
      this.$emit('select', e)
    },
    searchByMonth() {
      this.$store.dispatch('maintenance/search', this.monthBefore)
    }
  }
}
</script>
