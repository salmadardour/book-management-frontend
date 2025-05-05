# Book Management Frontend

This is a React-based frontend application for managing books, created for the 7SENG014W Web Application Development coursework.

## Live Demo

- GitHub Pages: [https://salmadardour.github.io/book-management-frontend](https://salmadardour.github.io/book-management-frontend)
- Netlify: [Your-Netlify-URL-Here](Your-Netlify-URL-Here)

## Features

- User Authentication (Login/Register)
- Book Management (CRUD operations)
- Responsive design for mobile and desktop
- State management with Redux
- Client-side routing with React Router

## Technologies Used

- React 18
- React Router 6
- Redux Toolkit
- React Bootstrap
- Axios for API communication
- Jest for testing

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/salmadardour/book-management-frontend.git
   cd book-management-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run deploy` - Deploys to GitHub Pages
- `npm run deploy:netlify` - Deploys to Netlify

## Project Structure

```
book-management-frontend/
├── public/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── redux/             # Redux store, slices, and actions
│   ├── services/          # API service functions
│   ├── utils/             # Utility functions
│   ├── App.js             # Main application component
│   ├── index.js           # Entry point
│   └── ...
└── ...
```

## API Integration

This frontend application consumes a .NET Core Backend API. The API endpoints used include:

- Authentication: Register and login
- Books: CRUD operations for book management

## Testing

Run the test suite with:

```
npm test
```

## Deployment

### GitHub Pages

```
npm run deploy
```

### Netlify

```
npm run deploy:netlify
```

Or connect your GitHub repository to Netlify for automatic deployment.

## Author

- Salma Dardour

## License

This project is part of a university coursework and is not licensed for public use.