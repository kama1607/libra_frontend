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
              <v-form>
                <v-text-field v-model="login" label="Логин" type="text" />
                <v-text-field
                  v-model="password"
                  label="Пароль"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="onLogin">ВОЙТИ</v-btn>
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
  name: "Login",
  props: {
    source: String,
  },
  data: () => ({
    login: "",
    password: "",
  }),
  methods: {
     onLogin() {
        token.save('dsfsdjfsfd')
        this.$router.push({name: 'Accounting'})
     }
  }
};
</script>

<style></style>
