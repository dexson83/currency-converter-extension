let browser;
if (navigator.userAgent.indexOf('Chrome') !== -1) {
  browser = chrome;
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.URL) {
    sendAjax(request.URL, sendResponse);
    return true;
  }
});

function sendAjax(url, callback) {
  let apiKey = 'apiKey=c56e5d3aa3616d1d1348';
  let API_URL = 'https://free.currencyconverterapi.com/api/v6/' + url + (url == 'currencies' ? '?' : '&') + apiKey;
  let xhr = new XMLHttpRequest();
  xhr.open('GET', API_URL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback && typeof callback == 'function' && callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

const getCurrencies = () => sendAjax('currencies', response => (localStorage.currencies = JSON.stringify(response)));

// Get Currencies
chrome.runtime.onStartup.addListener(getCurrencies);
chrome.runtime.onInstalled.addListener(getCurrencies);
