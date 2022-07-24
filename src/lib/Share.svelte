<!--
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { getTokenId, sendAccessPermission } from "./permissionNft.js";
    import { selectedFiles } from "./stores.js";


    let dialog, confirmShare;


    function showModal() {
        dialog.addEventListener('close', async () => {
            console.log('share', dialog.returnValue);

            if (dialog.returnValue === 'cancel') return

            console.log($selectedFiles[0].key)

            const tokenId = await getTokenId($selectedFiles[0].key);
            await sendAccessPermission(dialog.returnValue, tokenId.toNumber());

            // TODO: find usable messaging service and send message to receiver - recipient
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
    dialog {
        width: 80vw;
        height: 580px;

        padding: 0;
    }

    dialog header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        height: 63px;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

        padding-inline: 25px;
    }

    form {
        padding-inline: 25px;
    }

    #title {
        font-size: 36px;
    }

    #dialogAction {
        text-align: end;
    }

    #mainAction, #shareAction {
        width: 244px;
        height: 77px;

        color: #fff;
        background: #6C63FF;

        font-size: 36px;

        border: 0;
        border-radius: 15px;
    }

    #mainAction:disabled {
        background: #b4afff;
    }

    #mainAction img {
        width: 40px;
    }

    #shareAction {
        height: 59px;
        font-size: 24px;
    }

    #recipientAddress {
        display: flex;
        align-items: center;

        height: 60px;

        margin-block: 40px;

        background: #E8E8E8;
        border-radius: 10px;
    }

    #recipientAddress img {
        position: relative;
        width: 40px;
    }

    #recipientAddress input {
        flex-grow: 1;

        height: 40px;

        margin-inline-end: 10px;

        background: #E8E8E8;
        border: 0;
    }

    .removeShare {
        width: 20px;
    }
</style>


<button id="mainAction" disabled="{$selectedFiles.length !== 1}" on:click={showModal}>
    <img src="/share-icon.svg" alt="" />
    <span>Share</span>
</button>

<dialog bind:this={dialog}>
    <header>
        <p id="title">Share file</p>
        <img class="icon" on:click={() => dialog.close()} src="/close.svg" alt="close dialog" />
    </header>
    <form method="dialog">
        <div id="recipientAddress">
            <img src="/search.svg" alt="" />
            <input on:change={(event) => confirmShare.value = event.target.value}
                placeholder="Enter wallet address" />
        </div>
<!--        <div>-->
<!--            <label for="selected">Selected Files</label>-->
<!--            <ul id="selected">-->
<!--                {#each $selectedFiles as item}-->
<!--                    <li>-->
<!--                        <span>{item.key}</span>-->
<!--                        <img on:click={() => handleRemove(item)}-->
<!--                             class="removeShare"-->
<!--                             src="/delete-stop-svgrepo-com.svg"-->
<!--                             alt="remove file from list"/>-->
<!--                    </li>-->
<!--                {/each}-->
<!--            </ul>-->
<!--        </div>-->

        <div id="dialogAction">
            <button id="shareAction" bind:this={confirmShare}
                    value="default" disabled="{$selectedFiles.length === 0}">Share</button>
        </div>
    </form>
</dialog>
