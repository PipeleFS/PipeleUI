<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { sendAccessPermission } from "./permissionNft.js";

    export let disabled;


    let dialog, confirmShare;


    // verify that the recipient doesn't already have received the file
    // open dialog for sharing parameters

    function showModal() {
        dialog.addEventListener('close', async () => {
            console.log('share', dialog.returnValue);

            // mint access token for the file - files, recipient
            // send message to receiver - recipient

            sendAccessPermission(dialog.returnValue)
        }, { once: true});

        dialog.showModal()
    }
</script>


<button disabled="{disabled}" on:click={showModal}>Share</button>

<dialog bind:this={dialog}>
    <p>Share file</p>
    <form method="dialog">
        <label>
            <span>Recipient</span>
            <input on:change={(event) => confirmShare.value = event.target.value} />
        </label>
        <div>
            <button bind:this={confirmShare}>Send</button>
        </div>
    </form>
</dialog>
