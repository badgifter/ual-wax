<template>
    <div>
        <h1>Wallet & Transaction test</h1>
        <button @click="login()">Login with WAX (testnet)</button>
        <button @click="logout()">Logout</button>

        <div v-if="user">
            <p>login in as: {{ user.accountName }}</p>
        </div>

        <ul>
            <legend>sale_id's</legend>
            <li>24985</li>
            <li>24982</li>
            <li>24978</li>
            <li>24949</li>
            <li>24948</li>
        </ul>

        <div>
            <input type="text" v-model="saleId" placeholder="sale_id" />
            <button @click="buy()">Buy</button>

            <p v-if="loading">Loading...</p>

            <template v-if="sale">
                <p>you will buy:</p>
                <pre>
                {{ sale }}
                </pre>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Wax } from '@nefty/ual-wax';
import { NuxtUser } from './types/wallets';
import { rpcEndpoints } from './utils/networkUtils';
import { createTransaction, priceCalculator, transactionActions } from './utils/transactionUtils';

const { $ual } = useNuxtApp();
const config = useRuntimeConfig();

const user = ref(null);
const wax = ref(null);
const ual = ref(null);

const saleId = ref();
const sale = ref(null);
const loading = ref(false);

onMounted(async () => {
    walletMount();
});

const login = () => {
    ual.value.loginUser(wax.value);
};

const logout = () => {
    ual.value.logoutUser();
    user.value = null;
};

const walletMount = () => {
    // issue with Anchor fetch provider
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).global = window;
    const endpoints: string[] = config.RPC_ENDPOINTS;
    const appName: string = config.APP_NAME;
    const network = {
        chainId: config.CHAIN_ID as string,
        rpcEndpoints: rpcEndpoints(endpoints),
    };

    // init the wallets
    wax.value = new Wax([network], { appName });

    // init ual
    ual.value = $ual([wax.value], setUser);
    ual.value.init();
};

const setUser = (users: NuxtUser) => {
    // no support for multiple accounts
    user.value = users[0];
};

const buy = async () => {
    const { accountName, requestPermission } = user.value;
    const { assets_ids, price } = sale.value;

    const actions = transactionActions({
        account: accountName,
        permission: requestPermission,
        sale_id: saleId.value,
        assets_ids: assets_ids,
        precision_symbol: price.precision_symbol,
        token_contact: price.token_contact,
        price: `${price.amount_long} ${price.symbol}`,
        median: 0,
    });

    try {
        const { transaction, options } = await createTransaction(user.value, actions);

        console.log(user.value);

        const signedTransaction = await user.value.signTransaction(transaction, options);

        console.log(signedTransaction);
    } catch (error) {
        console.error(error);
    }
};

watch(saleId, () => getSale());

const getSale = async () => {
    const sale_id = +saleId.value;
    loading.value = true;

    if (!isNaN(sale_id)) {
        try {
            const { data } = await $fetch<any>(`https://aa.neftyblocks.com/atomicmarket/v1/sales/${sale_id}`);

            if (data) {
                const { price, assets, sale_id } = data;

                const reponses = {
                    name: assets[0].name || assets[0].data.name,
                    sale_id,
                    assets_ids: [],
                    price: priceCalculator(price),
                };

                for (let i = 0; i < assets.length; i++) {
                    const { asset_id } = assets[i];
                    reponses.assets_ids.push(asset_id);
                }

                sale.value = reponses;
            }
        } catch (error) {
            console.error(error);
        }
    }

    loading.value = false;
};
</script>
