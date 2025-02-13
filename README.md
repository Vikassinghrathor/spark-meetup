# Spark Meetup

Spark Meetup is a platform that enables users to create and join spontaneous meetups in real-time. Users can broadcast their availability for a specific time, location, and activity, allowing others to join them. The platform includes a modern UI and a robust backend to manage broadcasts, join requests, and notifications.

---

## Features

- **Broadcast Creation**: Users can create broadcasts with details like date, time, location, and activity.
- **Join Requests**: Users can send join requests to broadcasts and broadcasters can accept or reject them.
- **Notifications**: Email and push notifications for broadcasters when a join request is received.
- **Real-Time Updates**: (Bonus) Real-time updates for broadcasts and requests using WebSockets or Firebase.
- **Social Authentication**: (Bonus) Login and signup using Google accounts via Firebase Authentication.
- **Analytics**: Store and manage past broadcasts and analyze user engagement.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: React Hooks
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Notifications**: [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging) and [Nodemailer](https://nodemailer.com/)

### DevOps
- **CI/CD**: GitHub Actions
- **Hosting**: [Vercel](https://vercel.com/) (Frontend), Custom Backend Deployment
- **Testing**: Jest, React Testing Library

---

## Project Structure

```
spark-meetup/
├── frontend/               # Frontend workspace
│   ├── src/
│   │   ├── app/            # Next.js pages and layouts
│   │   ├── components/     # Reusable React components
│   │   ├── __tests__/      # Unit and integration tests
│   ├── package.json        # Frontend dependencies and scripts
├── backend/                # Backend workspace
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Notification and utility services
│   │   ├── config/         # Firebase configuration
│   │   ├── __tests__/      # API endpoint tests
│   ├── package.json        # Backend dependencies and scripts
├── .github/workflows/      # CI/CD pipeline configuration
├── package.json            # Monorepo configuration
├── README.md               # Project documentation
```

---

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- Firebase Project with Firestore and Authentication enabled
- Email service credentials for notifications (e.g., SMTP)

### Environment Variables

Create a `.env` file in both `frontend` and `backend` directories with the following variables:

#### Backend `.env`
```
PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

#### Frontend `.env`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vikassinghrathor/spark-meetup.git
   cd spark-meetup
   ```

2. Install dependencies for the monorepo:
   ```bash
   npm install
   ```

3. Install dependencies for each workspace:
   ```bash
   npm --workspace frontend install
   npm --workspace backend install
   ```

### Running the Project

#### Development Mode
Start both frontend and backend servers:
```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

#### Production Mode
1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production servers:
   ```bash
   npm --workspace frontend run start
   npm --workspace backend run start
   ```

---

## Testing

### Frontend Tests
Run unit and integration tests for the frontend:
```bash
npm --workspace frontend run test
```

### Backend Tests
Run API endpoint tests for the backend:
```bash
npm --workspace backend run test
```

---

## CI/CD Pipeline

The project includes a GitHub Actions workflow for CI/CD:
- **Linting**: Runs ESLint for both frontend and backend.
- **Testing**: Executes Jest tests for both workspaces.
- **Build**: Builds the frontend and backend.
- **Deployment**:
  - Frontend: Automatically deployed to Vercel.
  - Backend: Placeholder for custom deployment commands.

---

## API Documentation

The backend API is documented using OpenAPI/Swagger. To view the API documentation:
1. Start the backend server.
2. Visit the Swagger UI endpoint (e.g., `/api-docs`).

---

## Deployment

### Frontend
The frontend is deployed to Vercel. Configure the `VERCEL_TOKEN` secret in the GitHub repository for automatic deployment.

### Backend
Replace the placeholder deployment commands in `.github/workflows/ci-cd.yml` with your backend deployment steps (e.g., SSH, AWS, etc.).

---

## Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400?text=Home+Page)

### Broadcast Form
![Broadcast Form](https://via.placeholder.com/800x400?text=Broadcast+Form)

### Join Requests
![Join Requests](https://via.placeholder.com/800x400?text=Join+Requests)

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support, please open an issue on [GitHub](https://github.com/Vikassinghrathor/spark-meetup/issues).
