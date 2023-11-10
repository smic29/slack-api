import { getByPlaceholderText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import React from 'react';

export const performLogin = async () => {
    render(<App />);

    const userNameInput = screen.getByPlaceholderText(/email/i);
    userEvent.type(userNameInput, 'spicy@test3.com');

    const passwordInput = screen.getByPlaceholderText('Enter password');
    userEvent.type(passwordInput, '12345678');

    const loginButton = screen.getByTestId('loginButton');
    userEvent.click(loginButton);
      
    await waitFor(() => {
        const directToDashboard = screen.getByText('Dashboard');
        expect(directToDashboard).toBeInTheDocument();;
    })
}