LibTrello.prototype.getBoard = function (boardId) {
  if (!isDefined_(boardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}boards/${boardId}?key=${this.key}&token=${this.token}`;
  // print_(fullUrl);

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };

  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}