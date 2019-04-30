let browser;
if (navigator.userAgent.indexOf("Chrome") !== -1){
    browser = chrome;   
}

$(function(){
    // Get Currencies List
    getCurrencies(function(response){
        let listOptions = [];
        if(response.results){
            $.each(response.results, function(key, item){
                let currencyItem = {
                    id: key,
                    title: item.currencyName + (item.currencySymbol ? ' (' + item.currencySymbol+')' : '')
                };
                listOptions.push(currencyItem);
            });
        }
        
        // setTimeout(() => {
            $('.currency-list').selectize({
                valueField: 'id',
                labelField: 'title',
                searchField: 'title',
                options: listOptions,
                closeAfterSelect: true
            });
        // }, 200);
    });
});

$(document).on('click', '#reset-currency', function(){
    $('.result-container').fadeOut();
})

// Convert Currency
$(document).on("submit", '#convert-currency-form', function(e){
    e.preventDefault();
    $('.result-container').fadeIn();

    var amount = $('#amount').val();
    var from = $('#fromCurrency').val();
    var to = $('#toCurrency').val();
    var q = from+'_'+to;
    
    sendAjaxToApi({URL: 'convert?q='+q}, function(response){
        if(response.results){
            var val = response.results[q].val;
            var result = ((val*amount*100)/100).toFixed(2);
            $('.result-container').html('<strong>Result: </strong>'+ result +' '+ to);
        }
    });
});

function getCurrencies(callback){
    if(localStorage.currencies){
        callback(JSON.parse(localStorage.currencies))
    } else {
        sendAjaxToApi({URL: 'currencies'}, callback)
    }
}

function sendAjaxToApi(messageData, callback){
    browser.runtime.sendMessage(messageData, function(response){
        callback && typeof callback == 'function' && callback(response)
    })
}