# Frontend Package - React Tutorials CRUD App

This is the frontend package of the PERN Stack monorepo, a React application for managing tutorials.

## Features

- Create, Read, Update, and Delete tutorials
- Filter tutorials by title
- View all or only published tutorials
- Categorize tutorials with dropdown selection

## Technology Stack

- React.js with Hooks
- React Router for navigation
- Axios for API communication
- Bootstrap and PrimeReact for UI components
- Vite as build tool

## Development

### Setup

```
npm install
```

### Running in Development Mode

```
npm start
```

The application will run on http://localhost:80 by default.

### Environment Configuration

The `.env.local` file contains configuration for:

```
PORT=80
VITE_APP_API_URL='http://localhost:8080/api'
```

Modify these values if you need to change the port or API URL.

## Project Structure

- `src/components/`: React components for different views
- `src/services/`: Service classes that handle API communication
- `src/http-common.js`: Axios configuration for API requests 