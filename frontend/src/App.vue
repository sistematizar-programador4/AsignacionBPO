<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    > 
    <v-spacer></v-spacer>
    <div id="nav" style="color:black">
      <router-link to="/" style="color:black">Home</router-link> |
      <router-link to="/user" style="color:black">{{user}}</router-link><span v-if="isLoggedIn" style="color:black"> | <a style="color:black">Logout</a></span>
    </div>
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
    //
  }),
};
</script>
