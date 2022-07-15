<script>
    import { onMount, setContext } from "svelte";

    import Upload from "../lib/Upload.svelte";
    import FileList from "../lib/FileList.svelte";

    import { ethers } from "ethers";
    import Web3Modal from "web3modal";
    import WalletConnectProvider from "@walletconnect/web3-provider";

    import { Users, UserStorage } from '@spacehq/sdk';

    import { CONTEXT_KEY } from '$lib/constants';


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

    let identity, user, storage;

    const users = new Users({endpoint: 'wss://auth-dev.space.storage'});

    console.log(users)


    users.createIdentity()
        .then(async result => {
            identity = result;
            user = await users.authenticate(identity);

            console.log('promise', user)

            storage = new UserStorage(user);

            console.log('states', identity, user, storage)
        })
        .catch(error => console.log(error));


    setContext(CONTEXT_KEY, {
        getProvider: () => provider,
        getSigner: () => signer,

        getIdentity: () => identity,
        getUser: () => user,
        getStorage: () => storage
    });

    onMount(async () => {
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
        <FileList />
        <Upload buttonLabel="Upload" showButton="true" encrypt="true" />
        <button on:click={disconnect}>Disconnect</button>
    </section>
{/if}
