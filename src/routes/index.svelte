<script>
    import { onMount, setContext } from "svelte";

    import Upload from "$lib/Upload.svelte";
    import FileList from "$lib/FileList.svelte";

    import { ethers } from "ethers";
    import Web3Modal from "web3modal";
    import WalletConnectProvider from "@walletconnect/web3-provider";

    import { connect as tlConnect } from '@tableland/sdk';

    import { CONTEXT_KEY, USER_TABLE_NAME } from '$lib/constants';
    import { createFleekFolder } from '$lib/storage';
    import { rootFolder } from "$lib/stores";


    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: import.meta.env.CLIENT_INFURA_ID
            }
        }
    };

    const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions
    });


    let instance, provider, signer;
    let isConnected = false;

    let tableland;


    setContext(CONTEXT_KEY, {
        getProvider: () => provider,
        getSigner: () => signer,

    });

    onMount(async () => {
        const cachedProviderName = JSON.parse(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
        if (cachedProviderName) {
            await connect();
        }
    })

    async function connect() {
        instance = await web3Modal.connect()
        provider = new ethers.providers.Web3Provider(instance)
        signer = provider.getSigner();

        isConnected = true;
        initApp();

        provider.on("accountsChanged", (accounts) => {
            console.log('accounts', accounts);
        });

        provider.on("chainChanged", (chainId) => {
            console.log('changed', chainId);
        });

        provider.on("connect", (info) => {
            console.log('connected', info);
            isConnected = true;
        });

        provider.on("disconnect", (error) => {
            console.log('Error', error);
            isConnected = false;
        });
    }

    async function disconnect() {
        await web3Modal.clearCachedProvider();
        isConnected = false;
    }

    async function initApp() {
        tableland = await tlConnect({
            network: "testnet"
        });

        $rootFolder = await getRootFolderId();
    }

    async function getRootFolderId() {
        const tables = await tableland.list();
        let dataTable = tables.find(table => table.name.startsWith(USER_TABLE_NAME))?.name;
        console.log('connect', tables, dataTable);

        if (dataTable === undefined) {
            { name } await tableland.create(
                `root_folder text`,
                USER_TABLE_NAME
            );

            dataTable = name;

            const rootFolder = await createFleekFolder(`/${await signer.getAddress()}`, 'root.txt', 'empty', 'text/plain');
            const insertRes = await tableland.write(
                `INSERT INTO ${dataTable} (root_folder) VALUES (${rootFolder});`
            );
            console.log(insertRes);
        }

        const { columns, rows } = await tableland.read(`SELECT * FROM ${dataTable};`);
        console.log('table', columns, rows);

        return dataTable;
    }
</script>


{#if (!isConnected)}
    <section id="intro">
        <h1>Pipele</h1>
        <p>Creation of private space and data sharing products.</p>
        <button on:click={connect}>Connect</button>
    </section>
{/if}

{#if (isConnected)}
    <section id="content">
        <FileList />

        <!-- To get a first working implementation fast, this directly opens a file select dialog
             Dedicated dialog will be implemented during 2nd step app completion -->
        <Upload buttonLabel="Upload" showButton="true" encrypt="true" />
        <button on:click={disconnect}>Disconnect</button>
    </section>
{/if}
