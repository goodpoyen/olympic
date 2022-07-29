<template>
  <div>
    <v-card>
      <v-tabs color="blue accent-4" left>
        <v-tab style="color: black; font-weight: bolder">人員資料</v-tab>
        <v-tab style="color: black; font-weight: bolder">考區資料</v-tab>
        <v-tab style="color: black; font-weight: bolder">考場資料</v-tab>
        <v-tab style="color: black; font-weight: bolder">應試資料</v-tab>

        <v-tab-item v-for="n in 4" :key="n">
          <v-container v-if="n == 1" fluid>
            <personnel-info></personnel-info>
          </v-container>
          <v-container v-if="n == 2" fluid>
            <exam-area></exam-area>
          </v-container>
          <v-container v-if="n == 3" fluid>6666 </v-container>
          <v-container v-if="n == 4" fluid>7777 </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import PersonnelInfo from './personnelInfo.vue'
import ExamArea from './examArea.vue'
export default {
  data: () => ({

  }),

  components: {
    PersonnelInfo,
    ExamArea
  },

  computed: {
    id () {
      return this.$route.params.id
    }
  },

  methods: {

  },

  async mounted () {

  }
}
</script>
