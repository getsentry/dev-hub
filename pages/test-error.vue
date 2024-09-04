<script setup>
import { useFetch } from "#imports";

const triggerError = () => {
	throw new Error("Nuxt Button Error");
};
const fetchData = async () => {
	await useFetch("/api/testError");
};
</script>

<template>
	<div>
		<button id="errorBtn" @click="triggerError">Trigger Client Error</button>
		<br />
		<button @click="fetchData">Fetch Server Data</button>
	</div>
</template>
