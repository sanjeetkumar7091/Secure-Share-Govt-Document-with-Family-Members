# Secure & Share Govt Document with Family Members

## Project Overview
This project allows users to securely register, login, upload, update, delete, and share government documents with family members. It uses Firebase for authentication, storage, and database. The project is built with HTML, CSS, and JavaScript in a modular and maintainable fashion.

## Features
- User Registration with email and password
- OTP verification (simulated)
- User Login and Logout
- Upload government documents securely
- Update and Delete uploaded documents
- Share documents with family members by email
- User profile management
- Logging of all user actions for audit and debugging

## Technologies Used
- HTML, CSS, JavaScript
- Firebase Authentication, Firestore, Storage
- JavaScript logging utility

## Setup Instructions
1. Clone the repository:
   ```
   git clone <your-repo-url>
   ```
2. Navigate to the project directory:
   ```
   cd <project-directory>
   ```
3. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
4. Enable Email/Password Authentication in Firebase Authentication.
5. Enable Firestore Database and Firebase Storage.
6. Replace the Firebase configuration in `firebase-config.js` with your project credentials.
7. Open `index.html` in a browser to run the application.

## Workflow
- Users register with email and password.
- OTP verification is simulated for demo purposes.
- Users can login and manage their documents.
- Documents are uploaded to Firebase Storage and metadata saved in Firestore.
- Users can share documents with family members by specifying their email.
- All actions are logged with timestamps in the browser console.

## Deployment
- This is a static web app and can be deployed on any static hosting service like Firebase Hosting, GitHub Pages, Netlify, or Vercel.
- For Firebase Hosting:
  - Install Firebase CLI: `npm install -g firebase-tools`
  - Login: `firebase login`
  - Initialize hosting: `firebase init hosting`
  - Deploy: `firebase deploy`

## Optimization
- Use Firebase security rules to restrict access to documents.
- Optimize file uploads by limiting file size and type.
- Use lazy loading and caching strategies for better performance.
- Modular code structure for maintainability and scalability.

## Logging
- All user actions such as registration, login, document upload, delete, and share are logged with timestamps in the browser console using a custom logger.

## Code Standards
- The code is modular, maintainable, and portable.
- Follows best practices for JavaScript and Firebase usage.

## License
This project is open source and available under the MIT License.
