<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="6">
        <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
               <v-toolbar-title>Cargar Asignacion</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                  <v-row align="center" justify="center">
                  <v-col cols="12">
                    <v-file-input v-model="file" label="Archivo Asignación" @change="upload"></v-file-input>
                  </v-col>
                  <v-col cols="6">
                    <span style="font-size:18px">Unidad</span>
                    <v-select
                        prepend-icon="store_mall_directory"
                        item-text="nombre"
                        item-value="id"
                        v-model="unit"
                        :items="units"
                        menu-props="auto"
                        hide-details
                        single-line
                    ></v-select>
                  </v-col>
                  <v-col cols="6">
                    <span style="font-size:18px">Tipo de cargue</span>
                    <v-select
                        prepend-icon="build"
                        item-text="nombre"
                        item-value="id"
                        v-model="type"
                        :items="types"
                        menu-props="auto"
                        hide-details
                        single-line
                    ></v-select>
                  </v-col>
                  <v-col cols="12" v-if="type==='1'">
                    <span style="font-size:18px">Actualizacion/Nuevo</span>
                    <v-select
                        prepend-icon="update"
                        item-text="nombre"
                        item-value="id"
                        v-model="type"
                        :items="types"
                        menu-props="auto"
                        hide-details
                        single-line
                    ></v-select>
                  </v-col>
                  </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn block @click="signIn" color="primary">Realizar cargue</v-btn>
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
            file: null,
            unit: null,
            type: '1',
            units:{},
            types:[
                {
                    id:'1',
                    nombre:'Asignacion'
                },
                {
                    id:'2',
                    nombre:'Pagos'
                }
            ],
            estado:[
                {
                    id:'1',
                    nombre:'Nuevo'
                },
                {
                    id:'2',
                    nombre:'Actualizacion'
                }
            ],
        }
    },
    async mounted() {
        console.log(this.$route.params)
        let data = await(axios.get('/units/?client='+this.$route.params.client))
        this.units = data.data
        this.unit = this.units[0]
    },
    methods: {
        upload(){}
    },
    computed : {
        isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    },
};
</script>