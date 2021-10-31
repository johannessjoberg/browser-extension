<script lang="ts">
  import { Button } from 'sveltestrap';
  import ConsentRequestsLoader from "./ConsentRequestsLoader.svelte";
  import SvelteIsWeird from "./SvelteIsWeird.svelte";

  export let close: () => void;
  export let webPageOrigin: string | undefined;


  function openOptionsPage() {
    // browser.runtime.openOptionsPage();
    const optionsPageUrl = browser.runtime.getURL('/options/index.html');
    window.open(optionsPageUrl);
  }
</script>

<style>
  @font-face {
    font-family: 'GT-Eesti-Pro-Display';
    font-style: normal;
    font-weight: 400;
    src: local('GT-Eesti-Pro-Display'), local('Gelasio-Regular'), url(https://www.proxy.com/static/gt-eesti-pro-display-regular-e9820bc13314a888d0d6a08716aafc80.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  .main {
    font-family: 'GT-Eesti-Pro-Display';
    font-style: normal;
    font-weight: 200;
  }

  .avatar-img {
    border-radius: 50%;
    height: 42px;
    width: 42px;
    -o-object-fit: cover;
    object-fit: cover;
  }

  .avatar-figure {
    margin: 6px 0px 12px 12px;
    padding: 0 0 12px 0;
    color: #5c5856;
    display: flex;
  }

  .avatar-figcaption {
    margin: 0 0 0 12px;
    text-align: left;
  }

  .avatar-span {
    display: block;
    font-size: 14px;
  }

  .settings {
    margin-right: 12px;
    /*padding: 6px;*/
    margin-left: auto !important;
    font-size: 20px;
    background: #fa3350;
    color: white;
  }
</style>

<main class="main py-2 flex-grow-1 d-flex flex-column">
  <!-- <button on:click={close} class="btn-close small mx-2 mb-2 float-end" aria-label="Close"></button> -->
  {#if webPageOrigin}
    <ConsentRequestsLoader webPageOrigin={webPageOrigin} let:storageData>
        <figure class="avatar-figure border-bottom">
          <img class="avatar-img" src="https://static.wikia.nocookie.net/doom/images/4/4e/Doomguy_godface.png/revision/latest/scale-to-width-down/72?cb=20190116151541" alt="Henrik">
          <figcaption class="avatar-figcaption">
          <span class="avatar-span">John Doe</span>
          <span class="avatar-span">john.doe@proxy.com</span>
          </figcaption>
            <button on:click={openOptionsPage} class="btn settings">
                ⚙
            </button>
        </figure>
        <section class="container clearfix">
          <p>LinkedInterest asks your consent for the following:</p>
        </section>
        <SvelteIsWeird {storageData} {openOptionsPage} {close}/>
    </ConsentRequestsLoader>
  {:else}
    <i>Unable to read this webpage’s address.</i>
  {/if}
</main>
