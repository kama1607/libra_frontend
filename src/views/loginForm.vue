  <template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="black">
              <v-toolbar-title>Авторизация</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field 
                :rules="loginRule"
                required
                v-model="login" 
                label="Логин" 
                type="text" 
                />
                <v-text-field
                  :rules="passRule"
                  required
                  v-model="password"
                  label="Пароль"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
              color="primary" 
              @click="onLogin"
              :disabled="!valid"
              >ВОЙТИ</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import token from '@/api/Manager/TokenManager'

export default {
  name: "loginForm",
  props: {
    source: String,
  },
  data: () => ({
    valid: true,
    login: "",
    loginRule: [
      v => !!v || "Заполнение логина обязательно",
      v => (v && v.length > 4) || "Логин должен содержать не менее 4 символов"
    ],
    password: "",
    passRule: [
      p => !!p || "Заполнение пароля обязательно",
      p => (p && p.length > 4) || "Пароль должен содержать не менее 4 символов"
    ]
  }),

  methods: {
     onLogin() {
        this.$refs.form.validate();
        this.getToken()
     },
     
    getToken(){
      token.save('dsfsdjfsfd')
      this.$router.push({name: 'Accounting'})
    }

  }
};
</script>

<style></style>
