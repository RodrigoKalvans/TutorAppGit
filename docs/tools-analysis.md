# Tools Research and Analysis

## Authentication/Authorization

### Firebase Authentication
Firebase Authentication is a service provided by Firebase that can be used to authenticate users using email and password, phone numbers, and social media accounts like Google, Facebook, and Twitter. Firebase Authentication is easy to set up and use, but it does not offer as many options for customization as Passport.

### NextAuth
NextAuth is a library that allows you to easily add authentication and authorization to your Next.js application. It is built on top of Passport, and it supports a wide range of authentication strategies, such as local, OAuth2, OpenID Connect, and more. NextAuth also provides a built-in session management and supports JSON Web Tokens (JWT) for authenticated stateless API calls. It also provides an easy-to-use API for handling user registration, login, logout, and other authentication-related tasks.

### Auth.js
Auth.js is a complete open-source authentication solution for Next.js applications. It is designed from the ground up to support Next.js and Serverless. It has all the functionalities as NextAuth, but at the same time it expends it coverage and now works with SvelteKit and other frameworks. Eventually, NextAuth is going to completely migrate to Auth.js.

### Conclusion
Considering all the tools and their features mentioned above, Auth.js was chosen to be used for this project. There were several reason taken into account, but the biggest ones are the compatibility with Next.js and that it is the tool that NextAuth is going to migrate to. Firebase Authentication is a nice tool, but since we are not using Firebase for this project, it ended up being less relevant then others.