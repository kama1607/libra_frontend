<template>
  <v-container
    fluid
    style="height: 50px;"
  >
    <v-row>
        
      <v-menu
        dark
        bottom
        min-width="200px"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-large
            v-on="on"
          >
            <v-avatar
              color="black"
              size="47"
            >
              <v-icon>
                mdi-book-cog
              </v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
             
              <h3> Действия </h3>
              <v-divider class="my-2"></v-divider>
              <v-btn
                depressed
                rounded
                text
                @click="updateClasses"
              >
                Перевести учеников на следующий класс
              </v-btn>
              <v-divider class="my-2"></v-divider>
              <v-btn
                depressed
                rounded
                text
                @click="logout"
              >
                ВЫЙТИ
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-row>
  </v-container>
</template>

<script>
  import { axiosInstance } from "@/api/Axios";
  import token from '@/api/Manager/TokenManager'
  export default {
    name: "userActions",  
    data: () => ({
    }),
    methods: {
    async updateClasses(){
        try{
            await axiosInstance.get("/classup")
        }catch(error){
            console.log(error);
        }
    },    

    async logout(){
       this.$router.push("Login")
       token.delete();
    }

    }
  }
</script>
