<template>
  <v-container fluid>
    <v-row>
      <v-col :cols="12">
        <v-text-field label="Поиск" v-model="search" />
      </v-col>
      <v-col :cols="12">
        <v-card outlined elevation="4">
          <v-card-text>
            <v-data-table :headers="headers" :items="authors" :search="search">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Авторы</v-toolbar-title>
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
                        Добавить автора
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
                                v-model.trim="editedItem.name"
                                label="ФИО автора"
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
                        <v-btn color="blue darken-1" 
                        text 
                        @click="save"
                        :disabled="editedItem.name ==''"
                        >
                          Сохранить
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >Вы хотите удалить автора?</v-card-title
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
                   <v-card-title class="text-h5"
                        >ОШИБКА! ТАКОЙ АВТОР УЖЕ ИМЕЕТСЯ</v-card-title
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

export default {
  data: () => ({
    dialogError: false,

    dialog: false,
    dialogDelete: false,
    headers: [
     
      { text: "ФИО автора", value: "name" },
      { text: "Действия", value: "actions", sortable: false },
    ],
    search: "",
    authors: [],
    editedIndex: -1,
    editedItem: {
      name: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Добавление автора" : "Изменение";
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
    this.fetchAuthors();
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.authors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.authors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      const author = this.authors.splice(this.editedIndex, 1)[0] ?? null;
      console.dir(author)
      this.deleteById(author.id)
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
      const isAdd = this.editedIndex == -1; // -1 = добавление, 0 - редактирование 
      if (isAdd) {
        this.addAuthor(this.editedItem)
      } else {
        this.editAuthor(this.editedItem)

        Object.assign(this.authors[this.editedIndex], this.editedItem);
      }
      this.close();
    },

    async editAuthor(author) {
      try{
        await axiosInstance.put(`/authors/${author.id}`, this.editedItem)
        await this.fetchAuthors()
      }catch(err){
        console.log(err)
      }
    },
    
    async addAuthor(){
      try{
        await axiosInstance.post("/authors", this.editedItem);
        await this.fetchAuthors();
      }catch(error){
        console.log(error);
        this.dialogError = true;
      }
        

    },

    async fetchAuthors() {
      await axiosInstance.get("/authors").then(({ data }) => {
        this.authors = data.auth;
      });
    },

    async deleteById(id) {
      try{
        await axiosInstance.delete(`/authors/${id}`);
        await this.fetchAuthors();
      }catch(err){
          console.log(err)
      }
    },
  },
};
</script>