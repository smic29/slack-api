# Avion School Project - Slack API

## Made using:
- ReactJS
- Bootstrap 5

## Continued Development
This project was presented on November 14th, 2023. For some added personal changes, I chose to continue with development and add features that I think would make the project better.

- [x] Integrated Bootstrap 5 [Completed 23/11/23]
  - I spent time trying to learn bootstrap just for some added knowledge in styling. I found it really interesting and I think I'll continue using it moving forward. Using it alongside React was somewhat of a challenge, but I think continued use will let me get a hang of it.
- [ ] Organize code and file structure
- [ ] Some more features
- [ ] Find a way to have live site be able to do axios requests.

## Project Requirements (Completed 14/11/23)
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
- [x] Have Unit testing for components
- [ ] Themes for different users

## Personal Challenges
- [ ] Reactions for Chat
- [x] Messages rendered into system messages for adding users to a channel 
  - Messages are sent after adding a user to the channel.
  - Classes are added via a string indicator '..:"
- [ ] Custom alerts and notifications

## Component Tests
### App.js Test Suite
- The page defaults to Login
```jsx
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
```
- Create Button is disabled if inputs are empty
```jsx
test('create button is disabled if inputs are empty', () => {
  render(<App />);
  const createAccount = screen.getByText(/sign up here/i);
  
  act(() => {
    userEvent.click(createAccount);
  })

  const createButton = screen.getByTestId('createButton');
  expect(createButton).toHaveClass('disabled');
})
```
- Back button in create user form returns the user to the login page
```jsx
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
```
- User is able to log in using test account
```jsx
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
```
- User is able to log out
```jsx
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
```
I turned the login function from the previous test into a function that could be called by the final test suite test since I would be using the login process for other test suites. I saved it in `TestUtils.js` and imported that file in `App.test.js`.

## Acknowledgements
Thanks to my Avion School Batch 31 batchmates for providing their keen insights and offering solutions to some of the coding problems I had:
  - <a href='https://github.com/chrysspegenia' target="_blank">Francis</a>
  - <a href='https://github.com/Oak-Oak' target="_blank">Gars</a>
  - <a href='https://github.com/p3rc1us' target="_blank">Kervy</a>