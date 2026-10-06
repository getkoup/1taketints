// Loaded before the forms so no submission is missed. GHL posts this only after a successful submit;
// the iframe sandbox blocks its own top-level redirect, so the page does the redirect itself.
window.addEventListener('message', event => {
  if (event.origin !== 'https://api.leadconnectorhq.com' || !Array.isArray(event.data)) return;
  const frame = [...document.querySelectorAll('iframe.ghl-form-frame')].find(frame => event.source === frame.contentWindow);
  if (!frame) return;
  const [action, storageKey, frameId, locationId, fingerprint] = event.data;
  if (action !== 'set-sticky-contacts' || locationId !== 'fN2r559vBsi49zNFKJMB' ||
      frameId !== frame.id || storageKey !== `embedded_iframe_${frameId}` ||
      typeof fingerprint !== 'string' || !fingerprint) return;
  window.location.assign(new URL('thank-you.html', window.location.href).href);
});
