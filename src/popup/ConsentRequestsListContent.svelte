<script lang="ts">
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import type { Writable } from "svelte/store";
  import type { StorageData } from "../common/consent-request-management";
  import type { ConsentRequest } from '../types';

  export let storageData: Writable<StorageData>;
  export let onSubmit: (e: any, storageData: any) => {}

  function isUnanswered(consentRequest: ConsentRequest) {
    return $storageData.consentResponses[consentRequest.id] === undefined;
  }
</script>

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
