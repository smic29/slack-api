import { getByLabelText, getByPlaceholderText, getByText, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import LoginPage from './Components/Landing Page/LoginPage';
import DataProvider from './Context/DataProvider';

test('Page loads to Landing Page', () => {
  render(<App />);
  const logInScreen = screen.getByText(/username/i);
  expect(logInScreen).toBeInTheDocument();
});

global.alert = jest.fn();
test('User is able to log in', () => {
  render(<App />)
  act(() => {
      const userNameInput = screen.getByPlaceholderText(/username/i);
      userEvent.type(userNameInput, 'Spicy');

      const passwordInput = screen.getByPlaceholderText('Enter password');
      userEvent.type(passwordInput, 'mikpot');

      const loginButton = screen.getByTestId('loginButton');
      userEvent.click(loginButton);
      
      expect(global.alert).toHaveBeenCalledWith('Welcome, Spicy!');
  })
})
