<!--
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { sendAccessPermission } from "./permissionNft.js";
    import { getData, getIdofFileQuery } from "./queries.js";
    import { selectedFiles } from "./stores.js";

    export let disabled;


    let dialog, confirmShare;


    // TODO: verify that the recipient doesn't already have received the file

    function showModal() {
        dialog.addEventListener('close', async () => {
            console.log('share', dialog.returnValue);

            if (dialog.returnValue === 'cancel') return

            // TODO: get actual cid from selected file(s) from fleek ()
            // 6: bafybeifofeckwzgkpicae5hsctxnicfpe5kc3aa2q3rmolkxuvg4wktivy
            // 7: bafybeifieskylnqvikqc47rrohtcmp4v3slondvvbrxazi36pkso5zvlzm

            const idData = await getData(getIdofFileQuery, 'bafybeifieskylnqvikqc47rrohtcmp4v3slondvvbrxazi36pkso5zvlzm');
            await sendAccessPermission(dialog.returnValue, Number.parseInt(idData.data.data.pipeleEntities[0].id));

            // TODO: send message to receiver - recipient
        }, { once: true});

        dialog.showModal()
    }

    function handleRemove(item) {

        console.log($selectedFiles)

        const filtered = $selectedFiles.filter(share => share !== item);
        $selectedFiles = filtered

        console.log(item, $selectedFiles)
    }
</script>


<style>
    #mainAction {
        width: 244px;
        height: 77px;

        color: #fff;
        background: #6C63FF;

        font-size: 36px;

        border: 0;
        border-radius: 15px;
    }

    #mainAction img {
        width: 40px;
    }

    .removeShare {
        width: 20px;
    }
</style>


<button id="mainAction" disabled="{disabled}" on:click={showModal}>
    <img src="/share-icon.svg" alt="" />
    <span>Share</span>
</button>

<dialog bind:this={dialog}>
    <p>Share file</p>
    <form method="dialog">
        <label>
            <span>Recipient</span>
            <input on:change={(event) => confirmShare.value = event.target.value} />
        </label>
        <div>
            <label for="selected">Selected Files</label>
            <ul id="selected">
                {#each $selectedFiles as item}
                    <li>
                        <span>name</span>
                        <img on:click={() => handleRemove(item)}
                             class="removeShare"
                             src="/delete-stop-svgrepo-com.svg"
                             alt="remove file from list"/>
                    </li>
                {/each}
            </ul>
        </div>

        <div>
            <button value="cancel">cancel</button>
            <button bind:this={confirmShare} value="default" disabled="{$selectedFiles.length === 0}">Send</button>
        </div>
    </form>
</dialog>
