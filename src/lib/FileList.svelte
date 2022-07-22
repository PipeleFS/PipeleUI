<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { onMount } from "svelte";

    import { deleteFleekFile, listFleekFiles } from "./storage.js";
    import { rootFolder, selectedFiles, signer } from "./stores.js";

    import Share from "./Share.svelte";
    import UploadDialog from "./UploadDialog.svelte";


    let hasSelection;
    let signerAddress;

    $: hasSelection = $selectedFiles.length !== 0
    $: listItems = listFleekFiles($rootFolder);


    onMount(async () => {
        signerAddress = await $signer.getAddress();
    });

    async function handleDelete() {
        await deleteFleekFile();
        listItems = listFleekFiles($rootFolder);
    }
</script>


<style>
    #fileList {
        display: flex;
        flex-wrap: wrap;
        gap: 40px;

        margin-inline-start: 60px;
    }

    #fileList li {
        text-align: center;
    }

    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        width: 190px;
        height: 190px;

        margin-block-end: 10px;
        padding: 10px;

        border: 1px solid #ddd;
        border-radius: 10px;
    }

    .card .fileIcon {
        width: 64px;
    }

    .card .fileName {
        word-break: break-word;
    }
</style>


<div>
    <div>
        <UploadDialog/>
        <Share disabled="{hasSelection !== true}"/>
        <button on:click={handleDelete} disabled="{hasSelection === false}">Delete</button>
    </div>

    {#await listItems}
        loading...
    {:then list}
        <ul id="fileList">
            {#each list as item, index}
                {#if (!item.key.endsWith('root.txt'))}
                        <li>
                            <div class="card">
                                <img class="fileIcon" src="/file-icon.svg" alt="file icon" />
                                <label class="fileName" for="{`item-${index}`}">{item.key.split('/').at(-1)}</label>
                            </div>
                            <input id={`item-${index}`} type="checkbox" bind:group={$selectedFiles} value="{item.key}"/>
                        </li>
                {:else}
<!--                    <li>root for {signerAddress}</li>-->
                {/if}
            {:else}
                <p>No items yet</p>
            {/each}
        </ul>
    {/await}
</div>
