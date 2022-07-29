<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      multi-sort
      class="elevation-1"
    >
      <template
        v-for="(header, index) in headers"
        v-slot:[`header.${header.value}`]="{ header }"
      >
        <thead>
          <tr>
            <th>
              <span>{{ header.text }}</span>
            </th>

            <th v-if="header.text != '功能'">
              <v-menu offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon :id="'color' + index" small color="">
                      mdi-filter
                    </v-icon>
                  </v-btn>
                </template>
                <div style="background-color: white; width: 280px">
                  <v-text-field
                    @keyup="filteredDesserts(index, header.filterName)"
                    :id="'input' + index"
                    class="pa-4"
                    type="text"
                    label="輸入搜尋"
                    :autofocus="true"
                  ></v-text-field>
                  <v-btn
                    :id="'clean' + index"
                    @click="cleanDesserts(index, header.filterName)"
                    small
                    text
                    color="primary"
                    class="ml-2 mb-2"
                    >清除</v-btn
                  >
                </div>
              </v-menu>
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:item.statusName="{ item }">
        <v-chip :color="getColor(item.statusName)" dark>
          {{ item.statusName }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="#635BFF"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small left> mdi-map-marker-radius-outline </v-icon>
                <p style="font-size: 13px; margin-top: 16px">新增考場</p>
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
                          :rules="[(v) => !!v || '奧林匹亞不能為空']"
                          required
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.school_name"
                          label="學校"
                          :rules="[(v) => !!v || '學校不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.name"
                          label="姓名"
                          :rules="[(v) => !!v || '姓名不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.email"
                          label="信箱"
                          :rules="emailRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.tel"
                          label="公務電話"
                          :rules="[(v) => !!v || '姓名不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-radio-group
                          v-if="editedIndex === -1"
                          v-model="defaultStatus"
                          :disabled="true"
                          :rules="[(v) => !!v || 'Item is required']"
                          required
                        >
                          承辦人狀態
                          <v-radio
                            v-for="status in accountStatus"
                            :key="status.key"
                            :label="status.key"
                            :value="status.value"
                          ></v-radio>
                        </v-radio-group>
                        <v-radio-group v-else v-model="editedItem.status">
                          承辦人狀態
                          <v-radio
                            v-for="status in accountStatus"
                            :key="status.key"
                            :label="status.key"
                            :value="status.value"
                          ></v-radio>
                        </v-radio-group>
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
              <v-card-title class="text-h5"
                >確定刪除此承辦人資訊？</v-card-title
              >
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
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-download-box-outline
        </v-icon>
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-text-box-edit-outline
        </v-icon>
        <v-icon class="mr-2" @click="deleteItem(item)">
          mdi-trash-can-outline
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    keyWord: '',
    keyClumn: '',
    dessertChineseName: '',
    key: 0,
    statusName: '',
    valid: true,
    levelStatus: true,
    defaultOlympic: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '考場代碼', value: 'codeName', filterName: 'codeName' },
      { text: '考區名稱', value: 'areaName', filterName: 'areaName' },
      { text: '考場名稱', value: 'roomName', filterName: 'roomName' },
      { text: '總座數', value: 'totalSeat', filterName: 'totalSeat' },
      { text: '行排', value: 'rowNumber', filterName: 'rowNumber' },
      { text: '直排', value: 'columnNumber', filterName: 'columnNumber' },
      { text: '功能', value: 'actions' }
    ],
    emailRules: [
      v => !!v || '帳號(信箱)不能為空',
      v => /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(v) || '帳號(信箱)格式不對'
    ],
    accountStatus: [
      {
        key: '啟用',
        value: '1'
      },
      {
        key: '停權',
        value: '2'
      }
    ],
    defaultStatus: '2',
    olympicItem: ['TMO', 'IPHO', 'TWICHO', 'CTBO', 'IESO', 'TWIJSO', 'TOI'],
    desserts: [],
    dessertsTemp: [],
    editedIndex: -1,
    editedItem: {
      olympic: '',
      schoolName: '',
      olympicSelect: '',
      name: '',
      email: '',
      tel: ''
    },
    defaultItem: {
      olympic: '',
      schoolName: '',
      olympicSelect: '',
      name: '',
      email: '',
      tel: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增承辦人' : '更改承辦人資訊'
    },

    id () {
      return this.$route.params.id
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
    filteredDesserts (index, filterName) {
      const value = document.getElementById('input' + index).value

      document.getElementById('color' + index).style.color = 'rgb(25 118 210)'

      if (document.getElementById('input' + index).value != null) {
        this.desserts = this.dessertsTemp.filter((dessert) => {
          return dessert[filterName].toLowerCase().includes(value.toLowerCase())
        })
      }

      return this.desserts
    },

    cleanDesserts (index, filterName) {
      document.getElementById('input' + index).value = ''

      document.getElementById('color' + index).style.color = ''

      this.desserts = this.dessertsTemp.filter((dessert) => {
        if (dessert[filterName] === '' || dessert[filterName] == null) {
          return dessert
        } else {
          return !dessert[filterName].toLowerCase().includes(null)
        }
      })

      return this.desserts
    },

    show () {
      this.overlay = true
      this.drawer = false
    },
    reloadTitle () {
      this.titleName = this.$store.dispatch('title', '選拔管理')
      return this.$store.state.title
    },

    editItem (item) {
      if (this.level.value === '2') {
        this.defaultOlympic = item.olympic.split(',')
      }

      this.editedIndex = this.desserts.indexOf(item)
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
      if (this.editedIndex === -1) {
        this.editedItem.status = '2'
        if (this.level.value === '2') {
          this.editedItem.olympic = this.defaultOlympic
        } else {
          this.editedItem.olympic = this.editedItem.olympicSelect.toString()
        }
      } else {
        this.editedItem.olympic = this.editedItem.olympicSelect.toString()
      }

      this.editedItem = this.changeData(this.editedItem)

      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }

      this.close()
    },

    columnValueList (val) {
      return this.desserts.map(d => d[val])
    },

    changeData (data) {
      if (data.status === '1') {
        data.statusName = '啟用'
      }
      if (data.status === '2') {
        data.statusName = '停權'
      }

      return data
    },

    getColor (status) {
      if (status === '停權') return 'red'
      else if (status === '認證') return 'orange'
      else return 'blue'
    },

    async getClassRoomInfo () {
      const data = {}
      data.AT = this.AT.value
      data.id = this.id

      await this.axios
        .post(this.GLOBAL.APISERVERURL + '/getClassRoom', data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts = response.data.resultData
            this.dessertsTemp = response.data.resultData
            // const that = this
            // this.desserts.forEach(function (data) {
            //   data = that.changeData(data)

            //   data.olympicSelect = data.olympic.split(',')
            // })
            // console.log(this.desserts)
          } else if (response.data.code === 400) {
            if (this.getAT()) {
              const that = this
              setTimeout(function () {
                that.getClassRoomInfo()
              }, 1000)
            } else {
              location.href = '/login'
            }
          } else if (response.data.code === 401) {
            location.reload()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },

  async mounted () {
    this.reloadTitle()
    if (this.level.value === '1') {
      this.levelStatus = false
    } else {
      this.defaultOlympic.push(this.olympic.value)
    }

    await this.renewLT()
    await this.getClassRoomInfo()
  }
}
</script>
