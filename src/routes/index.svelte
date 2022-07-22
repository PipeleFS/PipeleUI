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
    import Web3Modal from "web3modal";
    import WalletConnectProvider from "@walletconnect/web3-provider";

    import { connect as tlConnect } from '@tableland/sdk';

    import { USER_TABLE_NAME } from '$lib/constants';
    import { createFleekFolder } from '$lib/storage';
    import { rootFolder, signer } from "$lib/stores";
    import { getAccessibleFiles, getData } from "$lib/queries";


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


    onMount(async () => {
        const cachedProviderName = JSON.parse(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
        if (cachedProviderName) {
            await connect();
        }

        const shares = await getData(getAccessibleFiles, '0xdD372842cB80c1892243D20eE4ad0979c293Cad5');
        console.log('shares', shares.data.data);
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
            folderCid = rows[0][0];
            console.log('table', columns, rows);

            // In case tableland is down
            // folderCid = '0xdD372842cB80c1892243D20eE4ad0979c293Cad5';  // this is the wallet address
        }

        return folderCid;
    }
</script>


{#if (!isConnected)}
    <Welcome on:connect={connect} />
{/if}

{#if (isConnected)}
    <snap-tabs>
        <header class="scroll-snap-x">
            <nav>
                <a active href="#responsive">Files</a>
                <a href="#friends">Friends</a>
                <a href="#accessible">Received</a>
            </nav>
            <span class="snap-indicator"></span>
        </header>
        <section class="scroll-snap-x">
            <article id="responsive">
                <h2>Uploaded files</h2>
                <FileList />
            </article>
            <article>
                <h2>Friends</h2>
                <FriendsList />
            </article>
            <article id="accessible">
                <h2>received</h2>
                <ReceivedList />
            </article>
        </section>
    </snap-tabs>

    <div>
        <button on:click={disconnect}>Disconnect</button>
    </div>
{/if}
