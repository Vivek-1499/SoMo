# SoMo - Social Media MERN Application

SoMo is a full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to register, create posts with images and captions, like, comment, bookmark, follow/unfollow users, and chat in real-time.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (JWT-based)
- Profile management (bio, avatar, followers, following)
- Create, edit, and delete posts with image upload and cropping
- Like, comment, and bookmark posts
- Reply to comments
- Real-time messaging (chat)
- Responsive UI with dark mode
- Suggested users and notifications
- Modern UI with Tailwind CSS

---

## Tech Stack

- **Frontend:** React, Redux, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT
- **Image Upload:** Multer, Cropper
- **Real-time:** Socket.io
- **Other:** Sonner (toasts), Lucide-react (icons), react-easy-crop

---

## Project Structure

```
SoMo/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── .env
│   └── index.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   ├── redux/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── index.html
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

---

### Backend Setup

1. **Navigate to backend:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values (see [Environment Variables](#environment-variables)).

4. **Start the backend server:**
   ```sh
   npm run dev
   ```
   The backend runs on [http://localhost:5000](http://localhost:5000) by default.

---

### Frontend Setup

1. **Navigate to frontend:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and set your backend API URL.

4. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

---

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

---

## Scripts

### Backend

- `npm run dev` — Start backend in development mode (nodemon)
- `npm start` — Start backend in production

### Frontend

- `npm run dev` — Start frontend in development mode (Vite)
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

---

## API Overview

- **Auth:** `/api/user/register`, `/api/user/login`, `/api/user/profile`
- **Posts:** `/api/post/addpost`, `/api/post/all`, `/api/post/:id/like`, `/api/post/:id/comment`, etc.
- **Comments:** `/api/post/:id/comment`, `/api/post/comment/:id/reply`
- **Bookmarks:** `/api/post/:id/bookmark`
- **Messaging:** `/api/message/`, `/api/conversation/`
- **Users:** `/api/user/follow/:id`, `/api/user/unfollow/:id`, `/api/user/suggested`

See the `routes/` and `controllers/` folders for full details.

---

## Folder Structure

See [Project Structure](#project-structure) above for a high-level overview.

- **backend/controllers/** — Express route handlers for posts, users, messages, etc.
- **backend/models/** — Mongoose models (User, Post, Comment, Conversation, etc.)
- **backend/routes/** — Express routers for API endpoints
- **backend/middlewares/** — Auth, file upload, etc.
- **backend/socket/** — Socket.io setup for real-time messaging
- **frontend/src/components/** — React components (Post, Profile, CreatePost, Messages, etc.)
- **frontend/src/redux/** — Redux slices and store
- **frontend/src/lib/** — Utility functions
- **frontend/src/hooks/** — Custom React hooks

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---
# SoMo - Social Media MERN Application

SoMo is a full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to register, create posts with images and captions, like, comment, bookmark, follow/unfollow users, and chat in real-time.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (JWT-based)
- Profile management (bio, avatar, followers, following)
- Create, edit, and delete posts with image upload and cropping
- Like, comment, and bookmark posts
- Reply to comments
- Real-time messaging (chat)
- Responsive UI with dark mode
- Suggested users and notifications
- Modern UI with Tailwind CSS

---

## Tech Stack

- **Frontend:** React, Redux, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT
- **Image Upload:** Multer, Cropper
- **Real-time:** Socket.io
- **Other:** Sonner (toasts), Lucide-react (icons), react-easy-crop

---

## Project Structure

```
SoMo/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── .env
│   └── index.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   ├── redux/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── index.html
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

---

### Backend Setup

1. **Navigate to backend:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your values (see [Environment Variables](#environment-variables)).

4. **Start the backend server:**
   ```sh
   npm run dev
   ```
   The backend runs on [http://localhost:5000](http://localhost:5000) by default.

---

### Frontend Setup

1. **Navigate to frontend:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and set your backend API URL.

4. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

---

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

---

## Scripts

### Backend

- `npm run dev` — Start backend in development mode (nodemon)
- `npm start` — Start backend in production

### Frontend

- `npm run dev` — Start frontend in development mode (Vite)
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

---

## API Overview

- **Auth:** `/api/user/register`, `/api/user/login`, `/api/user/profile`
- **Posts:** `/api/post/addpost`, `/api/post/all`, `/api/post/:id/like`, `/api/post/:id/comment`, etc.
- **Comments:** `/api/post/:id/comment`, `/api/post/comment/:id/reply`
- **Bookmarks:** `/api/post/:id/bookmark`
- **Messaging:** `/api/message/`, `/api/conversation/`
- **Users:** `/api/user/follow/:id`, `/api/user/unfollow/:id`, `/api/user/suggested`

See the `routes/` and `controllers/` folders for full details.

---

## Folder Structure

See [Project Structure](#project-structure) above for a high-level overview.

- **backend/controllers/** — Express route handlers for posts, users, messages, etc.
- **backend/models/** — Mongoose models (User, Post, Comment, Conversation, etc.)
- **backend/routes/** — Express routers for API endpoints
- **backend/middlewares/** — Auth, file upload, etc.
- **backend/socket/** — Socket.io setup for real-time messaging
- **frontend/src/components/** — React components (Post, Profile, CreatePost, Messages, etc.)
- **frontend/src/redux/** — Redux slices and store
- **frontend/src/lib/** — Utility functions
- **frontend/src/hooks/** — Custom React hooks

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.ski/)

---

## Screenshots

_Add screenshots here if desired._

---

## Contact

For questions or support, please open an issue or
## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.ski/)

---

## Screenshots

_Add screenshots here if desired._

---

## Contact

For questions or support, please open an issue or
