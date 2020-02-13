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
                  <v-col cols="6" v-if="type==='1'">
                    <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :return-value.sync="date1"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date1"
                          label="Fecha apertura"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date1"
                        no-title
                        scrollable
                        @change="$refs.menu1.save(date1)"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6" v-if="type==='1'">
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :return-value.sync="date2"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date2"
                          label="Fecha cierre"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date2"
                        no-title
                        scrollable
                        @change="$refs.menu2.save(date2)"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" v-if="type==='1'">
                    <span style="font-size:18px">Actualizacion/Nuevo</span>
                    <v-select
                        prepend-icon="update"
                        item-text="nombre"
                        item-value="id"
                        v-model="state"
                        :items="states"
                        menu-props="auto"
                        hide-details
                        single-line
                    ></v-select>
                  </v-col>
                  </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn block @click="upload" color="primary">Realizar cargue</v-btn>
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
            date1: new Date().toISOString().substr(0, 10),
            date2: new Date().toISOString().substr(0, 10),
            menu1:false,
            menu2:false,
            type: '1',
            state: '1',
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
            states:[
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
        let data = await(axios.get('/units/?client='+localStorage.getItem('client')))
        this.units = data.data
        this.unit = this.units[0].id
    },
    methods: {
        upload(){
          let formData = new FormData();
          formData.append('file', this.file);
          formData.append('unit', this.unit);
          formData.append('type', this.type);
          formData.append('state', this.state);
          formData.append('date_open',this.date1)
          formData.append('date_close',this.date2)
          axios.post('/asignacion/subir',formData)
        }
    },
};
</script>