var browser;
if (navigator.userAgent.indexOf("Chrome") !== -1){
    browser = chrome;   
}

browser.runtime.onMessage.addListener(function(request,sender,sendResponse) {
	if(request.URL){
		sendAjax(request.URL, sendResponse);
		return true;
	}
});

function sendAjax(url, callback){
    var apiKey = 'apiKey=c56e5d3aa3616d1d1348';
    var API_URL = 'https://free.currencyconverterapi.com/api/v6/'+ url + ((url == 'currencies') ? '?' : '&') + apiKey;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback && typeof callback == 'function' && callback(JSON.parse(xhr.responseText))
        }
    }
    xhr.send( null );
}