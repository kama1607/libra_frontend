<template>
  <v-app>
    <v-app-bar
      app
      dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <userActions/>
    </v-app-bar>
  
    <v-navigation-drawer
        app
        v-model="drawer"
        temporary
        dark>
      <v-list
          nav
          dense>
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4">

          <v-list-item link :to="{name: 'Accounting'}">
          <v-list-item-title>Движение книжного фонда</v-list-item-title>
          </v-list-item>

          <v-list-item link :to="{name: 'books'}">
            <v-list-item-title>Книги</v-list-item-title>
          </v-list-item>  

          <v-list-item link :to="{name: 'students'}">
            <v-list-item-title>
              Ученики
            </v-list-item-title>
          </v-list-item>

          <v-list-item link :to="{name: 'Authors'}">
            <v-list-item-title>Авторы</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>

  </v-app>
</template>

<script>
import userActions from './components/userActions';

export default {
  name: 'App',
  components: {
    userActions
  },
  data: () => ({
    drawer: false,
    group: null,
  }),

  watch: {
    group () {
      this.drawer = false
    },
  },
};
</script>
