LibTrello.prototype.getStickersOnCard = function(cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}cards/${cardId}/stickers?key=${this.key}&token=${this.token}`;

  var options = {
    method : "GET",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.addSticker = function(cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}cards/${cardId}/stickers?key=${this.key}&token=${this.token}`;
  fullUrl += `&image=${image}&top=${top}&left=${left}&zIndex=${zIndex}`;

  var options = {
    method : "POST",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.removeSticker = function(cardId, stickerId) {
  if (!isDefined_(cardId, stickerId)) {
    throw new Error("one or more of required argument is missing.");
  }
  var fullUrl = `${this.trelloUrl}cards/${cardId}/stickers/${stickerId}?key=${this.key}&token=${this.token}`;

  var options = {
    method : "DELETE",
    contentType : "application/json",
    muteHttpExceptions: true
  };
  var response = this.urlFetch_(fullUrl, options);
  return (response.getResponseCode() == 200)? JSON.parse(response.getContentText()): this.newError(response.getContentText());
}

LibTrello.prototype.removeAllStickers = function(cardId) {
  if (!isDefined_(cardId)) {
    throw new Error("one or more of required argument is missing.");
  }
  let responses = [];
  let stickers = this.getStickersOnCard(cardId);
  stickers.forEach(sticker => {
    let response = this.removeSticker(cardId, sticker.id);
    responses.push(response);
  });

  return responses;
}