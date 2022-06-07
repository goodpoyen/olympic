<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      multi-sort
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                新增教室
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-form ref="form" v-model="valid">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <v-combobox
                          v-if="level.value === '2'"
                          :disabled="levelStatus"
                          v-model="defaultOlympic"
                          :items="olympicItem"
                          label="奧林匹亞"
                          multiple
                          :rules="[(v) => !!v || '奧林匹亞不能為空']"
                          required
                        ></v-combobox>
                        <v-combobox
                          v-else
                          :disabled="levelStatus"
                          v-model="editedItem.olympicSelect"
                          :items="olympicItem"
                          label="奧林匹亞"
                          multiple
                          :rules="[(v) => !!v || '奧林匹亞碼不能為空']"
                          required
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.className"
                          label="教室名稱"
                          :rules="[(v) => !!v || '教室名稱不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.classId"
                          label="教室代碼"
                          :rules="[(v) => !!v || '教室代碼不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.seatNumber"
                          label="座位數"
                          :rules="[(v) => !!v || '座位數不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.row"
                          label="橫排數"
                          :rules="[(v) => !!v || '橫排數不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.column"
                          label="直排數"
                          :rules="[(v) => !!v || '直排數不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                    :disabled="!valid"
                    >儲存</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">確定刪除此教室資訊？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >取消</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >確定</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-download-box-outline
        </v-icon>
        <!-- <v-icon small class="mr-2" @click="getSchoolUsers()">
          mdi-delete
        </v-icon> -->
      </template>
      <template v-slot:item.setting="{ item }">
        <v-btn
          depressed
          color="primary"
          style="display: block; margin-top: 10px"
          @click="route('classRoom', item.olyId)"
          >教室設定
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    ne: '1',
    valid: true,
    levelStatus: true,
    defaultOlympic: [],
    olympicItem: ['TMO', 'IPHO', 'TWICHO', 'CTBO', 'IESO', 'TWIJSO', 'TOI'],
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '教室代碼', value: 'classId' },
      {
        text: '教室名稱',
        align: 'start',
        value: 'className'
      },
      { text: '座位數', value: 'seatNumber' },
      { text: '橫排', value: 'row' },
      { text: '直排', value: 'column' },
      { text: '功能', value: 'actions', sortable: false }
    ],
    desserts: [
      // { slectionID: 'A', olympic: 'TOI', signupName: '2022台灣資訊奧林匹亞初選選拔賽', startTime: '2022/04/01 00:00', endTime: '2022/04/14 23:59', type: '1', time: '2022/04/01 00:00 ~ 2022/04/14 23:59' },
      // { slectionID: 'B', olympic: 'TOI', signupName: '2022台灣資訊奧林匹亞初選選拔賽', startTime: '2022/04/01 00:00', endTime: '2022/04/14 23:59', type: '2', time: '2022/04/01 00:00 ~ 2022/04/14 23:59' }
    ],
    editedIndex: -1,
    editedItem: {
      slectionId: '',
      olympic: '',
      olympicSelect: '',
      typeName: '',
      signupName: '',
      startTime: '',
      endTime: '',
      time: '',
      type: ''
    },
    defaultItem: {
      slectionId: '',
      olympic: '',
      olympicSelect: '',
      typeName: '',
      signupName: '',
      startTime: '',
      endTime: '',
      time: '',
      type: ''
    },

    testType: [
      {
        key: '考試',
        value: '1'
      },
      {
        key: '選拔營',
        value: '2'
      }
    ]
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增教室' : '更改教室'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  methods: {
    editItem (item) {
      // if (this.level.value === '2') {
      //   this.defaultOlympic = item.olympic.split(',')
      // }
      // console.log(item)
      // console.log(this.editedIndex)

      this.editedIndex = this.desserts.indexOf(item)
      if (this.editedIndex !== -1) {
        item.startTime = new Date(item.startTime)
        item.endTime = new Date(item.endTime)
      }
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.valid = true
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      console.log(this.editedItem)
      this.editedItem = this.changeData(this.editedItem)
      this.editedItem.olympic = this.defaultOlympic
      this.editedItem.time = this.getDataTimeFormat(this.editedItem.startTime) + ' ~ ' + this.getDataTimeFormat(this.editedItem.endTime)
      if (this.editedIndex === -1) {
        // this.editedItem.status = '2'
        // if (this.level.value === '2') {
        //   this.editedItem.olympic = this.defaultOlympic
        // } else {
        //   this.editedItem.olympic = this.editedItem.olympicSelect.toString()
        // }
      } else {
        // this.editedItem.olympic = this.editedItem.olympicSelect.toString()
      }

      // this.editedItem = this.changeData(this.editedItem)

      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }

      this.close()
    },

    changeData (data) {
      if (data.type === '1') {
        data.typeName = '考試'
      }
      if (data.type === '2') {
        data.typeName = '選拔營'
      }

      return data
    },

    async getSelections () {
      const data = {}
      data.AT = this.AT.value

      this.desserts = [
        { olyId: '3', classId: 'A', className: 'B1O1', seatNumber: '45', row: '5', column: '9' },
        { olyId: '4', classId: 'B', className: 'B1O1', seatNumber: '45', row: '5', column: '9' }
      ]

      const that = this
      this.defaultOlympic = ['TOI']
      this.desserts.forEach(function (data) {
        data = that.changeData(data)
        data.olympicSelect = data.olympic.split(',')
      })
      console.log(this.desserts)
      // await this.axios
      //   .post(this.GLOBAL.APISERVERURL + '/getSchoolUsers', data)
      //   .then((response) => {
      //     if (response.data.code === 200) {
      //       this.desserts = response.data.resultData
      //       const that = this
      //       this.desserts.forEach(function (data) {
      //         data = that.changeData(data)

      //         data.olympicSelect = data.olympic.split(',')
      //       })
      //       console.log(this.desserts)
      //     } else if (response.data.code === 400) {
      //       if (this.getAT()) {
      //         const that = this
      //         setTimeout(function () {
      //           that.getSchoolUsers()
      //         }, 1000)
      //       } else {
      //         location.href = '/login'
      //       }
      //     } else if (response.data.code === 401) {
      //       location.reload()
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    },
    route (path, param) {
      console.log(path)
      console.log(param)
      if (path === 'classRoom') {
        this.$router.push({ path: '/manage/classRoom/' + param })
        // console.log(this.$router.path)
        // window.history.pushState('page2', 'Title', '/manage/account');
      }
    }
  },

  async mounted () {
    // console.log(this.level.value)
    // console.log(new Date('2022/04/14 23:59'))
    if (this.level.value === '1') {
      this.levelStatus = false
    } else {
      this.defaultOlympic.push(this.olympic.value)
    }

    await this.renewLT()
    await this.getSelections()
  }
}
</script>
