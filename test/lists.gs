/**
 * lists
 */

function test_lists() {
  let libT = loadTrelloLib();
  let ret;

  // getList (listId)
  // ret = libT.getList ("5809c475b5e8cb42f021e9d9"); // test pass

  // getListsOnBoard (boardId, filter = "")
  // ret = libT.getListsOnBoard ("DddxigsG"); // test pass

  // getListsByName (boardId, listName, opened=true)
  // ret = libT.getListsByName ("DddxigsG", "Information"); // test pass

  // getListIdsByName (boardId, listName, opened=true)
  // ret = libT.getListIdsByName ("DddxigsG", "Information"); // test pass

  // sortList (boardId, listName, method)
  // sortListByDueDate (boardId, listName, method)

  /**
   * log
   */
  // getFetchCount()
  count = libT.getFetchCount();

  print_(ret);
  print_("Fetch count is " + count);
}