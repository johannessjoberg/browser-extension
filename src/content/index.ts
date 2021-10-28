// @ts-ignore
import { remoteFunction } from 'webextension-rpc';
import { exposeToPage } from './page-script-rpc';
import type { ConsentRequestsList, UserDecisionsObject } from '../types';
import { setConsentRequestsList, getUserDecisions, listenToStorageChanges } from '../common/consent-request-management';
import { validateConsentRequestsList } from '../common/type-validation';
import type { RequestConsentParams } from '../background';
import { request } from './events';
import './popin';
// import { request } from "./request"

// const requestConsent = remoteFunction('requestConsent') as (args: RequestConsentParams) => Promise<void>;

exposeToPage({
  'navigator.dataProtectionControl.request': request,
  // 'navigator.dataProtectionControl.getProxyData': getProxyData,
});

// async function getProxyData(): Promise<Record<string,any>> {
//   const response = await fetch('http://localhost:8080/v2/twins/anton/age');
//   const json = await response.json();
//   await browser.storage.sync.set({
//     'data:proxy': { proxy: json },
//   });
//
//   return json
// }
//
// interface Wtf extends UserDecisionsObject {
//   data?: Record<string, any>
// }
//
// export async function request(consentRequestsList: ConsentRequestsList): Promise<Wtf> {
//   validateConsentRequestsList(consentRequestsList);
//
//   const webPageOrigin = new URL(document.URL).origin;
//   await setConsentRequestsList(webPageOrigin, consentRequestsList);
//
//   await requestConsent({ consentRequestsList, pageUrl: document.URL });
//
//   const userDecisions: Wtf = await getUserDecisions(webPageOrigin);
//
//   const json = await getProxyData()
//
//   if (userDecisions?.consent?.includes('proxy:age')) {
//     userDecisions.data = {
//       'proxy:age': json,
//     }
//   }
//
//   return userDecisions;
// }
