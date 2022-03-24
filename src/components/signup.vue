<template>
    <div>
        <v-data-table :headers="headers" :items="desserts" multi-sort class="elevation-1" :search="search">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                新增報名
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.name" label="姓名"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.idCard" label="識別碼"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.schoolName" label="學校"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.grade" label="年級"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.birthday" label="生日"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.email" label="信箱"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                                <v-btn color="blue darken-1" text @click="save">儲存</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">確定刪除此學生報名資訊？</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">確定</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '奧林匹亞',
        align: 'start',
        value: 'olympic'
      },
      { text: '姓名', value: 'name' },
      { text: '識別碼', value: 'idCard' },,
      { text: '學校', value: 'schoolName' },
      { text: '年級', value: 'grade' },
      { text: '生日', value: 'birthday' },
      { text: '信箱', value: 'email' },
      { text: '功能', value: 'actions', sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      idCard: '',
      schoolName: '',
      grade: 0,
      birthday: '',
      email: ''
    },
    defaultItem: {
      name: '',
      idCard: '',
      schoolName: '',
      grade: 0,
      birthday: '',
      email: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增報名' : '更新報名'
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

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.desserts = [
        {
          olympic: 'TOI',
          name: '汪曉帆',
          idCard: 'A1256',
          schoolName: '台中女中',
          grade: 10,
          birthday: '2006/07/06',
          email: 'Frozen@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '陳建年',
          idCard: 'F1514',
          schoolName: '政大附中',
          grade: 10,
          birthday: '2006/05/22',
          email: 'sandwich@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '曾美莉',
          idCard: 'P2894',
          schoolName: '中正高中',
          grade: 11,
          birthday: '2007/03/10',
          email: 'Eclair@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '郝文宗',
          idCard: 'K1561',
          schoolName: '師大附中',
          grade: 10,
          birthday: '2006/04/09',
          email: 'Cupcake@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '陳立強',
          idCard: 'T1461',
          schoolName: '板橋高中',
          grade: 11,
          birthday: '2007/12/30',
          email: 'Gingerbread@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '花思思',
          idCard: 'K2645',
          schoolName: '景美女中',
          grade: 12,
          birthday: '2008/05/19',
          email: 'Jelly@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '李玫芬',
          idCard: 'P2561',
          schoolName: '中正高中',
          grade: 10,
          birthday: '2006/10/13',
          email: 'Lollipop@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '黃文文',
          idCard: 'F2571',
          schoolName: '中山女中',
          grade: 10,
          birthday: '2006/11/12',
          email: 'Honeycomb@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '劉暖暖',
          idCard: 'N2971',
          schoolName: '台中女中',
          grade: 11,
          birthday: '2007/09/30',
          email: 'Donut@gmail.com'
        },
        {
          olympic: 'TOI',
          name: '陳大東',
          idCard: 'G1547',
          schoolName: '大同高中',
          grade: 12,
          birthday: '2008/01/12',
          email: 'KitKat@gmail.com'
        }

      ]
    },

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
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
