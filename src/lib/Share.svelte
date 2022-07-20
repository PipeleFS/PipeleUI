<!--
(c) 2022 Pipele
This code is licensed under MIT license (see LICENSE for details)
-->

<script>
    import { sendAccessPermission } from "./permissionNft.js";
    import { getData, getIdofFileQuery } from "./queries.js";

    export let disabled;


    let dialog, confirmShare;


    // TODO: verify that the recipient doesn't already have received the file

    function showModal() {
        dialog.addEventListener('close', async () => {
            console.log('share', dialog.returnValue);

            // send message to receiver - recipient

            const id = getData(getIdofFileQuery, 'cid');    // TODO: get actual cid from selected file(s)
            sendAccessPermission(dialog.returnValue, id)
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
