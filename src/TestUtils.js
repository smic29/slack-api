import { getByPlaceholderText, act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import React from 'react';

export const performLogin = async () => {
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
      }, {timeout: 5000})
    
      const signedIn = screen.getByText(/you are signed in as/i);
      expect(signedIn).toHaveTextContent('You are signed in as: spicy@test3.com')
}