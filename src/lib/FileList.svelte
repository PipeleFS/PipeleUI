<script>
    import { getContext, onMount } from "svelte";
    import { CONTEXT_KEY } from "./constants.js";

    import { listFleekFile } from "./storage.js";


    const appContext = getContext(CONTEXT_KEY);
    const storage = appContext.getStorage();

    let list = [];


    onMount(async () => {
        await storage?.createFolder({bucket: 'personal', path: 'topFolder'});
        list = await storage?.listDirectory({path: ''}) || [];
// result contains `topFolder` items

// upload a file
        const uploadResponse = await storage?.addItems({
            bucket: 'personal',
            files: [
                {
                    path: 'file.txt',
                    content: 'plain-text-value',
                },
                {
                    path: 'space.png',
                    content: '', // could also be a ReadableStream<Uint8Array> or ArrayBuffer
                }
            ],
        });
// uploadresponse is an event listener
        uploadResponse?.once('done', (data) => {
            const summary = data;
            // returns a summary of all files and their upload status
        });
    });
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
