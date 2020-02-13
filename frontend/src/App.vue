<template>
  <v-app>
    <v-app-bar 
    app
    color="primary"
    dark
    >
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-list class="hidden-xs-only" color="primary">
        <v-btn
          v-if="isLoggedIn"
          text
          key="Asignación"
          to="/asignacion">
          <v-icon left dark>cloud_upload</v-icon>
          Asignación
        </v-btn>
        <v-btn
          v-else
          text
          key="Iniciar Sesión"
          to="/">
          <v-icon left dark>person</v-icon>
          Iniciar Sesión
        </v-btn>
        <v-btn
          v-if="isLoggedIn"
          text
          key="Cerrar sesion"
          @click="logout">
          <v-icon left dark>block</v-icon>
          Cerrar sesion
        </v-btn>
      </v-list>
    </v-app-bar>

    <v-content fluid>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {},
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    unitUser : function(){ return this.$store.getters.unitUser},
    user : function(){ return this.$store.getters.user},
  },
  data: () => ({
    appTitle: 'Asignación BPO',
    sidebar: false,
    menuItems: [
      { title: 'Asignacion', path: '/asignacion', icon: 'home' },
    ]
  }),
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/')
      })
    }
  },
};
</script>
