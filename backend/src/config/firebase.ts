import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Ensure required environment variables are present
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error(
    'Missing Firebase configuration in environment variables. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in the .env file.'
  );
}

// Initialize Firebase Admin SDK
const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\\n/g, '\\n'), // Handle newline characters in private key
  }),
});

// Export Firestore and Firebase Admin instances
export const firestore = admin.firestore();
export const auth = admin.auth();
export default firebaseAdmin;
```

---

### Explanation of the Code

1. **Environment Variables**:
   - The `dotenv` package is used to load environment variables from a `.env` file.
   - The required Firebase credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) are loaded from the environment.

2. **Validation**:
   - The code checks if all required environment variables are present. If any are missing, an error is thrown to prevent the application from starting.

3. **Firebase Initialization**:
   - The `admin.initializeApp` method initializes the Firebase Admin SDK using the credentials provided in the environment variables.
   - The `privateKey` is processed to handle newline characters (`\\n`) correctly, as they are often escaped in environment variables.

4. **Exports**:
   - The `firestore` instance is exported for database operations.
   - The `auth` instance is exported for authentication operations.
   - The default export is the initialized Firebase Admin instance, which can be used for other Firebase services if needed.

5. **Security**:
   - The Firebase credentials are securely stored in environment variables and not hardcoded in the source code.

---

### Final Notes

- Ensure that the `.env` file contains the following variables:
  ```
  FIREBASE_PROJECT_ID=your-firebase-project-id
  FIREBASE_CLIENT_EMAIL=your-firebase-client-email
  FIREBASE_PRIVATE_KEY=your-firebase-private-key
  