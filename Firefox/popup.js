var result_box = document.getElementById('conversion-result');
var loader = document.getElementById('currency-loader');

// convert-currency
document.getElementById('convert-currency-form').addEventListener("submit", function(e){
    e.preventDefault();

    var amount = document.getElementById('currency-amount').value;
    var from = document.getElementById('from-currency').value;
    var to = document.getElementById('to-currency').value;

    var currency_data = {
        amount: amount,
        from: from,
        to: to
    };
    chrome.runtime.sendMessage({convert: true, data: currency_data});
});

document.getElementById('reset-currency').addEventListener("click", function(e){
    result_box.innerHTML = '';
    loader.style.display = 'inline-block';
})

document.addEventListener("DOMContentLoaded", function(event) {
    var currenciesUrl = chrome.runtime.getURL('currencies.json');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", currenciesUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var currencies = JSON.parse(xhr.responseText);
            // from currency options
            var fromCurrencyOptions = '<option value="" selected="true">From Currency</option>';
            currencies.forEach(function(item, value){
                fromCurrencyOptions += '<option value="' + item.value + '">' + item.name + '</option>';
            });
            // append to fromcurrecny selectbox
            document.getElementById('from-currency').innerHTML = fromCurrencyOptions;

            // to currency options
            var toCurrencyOptions = '<option value="" selected="true">To Currency</option>';
            currencies.forEach(function(item, value){
                toCurrencyOptions += '<option value="' + item.value + '">' + item.name + '</option>';
            });
            // append to tocurrecny selectbox
            document.getElementById('to-currency').innerHTML = toCurrencyOptions;
        }
    }
    xhr.send( null );
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);

    // same format
    if(request.SAME_CONVERSION_FORMAT){
        result_box.innerHTML = "Both format can't be same.";
        loader.style.display = 'none';
    }

    // currency converted
    if(request.CURRENCY_CONVERTED){
        result_box.innerHTML = request.CONVERTED_VALUE;
        loader.style.display = 'none';
    }
});