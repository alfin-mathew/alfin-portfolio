# Personal Portfolio Website

A dynamic and responsive personal portfolio website developed using
HTML, CSS, JavaScript, Node.js, Express.js and MongoDB.

The website allows a user to create and manage a personal profile,
showcase educational details, skills, interests and projects, and
receive feedback from visitors.

## Features

- Welcome page with portfolio navigation.
- Personal profile entry form.
- Dynamic About page displaying saved profile information.
- MongoDB database integration.
- Feedback submission form.
- Display of previously submitted feedback.
- Contact API for storing visitor messages.
- Responsive design for different screen sizes.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

## Project Structure

```text
alfin-portfolio/
│
├── models/
│   ├── profile.js
│   ├── feedback.js
│   └── contact.js
│
├── public/
│   ├── index.html
│   ├── home.html
│   ├── profile.js
│   ├── about.html
│   ├── about.js
│   ├── feedback.html
│   ├── feedback.js
│   └── style.css
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js