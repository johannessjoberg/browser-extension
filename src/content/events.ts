import deepEqual from 'fast-deep-equal';
import { listenToStorageChanges, storageDataToUserDecisions } from "../common/consent-request-management";
import { executePageScript, maybeClone } from "./execute-page-script";
// @ts-ignore
import { remoteFunction } from 'webextension-rpc';
import type { ConsentRequestsList, UserDecisionsObject } from '../types';
import {validateConsentRequestsList} from "../common/type-validation"
import {getUserDecisions, setConsentRequestsList} from "../common/consent-request-management"
import type {RequestConsentParams} from "../background"

// Dispatch ADPC events in the page script’s context.

// We make the page listen to a ‘proxy’ event on document, to then dispatch that
// at navigator.dataProtectionControl.
// TODO Make page-script-rpc work in the opposite direction too, and use that?
const randomString = Math.random().toString(36).slice(2);
const proxyEventName = `__ADPC_PROXY_EVENT__${randomString}`;

const pageScriptContent = `
  if (globalThis.window.navigator.dataProtectionControl === undefined) {
    globalThis.window.navigator.dataProtectionControl = new EventTarget();

    class AdpcEvent extends Event {
      constructor(typeArg, attributes) {
        super(typeArg);
        Object.assign(this, attributes);
      }
    }
    globalThis.AdpcEvent = AdpcEvent;

    document.addEventListener('${proxyEventName}', (proxyEvent) => {
      console.log('proxyEventName', proxyEvent)
      const adpcEvent = new AdpcEvent(
        'decisionchange',
        proxyEvent.detail,
      );
      globalThis.window.navigator.dataProtectionControl.dispatchEvent(adpcEvent);
    })
  }
`;
executePageScript(pageScriptContent);

const requestConsent = remoteFunction('requestConsent') as (args: RequestConsentParams) => Promise<void>;

interface Wtf extends UserDecisionsObject {
  data: Record<string, any>
}

async function getData(path: string): Promise<Record<string,any>> {
  const response = await fetch(`http://localhost:8080/v2/twins${path}`);
  const json = await response.json();

  const currentData = (await browser.storage.sync.get('data:proxy'))['data:proxy']

  await browser.storage.sync.set({
    'data:proxy': { ...currentData, [json.attributeType]: json },
  });

  return json
}

export async function request(consentRequestsList: ConsentRequestsList, origin?: string): Promise<Wtf> {
  validateConsentRequestsList(consentRequestsList);

  const webPageOrigin = origin || new URL(document.URL).origin;
  await setConsentRequestsList(webPageOrigin, consentRequestsList);

  await requestConsent({ consentRequestsList, pageUrl: document.URL });

  const userDecisions: Wtf = {
    ...await getUserDecisions(webPageOrigin),
    data: {}
  };

  await getData('/henrik/age')
  await getData('/henrik/clown/certification')

  return userDecisions;
}

listenToStorageChanges((webPageOrigin, newStorageData) => {
  console.log('listenToStorageChanges webPageOrigin', webPageOrigin)
  // console.log('webPageOrigin', webPageOrigin)
  // if (webPageOrigin !== new URL(document.URL).origin) return;
  // @ts-ignore
  const newUserDecisions = storageDataToUserDecisions(newStorageData);
  // const oldUserDecisions = storageDataToUserDecisions(oldStorageData);
  // if (deepEqual(newUserDecisions, oldUserDecisions)) return;

  console.log('newStorageData', newStorageData)
  // console.log('oldStorageData', oldStorageData)
  const eventAttributes = {
    userDecisions: newUserDecisions,
  };

  const proxy = eventAttributes?.userDecisions?.consent?.reduce((acc: Record<string,any>, val: string) => {
    return {
      ...acc,
      [val]: newStorageData[val]
    }
  }, {})

  let proxyEvent = new CustomEvent(
    proxyEventName,
    maybeClone({ detail: { ...eventAttributes, proxy }}),
  );
  // if (webPageOrigin === 'proxy') {
  //   proxyEvent = new CustomEvent(
  //     proxyEventName,
  //     maybeClone({ detail: newStorageData }),
  //   );
  // }
  document.dispatchEvent(proxyEvent);
});
