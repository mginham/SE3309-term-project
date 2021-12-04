import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function App() {
  const [librarian, setLibrarian] = useState(false)
  const [email, setEmail] = useState('');

  const login = () => {
    fetch('/login', {
      method: 'POST',
      headers: {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      }
    })
      .then(response => {
        console.log(response)
      })
      .catch((error) => {
        console.log('error: ', error);
      })
  }

  const reserve = () => {

  }

  const returnBook = () => {

  }

  const searchBook = () => {

  }

  const getPopularChoice = () => {

  }

  const handleEmail = (event) => {
    setEmail(event.target.value)
  }

  const loginForm = (
    <Form id='login-form' className='w-50 h-50 card p-5 m-5' onSubmit={login}>
      <Form.Group controlId='email'>
        <Form.Label>Email: </Form.Label>
        <Form.Control type='email' name='email' placeholder='' onChange={handleEmail} />
      </Form.Group>
      <Button type='submit' className='my-3'>Login</Button>
    </Form>
  );

  const librarianView = (
    <div>

    </div>
  )

  return (
    <div className="App h-100 w-100">
      <div id='tempbuttons'>
        <Button onClick={reserve}>Make Reservation</Button>
        <Button onClick={returnBook}>Return book</Button>
        <Button onClick={searchBook}>Search Book</Button>
        <Button onClick={getPopularChoice}>Get Popular Choice</Button>
      </div>

      {librarian ? librarianView : loginForm}

    </div>
  );
}

export default App;
