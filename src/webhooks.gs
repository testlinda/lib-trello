LibTrello.prototype.createWebhook = function (idModel, callbackURL, description = null) {
  if (!isDefined_(idModel, callbackURL)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}webhooks?key=${this.key}&token=${this.token}&idModel=${idModel}&callbackURL=${encodeURIComponent(callbackURL)}`;
  if (description) {
    fullUrl += `&description=${description}`;
  }
  // print_(fullUrl);

  let options = {
    method : "POST",
    contentType : "application/json",
    muteHttpExceptions: true
  };

  let response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.deleteWebhook = function (webhookId) {
  if (!isDefined_(webhookId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}webhooks/${webhookId}?key=${this.key}&token=${this.token}`;
  //print_(fullUrl);

  var options = {
    method : "DELETE",
    contentType : "application/json",
    muteHttpExceptions: true
  };

  var response = this.urlFetch_(fullUrl, options);

  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.updateWebhook = function (webhookId, idModel = null, callbackURL = null) {
  if (!isDefined_(webhookId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}webhooks/${webhookId}?key=${this.key}&token=${this.token}`;
  if (idModel) {
    fullUrl += `&idModel=${idModel}`;
  }
  if (callbackURL) {
    fullUrl += `&callbackURL=${callbackURL}`;
  }
  //print_(fullUrl);

  var options = {
    method : "PUT",
    contentType : "application/json",
    muteHttpExceptions: true
  };

  var response = this.urlFetch_(fullUrl, options);

  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

