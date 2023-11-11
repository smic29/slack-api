import { cleanup, getByLabelText, getByPlaceholderText, getByText, render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import React from 'react';
import axios from 'axios';
import { performLogin } from './TestUtils';

test('Defaults to login page', () => {
  render(<App />);
  const logInScreen = screen.getByText(/email/i);
  expect(logInScreen).toBeInTheDocument();
});

test('login can switch to user-creation', () => {
  render(<App />);
  const createAccount = screen.getByText(/sign up here/i);
  
  act(() => {
    userEvent.click(createAccount);
  })

  const createUser = screen.getByText(/login information/i);
  expect(createUser).toBeInTheDocument();
  expect(createAccount).not.toBeInTheDocument()
})

test('create button is disabled if inputs are empty', () => {
  render(<App />);
  const createAccount = screen.getByText(/sign up here/i);
  
  act(() => {
    userEvent.click(createAccount);
  })

  const createButton = screen.getByTestId('createButton');
  expect(createButton).toHaveClass('disabled');
})

test('back button returns to the login page', () => {
  render(<App />);
  const createAccount = screen.getByText(/sign up here/i);
  
  act(() => {
    userEvent.click(createAccount);
  })

  const backButton = screen.getByTestId('backButton');
  act(() => {
    userEvent.click(backButton);
  })
  
  const logInScreen = screen.getByText(/email/i);
  expect(logInScreen).toBeInTheDocument();
})

test('user is able to log in', async() => {
  render(<App />);
  act(() => {
    const userNameInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText('Enter password');

    userEvent.type(userNameInput, 'spicy@test3.com');
    userEvent.type(passwordInput, '12345678')
  })

  const loginButton = screen.getByTestId('loginButton');

  act(() => {
    userEvent.click(loginButton);
  })

  await waitFor(() => {
    const homepage = screen.getByText(/information/i);
    expect(homepage).toBeInTheDocument();
  })

  const signedIn = screen.getByText(/you are signed in as/i);
  expect(signedIn).toHaveTextContent('You are signed in as: spicy@test3.com')
})

test('user is able to log out', async() => {
  await performLogin();

  const modalTrigger = screen.getByTestId('user-modalTrigger');
  expect(modalTrigger).toBeInTheDocument();

  act(()=>{userEvent.click(modalTrigger)});

  const logoutButton = screen.getByText('Sign Out of Slack');
  expect(logoutButton).toBeInTheDocument();

  act(()=>{userEvent.click(logoutButton)});

  const logInScreen = screen.getByText(/email/i);
  expect(logInScreen).toBeInTheDocument();
})