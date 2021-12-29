import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
    modules: ['nuxt3-ual/module'],
    ual: {
        appName: process.env.APP_NAME,
        chainId: process.env.CHAIN_ID,
        rpcEndpoints: [process.env.RPC_ENDPOINT],
    },
    publicRuntimeConfig: {
        APP_NAME: process.env.APP_NAME,
        CHAIN_ID: process.env.CHAIN_ID,
        RPC_ENDPOINTS: [process.env.RPC_ENDPOINT],
    },
});
