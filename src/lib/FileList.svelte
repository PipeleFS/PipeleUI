<script>
    import { listFleekFile } from "./storage.js";

</script>


{#await listFleekFile()}
    loading...
    {:then list}
        {#each list as item}
            <ul>
                <li>{item.key}</li>
            </ul>
        {/each}
{/await}
