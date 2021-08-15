LibTrello.prototype.getCard = function (cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}cards/${cardId}?key=${this.key}&token=${this.token}`;
  //print(fullUrl);

  let options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };

  let response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}


LibTrello.prototype.getCardsInList = function (listId) {
  if (!isDefined_(listId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}lists/${listId}/cards?key=${this.key}&token=${this.token}`;

  let options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  let response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.getCardsInListByName = function (listId, cardName, labelId = null) {
  if (!isDefined_(listId, cardName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let matchedCards = [];
  let cards = this.getCardsInList(listId);
  if (cards.error == null) {
    cards.forEach(x => {if (x.name == cardName) matchedCards.push(x)});
    if (labelId) {
      let newMatchedCards = [];
      matchedCards.forEach(x => {if (x.idLabels.includes(labelId)) newMatchedCards.push(x)});
      matchedCards = newMatchedCards.slice(0);
    }
  } else {
    print_("error: " + cards.message);
  }
  
  return matchedCards;
}

LibTrello.prototype.getCardsInListByNameWithListName = function (boardId, listName, cardName, labelId = null) {
  if (!isDefined_(boardId, listName, cardName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let matchedCards = [];
  let listIds = this.getListIdsByName(boardId, listName);
  listIds.forEach(listId => {
    let cards = this.getCardsInListByName(listId, cardName, labelId);
    matchedCards.push(...cards);
  });
  return matchedCards;
}

LibTrello.prototype.getCardsInListByLabel = function (listId, labelId) {
  if (!isDefined_(listId, labelId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let matchedCards = [];
  let cards = this.getCardsInList(listId);
  if (cards.error == null) {
    cards.forEach(x => {if (x.idLabels.includes(labelId)) matchedCards.push(x)});
  } else {
    print_("error: " + cards.message);
  }
  return matchedCards;
}

LibTrello.prototype.getCardsInListByLabelWithListName = function (boardId, listName, labelId) {
  if (!isDefined_(boardId, listName, labelId)) {
    throw new Error("one or more of required argument is missing.");
  }

  let matchedCards = [];
  let listIds = this.getListIdsByName(boardId, listName);
  if (listIds.error == null) {
    listIds.forEach(listId => {
      let cards = this.getCardsInListByLabel(listId, labelId);
      matchedCards.push(...cards);
    });
  } else {
    print_("error: " + listIds.message);
  }
  return matchedCards;
}

LibTrello.prototype.getCardIdsInListByName = function (listId, cardName) {
  if (!isDefined_(listId, cardName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let cardIds = [];  
  let cards = this.getCardsInListByName(listId, cardName);
  cards.forEach(x => { cardIds.push(x.id) });
  
  return cardIds;
}

LibTrello.prototype.getCardIdsInListByNameWithListName = function (boardId, listName, cardName) {
  if (!isDefined_(boardId, listName, cardName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let cardIds = [];
  let listIds = this.getListIdsByName(boardId, listName);
  if (listIds.error == null) {
    listIds.forEach(listId => {
      let cards = this.getCardIdsInListByName(listId, cardName);
      cardIds.push(...cards);
    });
  } else {
    print_("error: " + lists.message);
  }
  return cardIds;
}

LibTrello.prototype.createCard = function (listId, cardName, labelId=null, dueDate=null, position=null) {
  if (!isDefined_(listId, cardName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}cards?key=${this.key}&token=${this.token}&idList=${listId}&name=${encodeURIComponent(cardName)}`;
    if (labelId != null) {
      fullUrl+=`&idLabels=${labelId}`;
    }
    if (dueDate != null) {
      fullUrl+=`&due=${dueDate}`;
    }
    if (position != null) {
      fullUrl+=`&pos=${position}`;
    }
    let options = {
      method : "POST",
      contentType : "application/json",
      muteHttpExceptions: true
    };

    let response = this.urlFetch_(fullUrl, options);
    return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.createCardInList = function (boardId, listName, cardName, labelName=null, dueDate=null, position=null) {
  if (!isDefined_(boardId, listName, cardName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let responses = [];
  let listIds = this.getListIdsByName(boardId, listName);
  let labelIds = null;
  if (labelName) {
    labelIds = this.getLabelIdsByName(boardId, labelName);
    if (labelIds.length > 0) {
      labelIds = labelIds.toString();
    } else {
      labelIds = null;
    }
  }
  listIds.forEach(listId => {
    let response = this.createCard(listId, cardName, labelIds, dueDate, position);
    responses.push(response);
  });
  return responses;
}

LibTrello.prototype.createUniqueCardInList = function (boardId, listName, cardName, labelName=null, dueDate=null, position=null) {
  if (!isDefined_(boardId, listName, cardName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let cards = this.getCardsInListByNameWithListName(boardId, listName, cardName);
  if (cards.length == 0) {
    return this.createCardInList(boardId, listName, cardName, labelName, dueDate, position);
  }
  return cards;
}

LibTrello.prototype.archiveAllCardsInList = function (listId) {
  if (!isDefined_(listId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}lists/${listId}/archiveAllCards?key=${this.key}&token=${this.token}`;
  //print_(fullUrl);

  let options = {
    method : "POST",
    contentType : "application/json",
    muteHttpExceptions: true
  };

  let response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.archiveAllCardsInListWithListName = function (boardId, listName) {
  if (!isDefined_(boardId, listName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let responses = [];
  let listIds = this.getListIdsByName(boardId, listName);
  listIds.forEach(listId => {
    let response = this.archiveAllCardsInList(listId);
    responses.push(response);
  });

  return responses;
}

LibTrello.prototype.getCardCreateDateById = function (cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  return new Date(1000*parseInt(cardId.substring(0,8),16));
}

LibTrello.prototype.getCardCreateDateByShortId = function (cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let card = this.getCard(cardId);
  if (card.error == null) {
    return this.getCardCreateDateById(card.id);
  } else {
    return card;
  }
}

LibTrello.prototype.getCardAgeInDaysById = function (cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var createDate;
  if (cardId.length > 20) { // the hex id
    createDate = this.getCardCreateDateById(cardId);
  } else { // shortLink
    createDate = this.getCardCreateDateByShortId(cardId);
  }
  
  var diffTime = Date.now() - createDate.getTime();
  var diffTimeDays = diffTime / (1000 * 3600 * 24);
  return diffTimeDays;
}

LibTrello.prototype.getCardLastActivityUTCDateById = function (cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let card = this.getCard(cardId);
  if (card.error == null) {
    return card.dateLastActivity;
  } else {
    print_("error: " + card.message);
  }
  return null;
}

LibTrello.prototype.getOldCardIdsInList = function (boardId, listName, moreThanDays) {
  if (!isDefined_(boardId, listName, moreThanDays)) {
    throw new Error("one or more of required argument is missing.");
  }
  let matchedCards = [];
  let listIds = this.getListIdsByName(boardId, listName);
  if (listIds.error == null) {
    listIds.forEach(listId => {
      let cards = this.getCardsInList(listId);
      if (cards.error == null) { 
        cards.forEach(x => {if (this.getCardAgeInDaysById(x.id) > moreThanDays) matchedCards.push(x.id)});
      } else {
        print_("error: " + cards.message);
      }
    });
  } else {
    print_("error: " + listIds.message);
  }
  return matchedCards;
}

LibTrello.prototype.moveCardById = function (cardId, destListId, position = null) {
  if (!isDefined_(cardId, destListId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let fullUrl = `${this.trelloUrl}cards/${cardId}?key=${this.key}&token=${this.token}&idList=${destListId}`;
  if (position) {
    fullUrl += `&pos=${position}`;
  }
  // print_(fullUrl);

  let options = {
    method : "PUT",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  let response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.moveCardsByIdToList = function (boardId, cardIds, destListName, position = null) {
  if (!isDefined_(boardId, cardIds, destListName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let response;
  let destListId = this.getListIdsByName(boardId, destListName);
  if (destListId.length != 1) return this.newError("Destination is more than one.");

  if(!Array.isArray(cardIds)) {
    response = this.moveCardById(cardIds, destListId, position); 
  } else {
    let responses = [];
    cardIds.forEach( cardId => {
      let res = this.moveCardById(cardId, destListId, position);      
      responses.push(res);
    });
    response = responses;
  }
  return response; 
}

LibTrello.prototype.moveCardsByNameToList = function (boardId, cardNames, srcListName, destListName, position = null) {
  if (!isDefined_(boardId, cardNames, srcListName, destListName)) {
    throw new Error("one or more of required argument is missing.");
  }
  let cardIds = [];  
  if(!Array.isArray(cardNames)) {
    print_("is not array");
    let cardId = this.getCardIdByNameWithListName(boardId, srcListName, cardNames);
    cardIds.push(cardId);
  } else {
    print_("is array");
    cardNames.forEach( cardName => {
      let cardId = this.getCardIdByNameWithListName(boardId, srcListName, cardName);
      cardIds.push(...cardId);
    });
  }
  // print_(cardIds);
  let response = this.moveCardsById(boardId, cardIds, destListName, position);
  return response;
}
