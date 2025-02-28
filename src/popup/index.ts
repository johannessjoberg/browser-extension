import Popup from "./Popup.svelte";
import 'bootstrap/dist/css/bootstrap.min.css';
// @ts-ignore
import { remoteFunction } from 'webextension-rpc';
import { markConsentRequestsAsAnswered } from "../common/consent-request-management";

async function main() {
  const searchParams = new URL(document.URL).searchParams;
  const tabIdParam = searchParams.get('tabId');
  const originParam = searchParams.get('origin');

  const tabId = tabIdParam ? Number.parseInt(tabIdParam) : undefined;

  const isPopup = !!tabIdParam;
  if (isPopup) {
    // Hide the pop-in (if any) when opening the pop-up, to avoid showing both.
    remoteFunction('hidePopin')(tabId);
  }

  let webPageOrigin: string | undefined;
  if (originParam) { // if popin
    webPageOrigin = originParam;
  } else if (tabId !== undefined) { // if popup
    const tab = await browser.tabs.get(tabId);
    if (tab.url)
      webPageOrigin = new URL(tab.url).origin;
  }

  async function close() {
    console.log('close')
    // When explicitly closed, consider unchecked boxes as rejected.
    if (webPageOrigin)
      await markConsentRequestsAsAnswered(webPageOrigin);

    window.close(); // For pop-up
    remoteFunction('hidePopin')(); // For pop-in
  }

  // Close the popup/popin if the user presses escape.
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  });

  const app = new Popup({
    target: document.body,
    props: {
      close,
      webPageOrigin,
    },
  });
}

main();

export {}
