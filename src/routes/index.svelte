<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { onMount } from "svelte";

    import FileList from "$lib/FileList.svelte";
    import FriendsList from "../lib/FriendsList.svelte";
    import ReceivedList from "$lib/ReceivedList.svelte";
    import Welcome from "../lib/Welcome.svelte";

    import { ethers } from "ethers";

    import { connect as tlConnect } from '@tableland/sdk';

    import { USER_TABLE_NAME } from '$lib/constants';
    import { createFleekFolder } from '$lib/storage';
    import { rootFolder, signer } from "$lib/stores";


    let provider;
    let isConnected = false;
    let activeContent = 'files';
    let selectedComponent = FileList;

    let tableland;


    onMount(async () => {
        const cachedProviderName = JSON.parse(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
        if (cachedProviderName) {
            await connect();
        }
    })

    async function connect() {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
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

            folderCid = await createFleekFolder(`${await $signer.getAddress()}`, 'root.txt', 'empty', 'text/plain');

            const insertRes = await tableland.write(
                `INSERT INTO ${dataTable} (root_folder) VALUES (${folderCid});`
            );
            console.log('new root', insertRes, folderCid);
        } else {
            const { columns, rows } = await tableland.read(`SELECT * FROM ${dataTable};`);
            console.log('table', columns, rows);

            // folderCid = rows[0][0];

            // In case tableland is down, or the write call doesn't work (which was a constant problem for us)
            folderCid = '0xdD372842cB80c1892243D20eE4ad0979c293Cad5';
        }

        return folderCid;
    }

    function handleNav(key, component) {
        activeContent = key;
        selectedComponent = component;
    }
</script>


<style>
    nav {
        display: flex;
        flex-direction: column;
    }

    nav a {
        display: flex;
        gap: 10px;
        align-items: center;

        height: 58px;

        padding-inline-start: 37px;

        color: #464646;
        background-color: #E0E0E0;

        text-decoration: none;
    }

    nav a.active {
        color: #6C63FF;;
        background-color: #fff;
    }

    #content {
        display: grid;
        grid-template-columns: 220px 1fr;
    }

    header {
        display: flex;
        align-items: center;

        height: 90px;

        margin-block-end: 5px;
        padding-inline: 40px;

        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    }

    #logo {
        width: 180px;
        height: 54px;
    }
</style>


{#if (!isConnected)}
    <Welcome on:connect={connect} />
{:else}

    <header>
        <img id="logo" src="/pipele.png" alt="pipele logo" />
    </header>

    <section id="content">
        <nav>
            <a class:active={activeContent === 'files'} href="#responsive"
               on:click={() => handleNav('files', FileList)}>
                <img src="/upload-icon.svg" alt="upload files" />
                <span>Uploaded Files</span>
            </a>
            <a class:active={activeContent === 'friends'} href="#friends"
               on:click={() => handleNav('friends', FriendsList)}>
                <img src="/friends-icon.svg" alt="friends list" />
                <span>Friends list</span>
            </a>
            <a class:active={activeContent === 'received'} href="#accessible"
               on:click={() => handleNav('received', ReceivedList)}>
                <img src="/received-icon.svg" alt="received files" />
                <span>Received</span>
            </a>
        </nav>

        <svelte:component this="{selectedComponent}" />
    </section>

<!--    TODO: Add back somewhere -->
<!--    <div>-->
<!--        <button on:click={disconnect}>Disconnect</button>-->
<!--    </div>-->
{/if}
