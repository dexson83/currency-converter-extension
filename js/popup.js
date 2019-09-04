let browser, selectize;
if (navigator.userAgent.indexOf('Chrome') !== -1) {
  browser = chrome;
}

$(() => {
  // Get Currencies List
  getCurrencies(response => {
    let listOptions = [];
    if (response.results) {
      $.each(response.results, function(key, item) {
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

  $('#currentYear').text(new Date().getFullYear());
  $('#settings').on('click', () => $('#settings_modal').show());
  $('#cancelbtn').on('click', () => $('#settings_modal').hide());
});

function setDefaultCurrencies() {
  if (localStorage.defaultCurrencies) {
    let dc = JSON.parse(localStorage.defaultCurrencies);
    $.each(selectize, function(i, item) {
      let defaultValue = item.id == 'fromCurrency' || item.id == 'fromCurrency1' ? dc.fromCurrency : dc.toCurrency;
      item.selectize.setValue(defaultValue);
    });
  }
}

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
