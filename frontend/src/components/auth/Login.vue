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
               <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
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
                <v-btn @click="signIn" color="primary">Iniciar Sesión</v-btn>
              </v-card-actions>
            </v-card>
        </v-col>
        <v-snackbar
          v-model="snackbar"
          color="success"
        >
          {{message}}
          <v-btn
            color="white"
            text
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import 'vuejs-noty/dist/vuejs-noty.css'
export default {
    data() {
        return {
            user: null,
            password: null,
            snackbar:false,
            message: '',
            client: null,
            clients: Array({
                id:null,
                nombre:'Escriba el usuario'
            }),
        }
    },
    async mounted() {
      if(localStorage.getItem('token')){
        this.$router.push('/asignacion')
      }
    },
    methods: {
        async searchClient(){
            let clientsList = (await axios.get('/clients/?user='+this.user)).data
            if(clientsList.length > 0){
              this.clients = clientsList
              this.client = this.clients[0].id
            }else{
              this.clients = Array({
                id:null,
                nombre:'Escriba el usuario'
              })
              this.client = null
            }
        },
        async signIn(){
          let email = this.user
          let password = this.password
          let client = this.client
          let thos = this
          this.$store.dispatch('login', { email, password, client })
          .then(() => {
            thos.snackbar = true
            thos.message = 'Inicio de Sesión exitoso!'
            // this.$router.push('/asignacion')
          })
          .catch(err => {
            thos.message = err
          })
        }
    },
}
</script>

<style>

</style>