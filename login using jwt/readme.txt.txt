Project Overview
User Registration and Reminder System

Welcome to the User Registration and Reminder System project! This application facilitates user registration, login using email and OTP, and implements a weekly reminder system. Below is an overview of key functionalities:
User Registration

The registration process involves collecting user information such as username, email, and password. Additionally, an OTP (One-Time Password) is generated and sent to the user's email for validation. The system ensures data integrity by utilizing MongoDB for data storage.
Login Mechanism

To enhance security, the login process requires users to provide their email and the OTP sent during registration. JSON Web Tokens (JWT) are employed to manage user sessions securely.
Email Notification with Nodemailer

Nodemailer, a powerful email sending library, is integrated into the system to dispatch OTP emails during registration. For security reasons, subscription-related emails are not sent. Instead, all emails are stored in Nodemailer, ensuring a streamlined and efficient email management process.
Weekly Reminders

A weekly reminder feature is incorporated into the system, reminding registered users of important events or updates. The reminders are stored both in Nodemailer and MongoDB for effective tracking and management.
Database Schemas

Two MongoDB database schemas, namely userSchema and otpSchema, are implemented to efficiently store user information and OTP data. These schemas ensure structured data storage and retrieval for seamless application functionality.
Project Components

    User Registration:
        Collects user details (username, email, password).
        Generates OTP for email validation.
        Utilizes MongoDB for secure data storage.

    Login Mechanism:
        Requires email and OTP for user authentication.
        Employs JWT tokens for secure session management.

    Email Notification:
        Uses Nodemailer for sending OTP emails.
        Centralizes email storage in Nodemailer.

    Weekly Reminders:
        Sends reminders to registered users every week.
        Efficiently manages reminders in Nodemailer and MongoDB.

    Database Schemas:
        userSchema for storing user information.
        otpSchema for storing OTP data.
		

Endpoints

    User Registration:
        Endpoint: POST /api/user/register
        Controller: controllers.userregister
        Body:

        json

    {
      "fname": "John",
      "email": "john@example.com",
      "password": "securePassword"
    }

    Expected Response:
        200 OK if registration is successful.
        400 Bad Request if there's an issue (e.g., missing parameters or user already exists).

Send OTP:

    Endpoint: POST /api/user/sendotp
    Controller: controllers.userOtpSend
    Body:

    json

    {
      "email": "john@example.com"
    }

    Expected Response:
        200 OK if OTP is sent successfully.
        400 Bad Request if there's an issue (e.g., invalid email or user doesn't exist).

User Login:

    Endpoint: POST /api/user/login
    Controller: controllers.userLogin
    Body:

    json

    {
      "email": "john@example.com",
      "otp": "123456"
    }

    Expected Response:
        200 OK if login is successful.
        400 Bad Request if there's an issue (e.g., invalid email, OTP mismatch, or user not found).

Send Weekly Reminder:

    Endpoint: POST /api/send-reminder
    Controller: controllers.sendWeeklyReminder
    Body:

    json

{}  // No body required for reminder endpoint
