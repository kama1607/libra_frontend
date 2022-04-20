<template>
    <v-card elevation="4">
        <v-card-title align="center"> {{ title }} </v-card-title>
        <v-card-title> {{ text }} </v-card-title>
        <v-img :src="errorImg" width="350" height="400" class="mx-auto"/>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="$router.push('/accountings')"> 
                <span> На главную</span>       
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
 name: "errorTitle",
 props: {
     title: {
      type: String,
      default: 'Не установлен заголовок'
    },
    text: {
      type: String,
      default: 'Нет установленного текста'
    },
 },

 data: ()=> ({
    errorImg: "https://st.depositphotos.com/1252248/1783/i/450/depositphotos_17832955-stock-photo-error-404-not-found.jpg"
 })
}

</script>