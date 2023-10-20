# Avion School Project - Slack API

## Made using:
- React

## Project Requirements
- [x] User is able to create his/her account with email and password
- [x] User is able to login his/her credentials
- [x] User is able to create new channel
- [x] User is able to add users on a channel
- [ ] User is able to send message to otther user (Direct Message)
- [x] User is able to send message to a channel
- [x] User is able to receive message to a channel
- [x] User is able to receive message from other user (Direct Message)
- [x] User is able to receive message from his/her channels

## Added Challenges
- [ ] Have tests for each component
- [ ] Themes for different users

## Personal Challenges
- [ ] Settings for which name to use (firstname, nickname, or username).
- [ ] Reactions for Chat
- [x] Added Users to channel text 
  - Messages are sent after adding a user to the channel.
  - Classes are added via a string indicator '..:"
- [ ] Custom alerts and notifications

## Project API
- [API]()

## Component Tests
1. App.js test on landing page
```jsx
test('Page loads to Landing Page', () => {
  render(<App />);
  const logInScreen = screen.getByText(/username/i);
  expect(logInScreen).toBeInTheDocument();
});
```
2. Login Successful
```jsx
global.alert = jest.fn();
test('User is able to log in', () => {
  render(<App />)
  act(() => {
      const userNameInput = screen.getByPlaceholderText(/username/i);
      userEvent.type(userNameInput, 'USERNAME');

      const passwordInput = screen.getByPlaceholderText('Enter password');
      userEvent.type(passwordInput, 'PASSWORD');

      const loginButton = screen.getByTestId('loginButton');
      userEvent.click(loginButton);
      
      expect(global.alert).toHaveBeenCalledWith('Welcome, Spicy!');
  })
})
```
- This test would need to be updated once I remove alerts and switch to custom notifications.