<script>
    import { onMount } from "svelte";

    import Upload from "../lib/Upload.svelte";

    import { ethers } from "ethers";
    import Web3Modal from "web3modal";
    import WalletConnectProvider from "@walletconnect/web3-provider";


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


    onMount(() => {
        const cachedProviderName = JSON.parse(localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER"));
        if (cachedProviderName) {
            connect();
        }
    })

    async function connect() {
        instance = await web3Modal.connect()
        provider = new ethers.providers.Web3Provider(instance)
        signer = provider.getSigner();

        isConnected = true;

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
        content
        <Upload buttonLabel="Upload" showButton="true" encrypt="true" />
        <button on:click={disconnect}>Disconnect</button>
    </section>
{/if}
