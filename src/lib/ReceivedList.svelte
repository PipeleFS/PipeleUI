<!--
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { onMount } from "svelte";

    import { selectedShares, signer } from "./stores.js";
    import { getAccessibleFiles, getData } from "./queries.js";
    import { SELECTION_TYPES } from "./constants.js";
    import Download from "./Download.svelte";


    let hasSelection;
    let signerAddress;

    $: hasSelection = $selectedShares.length !== 0;
    $: listItems = getData(getAccessibleFiles, signerAddress);


    onMount(async () => {
        signerAddress = await $signer.getAddress();
    });

    function handleCardClick(checkId) {
        const check = document.querySelector(checkId);
        check.click();
    }
</script>


<style>
    #receivedList {
        display: flex;
        flex-wrap: wrap;
        gap: 40px;

        margin-inline-start: 60px;
    }

    #receivedList li {
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
        <h2 id="title">Received Files</h2>
        <Download disabled="{hasSelection !== true}" selectionType="{SELECTION_TYPES.received}"/>
    </div>

    {#await listItems}
        <span id="loadState">...loading</span>
    {:then list}
        <ul id="receivedList">
            {#each list.pipeleShares as item, index}
                    <li>
                        <div class="card" on:click={() => handleCardClick(`#item-${index}`)}>
                            <img class="fileIcon" src="/file-icon.svg" alt="file icon" />
                            <label class="fileName" for="{`item-${index}`}">{item.pipeleSBT.fileID}</label>
                        </div>
                        <input id={`item-${index}`} type="checkbox" bind:group={$selectedShares} value="{item.pipeleSBT.fileID}"/>
                    </li>
            {:else}
                <li>No files received yet</li>
            {/each}
        </ul>
    {/await}
</div>
