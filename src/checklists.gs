LibTrello.prototype.getChecklistsOnCard = function (cardId, getCheckItems=true) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}cards/${cardId}/checklists?key=${this.key}&token=${this.token}`;
  if (!getCheckItems) {
    fullUrl += `&checkItems=none`;
  }

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.getChecklistsByName = function (cardId, checklistName, getCheckItems=true) {
  if (!isDefined_(cardId, checklistName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let matchedChecklists = [];
  let checklists = this.getChecklistsOnCard(cardId, getCheckItems);
  if (checklists.error == null) {
    checklists.forEach(x => { if (x.name == checklistName) matchedChecklists.push(x); });
  } else {
    print_("error: " + checklists.message);
  }
  return matchedChecklists;
}

LibTrello.prototype.getCheckitemsInChecklist = function (checklistsId, fields=null) {
  if (!isDefined_(checklistsId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}checklists/${checklistsId}/checkItems?key=${this.key}&token=${this.token}`;
  if (!fields) {
    fullUrl += `&fields=${fields}`;
  }

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.createChecklist = function (cardId, checklistName, idChecklistSrc = null) {
  if (!isDefined_(cardId, checklistName)) {
    throw new Error("one or more of required argument is missing.");
  }
  if (checklistName.length < 1 || checklistName.length > 16384) {
    throw new Error("checklistName should be a string of length 1 to 16384");
  }
  var fullUrl = `${this.trelloUrl}checklists?idCard=${cardId}&name=${encodeURIComponent(checklistName)}&key=${this.key}&token=${this.token}`;
  if (idChecklistSrc) {
    fullUrl += `&idChecklistSource=${idChecklistSrc}`;
  }
  var options = {
    method : "POST",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.createUniqueChecklist = function (cardId, checklistName, idChecklistSrc = null) {
  if (!isDefined_(cardId, checklistName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let checklists = this.getChecklistsByName(cardId, checklistName, false);
  if (checklists.length == 0) {
    let checklist = this.createChecklist(cardId, checklistName, idChecklistSrc);
    checklists.push(checklist);
  }
  return checklists;
}

LibTrello.prototype.addCheckitems = function (checklistId, checklistItemName) {
  if (!isDefined_(checklistId, checklistItemName)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}checklists/${checklistId}/checkItems?name=${encodeURIComponent(checklistItemName)}&key=${this.key}&token=${this.token}`;

  var options = {
    method : "POST",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

