function LibTrello (key, token) {
  this.trelloUrl = "https://api.trello.com/1/";
  this.key = key;
  this.token = token;
  this.fetchCount = 0;
}

function libTrello(key, token) {
  return new LibTrello(key, token)
}

LibTrello.prototype.getFetchCount = function () {
  return this.fetchCount;
}

LibTrello.prototype.newError = function (error) {
  if (error.error) {
    return error;

  } else if (Array.isArray(error)) {
    return error;

  } else if (error === null) {
    return `{"error":"ERROR", "message": "null"}`;

  } else if (typeof error === 'object') {
    error.error = "ERROR";
    return error;

  } else {
    return `{"error":"ERROR", "message": "${error}""}`;
  }
}

/**
 * private
 */

function print_(text) {
  Logger.log(text);
}

function isDefined_() {
  for(var i = arguments.length; i--;) {
        if(arguments[i] === undefined || arguments[i] === null) 
            return false;
    }
    return arguments.length > 0 ? true : false;
}

LibTrello.prototype.urlFetch_ = function (url, options) {
  this.fetchCount += 1;
  return UrlFetchApp.fetch(url, options);
}

LibTrello.prototype.urlFetchEncoded_ = function (url, options) {
  this.fetchCount += 1;
  return UrlFetchApp.fetch(encodeURI(url), options);
}

