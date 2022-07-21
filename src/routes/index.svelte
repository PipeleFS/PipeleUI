<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { onMount } from "svelte";

    import FileList from "$lib/FileList.svelte";
    import ReceivedList from "$lib/ReceivedList.svelte";

    import { ethers } from "ethers";
    import Web3Modal from "web3modal";
    import WalletConnectProvider from "@walletconnect/web3-provider";

    import { connect as tlConnect } from '@tableland/sdk';

    import { USER_TABLE_NAME } from '$lib/constants';
    import { createFleekFolder } from '$lib/storage';
    import { rootFolder, signer } from "$lib/stores";
    import { getAccessibleFiles, getData } from "$lib/queries.js";


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


<style>
    snap-tabs {
        --hue: 328deg;
        --accent: var(--hue) 100% 54%;
        --indicator-size: 2px;
        --space-1: .5rem;
        --space-2: 1rem;
        --space-3: 1.5rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative
    }

    snap-tabs a, snap-tabs article, snap-tabs header, snap-tabs nav, snap-tabs section {
        outline-color: hsl(var(--accent));
        outline-offset: -5px
    }

    .scroll-snap-x {
        overflow: auto hidden;
        overscroll-behavior-x: contain;
        -ms-scroll-snap-type: x mandatory;
        scroll-snap-type: x mandatory
    }

    @media (prefers-reduced-motion: no-preference) {
        .scroll-snap-x {
            scroll-behavior: smooth
        }
    }

    @media (hover: none) {
        .scroll-snap-x {
            scrollbar-width: none
        }

        .scroll-snap-x::-webkit-scrollbar {
            width: 0;
            height: 0
        }
    }

    snap-tabs > header {
        --text-color: hsl(var(--hue) 5% 40%);
        --text-active-color: hsl(var(--hue) 20% 10%);
        flex-shrink: 0;
        min-block-size: -webkit-fit-content;
        min-block-size: -moz-fit-content;
        min-block-size: fit-content;
        display: flex;
        flex-direction: column
    }

    snap-tabs > header > nav {
        display: flex
    }

    snap-tabs > header a {
        scroll-snap-align: start;
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        font-size: .8rem;
        color: var(--text-color);
        font-weight: 700;
        text-decoration: none;
        padding: var(--space-2) var(--space-3)
    }

    snap-tabs > header a > svg {
        inline-size: 1.5em;
        pointer-events: none
    }

    snap-tabs > header a:hover {
        background: hsl(var(--accent)/5%)
    }

    snap-tabs > header a:focus {
        outline-offset: -.5ch
    }

    snap-tabs > header > .snap-indicator {
        inline-size: 0;
        block-size: var(--indicator-size);
        border-radius: var(--indicator-size);
        background: hsl(var(--accent))
    }

    snap-tabs > section {
        block-size: 100%;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 100%
    }

    snap-tabs > section > article {
        scroll-snap-align: start;
        overflow-y: auto;
        overscroll-behavior-y: contain;
        padding: var(--space-2) var(--space-3)
    }

    @media (prefers-reduced-motion: reduce) {
        snap-tabs > header a {
            -webkit-border-after: var(--indicator-size) solid hsl(var(--accent)/0%);
            border-block-end: var(--indicator-size) solid hsl(var(--accent)/0%);
            transition: color .7s ease, border-color .5s ease
        }

        snap-tabs > header a:active, snap-tabs > header a:target, snap-tabs > header a[active] {
            color: var(--text-active-color);
            border-block-end-color: hsl(var(--accent))
        }

        snap-tabs .snap-indicator {
            visibility: hidden
        }
    }

    p {
        max-inline-size: 35ch;
        margin-block: .5ch
    }

    p + p {
        -webkit-margin-before: 1rem;
        margin-block-start: 1rem
    }

    h2 {
        font-size: 2.5rem;
        -webkit-margin-after: .5rem;
        margin-block-end: .5rem;
        line-height: 1
    }

    h2:first-of-type {
        -webkit-margin-before: 0;
        margin-block-start: 0
    }

    article {
        box-sizing: border-box;
        font-family: Blokk;
        font-size: 1.25rem;
        line-height: 1;
        color: #333
    }

    .github-corner {
        fill: #ccc;
        color: #fff
    }

    @-webkit-keyframes octocat-wave {
        0%, to {
            transform: rotate(0)
        }
        20%, 60% {
            transform: rotate(-25deg)
        }
        40%, 80% {
            transform: rotate(10deg)
        }
    }

    @keyframes octocat-wave {
        0%, to {
            transform: rotate(0)
        }
        20%, 60% {
            transform: rotate(-25deg)
        }
        40%, 80% {
            transform: rotate(10deg)
        }
    }
</style>


{#if (!isConnected)}
    <section id="intro">
        <h1>Pipele</h1>
        <p>Creation of private space and data sharing products.</p>
        <button on:click={connect}>Connect</button>
    </section>
{/if}

{#if (isConnected)}
    <snap-tabs>
        <header class="scroll-snap-x">
            <nav>
                <a active href="#responsive">Files</a>
                <a href="#accessible">Received</a>
            </nav>
            <span class="snap-indicator"></span>
        </header>
        <section class="scroll-snap-x">
            <article id="responsive">
                <h2>Uploaded files</h2>
                <FileList />
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
