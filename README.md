# Order API (NestJS) with DevOps Integration

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://th.bing.com/th/id/OIP.fXkgDlTxTKAqOTeLZOS_XgHaC9?pid=ImgDet&w=175&h=70&c=7&dpr=1.3" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
---

# Order API (NestJS) with DevOps Integration

This is a **NestJS-based RESTful API** for managing orders, product, category, and user. The API supports user authentication, role-based access control (admin/user), and internationalization (i18n) for DTOs. It also includes features like password reset via email, order status updates, and product/category management.

The project is integrated with **DevOps tools**:
- **Jenkins**: For continuous integration and deployment (CI/CD).
- **Docker**: For containerization and easy deployment.

---

## Features

- **User Authentication**: Register, login, and generate JWT tokens.
- **Password Reset**: Users can reset their password via email using Nodemailer.
- **Role-Based Access Control**:
  - **Admin**: Can create, update, and delete product, category, and orders. Can also update order status and send emails to user.
  - **User**: Can create orders and view their order history.
- **Internationalization (i18n)**: Supports Arabic and English for DTOs.
- **Exception Handling**: Custom exception filters and guards for better error handling.
- **Order Management**: Users can create orders, and admins can update order status and send emails to user.
- **Product & Category Management**: Admins can create, update, and delete product and category.
- **DevOps Integration**:
  - **Jenkins**: Automates fetching, building, and testing the application.
  - **Docker**: Containerizes the application for easy deployment.

---

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **MongoDB**: Database.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **Nodemailer**: For sending emails (e.g., password reset).
- **i18n**: For internationalization support.
- **Class-validator**: For DTO validation.
- **Multer**: For handling file uploads (e.g., product images).
- **Jenkins**: For CI/CD automation.
- **Docker**: For containerization.

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/diaaqassem/Order-API-NestJS-with-DevOps-Integration.git
cd Order-API-NestJS-with-DevOps-Integration
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
PORT=3000
MONGO_URI=mongodb_URI
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600
MAIL_HOST=smtp.ethereal.email
MAIL_USER=autumn.kohler90@ethereal.email
MAIL_PASSWORD=s5wZHwNG4gePu7cRqf
MAIL_PORT=587
```

---

## Running the Application

### Without Docker
```bash
pnpm run start:dev
```

### With Docker
1. **Build the Docker Image**:
   ```bash
   docker build -t order .
   ```

2. **Docker Container For DB**:
   ```bash
   docker run -d -p 9000:27017 mongodb mongodb/mongodb-atlas-local:latest
   ```
2. **Run the Docker Container**:
   ```bash
   docker run -d \
     -e PORT=3000 \
     -e MONGO_URI="your_mongodb_uri" \
     -e JWT_SECRET="your_jwt_secret" \
     -e JWT_EXPIRES_IN=3600 \
     -e MAIL_HOST='smtp.ethereal.email' \
     -e MAIL_USER='autumn.kohler90@ethereal.email' \
     -e MAIL_PASSWORD="s5wZHwNG4gePu7cRqf" \
     -e MAIL_PORT=587 \
     -p 3000:3000 \
     order
   ```
- **OR Run API From My Docker Hub**:
   ```bash
   docker run -d \
     -e PORT=3000 \
     -e MONGO_URI="your_mongodb_uri" \
     -e JWT_SECRET="your_jwt_secret" \
     -e JWT_EXPIRES_IN=3600 \
     -e MAIL_HOST='smtp.ethereal.email' \
     -e MAIL_USER='autumn.kohler90@ethereal.email' \
     -e MAIL_PASSWORD="s5wZHwNG4gePu7cRqf" \
     -e MAIL_PORT=587 \
     -p 3000:3000 \
     order-api \
     diaaqassem1/order-api:v1.4
   ```

---

## DevOps Integration

### Jenkins Setup

1. **Install Jenkins**:
   - Follow the official [Jenkins installation guide](https://www.jenkins.io/doc/book/installing/).

2. **a Jenkins Pipeline**:
   -  a `Jenkinsfile` in the root project
    
3. **Run the Pipeline**:
   - Open Jenkins, create a new pipeline job, and point it to the `Jenkinsfile`.

---

## API Endpoints

### User Routes
- **POST /user/register**: Register a new user.
- **POST /user/login**: Login and generate a JWT token.
- **GET /user**: Get all user (Admin only).
- **GET /user/me**: Get the current user's profile.
- **PATCH /user**: Update the current user's profile.
- **DELETE /user/:id**: Delete a user (Admin only).
- **POST /user/forgetPassword**: Send a password reset email.
- **POST /user/verifyResetCode**: Verify the password reset code.
- **POST /user/resetPassword**: Reset the user's password.

### Product Routes
- **POST /product**: Create a new product (Admin only).
- **GET /product/:id**: Get a product by ID.
- **GET /product**: Get all product.
- **PATCH /product/:id**: Update a product (Admin only).
- **DELETE /product/:id**: Delete a product (Admin only).

### Category Routes
- **POST /category**: Create a new category (Admin only).
- **GET /category/:id**: Get a category by ID.
- **GET /category**: Get all category.
- **PATCH /category/:id**: Update a category (Admin only).
- **DELETE /category/:id**: Delete a category (Admin only).

### Order Routes
- **POST /order**: Create a new order.
- **GET /order**: Get all orders (Admin only).
- **GET /order/:id**: Get an order by ID.
- **GET /order/user/:userId**: Get orders by user ID.
- **PATCH /order/status/:orderId/:status**: Update order status (Admin only).
- **DELETE /order/:id**: Delete an order.

---
