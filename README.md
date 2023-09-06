# tinyapp - a URL tinying web app
*tiny url clone*

TinyApp is a simple URL shortening web application built with Express.js and EJS templating. It allows users to create short aliases for long URLs, making them easier to share and manage.

## Features

- User Registration and Login
- Session-Based Authentication
- URL Shortening and Management for Users
- User-Friendly (Very simple...) Interface
- Route protection

## Getting started
To use this app, you will need:
- Node.js installed (version 12 or higher)
- npm (Node Package Manager) installed

  1. Clone this repository and move into the folder:
    ```bash
    git clone https://github.com/yourusername/tinyapp.git
    cd tinyapp
    ```

  2. Install dependencies:

      ```npm install```

  3. Start the application: 

      ```npm start```

  4. Open your web browser and navigate to http://localhost:8080 to start acccessing TinyApp.


## Using this app
A user can:
- Register a new account or log in if they already have one.
- Create and manage short URLs for their long links.
- Share the generated short URLs with others.

## Technologies Used
- Express.js: A minimal and flexible Node.js web application framework.
- EJS: A simple templating engine for generating HTML templates.
- bcryptjs: Library for hashing and comparing passwords securely.
- cookie-session: Middleware for handling session data using cookies.

## Project Structure
- express-server.js: The main server file containing application routes and configuration.
- views/: Directory containing EJS view templates.
- helper-functions.js: Utility functions for handling user data and URLs.
- README.md: This documentation file.

## Acknowledgments
Thanks to Lighthouse Labs for the inspiration and education.