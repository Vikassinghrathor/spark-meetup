import express, { Request, Response, NextFunction } from 'express';
import { firestore } from 'firebase-admin';

// Initialize Firestore
const db = firestore();
const broadcastsCollection = db.collection('broadcasts');

// Initialize Router
const router = express.Router();

// Middleware for error handling
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Create a new broadcast
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { date, time, location, activity } = req.body;

    // Validate input
    if (!date || !time || !location || !activity) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newBroadcast = {
      date,
      time,
      location,
      activity,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await broadcastsCollection.add(newBroadcast);
    const createdBroadcast = await docRef.get();

    res.status(201).json({ id: docRef.id, ...createdBroadcast.data() });
  })
);

// Get all broadcasts
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const snapshot = await broadcastsCollection.orderBy('createdAt', 'desc').get();
    const broadcasts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(broadcasts);
  })
);

// Get a specific broadcast by ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const doc = await broadcastsCollection.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Broadcast not found.' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  })
);

// Update a broadcast by ID
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { date, time, location, activity } = req.body;

    // Validate input
    if (!date || !time || !location || !activity) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const docRef = broadcastsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Broadcast not found.' });
    }

    await docRef.update({
      date,
      time,
      location,
      activity,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    const updatedBroadcast = await docRef.get();
    res.status(200).json({ id: docRef.id, ...updatedBroadcast.data() });
  })
);

// Delete a broadcast by ID
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const docRef = broadcastsCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Broadcast not found.' });
    }

    await docRef.delete();
    res.status(200).json({ message: 'Broadcast deleted successfully.' });
  })
);

export default router;
```

---

### Explanation of the Code

1. **Router Initialization**:
   - The `express.Router()` is used to define routes for broadcasts.

2. **Firestore Integration**:
   - The `firebase-admin` Firestore instance is used to interact with the database.
   - A `broadcasts` collection is used to store broadcast data.

3. **CRUD Operations**:
   - **Create**: Adds a new broadcast to the Firestore collection.
   - **Read**:
     - Fetches all broadcasts, ordered by creation time.
     - Fetches a specific broadcast by its ID.
   - **Update**: Updates an existing broadcast by its ID.
   - **Delete**: Deletes a broadcast by its ID.

4. **Error Handling**:
   - The `asyncHandler` middleware is used to catch and handle errors in asynchronous routes.

5. **Validation**:
   - Input validation ensures that all required fields are provided.

6. **Response Structure**:
   - Responses include appropriate HTTP status codes and JSON data.

---

### Final Notes

- This file is fully functional and adheres to the project's conventions.
- Ensure that the Firestore database is properly initialized in the project.
- Add this router to the main Express app in `src/index.ts`:
  ```typescript
  import broadcastRoutes from './routes/broadcast';
  app.use('/api/broadcasts', broadcastRoutes);
  