chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
	console.log('Got Message:', request);

	if(request.convert){
		var data = request.data;
		var amount = data.amount;
		var fromCurrency = data.from;
		var toCurrency = data.to;
		var result = '';
		var currency_conversion_api_url = 'http://api.fixer.io/latest?base='+ fromCurrency;

		if(fromCurrency == toCurrency){
			console.log('SAME_CONVERSION_FORMAT');
			chrome.runtime.sendMessage({SAME_CONVERSION_FORMAT: true});
		} else {

			var xhr = new XMLHttpRequest();
		    xhr.open("GET", currency_conversion_api_url, true);
		    xhr.onreadystatechange = function() {
		        if (xhr.readyState == 4 && xhr.status == 200) {
		            var res = JSON.parse(xhr.responseText);
		            var totalMoney = res.rates[toCurrency] * amount;
		            if(!isNaN(totalMoney)){
						result = amount +" "+ fromCurrency +" = "+ toCurrency +" "+ totalMoney.toFixed(2);
					} else {
						result = 'Sorry, Unable to convert!';
					}

					console.log('Result:', result);

					chrome.runtime.sendMessage({CURRENCY_CONVERTED: true, CONVERTED_VALUE: result});
		        }
		    }
		    xhr.send( null );
		}
	}
});