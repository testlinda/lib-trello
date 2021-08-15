LibTrello.prototype.getList = function (listId) {
  if (!isDefined_(listId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}lists/${listId}?key=${this.key}&token=${this.token}`;

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.getListsOnBoard = function (boardId, filter = null) {
  if (!isDefined_(boardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}boards/${boardId}/lists?key=${this.key}&token=${this.token}`;
  if (filter) {
    fullUrl += `&filter=${filter}`;
  }

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.getListsByName = function (boardId, listName, opened=true) {
  if (!isDefined_(boardId, listName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let mlists = [];
  let filter = (opened)? null : "closed" ;
  let lists = this.getListsOnBoard(boardId, filter);
  if (lists.error == null) {
    lists.forEach(x => {if (x.name == listName) mlists.push(x)});
  } else {
    print_("error: " + lists.message);
  }
  return mlists;
}

LibTrello.prototype.getListIdsByName = function (boardId, listName, opened=true) {
  if (!isDefined_(boardId, listName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let listIds = [];
  let lists = this.getListsByName(boardId, listName, opened);
  lists.forEach(x => { listIds.push(x.id) });
  
  return listIds;
}

LibTrello.prototype.sortList = function (boardId, listName, method) {

}

LibTrello.prototype.sortListByDueDate = function (boardId, listName, method) {

}