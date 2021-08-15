LibTrello.prototype.getLabel = function (labelId) {
  if (!isDefined_(labelId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}labels/${labelId}?key=${this.key}&token=${this.token}`;

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.getLabelsOnBoard = function (boardId) {
  if (!isDefined_(boardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}boards/${boardId}/labels?key=${this.key}&token=${this.token}`;

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.getLabelsByName = function (boardId, labelName) {
  if (!isDefined_(boardId, labelName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let mlabels = [];
  let labels = this.getLabelsOnBoard(boardId);
  if (labels.error == null) {
    labels.forEach(x => {if (x.name == labelName) mlabels.push(x)});
  } else {
    print_("error: " + labels.message);
  }
  return mlabels;
}

LibTrello.prototype.getLabelIdsByName = function (boardId, labelName) {
  if (!isDefined_(boardId, labelName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let labelIds = [];
  let labels = this.getLabelsByName(boardId, labelName);  
  labels.forEach(x => { labelIds.push(x.id) });
  return labelIds;
}
