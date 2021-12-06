import './App.css';
import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Row, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import { showError, ErrorContainer, showSuccess, SuccessContainer } from './toast';

// A React component to display arrays of entities returned by our database in table-format.
// It is agnostic to the different attributes of the entities by creating each column dynamically.
function EntityTable({ listName, entities }) {
  // if the array of entities to display is empty, return "null" so nothing displays.
  // if the array is not empty, generate a table
  return entities.length > 0 ? (
    <div>
      <h3 className='pt-3'>{listName}</h3>

      <Table striped bordered hover>
        {/* Map the keys of an arbitrary item to be the table's column names 
        (all returned entities have the same attributes) */}
        <thead>
          <tr>
            {Object.keys(entities[0]).map(field => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        {/* Map each item in the array to a table row. Iterate over each item's 
        attributes to populate the table data */}
        <tbody>
          {entities.map(e => (
            <tr key={e['Title']}>
              {Object.keys(e).map(field => (
                <td key={e + field}>{e[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  ) : null;
}

// The main React component for the frontend. Initially displays a login form until authentication is completed.
// After login, there are multiple tabs which can be selected to display a unique form that implements
// a particular functionality of our database.
function App() {
  /*
    Declare React state variables using hooks. Retrieved data from the database is stored in these variables
    so the data can be dynamically displayed in React
  */

  // use hooks to store data that was returned from our database in a stateful manner
  const [librarian, setLibrarian] = useState(false)
  const [email, setEmail] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [cardholder, setCardholder] = useState(null);
  const [returnSerial, setReturnSerial] = useState(null);
  const [authorName, setAuthorName] = useState(null);
  const [genre, setGenre] = useState(null);
  const [bookTitle, setBookTitle] = useState(null);
  const [library, setLibrary] = useState(null);
  const [cardholderBalance, setCardholderBalance] = useState(null);
  // these state variables hold data that can be passed to a the EntityTable component
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  // holds a list of all available libraries which are used for drop-down selection.
  // this is fetched when the page loads
  const [libraryList, setLibraryList] = useState([])
  // keeps track of what tab the user is currently viewing
  const [view, setView] = useState(0);

  /*
    Load the available libraries by hitting the getLibraries endpoint in our express server,
    and store the libraries in a state variable. This is called when the page loads
  */

  useEffect(() => {
    fetch('http://localhost:5000/getLibraries').then(res => {
      if (!res.ok) {
        // if a 400 or 500 http status is received, display the response error in a toaster popup
        res.text().then(showError);
      }
      else {
        // parse the json object returned from the express server
        res.json().then(libraries => {
          setLibraryList(libraries);
        }
        )
      }
    })
  }, [])

  /*
    Handler functions that are called when the user clicks the respective button. These send requests to 
    our express server and set state variables with the returned data, so the data can be displayed on the frontend
  */

  // handles the login form and fetches the appropriate data through our express server
  const login = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // parse the json object returned from the express server
          res.json().then(librarian => {
            // if the login was successful, a "true" response will be sent from the server.
            // confirm the login using a state variable so the functional view can be shown
            if (librarian) {
              setLibrarian(true);
            }
          })
        }
      })
      // if an error occurs here, it's because the data was not retrieved properly. display the error in a toaster
      .catch(err => showError('Database failed to connect'));
  }

  // handles the reservation form and fetches the appropriate data through our express server
  const reserve = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/makereservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cardholder, serial_Number: serialNumber })
    })
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // a simple "Success" text will be returned by the server if the function succeeded.
          // if this message was received, show a successful toaster popup and clear the form inputs
          res.text().then(status => {
            if (status === 'Success') {
              showSuccess('Book reserved successfully')
              setSerialNumber(null);
              setCardholder(null);
            }
          })
        }
      })
      // if an error occurs here, it's because the data was not retrieved properly. display the error in a toaster
      .catch(err => showError('Database failed to connect'));
  }

  // handles the book return form and fetches the appropriate data through our express server
  const returnBook = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/returnbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial_Number: returnSerial })
    })
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // a simple "Success" text will be returned by the server if the function succeeded.
          // if this message was received, show a successful toaster popup and clear the form inputs
          res.text().then(status => {
            if (status === 'Success') {
              showSuccess('Book returned successfully')
              setReturnSerial(null);
            }
          })
        }
      })
      // if an error occurs here, it's because the data was not retrieved properly. display the error in a toaster
      .catch(err => showError('Database failed to connect'));
  }

  // handles the searching form and fetches the appropriate data through our express server
  const searchBook = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/searchBook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: authorName, genre: genre })
    })
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // parse the json object returned from the express server
          res.json().then(books => {
            if (books.length === 0) {
              // if the returned list is empty, notify the user that no such book exists
              showError('No books found');
            }
            else {
              // if any books match the search query, set a state variable to the returned list
              // so the books can be shown using a EntityTable component. reset the state input variables
              setSearchedBooks(books);
              setAuthorName(null);
              setGenre(null);
            }
          })
        }
      })
      // if an error occurs here, it's because the data was not retrieved properly. display the error in a toaster
      .catch(err => showError('Database failed to connect'));
  }

  // handles the popular book display and fetches the appropriate data through our express server
  const getPopularChoice = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/getPopularChoice')
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // parse the json object returned from the express server
          res.json().then(books => {
            if (books.length === 0) {
              // if the returned list is empty, notify the user that the query was unsuccessful
              showError('No books found. Try again later.');
            }
            else {
              // if any books were found, set a state variable to the returned list
              // so the books can be shown using a EntityTable component. 
              setPopularBooks(books);
            }
          })
        }
      })
      // if an error occurs here, it's because the data was not retrieved properly. display the error in a toaster
      .catch(err => showError('Database failed to connect'));
  }

  // handles the cardholder reservations list and fetches the appropriate data through our express server
  // this method makes two requests to the server: one to retrive all of a cardholder's past reservations,
  // and one to retrive a cardholder's fee balance
  const getReservations = (e) => {
    e.preventDefault();
    // fetch the cardholder's reservations
    fetch('http://localhost:5000/getReservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cardholder })
    })
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // parse the json object returned from the express server
          res.json().then(reservations => {
            if (reservations.length === 0) {
              // if the returned list is empty, notify the user that they have no reservations on file
              showError('No reservations found');
            }
            else {
              // if any reservations were found, set a state variable to the returned list
              // so the reservations can be shown using a EntityTable component. 
              setReservations(reservations);
            }
          })
        }
      })
    // fetch the cardholder's fee balance
    fetch(`http://localhost:5000/feeBalance/?email=${cardholder}`)
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // the server returns a simple text response containing the cardholder's balance. set a state variable
          // to hold the balance and display it in the frontend
          res.text().then(bal => {
            setCardholderBalance(bal);
          })
        }
      })
      // if an error occurs here, it's because the data was not retrieved properly. display the error in a toaster
      .catch(err => showError('Database failed to connect'));
  }

  // handles the book availability form and fetches the appropriate data through our express server
  const getAvailable = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/bookAvailable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_Title: bookTitle, libraryName: library })
    })
      .then(res => {
        if (!res.ok) {
          // if a 400 or 500 http status is received, display the response error in a toaster popup
          res.text().then(showError);
        }
        else {
          // parse the json object returned from the express server
          res.json().then(books => {
            if (books.length === 0) {
              // if the returned list is empty, notify the user that the book cannot be found at the specified library
              showError('This book is not available at this library');
            }
            else {
              // if any books were found, set a state variable to the returned list
              // so the books can be shown using a EntityTable component. reset the library dropdown.
              setAvailableBooks(books);
              setLibrary(null);
            }
          })
        }
      })
      // if an error occurs here, it's because the data was not retrieved properly. display the error in a toaster
      .catch(err => showError('Database failed to connect'));
  }

  // this function handles changes to an input field. the function to set the appropriate state variable
  // is passed as an argument, and the value of the binded input is passed to the state variable setter
  const handleChange = (setFn) => {
    return (event) => {
      setFn(event.target.value)
    }
  };

  /*
    JSX code for each type of database query form. They are each displayed when a specific view
    is selected by the user; no two views are displayed at the same time. All of these are
    html Forms which call a specific handler function when submitted.
  */

  // receives input for a librarian's login (Query) to enable the functional view
  const loginForm = (
    <Form id='login-form' className='w-50 h-50 card p-5 m-5' onSubmit={login}>
      <Form.Group className='pt-3' controlId='email'>
        <Form.Label>Email: </Form.Label>
        <Form.Control
          type='email'
          name='email'
          required
          placeholder='Enter your librarian email'
          onChange={handleChange(setEmail)} />
      </Form.Group>
      <Button type='submit' className='my-3'>Login</Button>
    </Form>
  );

  // receives input to create a new reservation (Modification)
  const reservationForm = (
    <Form id='reservation-form' className='col-6 h-25 card p-5 m-5' onSubmit={reserve}>
      <h2>Make a Reservation</h2>

      <Form.Group className='pt-3' controlId='serialNumber'>
        <Form.Label>Serial Number: </Form.Label>
        <Form.Control
          type='text'
          name='serialNumber'
          required
          placeholder='Enter the serial number to reserve'
          onChange={handleChange(setSerialNumber)} />
      </Form.Group>

      <Form.Group className='pt-3' controlId='cardholder'>
        <Form.Label>Cardholder email: </Form.Label>
        <Form.Control
          type='email'
          name='cardholder'
          required
          placeholder='Enter the cardholder email'
          onChange={handleChange(setCardholder)} />
      </Form.Group>

      <Button type='submit' className='my-3'>Create Reservation</Button>
    </Form>
  );

  // receives input to create a return a book (Modification)
  const returnForm = (
    <Form id='return-form' className='col-6 h-50 card p-5 m-5' onSubmit={returnBook}>
      <h2>Return a Book</h2>

      <Form.Group className='pt-3' controlId='returnSerial'>
        <Form.Label>Serial Number: </Form.Label>
        <Form.Control
          type='text'
          name='returnSerial'
          required
          placeholder='Enter the serial number of the book being returned'
          onChange={handleChange(setReturnSerial)} />
      </Form.Group>
      <Button type='submit' className='my-3'>Return Book</Button>
    </Form>
  );

  // receives input to search for a book (Query) and provides a display to show the results
  const searchForm = (
    <div className='col-6 h-50 card p-5 m-5'>
      <Form id='search-form' onSubmit={searchBook}>
        <h2>Search for a Book</h2>
        <Form.Group className='pt-3' controlId='author'>
          <Form.Label>Author Name: </Form.Label>
          <Form.Control
            type='text'
            name='authorName'
            required
            placeholder='Enter the author name'
            onChange={handleChange(setAuthorName)} />
        </Form.Group>

        <Form.Group className='pt-3' controlId='genre'>
          <Form.Label>Book Genre: </Form.Label>
          <Form.Control
            type='text'
            name='genre'
            required
            placeholder='Enter the desired genre'
            onChange={handleChange(setGenre)} />
        </Form.Group>

        <Button type='submit' className='my-3 w-100'>Search Book</Button>
      </Form>

      <EntityTable entities={searchedBooks} listName='Search Results'></EntityTable>
    </div>
  );

  // provides a button to list the most popular books (Query) and provides a display to show the results
  const popularChoiceForm = (
    <div className='col-6 h-50 card p-5 m-5'>
      <h2>Get Most Popular Books</h2>
      <Button className='my-3' onClick={getPopularChoice}>View Books</Button>

      <EntityTable entities={popularBooks} listName='List of Popular Books'></EntityTable>
    </div>
  );

  // receives input to search for the reservations created by a cardholder (Query) 
  // and provides a display to show the results. also queries and displays the cardholder's
  //  balance (Query)
  const cardholderReservationForm = (
    <div className='col-6 h-50 card p-5 m-5'>
      <Form id='search-form' onSubmit={getReservations}>
        <h2>List a Cardholder's Reservations</h2>
        <Form.Group className='pt-3' controlId='cardholder'>
          <Form.Label>Cardholder Email: </Form.Label>
          <Form.Control
            type='email'
            name='cardholder'
            required
            placeholder='Enter the cardholder email'
            onChange={handleChange(setCardholder)} />
        </Form.Group>

        <Button type='submit' className='my-3 w-100'>Show Reservations</Button>
      </Form>

      {cardholderBalance === null ? null :
        <div>
          <h3>Cardholder's Fee Balance</h3>
          <h5>${cardholderBalance}</h5>
        </div>
      }

      <EntityTable entities={reservations} listName='Reservations'></EntityTable>
    </div>
  );

  // receives input to check a book's availability at a library (Query) and provides
  // a display to show the available copies
  const bookAvailableForm = (
    <div className='col-6 h-50 card p-5 m-5'>
      <Form id='book-available-form' onSubmit={getAvailable}>
        <h2>Check a Book's Availability</h2>
        <Form.Group className='py-3' controlId='bookTitle'>
          <Form.Label>Book title: </Form.Label>
          <Form.Control
            type='text'
            name='bookTitle'
            required
            placeholder='Enter the book title'
            onChange={handleChange(setBookTitle)} />
        </Form.Group>

        <DropdownButton id="library-dropdown" title={library === null ? 'Select a library' : library}>
          {libraryList.map(l => (
            <Dropdown.Item onClick={() => setLibrary(l)}>{l}</Dropdown.Item>
          ))}
        </DropdownButton>

        <Button type='submit' className='my-3 w-100'>Check Availability</Button>
      </Form>

      <EntityTable entities={availableBooks} listName='Available Copies'></EntityTable>
    </div>
  );

  /*
    Some React logic to specify which form to display based on the user's selected view.
  */

  // when called, returns one of the above Forms switching based on the "view" state variable
  const getPage = () => {
    switch (view) {
      case 0:
        return reservationForm;
      case 1:
        return returnForm;
      case 2:
        return searchForm;
      case 3:
        return popularChoiceForm;
      case 4:
        return cardholderReservationForm;
      case 5:
        return bookAvailableForm;
      default:
        return reservationForm;
    }
  }

  // defines a navbar with buttons that allow the "view" state variable to be updated. clicking on 
  // one of the buttons sets "view" such that the selected Form is displayed as per the above "getPage" function
  const navButtons = (
    <ButtonGroup className='p-5'>
      <Button onClick={() => setView(0)} variant={view === 0 ? 'primary' : 'outline-primary'}>New Reservation</Button>
      <Button onClick={() => setView(1)} variant={view === 1 ? 'primary' : 'outline-primary'}>Return a Book</Button>
      <Button onClick={() => setView(2)} variant={view === 2 ? 'primary' : 'outline-primary'}>Search for a Book</Button>
      <Button onClick={() => setView(3)} variant={view === 3 ? 'primary' : 'outline-primary'}>Get Popular Books</Button>
      <Button onClick={() => setView(4)} variant={view === 4 ? 'primary' : 'outline-primary'}>Get Reservations</Button>
      <Button onClick={() => setView(5)} variant={view === 5 ? 'primary' : 'outline-primary'}>Check Availability</Button>
    </ButtonGroup>
  )

  // the functional view that a logged-in user can see. implements the navbuttons and 
  // current selected page switcher ("navButtons" and "getPage" respectively)
  const librarianView = (
    <div className='container-fluid'>
      <Row className='justify-content-center'>
        {navButtons}
        {getPage()}
      </Row>
      <Row className='justify-content-center py-3'>
        <Button style={{ width: '10%' }} onClick={() => setLibrarian(false)}>Quit</Button>
      </Row>
    </div>
  )

  // returns the component to be rendered. implements the functional "librarianView" if a librarian user is 
  // logged in, but if not, displays the "loginForm". also implements the containers in which toaster popups
  // are displayed
  return (
    <div className="App h-100 w-100">
      <ErrorContainer></ErrorContainer>
      <SuccessContainer></SuccessContainer>
      {librarian ? librarianView : loginForm}
    </div>
  );
}

export default App;
