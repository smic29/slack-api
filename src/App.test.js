import { cleanup, getByLabelText, getByPlaceholderText, getByText, render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import React from 'react';
import { performLogin } from './TestUtils';

afterEach(() => {
  cleanup();
})

test('Page loads to Landing Page', () => {
  render(<App />);
  const logInScreen = screen.getByText(/email/i);
  expect(logInScreen).toBeInTheDocument();
});

test('Check if Landing Page switches from log-in to create user', async () => {
  render(<App />);
  const createAccount = screen.getByText(/sign up here/i);
  userEvent.click(createAccount);
  
  await waitFor(() => {
    const createUser = screen.getByText(/login information/i);
    expect(createUser).toBeInTheDocument();
    expect(createAccount).not.toBeInTheDocument()
  })
})

test('Check if create button is disabled on empty user creation form', async() => {
  render(<App />);
  const createAccount = screen.getByText(/sign up here/i);
  userEvent.click(createAccount);
  
  await waitFor(() => {
    const createButton = screen.getByTestId('createButton');
    expect(createButton).toHaveClass('disabled');
  })
})

jest.mock('axios', () => jest.requireActual('axios'));
test('User is able to log in', () => {
  render(<App />)
  act(async() => {
      const userNameInput = screen.getByPlaceholderText(/email/i);
      userEvent.type(userNameInput, 'spicy@test3.com');

      const passwordInput = screen.getByPlaceholderText('Enter password');
      userEvent.type(passwordInput, '12345678');

      const loginButton = screen.getByTestId('loginButton');
      userEvent.click(loginButton);
      
      await waitFor(() => {
        const directToDashboard = screen.getByText('Information');
        expect(directToDashboard).toBeInTheDocument();
      }, {timeout: 5000})
  })
})

test('User is able to log out', async () => {
  render(<App />)
  await act(async() => {
    const triggerLogoutModal = screen.getByTestId('user-modalTrigger');
    userEvent.click(triggerLogoutModal);
    
    const logoutButton = screen.getByText('Sign Out of Slack');
    expect(logoutButton).toBeInTheDocument();

    // waitFor(() => {
    //   const logoutButton = screen.getByText('Sign Out of Slack');
    //   expect(logoutButton).toBeInTheDocument();
    // })
  })
})
