# Book Management System

A React-based frontend application for managing books, authors, categories, publishers, and reviews. This project was built as part of the 7SENG014W Web Application Development coursework.

## Features

- **Book Management**: Add, view, edit, and delete books
- **Author Management**: Add, view, and delete authors
- **Category Management**: Add, view, and delete categories
- **Publisher Management**: Add, view, and delete publishers
- **Review Management**: Add, view, and delete reviews
- **User Authentication**: Login, register, and protected routes
- **Responsive Design**: Works on both mobile and desktop devices
- **API/LocalStorage Fallback**: Works with or without a backend server

## Technologies Used

- **React 18**: Modern JavaScript library for building user interfaces
- **Redux Toolkit**: State management for React applications
- **React Router 6**: Client-side routing for React applications
- **React Bootstrap**: UI components library
- **Axios**: HTTP client for making API requests
- **JWT Authentication**: Token-based authentication

## Dual-Mode Operation

This application can operate in two modes:

1. **API Mode**: Connects to a .NET Core backend API for data storage and retrieval
2. **LocalStorage Mode**: Uses browser's localStorage for data persistence when the backend is unavailable

You can toggle between these modes using the API Mode toggle in the application.

## Project Structure

```
book-management-frontend/
├── public/              # Public assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── redux/
│   │   ├── slices/      # Redux slices for each entity
│   │   └── Store.js     # Redux store configuration
│   ├── services/        # API services
│   ├── hooks/           # Custom React hooks
│   ├── App.js           # Main application component
│   └── index.js         # Application entry point
└── package.json         # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/book-management-frontend.git
   cd book-management-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env.development` file:
   ```
   REACT_APP_API_URL=http://localhost:5060/api
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

### Running with Backend

To run with the backend API:
1. Start the backend server (.NET Core API)
2. Make sure the API URL in `.env.development` matches your backend URL
3. In the application, make sure the API Mode toggle is set to "API Mode"

### Running without Backend

To run without the backend API:
1. In the application, set the API Mode toggle to "LocalStorage Mode"
2. The application will use the browser's localStorage for data persistence

## Deployment

This application is deployed to Netlify at: [your-netlify-url.netlify.app](https://your-netlify-url.netlify.app)

## Coursework Information

This project was developed as part of the 7SENG014W Web Application Development coursework at the University of Westminster.

## Author

Salma Dardour

## License

This project is available for academic purposes only.