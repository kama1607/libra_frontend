<template>
  <v-container fluid>
    <v-row>
      
      <v-col :cols="6">
        <v-text-field label="Поиск" v-model="search" />
      </v-col>

      <v-col :cols="8">
        <v-select
          v-model="filterStatus"
          :items="statuses"
          dense
          @change="filterStatuses"
          label="Статус книг"
          max-width="500px"
        />
      </v-col>
      <v-col :cols="2">
        <v-btn color="primary" @click="clearFilter">Очистить </v-btn>
      </v-col>

      <v-col :cols="3">
        <v-btn color="primary" @click="getReport">Сформировать список книг на списание </v-btn>
      </v-col>

      <v-col :cols="12">
        <v-card outlined elevation="4">
          <v-card-text>
            <v-data-table :headers="headers" :items="books" :search="search">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Книги</v-toolbar-title>
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
                        Добавить книгу
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
                                v-model="editedItem.author_id"
                                :items="authors"
                                item-value="id"
                                item-text="name"
                                label="Автор"
                                outlined
                                max-width="500px"
                              />

                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.name_book"
                                label="Название книги"
                              />

                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.year_of_public"
                                label="Год издания"
                              />

                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.isbn"
                                label="ISBN"
                              />

                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.price"
                                label="Цена"
                              />

                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.category"
                                label="Категория"
                              />

                              <v-select
                                v-model="editedItem.status_remove"
                                :items="statuses"
                                label="Статус"
                                outlined
                              />

                              <v-text-field
                                max-width="400px"
                                v-model="editedItem.num_of_act"
                                label="№ акта"
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
                                    v-model="editedItem.date_remove"
                                    label="Дата списания"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.date_remove"
                                  @input="menu2 = false"
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
                        >Вы хотите удалить книгу?</v-card-title
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
import fileSave from "file-saver"

export default {
  data: () => ({
    statuses: [
      {
        value: 200,
        text: "В НАЛИЧИИ",
      },
      {
        value: 250,
        text: "НА СПИСАНИЕ",
      },
      {
        value: 300,
        text: "СПИСАН",
      },
    ],

    menu2: false,
    books: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Автор", value: "author.name" },
      { text: "Название", value: "name_book" },
      { text: "Год издания", value: "year_of_public" },
      { text: "ISBN", value: "isbn" },
      { text: "Цена", value: "price" },
      { text: "Категория", value: "category" },
      { text: "Статус", value: "status_remove" },
      { text: "№ акта", value: "num_of_act" },
      { text: "Дата списания", value: "date_remove" },
      { text: "Действия", value: "actions", sortable: false },
    ],
    authors: [],
    search: "",
    //filter
    filterStatus: null,
    editedIndex: -1,
    editedItem: {
      author_id: "",
      name_book: "",
      year_of_public: "",
      isbn: "",
      price: "",
      category: "",
      num_of_act: "",
      date_remove: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Добавление книги" : "Изменение";
    },
  },

  created() {
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
    //report 
    async getReport(){
        await axiosInstance.post("/book-list")
        .then(() => axiosInstance.get("/give-list", {responseType: "blob"}))
        .then((res) => {
          const pdfBlob = new Blob([res.data], {type: "application/pdf"});
          saveAs(pdfBlob, "naSpisanie.pdf")
        })
      },

    async getBooks() {
      await axiosInstance.get("/books").then(({ data }) => {
        this.books = data;
        console.log(data);
      });
    },

    async getAuthors() {
      await axiosInstance.get("/authors").then(({ data }) => {
        this.authors = data.auth;
        console.log(data);
      });
    },

    async filterStatuses(number) {
      await axiosInstance.get(`/books-by-status/${number}`).then(({ data }) => {
        this.books = data;
      });
    },

    editItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      console.log(item)
    },

    deleteItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const book = this.books.splice(this.editedIndex, 1)[0] ?? null;
      console.dir(book);
      this.deleteBook(book.id);
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
        this.addBook(this.editedItem);
      } else {
        this.editBook(this.editedItem);

        Object.assign(this.books[this.editedIndex], this.editedItem);
      }
      this.close();
    },

    async addBook() {
      try {
        await axiosInstance.post("/books", this.editedItem);
        await this.getBooks();
      } catch (err) {
        console.log(err);
      }
    },

    async editBook(book) {
      try {
        await axiosInstance.put(`/books/${book.id}`, this.editedItem);
        await this.getBooks();
      } catch (err) {
        console.dir(err);
      }
    },
  
    async deleteBook(id) {
      try {
        await axiosInstance.delete(`/books/${id}`);
        await this.getBooks();
      } catch (err) {
        console.log(err);
      }
    },

    async clearFilter(){
      this.filterStatus = null;
      this.getBooks();
    }
  },
};
</script>
