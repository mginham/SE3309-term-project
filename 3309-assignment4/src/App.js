import './App.css';
import React, { useState } from 'react';
import { Button, Form, Table, Row, ButtonGroup } from 'react-bootstrap';

import { showError, ErrorContainer, showSuccess, SuccessContainer } from './toast';


function BookList({ listName, books }) {
  return books.length > 0 ? (
    <div>
      <h3 className='pt-3'>{listName}</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            {Object.keys(books[0]).map(field => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {books.map(book => (
            <tr key={book['Title']}>
              {Object.keys(book).map(field => (
                <td key={book + field}>{book[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  ) : null;
}


function App() {
  const [librarian, setLibrarian] = useState(true)
  const [email, setEmail] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [cardholder, setCardholder] = useState(null);
  const [reservationID, setReservationID] = useState(null);
  const [authorName, setAuthorName] = useState(null);
  const [genre, setGenre] = useState(null);

  const [searchedBooks, setSearchedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [view, setView] = useState(0);

  const login = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(res => {
        if (!res.ok) {
          res.text().then(showError);
        }
        else {
          res.json().then(librarian => {
            if (librarian) {
              setLibrarian(true);
            }
          })
        }
      })
  }

  const reserve = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/makereservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cardholder, serial_Number: serialNumber })
    })
      .then(res => {
        if (!res.ok) {
          res.text().then(showError);
        }
        else {
          res.text().then(status => {
            if (status === 'Success') {
              showSuccess('Book reserved successfully')
              setSerialNumber(null);
              setCardholder(null);
            }
          })
        }
      })
  }

  const returnBook = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/returnbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationID: reservationID })
    })
      .then(res => {
        if (!res.ok) {
          res.text().then(showError);
        }
        else {
          res.text().then(status => {
            if (status === 'Success') {
              showSuccess('Book returned successfully')
              setReservationID(null);
            }
          })
        }
      })
  }

  const searchBook = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/searchBook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: authorName, genre: genre })
    })
      .then(res => {
        if (!res.ok) {
          res.text().then(showError);
        }
        else {
          res.json().then(books => {
            if (books.length === 0) {
              showError('No books found');
            }
            else {
              setSearchedBooks(books);
              setAuthorName(null);
              setGenre(null);
            }
          })
        }
      })
  }

  const getPopularChoice = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/getPopularChoice')
      .then(res => {
        if (!res.ok) {
          res.text().then(showError);
        }
        else {
          res.json().then(books => {
            if (books.length === 0) {
              showError('No books found');
            }
            else {
              setPopularBooks(books);
            }
          })
        }
      })
  }

  const getReservations = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/getReservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cardholder })
    })
      .then(res => {
        if (!res.ok) {
          res.text().then(showError);
        }
        else {
          res.json().then(reservations => {
            if (reservations.length === 0) {
              showError('No reservations found');
            }
            else {
              setReservations(reservations);
            }
          })
        }
      })
  }

  const handleChange = (setFn) => {
    return (event) => {
      setFn(event.target.value)
    }
  };

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

  const returnForm = (
    <Form id='return-form' className='col-6 h-50 card p-5 m-5' onSubmit={returnBook}>
      <h2>Return a Book</h2>

      <Form.Group className='pt-3' controlId='reservationID'>
        <Form.Label>Reservation ID: </Form.Label>
        <Form.Control
          type='text'
          name='reservationID'
          required
          placeholder='Enter ID of the reservation to be returned'
          onChange={handleChange(setReservationID)} />
      </Form.Group>
      <Button type='submit' className='my-3'>Return Book</Button>
    </Form>
  );

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

      <BookList books={searchedBooks} listName='Search Results'></BookList>
    </div>
  );

  const popularChoiceForm = (
    <div className='col-6 h-50 card p-5 m-5'>
      <h2>Get Most Popular Books</h2>
      <Button className='my-3' onClick={getPopularChoice}>View Books</Button>

      <BookList books={popularBooks} listName='List of Popular Books'></BookList>
    </div>
  );

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

      <BookList books={reservations} listName='Reservations'></BookList>
    </div>
  );


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
      default:
        return reservationForm;
    }
  }

  const navButtons = (
    <ButtonGroup className='p-5'>
      <Button onClick={() => setView(0)} variant={view === 0 ? 'primary' : 'outline-primary'}>New Reservation</Button>
      <Button onClick={() => setView(1)} variant={view === 1 ? 'primary' : 'outline-primary'}>Return a Book</Button>
      <Button onClick={() => setView(2)} variant={view === 2 ? 'primary' : 'outline-primary'}>Search for a Book</Button>
      <Button onClick={() => setView(3)} variant={view === 3 ? 'primary' : 'outline-primary'}>Get Popular Books</Button>
      <Button onClick={() => setView(4)} variant={view === 4 ? 'primary' : 'outline-primary'}>Get Reservations</Button>
    </ButtonGroup>
  )

  const librarianView = (
    <div className='container-fluid'>
      <Row className='justify-content-center'>
        {navButtons}
        {getPage()}
      </Row>
    </div>
  )

  return (
    <div className="App h-100 w-100">
      <ErrorContainer></ErrorContainer>
      <SuccessContainer></SuccessContainer>

      {librarian ? librarianView : loginForm}

    </div>
  );
}

export default App;
