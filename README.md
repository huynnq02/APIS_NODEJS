# APIS_NODEJS
# AUTHOR
- Nguyen The Dan - 19521312  
- Nguyen Ngoc Quang Huy - 20521401  
# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [chalk](https://www.npmjs.com/package/chalk) - For terminal styling log
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - For hashing user's password
- [moment](https://www.npmjs.com/package/moment) - A date library for parsing, validating, manipulating, and formatting dates.
- [multer](https://www.npmjs.com/package/multer) - For handling multipart/form-data, which is primarily used for uploading files.
- [sharp](https://www.npmjs.com/package/sharp) - For resizing image.
- [validator](https://www.npmjs.com/package/validator) - A library of string validators and sanitizers.

## Application Structure

- `index.js` - The entry point of this app. This file takes the app instance from `app.js` and starts it.
- `app.js` - This file defines our express server. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `middleware/` - This folder contains app's middleware such as authentication.
- `utils/` - This folder contains utils file for this app, such as `constant.js`, `enum.js`, `utils.js` which contain some common function. `logger.js` for logging error or message for debugging.
- `test/` - This folder contains unit test files for this app.

## Naming convention

- file: `file_name.js` or `file.js`.
- router: <noun>Router with camelCase. Example: `userRouter`
- folder: same as file.
- function: start with verb, written in camelCase. Example: `doSomething`
- ##### api route: always be noun. Example:

1. POST /user or PUT /user:/id to create a new user.
2. GET /user to retrieve a list of users.
3. GET /user/:id to retrieve a user.
4. PATCH /user/:id to modify an existing user record.
5. DELETE /user/:id to remove a user.

## Write Documentation (Swagger)

- Watch [this video](https://www.youtube.com/watch?v=S8kmHtQeflo) for tutorial.
- For more details read [swagger documentation](https://swagger.io/docs/specification/basic-structure/).
- There's an example docs in `/routers/example.js`
