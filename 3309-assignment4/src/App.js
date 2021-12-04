import './App.css';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function App() {
  const [librarian, setLibrarian] = useState(false)
  const [email, setEmail] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [cardholder, setCardholder] = useState(null);
  const [reservationID, setReservationID] = useState(null);
  const [authorName, setAuthorName] = useState(null);
  const [genre, setGenre] = useState(null);

  const login = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(res =>{
        res.json().then(librarian => {
          if (librarian){
            setLibrarian(true);
          }
      }
      )})
      .catch((error) => {
        console.log('error: ', error);
      })
  }

  const reserve = (e) => {
    e.preventDefault();

  }

  const returnBook = (e) => {
    e.preventDefault();

  }

  const searchBook = (e) => {
    e.preventDefault();

  }

  const getPopularChoice = (e) => {
    e.preventDefault();

  }

  const handleChange = (setFn) => {
    return (event) => {
      setEmail(event.target.value)
    }
  };

  const loginForm = (
    <Form id='login-form' className='w-50 h-50 card p-5 m-5' onSubmit={login}>
      <Form.Group controlId='email'>
        <Form.Label>Email: </Form.Label>
        <Form.Control
          type='email'
          name='email'
          value={email}
          placeholder='Enter your librarian email'
          onChange={handleChange(setEmail)} />
      </Form.Group>
      <Button type='submit' className='my-3'>Login</Button>
    </Form>
  );

  const reservationForm = (
    <Form id='reservation-form' className='w-50 h-25 card p-5 m-5' onSubmit={reserve}>
      <h2>Make a Reservation</h2>

      <Form.Group controlId='serialNumber'>
        <Form.Label>Serial Number: </Form.Label>
        <Form.Control
          type='text'
          name='serialNumber'
          value={serialNumber}
          placeholder='Enter the serial number to reserve'
          onChange={handleChange(setSerialNumber)} />
      </Form.Group>

      <Form.Group controlId='cardholder'>
        <Form.Label>Cardholder email: </Form.Label>
        <Form.Control
          type='email'
          name='cardholder'
          value={cardholder}
          placeholder='Enter the cardholder email'
          onChange={handleChange(setCardholder)} />
      </Form.Group>

      <Button type='submit' className='my-3'>Create Reservation</Button>
    </Form>
  );

  const returnForm = (
    <Form id='return-form' className='w-50 h-50 card p-5 m-5' onSubmit={returnBook}>
      <Form.Group controlId='reservationID'>
        <Form.Label>Reservation ID: </Form.Label>
        <Form.Control
          type='text'
          name='reservationID'
          value={reservationID}
          placeholder='Enter the reservationID to be returned'
          onChange={handleChange(setReservationID)} />
      </Form.Group>
      <Button type='submit' className='my-3'>Return Book</Button>
    </Form>
  );

  const searchForm = (
    <Form id='search-form' className='w-50 h-50 card p-5 m-5' onSubmit={searchBook}>
      <Form.Group controlId='author'>
        <Form.Label>Author Name: </Form.Label>
        <Form.Control
          type='text'
          name='authorName'
          value={authorName}
          placeholder='Enter the author name to be returned'
          onChange={handleChange(setAuthorName)} />
      </Form.Group>

      <Form.Group controlId='genre'>
        <Form.Label>Author Name: </Form.Label>
        <Form.Control
          type='text'
          name='genre'
          value={genre}
          placeholder='Enter the author name to be returned'
          onChange={handleChange(setGenre)} />
      </Form.Group>

      <Button type='submit' className='my-3'></Button>
    </Form>
  );

  const librarianView = (
    <div>
      <reservationForm />
      <returnForm />
    </div>
  )

  return (
    <div className="App h-100 w-100">
      {librarian ? librarianView : loginForm}

    </div>
  );
}

export default App;
