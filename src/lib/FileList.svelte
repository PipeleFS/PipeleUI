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
    import { mintFileToken } from "./permissionNft.js";

    export let hasSelection;


    let signerAddress;


    $: hasSelection = $selectedFiles.length !== 0
    $: listItems = listFleekFiles($rootFolder);


    onMount(async () => {
        signerAddress = await $signer.getAddress();
    });

    function handleUploadComplete(url, fileName, fileType, cid) {
        console.log('complete', cid, url);

        mintFileToken(cid);
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
    <button on:click={deleteFleekFile} disabled="{hasSelection === false}">Delete</button>
</div>
