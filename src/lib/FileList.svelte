<script>
    import { onMount } from "svelte";

    import { listFleekFiles } from "./storage.js";
    import { rootFolder, signer } from "./stores.js";

    export let hasSelection;


    let signerAddress;

    let selectedItems = [];

    $: hasSelection = selectedItems.length !== 0
    $: listItems = listFleekFiles($rootFolder);


    onMount(async () => {
        signerAddress = await $signer.getAddress();
    });
</script>


{#await listItems}
    loading...
    {:then list}
        {#each list as item, index}
            {#if (item.key.ends)}
                <ul>
                    <li>
                        <input id={`item-${index}`} type="checkbox" bind:group={selectedItems} value="{item.publicUrl}" />
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
