import { makeRemotelyCallable } from 'webextension-rpc';

const fadeOutDuration = 300; // ms
const popupUrl = browser.runtime.getURL('/popup/index.html');

export async function showPopin() {
  if (getPopinElement() !== null) return;
  const container = document.createElement('iframe');
  container.style.all = 'unset';
  container.style.boxSizing = 'content-box';
  container.style.height = '400px';
  container.style.width = '400px';
  container.style.maxHeight = '80vh';
  container.style.maxWidth = 'calc(100vw - 2 * 20px)';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.right = '0';
  container.style.margin = '2px 20px';
  container.style.border = '1px solid lightgrey';
  container.style.borderRadius = '5px';
  container.style.boxShadow = '0px 4px 6px #00000066';
  container.style.background = 'white';
  container.style.zIndex = '999999999';
  container.style.transition = `opacity ${fadeOutDuration}ms`;

  const websiteOrigin = new URL(document.URL).origin;
  container.src = `${popupUrl}?origin=${websiteOrigin}`;

  document.body.appendChild(container);
  container.focus();

  document.documentElement.addEventListener('click', () => {
    hidePopin();
  });
}

export async function hidePopin() {
  const container = getPopinElement();
  if (container && container.style.opacity !== '0') {
    container.style.opacity = '0';
    setTimeout(() => container.remove(), fadeOutDuration);
  }
}

function getPopinElement() {
  const container = document.querySelector(`iframe[src^="${popupUrl}"]`);
  return container as HTMLIFrameElement | null;
}

makeRemotelyCallable({
  showPopin,
  hidePopin,
});
