LibTrello.prototype.listEmojis = function() {
  var fullUrl = `${this.trelloUrl}emoji?key=${this.key}&token=${this.token}`;

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}
