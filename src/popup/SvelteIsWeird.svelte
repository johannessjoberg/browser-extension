<script lang="ts">
  import { Button } from 'sveltestrap';
  import type { Writable } from "svelte/store";
  import type { StorageData } from "../common/consent-request-management";
  import ConsentRequestsListContent from "./ConsentRequestsListContent.svelte";
  import AcceptRejectAllButtons from "./AcceptRejectAllButtons.svelte";

  export let storageData: Writable<StorageData>;
  export let openOptionsPage: (e: any, storageData: any) => {}
  export let close: () => {}

  function onSubmit(e:any) {
    console.log('e', e)
    console.log('storageData', $storageData)
    const formData = new FormData(e.target);
    console.log('formData', formData)
    const data = {};

    Object.keys($storageData.consentResponses).forEach((key) => {
      $storageData.consentResponses[key] = undefined
    })
    for (let field of formData) {
      let key: string
      let value: any
      [key, value] = field;
      //@ts-ignore
      data[key] = value;
      $storageData.consentResponses[key] = value == "on"
    }

    close()
  }

</script>

<style>
    .save-button {
        width: 100%;
    }
</style>

<form on:submit|preventDefault={onSubmit}>
    <section class="container flex-grow-1 d-flex flex-column">
        <div style="height: 200px; overflow-y: auto;" class="border-bottom flex-grow-1">
            <ConsentRequestsListContent {storageData} />
            <div><AcceptRejectAllButtons {storageData} classes="d-block float-end ms-2 mt-2 mb-1" /></div>
        </div>
    </section>
    <section class="container">
        <button type="submit" class="btn btn-primary save-button">
            💾 Save settings
        </button>
    </section>
</form>
