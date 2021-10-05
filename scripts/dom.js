const UNCOMPLETED_LIST_BOOK_ID = "books";
const COMPLETED_LIST_BOOK_ID = "completed-books";
const BOOK_ITEMID = "itemId";

function makeBook(title, author, timestamp, isCompleted) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("h4");
  textAuthor.innerText = author;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);

  if (isCompleted) {
    container.append(createUndoButton(), createTrashButton());
  } else {
    container.append(createCheckButton(), createTrashButton());
  }

  return container;
}

function createUndoButton() {
  return createButton("undo-button", function (event) {
    undoBookFromCompleted(event.target.parentElement);
  });
}

function createTrashButton() {
  return createButton("trash-button", function (event) {
    removeBookFromCompleted(event.target.parentElement);
    window.alert("Buku Berhasil Dihapus");
  });
}

function createCheckButton() {
  return createButton("check-button", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
    event.stopPropagation();
  });
  return button;
}

function addBook() {
  const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const textBook = document.getElementById("title").value;
  const textAuthor = document.getElementById("author").value;
  const timestamp = document.getElementById("date").value;

  const book = makeBook(textBook, textAuthor, timestamp, false);
  const bookObject = composeBookObject(textBook, textAuthor, timestamp, false);

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  uncompletedBookList.append(book);
  updateDataToStorage();
}

function addBookToCompleted(taskElement) {
  const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
  const taskTitle = taskElement.querySelector(".inner > h2").innerText;
  const taskAuthor = taskElement.querySelector(".inner > h4").innerText;
  const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

  const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, true);

  const book = findBook(taskElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  listCompleted.append(newBook);
  taskElement.remove();

  updateDataToStorage();
}

function removeBookFromCompleted(taskElement) {
  const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);

  taskElement.remove();
  updateDataToStorage();
}

function undoBookFromCompleted(taskElement) {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const taskTitle = taskElement.querySelector(".inner > h2").innerText;
  const taskAuthor = taskElement.querySelector(".inner > h4").innerText;
  const taskTimestamp = taskElement.querySelector(".inner > p").innerText;

  const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, false);

  const book = findBook(taskElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;

  listUncompleted.append(newBook);
  taskElement.remove();

  updateDataToStorage();
}

function refreshDataFromBooks() {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

  for (book of books) {
    const newBook = makeBook(
      book.task,
      book.author,
      book.timestamp,
      book.isCompleted
    );
    newBook[BOOK_ITEMID] = book.id;

    if (book.isCompleted) {
      listCompleted.append(newBook);
    } else {
      listUncompleted.append(newBook);
    }
  }
}
