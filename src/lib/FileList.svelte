<script>
    import { listFleekFile } from "./storage.js";

    export let hasSelection;

    let selectedItems = [];

    $: hasSelection = selectedItems.length !== 0
</script>


{#await listFleekFile()}
    loading...
    {:then list}
        {#each list as item, index}
            <ul>
                <li>
                    <input id={`item-${index}`} type="checkbox" bind:group={selectedItems} value="{item.publicUrl}" />
                    <label for="{`item-${index}`}">{item.key}</label>
                </li>
            </ul>
        {/each}
{/await}
