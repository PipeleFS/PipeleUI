<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { onMount } from "svelte";

    import Upload from "$lib/Upload.svelte";
    import FileList from "$lib/FileList.svelte";

    import { ethers } from "ethers";
    import Web3Modal from "web3modal";
    import WalletConnectProvider from "@walletconnect/web3-provider";

    import Download from "$lib/Download.svelte";
    import Share from "$lib/Share.svelte";

    import { connect as tlConnect } from '@tableland/sdk';

    import { USER_TABLE_NAME } from '$lib/constants';
    import { createFleekFolder, deleteFleekFile } from '$lib/storage';
    import { rootFolder, signer } from "$lib/stores";
    import { mintFileToken } from "../lib/permissionNft.js";


    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: import.meta.env.CLIENT_INFURA_ID
            }
        }
    };

    const web3Modal = new Web3Modal({
        network: "testnet",
        cacheProvider: true,
        providerOptions
    });


    let instance, provider;
    let isConnected = false;

    let tableland;

    let hasSelection = false;


    onMount(async () => {
        const cachedProviderName = JSON.parse(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
        if (cachedProviderName) {
            await connect();
        }
    })

    async function connect() {
        instance = await web3Modal.connect()
        provider = new ethers.providers.Web3Provider(instance)
        $signer = provider.getSigner();

        isConnected = true;
        await initApp();

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
            network: "testnet",
            chain: "ethereum-goerli"
        });

        $rootFolder = await getRootFolderCid();
        console.log('root', $rootFolder)
    }

    async function getRootFolderCid() {
        let folderCid;

        const tables = await tableland.list();
        let dataTable = tables.find(table => table.name.startsWith(USER_TABLE_NAME))?.name;
        console.log('connect', tables, dataTable);

        if (dataTable === undefined) {
            const { name } = await tableland.create(
                `root_folder text`,
                USER_TABLE_NAME
            );

            dataTable = name;

            folderCid = await createFleekFolder(`/${await $signer.getAddress()}`, 'root.txt', 'empty', 'text/plain');

            const insertRes = await tableland.write(
                `INSERT INTO ${dataTable} (root_folder) VALUES (${folderCid});`
            );
            console.log('new root', insertRes, folderCid);
        } else {
            const { columns, rows } = await tableland.read(`SELECT * FROM ${dataTable};`);
            console.log('table', columns, rows);

            folderCid = rows[0][0];
        }

        return folderCid;
    }

    function handleUploadComplete(url, fileName, fileType, cid) {
        console.log('complete', cid);

        mintFileToken(cid);
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
        <FileList bind:hasSelection />

        <!-- To get a first working implementation fast, this directly opens a file select dialog
             Dedicated dialog will be implemented during 2nd step app completion -->
        <div>
            <Upload buttonLabel="Upload" showButton="true" encrypt="true" postFileCallback="{handleUploadComplete}"/>
            <Share disabled="{hasSelection !== true}"/>
            <Download disabled="{hasSelection !== true}"/>
        </div>
        <div>
            <button on:click={deleteFleekFile} disabled="{hasSelection === false}">Delete</button>
        </div>
        <div>
            <button on:click={disconnect}>Disconnect</button>
        </div>
    </section>
{/if}
