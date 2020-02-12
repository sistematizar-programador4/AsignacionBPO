<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
               <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Nombre de usuario"
                    name="login"
                    prepend-icon="person"
                    type="text"
                    v-model="user"
                    @change="searchClient"
                  />

                  <v-text-field
                    id="password"
                    label="contraseña"
                    name="password"
                    v-model="password"
                    prepend-icon="lock"
                    type="password"
                  />

                    <v-select
                        prepend-icon="business"
                        item-text="nombre"
                        item-value="id"
                        v-model="client"
                        :items="clients"
                        menu-props="auto"
                        hide-details
                        single-line
                    ></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="signIn" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            user: null,
            password: null,
            client: null,
            clients: Array({
                id:null,
                nombre:'Escriba el usuario'
            })
        }
    },
    async mounted() {},
    methods: {
        async searchClient(){
            this.clients = (await axios.get('/clients/?user='+this.user)).data
            this.client = this.clients[0].id
        },
        async signIn(){
          let email = this.user
          let password = this.password
          let client = this.client
          this.$store.dispatch('login', { email, password, client })
          .then(() => this.$router.push('/asignacion/'+client))
          .catch(err => console.log(err))
        }
    },
}
</script>

<style>

</style>