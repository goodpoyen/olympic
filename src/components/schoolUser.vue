<template>
  <div>
    <v-overlay :value="overlay" absolute>
      <v-btn icon color="red" :style="{ left: '83%', top:'40px' }" @click="overlay = false">
        <v-icon large>mdi-close-circle-outline</v-icon>
      </v-btn>
      <v-card-title class="text-h6" :style="{ margin: 'auto', width: width }">
        <v-btn color="orange lighten-2" @click="dessertName = '陳大天'">
          Hide Overlay
        </v-btn>
      </v-card-title>
      <v-carousel
        hide-delimiters
        height="auto"
        :style="{ margin: 'auto', width: width }"
      >
        <v-carousel-item v-for="(item, i) in item2" :key="i">
          <v-img :src="item.src"></v-img>
        </v-carousel-item>
      </v-carousel>
    </v-overlay>
    <v-data-table
      :headers="headers"
      :items="filteredDesserts"
      class="elevation-1"
    >
      <template v-slot:header.statusName="{ header }">
        {{ header.text }}
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon small :color="statusName ? 'primary' : ''">
                mdi-filter
              </v-icon>
            </v-btn>
          </template>
          <div style="background-color: white; width: 200px; padding: 10px">
            <v-select
              flat
              small
              multiple
              clearable
              v-model="statusName"
              label="請選擇"
              :items="columnValueList(header.value)"
            >
            </v-select>
            <v-btn
              @click="statusName = ''"
              small
              text
              color="primary"
              class="ml-2 mb-2"
              >清除</v-btn
            >
          </div>
        </v-menu>
      </template>
      <template v-slot:header.name="{ header }">
        {{ header.text }}
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon small :color="dessertName ? 'primary' : ''">
                mdi-filter
              </v-icon>
            </v-btn>
          </template>
          <div style="background-color: white; width: 280px">
            <v-text-field
              v-model="dessertName"
              class="pa-4"
              type="text"
              label="輸入搜尋"
              :autofocus="true"
            ></v-text-field>
            <v-btn
              @click="dessertName = ''"
              small
              text
              color="primary"
              class="ml-2 mb-2"
              >清除</v-btn
            >
          </div>
        </v-menu>
      </template>
      <template v-slot:item.statusName="{ item }">
        <v-chip :color="getColor(item.statusName)" dark>
          {{ item.statusName }}
        </v-chip>
      </template>
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
                新增承辦人
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
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon small class="mr-2" @click="show()"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    // width: '50%',
    overlay: false,
    items: [
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
      },
      {
        src: 'https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/283755359_5412721285416863_8270869590315033899_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=l6A5-SmWqcYAX9SntHB&_nc_ht=scontent-tpe1-1.xx&oh=00_AT_fPbSDY7ZvF_ELIIdUDVB1XrsFpsCUwMj8HPy1npTe7A&oe=62A7857F'
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
      },
      {
        src: 'https://hujiyi.gitee.io/2021/01/20/create-a-vue-app-based-vuetify-and-leancloud-part-II/filelist.png'
      },
      {
        src: 'https://media.istockphoto.com/photos/taipei-city-panorama-in-taiwan-picture-id1209191587'
      }
    ],
    item2: [],
    dessertName: '',
    statusName: '',
    valid: true,
    levelStatus: true,
    defaultOlympic: [],
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      // {
      //   text: '奧林匹亞',
      //   align: 'start',
      //   value: 'olympic'
      // },
      { text: '帳號狀態', value: 'statusName' },
      { text: '學校', value: 'school_name' },
      { text: '姓名', value: 'name' },
      { text: '信箱', value: 'email' },
      { text: '公務電話', value: 'tel' },
      { text: '功能', value: 'actions', sortable: false }
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

    filteredDesserts () {
      const conditions = []

      if (this.dessertName) {
        conditions.push(this.filterDessertName)
      }

      if (this.statusName) {
        conditions.push(this.filterStatusName)
      }

      if (conditions.length > 0) {
        return this.desserts.filter((dessert) => {
          return conditions.every((condition) => {
            return condition(dessert)
          })
        })
      }

      return this.desserts
    },

    width () {
      console.log(document.documentElement.clientWidth)

      if (document.documentElement.clientWidth >= 1600) {
        return '70%'
      } else {
        return '50%'
      }
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
    show () {
      this.overlay = true
      this.drawer = false
      console.log(this.drawer)
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

    filterDessertName (item) {
      return item.name.toLowerCase().includes(this.dessertName.toLowerCase())
    },

    filterStatusName (item) {
      return item.statusName.includes(this.statusName)
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
      else return 'green'
    },

    async getSchoolUsers () {
      const data = {}
      data.AT = this.AT.value

      await this.axios
        .post(this.GLOBAL.APISERVERURL + '/getSchoolUsers', data)
        .then((response) => {
          if (response.data.code === 200) {
            this.desserts = response.data.resultData
            const that = this
            this.desserts.forEach(function (data) {
              data = that.changeData(data)

              data.olympicSelect = data.olympic.split(',')
            })
            console.log(this.desserts)
          } else if (response.data.code === 400) {
            if (this.getAT()) {
              const that = this
              setTimeout(function () {
                that.getSchoolUsers()
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
    },

    test (key) {
      // console.log(key)
      const i = key

      this.item2 = this.items.slice(i, this.items.length)
      this.item2 = this.item2.concat(this.items.slice(0, key))
      // for (i; i < this.items.length; i++) {
      //   this.item2.push(this.items[i])
      // }

      // for (let j = 0; j < key; j++) {
      //   console.log(j)
      //   this.item2.push(this.items[j])
      // }
      // console.log(this.items)
      // console.log(this.item2)
    }
  },

  async mounted () {
    // console.log(this.level.value)
    if (this.level.value === '1') {
      this.levelStatus = false
    } else {
      this.defaultOlympic.push(this.olympic.value)
    }

    await this.renewLT()
    await this.getSchoolUsers()
    // this.items.splice(1, 1)
    this.test(0)
    // console.log(this.drawer)
  }
}
</script>
