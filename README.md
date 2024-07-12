# taskManagerApp

## 📖 Table of Contents 📖

1. [To-do's](##To-do's)
2. [Software design](##software-design)
3. [Getting started](##getting-started)

## To-do's

1. Create a new React Native Application
   - [x] Create a new React Native project
   - [x] Use functional components and hooks
2. Firebase Integration
   - [x] Use Firestore for storing task and user data
   - [x] Use Firebase Authentication to allow users to sign up, log in, and log out
3. Task Manager Features
   - [x] Task Management: Implement CRUD operations (Create, Read, Update, Delete)
         for tasks using Firestore
   - [x] Task List: Display a list of tasks fetched from Firestore
4. Leaderboard Feature
   - [x] Track the number of tasks each user completes
   - [x] Implement a leaderboard that displays the top users who have completed the most tasks
   - [x] Allow the leaderboard to be filtered by time periods (daily, weekly, monthly)
5. Bonous
   - [ ] Include notifications for task reminders using Firebase Cloud Messaging.
   - [x] Write unit tests for critical parts of the application
   - [ ] Add the ability for users to upload and display images for each task using Firebase Storage
   - [x] Implement form validation for the authentication and task forms
   - [x] Use TypeScript for type safety

## Software design

![software](./assets/documentation/software.png)

## Getting Started

### Prerequistes

Update .env.example and modify file name into .env

```bash
API_KEY=YOUR_API_KEY
AUTH_DOMAIN=YOUR_AUTH_DOMAIN
PROJECT_ID=YOUR_PROJECT_ID
STORAGE_BUCKET=YOUR_STORAGE_BUCKET
MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
APP_ID=YOUR_APP_ID
```

Go to project root

```bash
yarn install
```

### For iOS

Install depenencies for ios

```bash
cd ios
pod install
cd ..
```

Then go to Xcode `cmd + b` to build the app with the following step to run (install) the app on to your simulator.
Once the simulator is on, you may stop the run.

```bash
yarn start # Then chose i
```

If the App did not opend automatically, click the logo to manually open it.

### For Android

```bash
yarn start # Then chose a
```

### Test

Run unit test with jest

```bash
yarn test
```
