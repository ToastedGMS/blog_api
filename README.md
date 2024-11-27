Blog API with Admin Frontend
This is a project designed to explore the creation of a RESTful API for a blogging platform, alongside a basic "admin" front-end for managing blog posts and comments.

Features
Backend (API)
The backend is built with Express and uses Prisma as the ORM for database management. It includes:

Blog Posts:
CRUD operations for posts.
Posts can be marked as published or unpublished.

Comments:
CRUD operations for comments.
Comments can include user details such as username or email.

Authentication:
JSON Web Tokens (JWT) for secure access to protected routes.
Admin-specific routes for managing posts and comments.

Frontend (Admin Interface)
A basic admin front-end built with React, which allows:

Viewing all blog posts with an indicator for published/unpublished status.
Creating new posts.
Editing and deleting posts.
Managing comments (editing or deleting them).

Bugs & Limitations
There are a few bugs that have not been resolved.
The "reader-facing" front-end has not been implemented yet.
The admin front-end is functional but minimal, and could benefit from styling and usability improvements.

Future Improvements
Implement the "reader-facing" front-end.
Fix existing bugs in the admin front-end.
The api-database interactions could be improved.
The database itself could use some refactoring to reflect updated project needs.
Enhance authentication and authorization features.
Improve the UI/UX of both front-ends.
