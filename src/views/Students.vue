<template>
  <v-container fluid>
    <v-row>
      <v-col :cols="6">
        <v-text-field label="Поиск" v-model="search" />
      </v-col>

      <v-col :cols="8">
        <v-select
          v-model="choosenClassId"
          :items="classes"
          dense
          item-value="id"
          item-text="number"
          @change="filterStudentsByClassId"
          label="Класс"
          outlined
          max-width="500px"
        />
      </v-col>
      <v-col :cols="2">
        <v-btn color="warning" @click="clearFilter"> Очистить фильтр </v-btn>
      </v-col>
      <v-col :cols="12">
        <v-card outlined elevation="4">
          <v-card-text>
            <v-data-table :headers="headers" :items="students" :search="search">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Ученики </v-toolbar-title>
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
                        Добавить ученика
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
                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.FIO"
                                label="ФИО Ученика"
                              />

                              <v-select
                                v-model="editedItem.class_id"
                                :items="classes"
                                item-value="id"
                                item-text="number"
                                label="Класс"
                                outlined
                                max-width="500px"
                              />

                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.letter"
                                label="Буква"
                              />
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
                        >Вы хотите удалить ученика?</v-card-title
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

                   <v-dialog v-model="dialogError" max-width="500px">
                  <v-card>
                   <v-card-title class="text-h6"
                        >ОШИБКА! ТАКОЙ УЧЕНИК УЖЕ ИМЕЕТСЯ</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="dialogError = false"
                          >ОК</v-btn
                        >
                        <v-spacer/>  
                        </v-card-actions>
                    </v-card>
                  </v-dialog>  
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon class="mr-2" @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
                <v-icon @click="showAccouting(item)"> mdi-book-account </v-icon>
              </template>
            </v-data-table>

            <v-dialog v-if="dialogStudent" v-model="dialogStudentAccouting">
              <v-card elevation="4" outlined>
                <v-card-title> Ученик: {{ dialogStudent.FIO }} </v-card-title>
                <v-card-text>
                  Класс: 
                  {{ dialogStudent.class.number
                    }}{{ dialogStudent.letter }}  
                </v-card-text>
              
                <v-col :cols="6">
                   <v-btn 
                   :disabled="dialogStudentData ==''"
                   color="primary"
                  @click="getReportAboutStudent"
                   >Сформировать отчёт</v-btn> 
                </v-col>

                <v-card-text>
                  <v-data-table
                    v-if="dialogStudentData.length > 0"
                    :items-per-page="5"
                    :items="dialogStudentData"
                    :headers="dialogStudentHeaders"
                  />
                  
                  <span v-else> ЭТОТ УЧЕНИК ЕЩЁ НЕ БРАЛ КНИГИ </span>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { axiosInstance } from "@/api/Axios";
import fileSave from "file-saver";
import {
  fetchStudents,
  fetchStudentsByClassId,
} from "@/api/Repository/studentsRepository";

export default {
  data: () => ({
    students: [],

    dialogError: false,
    dialogStudent: null,
    dialogStudentData: [],
    dialogStudentAccouting: false,

    dialogStudentHeaders: [
      { text: "Автор", value: "book.author.name" },
      { text: "Книга", value: "book.name_book" },
      { text: "Год издания", value: "book.year_of_public" },
      { text: "ISBN", value: "book.isbn" },
      { text: "Цена", value: "book.price" },
      { text: "Категория", value: "book.category"},
      { text: "Статус", value: "status_book" },
      { text: "Дата выдачи", value: "date_of_issue" },
      { text: "Дата получения", value: "return_date" },
    ],

    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ФИО ученика", value: "FIO" },
      { text: "Класс", value: "class.number" },
      { text: "Буква", value: "letter" },
      { text: "Действия", value: "actions", sortable: false },
    ],
    classes: [],
    search: "",
    editedIndex: -1, 
    choosenClassId: null,
    editedItem: {
      FIO: "",
      class_id: "",
      letter: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Добавление ученика" : "Изменение";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getStudents();
    this.getClass();
  },

  methods: {
     async showAccouting(item) {
      await axiosInstance
        .get(`/student-accouting/${item.id}`)
        .then(({ data }) => {
          this.dialogStudentData = data;
          this.dialogStudentAccouting = true;
          this.dialogStudent = item;
          console.dir(data);
        });
    },
    
    async getReportAboutStudent(){
        await axiosInstance.post(`/student-form/${this.dialogStudent.id}`)
        .then(() => axiosInstance.get("/give-student-form", {responseType: "blob"}))
        .then((res) => {
          const pdfBlob = new Blob([res.data], {type: "application/pdf"})
          saveAs(pdfBlob, "studentForm")
        })
    },


    async getStudents() {
      await fetchStudents().then((s) => (this.students = s));
    },

    async filterStudentsByClassId(id) {
      await axiosInstance
        .get(`/students-by-class/${id}`)
        .then(({ data }) => (this.students = data.students));
    },

    async getClass() {
      await axiosInstance.get("/classes").then(({ data }) => {
        console.dir(data);
        this.classes = data.clsses;
      });
    },
    editItem(item) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.students.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const student = this.students.splice(this.editedIndex, 1)[0] ?? null;
      console.dir(student);
      this.deleteStudent(student.id);
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
        this.addStudent(this.editedItem);
      } else {
        this.editStudent(this.editedItem);
        Object.assign(this.students[this.editedIndex], this.editedItem);
      }
      this.close();
    },

    async addStudent() {
      try {
        await axiosInstance.post("/students", this.editedItem);
        await this.getStudents();
      } catch (err) {
        console.log(err);
        this.dialogError = true;
      }
    },

    async editStudent(student) {
      await axiosInstance
        .put(`/students/${student.id}`, this.editedItem)
        .then(({ data }) => {
          console.log(data);
          this.getStudents()
        })
        .catch((err) => console.dir(err));
    },

    async deleteStudent(id) {
      try {
        await axiosInstance.delete(`/students/${id}`);
        await this.getStudents();
      } catch (err) {
        console.log(err);
      }
    },

    async clearFilter(){
      this.choosenClassId = null;
      this.getStudents();
    }

  },
};
</script>