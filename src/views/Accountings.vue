<template>
  <v-container fluid>
    <v-row>
      <v-col :cols="6">
        <v-text-field label="Поиск" v-model="search" />
        <v-select
          v-model="filterStatus"
          :items="statuses"
          dense
          @change="filterStatuses"
          label="Статус"
          max-width="500px"
        />
        <v-btn class="mr-10" color="primary" @click="clear">Очистить </v-btn>
    
        <v-btn color="primary" @click="getReport">Сформировать список должников </v-btn>
      
      </v-col>

      <v-col :cols="12">
        <v-card outlined elevation="4">
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="accountings"
              :search="search"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Движение книжного фонда</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical />
                  <v-spacer />
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Добавить запись
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-autocomplete
                                v-model="editedItem.book_id"
                                item-text="name_book"
                                item-value="id"
                                label="Название книги"
                                max-width="500px"
                                :items="books"
                                outlined
                              />

                              <v-select
                                v-model="editedItem.class_id"
                                :items="classes"
                                item-value="id"
                                item-text="number"
                                label="Класс"
                                @change="onChangeClass"
                                outlined
                                max-width="500px"
                              />

                              <v-autocomplete
                                v-model="editedItem.student_id"
                                :items="students"
                                item-value="id"
                                item-text="FIO"
                                label="ФИО ученика"
                                outlined
                                max-width="500px"
                              />

                              <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editedItem.date_of_issue"
                                    label="Дата выдачи"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.date_of_issue"
                                  @input="menu2 = false"
                                ></v-date-picker>
                              </v-menu>

                              <v-select
                                v-model="editedItem.status_book"
                                :items="statuses"
                                label="Статус"
                                outlined
                              />

                              <v-menu
                                v-model="menu3"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editedItem.return_date"
                                    label="Дата возврата"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.return_date"
                                  @input="menu3 = false"
                                ></v-date-picker>
                              </v-menu>

                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="close">
                          Отменить
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save">
                          Сохранить
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >Вы хотите удалить запись</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Отмена</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer />
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { axiosInstance } from "@/api/Axios";
import { fetchClasses } from "@/api/Repository/classRepository";
import { fetchStudentsByClassId } from "@/api/Repository/studentsRepository";
import fileSave from "file-saver"

export default {
  data: () => ({
    class_id: null,
    filterStatus: null,
    statuses: [
      {
        value: 200,
        text: "ВЫДАНА",
      },
      {
        value: 250,
        text: "ПОЛУЧЕНО",
      },
    ],
    menu2: false,
    menu3: false,

    accountings: [],
    books: [],
    authors: [],
    students: [],

    dialog: false,
    dialogDelete: false,
    search: "",
    editedIndex: -1,
    headers: [
      {text: "Автор", value:"book.author.name"},
      { text: "Книга", value: "book.name_book" },
      { text: "Класс", value: "student.class.number"},
      {value: "student.letter"},
      { text: "Ученик", value: "student.FIO" },
      { text: "Дата выдачи", value: "date_of_issue" },
      { text: "Статус книги", value: "status_book" },
      { text: "Дата возврата", value: "return_date" },
      { text: "Действия", value: "actions", sortable: false },
    ],
    classes: [],
    editedItem: {
      book_id: "",
      class_id: "",
      student_id: "",
      date_of_issue: "",
      status_book: "",
      //return_date: "" 
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Добавление записи" : "Изменение";
    },
  },

  created() {
    this.getAccounts();
    this.getStudents();
    this.getBooks();
    this.getAuthors();
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    //get requests to server for data from db

    //filter request
    async filterStatuses(number){
      await axiosInstance.get(`/accountbystatus/${number}`)
      .then(({data}) => {
        this.accountings = data
      })
    },

    async getAccounts() {
      await axiosInstance.get("/accountings").then(({ data }) => {
        this.accountings = data
        console.log(data);
      });
    },

    async getAuthors(){
      await axiosInstance.get("/authors").then(({data}) => {
        this.authors = data.auth
      })
    },

    async onChangeClass(id) {
      await fetchStudentsByClassId(id).then(s => this.students = s)
    },

  
    async getBooks() {
      await axiosInstance.get("/books").then(({ data }) => {
        this.books = data
        console.log(data);
      });
    },

    async getStudents() {
      await fetchStudentsByClassId().then((s) => (this.students = s));
    },

    async getReport(){
        await axiosInstance.post("/account-list")
        .then(() => axiosInstance.get("/give-account", {responseType: "blob"}))
        .then((res) => {
          const pdfBlob = new Blob([res.data], {type: "application/pdf"});
          saveAs(pdfBlob, "studentsList.pdf")
        })
    },

    //Add, Edit, Delete functions
    editItem(item) {
      this.editedIndex = this.accountings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      console.log(item)
    },

    deleteItem(item) {
      this.editedIndex = this.accountings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const account = this.accountings.splice(this.editedIndex, 1)[0] ?? null;
      console.dir(account);
      this.deleteAccount(account.id);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      const isAdd = this.editedIndex == -1;
      if (isAdd) {
        this.addAccount(this.editedItem);
        
      } else {
        this.editAccount(this.editedItem);
        Object.assign(this.accountings[this.editedIndex], this.editedItem);
      }
      this.close();
    },
  
    async addAccount() {
      try {
        await axiosInstance.post("/accountings", this.editedItem);
        await this.getAccounts();
        console.log(this.editedItem)
      } catch (err) {
        console.dir(err);
      }
    },

    // async editAccount(account){
    //   try{
    //     await axiosInstance
    //     .put(`/accountings/${account.id}`, account);
    //     await this.getAccounts();
    //   }catch(err){
    //     console.log(err)
    //   }
    // },     
    //Old code
    async editAccount(account) {
      try{
        await axiosInstance
        .put(`/accountings/${account.id}`, this.editedItem)
        await this.getAccounts();
      }catch(err){
        console.log(err)
      }
    },

    async deleteAccount(id) {
      try {
        await axiosInstance.delete(`/accountings/${id}`);
        await this.getAccounts();
      } catch (err) {
        console.log(err);
      }
    },

    async clear(){
      this.filterStatus = null;
      this.getAccounts();
      
    }
  },

  async beforeMount() {
    fetchClasses().then((c) => (this.classes = c));
  },
};
</script>