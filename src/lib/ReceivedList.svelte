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
</script>


{#await listItems}
    <p>...loading</p>
{:then list}
    {#each list.data.data.pipeleEntities as item, index}
        <ul>
            <li>
                <input id={`item-${index}`} type="checkbox" bind:group={$selectedShares} value="{item.hash}" />
                <label for="{`item-${index}`}">{item.key}</label>
            </li>
        </ul>
    {:else}
        <p>No files received yet</p>
    {/each}
{/await}

<div>
    <Download disabled="{hasSelection !== true}" selectionType="{SELECTION_TYPES.received}" />
</div>
