<script lang="ts">
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import type { Writable } from "svelte/store";
  import type { StorageData } from "../common/consent-request-management";
  import type { ConsentRequest } from '../types';

  export let storageData: Writable<StorageData>;

    function onSubmit(e:any) {
    console.log('storageData',$storageData)

    const formData = new FormData(e.target);
    console.log('formdata', formData)
    const data = {};
    for (let a of formData) {
      console.log('a',a)
    }
    // console.log($storageData.consentResponses)
    Object.keys($storageData.consentResponses).forEach((key) => {
      $storageData.consentResponses[key] = undefined
    })
    for (let field of formData) {
      console.log(field)
      let key: string
      let value: any
      [key, value] = field;
      //@ts-ignore
      data[key] = value;
      $storageData.consentResponses[key] = value == "on"
    }

    //   console.log('data', data)
    }
    // bind:checked={}

  function isUnanswered(consentRequest: ConsentRequest) {
    return $storageData.consentResponses[consentRequest.id] === undefined;
  }
</script>

<form on:submit|preventDefault={(e) => onSubmit(e)}>
<ListGroup>
  {#each $storageData.consentRequestsList as consentRequest (consentRequest.id)}
    <ListGroupItem
      id={consentRequest.id}
      class="consent-request-item {isUnanswered(consentRequest) ? 'bg-white' : 'bg-transparent'}"
    >
      <div class="form-check form-switch mt-1 me-0 mb-3 ms-3 float-end" style="transform: scale(1.2);">
        <label for="name">
        <input
          class="form-check-input"
          type="checkbox"
          name="{consentRequest.id}"
          title={$storageData.consentResponses[consentRequest.id]
            ? 'Click to withdraw your consent'
            : 'Click to give your consent'
          }
          checked={$storageData.consentResponses[consentRequest.id]}
        />
      </label>
      </div>
      <q>{consentRequest.text}</q>
    </ListGroupItem>
  {:else}
    <p class="m-4">
      <em>
        This website does not request consent, or does not support Advanced Data Protection Control.
      </em>
    </p>
  {/each}
</ListGroup>
<button type="submit">Save settings</button>
</form>
