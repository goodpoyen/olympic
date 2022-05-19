<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      multi-sort
      class="elevation-1"
      :search="search"
    >
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
                        奧林匹亞
                        <v-select
                          v-model="editedItem.olympic"
                          :items="olympicItem"
                          :rules="[(v) => !!v || '奧林匹亞不能為空']"
                          required
                        ></v-select>
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
              <v-card-title class="text-h5">確定刪除此帳號資訊？</v-card-title>
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
        <v-icon small class="mr-2" @click="getSchoolUsers()">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '奧林匹亞',
        align: 'start',
        value: 'olympic'
      },
      { text: '帳號狀態', value: 'statusName' },
      { text: '學校', value: 'school_name' },
      { text: '姓名', value: 'name' },
      { text: '信箱', value: 'email' },
      { text: '公務電話', value: 'tel' },
      { text: '功能', value: 'actions', sortable: false }
    ],
    emailRules: [
      v => !!v || '帳號(信箱)不能為空',
      v => /.+@.+/.test(v) || '帳號(信箱)格式不對'
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
      name: '',
      email: '',
      tel: ''
    },
    defaultItem: {
      olympic: '',
      schoolName: '',
      name: '',
      email: '',
      tel: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增承辦人' : '更承辦人資訊'
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
      }

      this.editedItem = this.changeData(this.editedItem)

      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }

      this.close()
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
    }
  },

  async mounted () {
    // console.log(this.level.value)
    await this.renewLT()
    await this.getSchoolUsers()
  }
}
</script>
