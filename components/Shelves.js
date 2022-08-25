import React from 'react';
import Shelf from './Shelf';


const Shelves = ({books, moveBook}) => {

    const currentlyReading = books.filter((book) => book.shelf === "currentlyReading");
    const whatToRead = books.filter((book) => book.shelf === "wantToRead");
    const read = books.filter((book) => book.shelf === "read");

    return (
        <div>
            <Shelf title="Currently Reading" books={currentlyReading} moveBook={moveBook} />
            <Shelf title="Want To Read" books={whatToRead}  moveBook={moveBook} />
            <Shelf title="Read" books={read}  moveBook={moveBook}/>
        </div>
    )

}

export default Shelves;