<template>
    <errorTitle
    title="Ошибка 404"
    :text="message"
    />
</template>

<script>
import errorTitle from "../components/errorTitle"

export default {
    name: "Error404",
    components: {
        errorTitle
    },
    data: () => ({
        message: "Адрес не найден"
    })
}


</script>