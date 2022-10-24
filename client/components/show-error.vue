<template>
    <div class="alert alert-danger" v-if="errors.length">
        <ul class="my-0">
            <li v-for="(error,index) in errors" :key="index">{{ error.message }}</li>
        </ul>
    </div>
</template>