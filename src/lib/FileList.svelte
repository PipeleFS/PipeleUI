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

    function handleCardClick(checkId) {
        const check = document.querySelector(checkId);
        check.click();
    }

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

    #actions {
        display: flex;
        gap: 30px;
        align-items: center;

        margin-inline-start: 35px;
        margin-block: 35px;
    }

    #title {
        font-size: 36px;
    }

    #deleteAction {
        width: 244px;
        height: 77px;

        color: #fff;
        background: #6C63FF;

        font-size: 36px;

        border: 0;
        border-radius: 15px;
    }

    #deleteAction:disabled {
        background: #b4afff;
    }

    #deleteAction img {
        width: 40px;
    }

    #loadState {
        margin: 35px;
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
        pointer-events: none;
    }
</style>


<div>
    <div id="actions">
        <h2 id="title">Uploaded Files</h2>
        <UploadDialog/>
        <Share />
        <button id="deleteAction" on:click={handleDelete} disabled="{hasSelection === false}">
            <img src="/delete-icon.svg" alt="" />
            <span>Delete</span>
        </button>
    </div>

    {#await listItems}
        <span id="loadState">loading...</span>
    {:then list}
        <ul id="fileList">
            {#each list as item, index}
                {#if (!item.key.endsWith('root.txt'))}
                        <li>
                            <div class="card" on:click={() => handleCardClick(`#item-${index}`)}>
                                <img class="fileIcon" src="/file-icon.svg" alt="file icon" />
                                <label class="fileName" for="{`item-${index}`}">{item.key.split('/').at(-1)}</label>
                            </div>
                            <input id={`item-${index}`} type="checkbox" bind:group={$selectedFiles} value="{item}"/>
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
