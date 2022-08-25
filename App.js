import { useState ,useEffect} from "react";
// import the used components here from other pages
import "./App.css";
import Header from "./components/Header";
import Shelves from "./components/Shelves";
import { BrowserRouter as Router, Routes, Link ,Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from "./components/Book";


function App() {

  // create new map to make the books with a key which is id
  const [mapId, setMapId] = useState(new Map());
  // states to combined books from search to main page and set books
  const[books,setBooks]=useState([]);
  const [searchResult,setSearchResult]= useState("");
  const[BooksArrSearch,setBooksArrSearch]=useState([]);
  const [combinedBooks, setCombinedBooks] = useState([]);

  // useEffect to get all books and make a map to of every book with key id
  useEffect (() => {
    BooksAPI.getAll()
    .then(data => {
      setBooks(data);
    setMapId(MakeMapIds(data))

    }
    );
      },[])

  // useEffect to search for books  if found set it to Books Arr Search
  //if not found log the error
  // if not typed anything in search return an empty array without saving any other search books
  useEffect (() => {
    let available  =true;
        if(searchResult){
           BooksAPI.search(searchResult).then(data =>{
          if(data.error){
            console.log(data);
          } else{

            if (available){
              setBooksArrSearch(data);
              
            }
          }
        })
      } 
    return ()=> {
      available= false;
      setBooksArrSearch([])
    }
    },[searchResult])


 
        
    // useEffect to set Combined Books with the books in main page and in search page when we assign it to a shelf
    useEffect(() => {

      const combined = BooksArrSearch.map(book => {
        if (mapId.has(book.id)) {
          return mapId.get(book.id);
        } else {

          return book;
        }
      })
      setCombinedBooks(combined);
      
    }, [BooksArrSearch,mapId])

    // function to make the books that returned from getAll api map to a key with id and the book
  
    const MakeMapIds = (books) => {
      const map = new Map();
      books.map(book => map.set(book.id, book));
      return map;
    }

// function to move the book new shelf according to the destination and return all other books
// use the update api to save updates even after the refresh
  const moveBook = (book, dest) => {
    const newBooks = books.map(i => {
      if (i.id === book.id ) {
        
        book.shelf = dest;

        return book;
      }
   else   return i;

    })

    if (!mapId.has(book.id)) {
      book.shelf = dest;
      newBooks.push(book)

    }
    BooksAPI.update(book,dest).then(data =>console.log(data))

    setBooks(newBooks);

  }
  

  return (
    
    <div className="app">
<Router>
<Routes>
<Route path= '/search' element ={

        <div className="search-books">
          <div className="search-books-bar">
            <Link to="/" >

            <a href="!#" 
              className="close-search"
              
            >
              Close
            </a>
            </Link>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                placeholder="Search by title, author, or ISBN"
              value={searchResult} onChange={(e) =>setSearchResult(e.target.value) }/>
            </div>
          </div>
          <div className="search-books-results">
            <ol className="books-grid">
            {combinedBooks.map(i => (
              <li key= {i.id}>
                  <Book book={i} changeShelf={moveBook}   />
              </li>
          ))}

            </ol>
          </div>
        </div>
} />
<Route path ='/'  element = {



        <div className="list-books">
<Header/>
          <div className="list-books-content">
 <Shelves books={books}  moveBook={moveBook} />
          </div>
          <div className="open-search">
          <Link to="/search">
                  <a href="!#" >Add a book</a>
                </Link>
          </div>
        </div>
} />

        </Routes>
        </Router>
    </div>
  );
}

export default App;
