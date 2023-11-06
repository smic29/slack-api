# Avion School Project - Slack API

## Made using:
- ReactJS

## Project Requirements
- [x] User is able to create his/her account with email and password
- [x] User is able to login his/her credentials
- [x] User is able to create new channel
- [x] User is able to add users on a channel
- [x] User is able to send message to other users (Direct Message)
- [x] User is able to send message to a channel
- [x] User is able to receive message to a channel
- [x] User is able to receive message from other users (Direct Message)
- [x] User is able to receive message from his/her channels

## Added Challenges
- [ ] Have tests for each component
- [ ] Themes for different users

## Personal Challenges
- [ ] Reactions for Chat
- [x] Messages rendered into system messages for adding users to a channel 
  - Messages are sent after adding a user to the channel.
  - Classes are added via a string indicator '..:"
- [ ] Custom alerts and notifications

## Component Tests (Work In Progress, Tests below no longer applies to current commit)
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

## Acknowledgements
Thanks to my Avion School Batch 31 batchmates for providing their keen insights and offering solutions to some of the coding problems I had:
  - [Francis]()
  - [Gars]()
  - <a href='https://github.com/imjohnescalante' target="_blank">Kervy</a>