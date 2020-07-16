let selectize;
let browser = window.browser || window.chrome;

$(() => {
  // Get Currencies List
  initialiseCurrencyList(true)

  $('#currentYear').text(new Date().getFullYear());
  $('#settings').on('click', () => $('#settings_modal').show());
  $('#cancelbtn').on('click', () => $('#settings_modal').hide());
});

function initialiseCurrencyList(init){
  if(init == true) {
    getCurrencies(response => {
      let listOptions = [];
      if (response.results) {
        $.each(response.results, function (key, item) {
          let currencyItem = {
            id: key,
            title: item.currencyName + (item.currencySymbol ? ' (' + item.currencySymbol + ')' : '')
          };
          listOptions.push(currencyItem);
        });
      }

      selectize = $('.currency-list').selectize({
        valueField: 'id',
        labelField: 'title',
        searchField: 'title',
        options: listOptions,
        closeAfterSelect: true
      });

      // Set Default Currencies
      setDefaultCurrencies();
    });
  }else{
    getCurrencies(response => {
      let listOptions = [];
      if (response.results) {
        $.each(response.results, function (key, item) {
          let currencyItem = {
            id: key,
            title: item.currencyName + (item.currencySymbol ? ' (' + item.currencySymbol + ')' : '')
          };
          listOptions.push(currencyItem);
        });
      }

      selectize = $('.toCurrency').selectize({
        valueField: 'id',
        labelField: 'title',
        searchField: 'title',
        options: listOptions,
        closeAfterSelect: true
      });

      // Set Default Currencies
      setDefaultCurrencies();
    });
  }
}

function setDefaultCurrencies() {
  if (localStorage.defaultCurrencies) {
    let dc = JSON.parse(localStorage.defaultCurrencies);
    $.each(selectize, function(i, item) {
      let defaultValue = item.id == 'fromCurrency' || item.id == 'fromCurrency1' ? dc.fromCurrency : dc.toCurrency;
      item.selectize.setValue(defaultValue);
    });
  }
}

var totalNewConversionHTMLArray = [];
var baseConversionHTML = $('#toCurrencyDiv').html();
$('#add-conversion').click(function (e) {
  e.preventDefault();
  let newCurrencyConversionHTML = "<div id=\"toCurrencyDiv\">\n" +
      "            <div class=\"p-container\">\n" +
      "                <label class=\"p-label\" for=\"toCurrency\">To</label>\n" +
      "                <select class=\"currency-list toCurrency\" required>\n" +
      "                    <option value=\"\">Please Select</option>\n" +
      "                </select>\n" +
      "            </div>\n" +
      "        </div>";
  totalNewConversionHTMLArray.push(newCurrencyConversionHTML)
  var totalNewConversionHTMLString = "";
  for(var i = 0; i < totalNewConversionHTMLArray.length; i++){
    totalNewConversionHTMLString = totalNewConversionHTMLString + totalNewConversionHTMLArray[i];
  }
  console.log($('#toCurrencyDiv').html(baseConversionHTML + totalNewConversionHTMLString));
  initialiseCurrencyList(false);
});

$('#delete-conversion').click(function (e) {
  e.preventDefault();
  let newCurrencyConversionHTML = "<div id=\"toCurrencyDiv\">\n" +
      "            <div class=\"p-container\">\n" +
      "                <label class=\"p-label\" for=\"toCurrency\">To</label>\n" +
      "                <select class=\"currency-list toCurrency\" required>\n" +
      "                    <option value=\"\">Please Select</option>\n" +
      "                </select>\n" +
      "            </div>\n" +
      "        </div>";
  totalNewConversionHTMLArray.pop()
  var totalNewConversionHTMLString = "";
  for(var i = 0; i < totalNewConversionHTMLArray.length; i++){
    totalNewConversionHTMLString = totalNewConversionHTMLString + totalNewConversionHTMLArray[i];
  }
  console.log($('#toCurrencyDiv').html(baseConversionHTML + totalNewConversionHTMLString));
  initialiseCurrencyList(false);
});


$('#settings_form').on('submit', e => {
  e.preventDefault();

  let defaultCurrencies = {
    fromCurrency: $('#fromCurrency1').val(),
    toCurrency: $('#toCurrency1').val()
  };

  localStorage.defaultCurrencies = JSON.stringify(defaultCurrencies);

  // Set Default Currencies
  if ($('#apply_changes').is(':checked')) setDefaultCurrencies();

  $('#settings_modal').hide();
});

$(document).on('click', '#reset-currency', () => $('.result-container').fadeOut());

// Convert Currency
$(document).on('submit', '#convert-currency-form', e => {
  e.preventDefault();
  $('.result-container').fadeIn();

  var amount = $('#amount').val();
  var from = $('#fromCurrency').val();
  var to = $('#toCurrency').val();
  var q = from + '_' + to;

  sendAjaxToApi({ URL: 'convert?q=' + q }, response => {
    if (response.results) {
      var val = response.results[q].val;
      var result = ((val * amount * 100) / 100).toFixed(2);
      $('.result-container').html('<strong>Result: </strong>' + result + ' ' + to);
    }
  });
});

function getCurrencies(callback) {
  if (localStorage.currencies) {
    callback(JSON.parse(localStorage.currencies));
  } else {
    sendAjaxToApi({ URL: 'currencies' }, callback);
  }
}

function sendAjaxToApi(messageData, callback) {
  browser.runtime.sendMessage(messageData, function(response) {
    callback && typeof callback == 'function' && callback(response);
  });
}
