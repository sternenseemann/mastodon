import { stopEverything, csrfToken, csrfParam, isCrossDomain,
  delegate, preventInsignificantClick } from '@rails/ujs';

const paramsField = 'data-sync-params';

const makeInput = (name, value) => {
  return ('<input name="' + name + '" ')
    + (value !== null ? 'value="' + value + '" ' : '')
    + 'type="hidden" />';
};

const handleSyncLink = (ev) => {
  var link = ev.target;
  while(link.nodeName !== 'A') {
    link = link.parentNode;
  }

  var data = link.getAttribute(paramsField);
  if(!data) {
    return true;
  }

  var form = document.createElement('form');
  var formContent = data.split('&').map((p) => {
    var param = p.split('=');
    return makeInput(param[0], param[1]);
  }).join('');

  var method = link.getAttribute('data-sync-method');
  if(method !== undefined && method !== null) {
    formContent += makeInput('_method', method);
  }

  if(csrfParam() !== null && csrfToken() !== null && !isCrossDomain(link.href)) {
    formContent += makeInput(csrfParam(), csrfToken());
  }

  formContent += '<input type="submit" />';

  form.method = 'post';
  form.action = link.href;
  form.target = link.target;
  form.innerHTML = formContent;
  form.style.display = 'none';

  document.body.appendChild(form);
  form.querySelector('[type="submit"]').click();

  stopEverything(ev);
  return false;
};

export const startSyncUjs = () => {
  if(!window._sync_ujs_loaded) {
    const syncLinkSel = 'a[' + paramsField + ']';
    delegate(document, syncLinkSel, 'click', preventInsignificantClick);
    delegate(document, syncLinkSel, 'click', handleSyncLink);
    window._sync_ujs_loaded = true;
  }
};
