function loadTrelloLib() {
  key = 'enter_your_key_here';
  token = 'enter_your_token_here';
  const trellohelper = libtrello.libTrello(key, token);
  return trellohelper;
}

function print_(text) {
  Logger.log(text);
}

function setDate(strDate) {
  let trimDate = strDate.trim();
  let date = new Date(trimDate);
  if (isNaN(date.valueOf()))
    return null;

  if (trimDate.length == 10) {
    date.setHours(23,59,59,999);
  }

  return date.toUTCString();
}