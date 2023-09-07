# tinyapp - a URL tinying web app
*tiny url clone*

**tinyapp** is a simple URL shortening web application built with Express.js and EJS templating. It allows users to create short aliases for long URLs, making them easier to share and manage.

## Final Product
!["URLs page"](https://github.com/m3c-ode/tinyapp/blob/main/docs/urls-page.png)
!["Create new URL page"](https://github.com/m3c-ode/tinyapp/blob/main/docs/urls-create.png)
!["Edit URL page"](https://github.com/m3c-ode/tinyapp/blob/main/docs/urls-edit1.png)

## Features

- User Registration and Login
- Session-Based Authentication
- URL Shortening and Management for Users
- User-Friendly (Very simple...) Interface
- Route protection
- Tests for helper functions using Mocha and Chai

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
    ```
    npm install
    ```

3. Start the application: 
    ```
    npm start
    ```

4. Open your web browser and navigate to http://localhost:8080 to start acccessing TinyApp.

5. Accessorily, you can run some unit testing done (in `/test` folder)
    ```
    npm mocha
    ```


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
- Mocha and Chai for unit testing

## Project Structure
- express-server.js: The main server file containing application routes and configuration.
- views/: Directory containing EJS view templates.
- helper-functions.js: Utility functions for handling user data and URLs.
- README.md: This documentation file.

## Acknowledgments
Thanks to Lighthouse Labs for the inspiration and education.