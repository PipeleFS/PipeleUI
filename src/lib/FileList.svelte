<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { onMount } from "svelte";

    import { deleteFleekFile, listFleekFiles } from "./storage.js";
    import { rootFolder, selectedFiles, signer } from "./stores.js";

    import Upload from "./Upload.svelte";
    import Share from "./Share.svelte";
    import Download from "./Download.svelte";
    import { mintFileToken, sendAccessPermission } from "./permissionNft.js";

    export let hasSelection;


    let signerAddress;


    $: hasSelection = $selectedFiles.length !== 0
    $: listItems = listFleekFiles($rootFolder);


    onMount(async () => {
        signerAddress = await $signer.getAddress();
    });

    async function handleUploadComplete(url, fileName, fileType, cid) {
        console.log('complete', cid, url);

        listItems = listFleekFiles($rootFolder);

        await mintFileToken(cid);

        // Allow uploader to download the file
        await sendAccessPermission(await $signer.getAddress(), 0);
    }

    async function handleDelete() {
        await deleteFleekFile();
        listItems = listFleekFiles($rootFolder);
    }
</script>


{#await listItems}
    loading...
    {:then list}
        {#each list as item, index}
            {#if (!item.key.endsWith('root.txt'))}
                <ul>
                    <li>
                        <input id={`item-${index}`} type="checkbox" bind:group={$selectedFiles} value="{item.key}" />
                        <label for="{`item-${index}`}">{item.key}</label>
                    </li>
                </ul>
            {:else}
                <p>root for {signerAddress}</p>
            {/if}
        {:else}
            <p>No items yet</p>
        {/each}
{/await}

<div>
    <!-- To get a first working implementation fast, this directly opens a file select dialog
    Dedicated dialog will be implemented during 2nd step app completion -->
    <Upload buttonLabel="Upload" showButton="true" encrypt="true"
            postFileCallback="{handleUploadComplete}" rootFolder="{$rootFolder}"/>
    <Share disabled="{hasSelection !== true}"/>
    <Download disabled="{hasSelection !== true}"/>
</div>
<div>
    <button on:click={handleDelete} disabled="{hasSelection === false}">Delete</button>
</div>
