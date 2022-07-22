<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()
</script>


<style>
    button {
        width: 402px;
        height: 73px;

        color: #fff;
        background: #6C63FF;

        font-size: 36px;

        border: 0;
        border-radius: 15px;
    }

    #wrapper {
        height: 100vh;
        width: 100vw;

        background:
                url("/teaser.svg") no-repeat 790px 360px,
                url("/connectbg-top.png") no-repeat left top,
                url("/connectbg-bottom.png") no-repeat left bottom;
    }

    #content {
        padding-block-start: 220px;
        padding-inline-start: 125px;
    }

    #content #logo {
        margin-block-end: 30px;
    }

    #content h1 {
        margin-block-end: 0;

        font-size: 70px;
        font-weight: 100;
    }

    #subtitle {
        margin-block-end: 92px;

        font-size: 24px;
    }

    .highlight {
        font-weight: 800;
    }
</style>


<section id="wrapper">
    <div id="content">
        <img id="logo" src="/pipele.png" alt="pipele logo"/>

        <h1>Welcome to <span class="highlight">Pipele</span></h1>
        <p id="subtitle">Pipele allows you to create your private online space and share files securely</p>

        <button on:click={() => dispatch('connect')}>Connect Wallet</button>
    </div>
</section>
