**VoteForge**

VoteForge is a secure and interactive online voting platform built with **React, Node.js, Express, and MongoDB**. The platform allows users to participate in elections, polls, and surveys in real-time while ensuring data privacy and integrity.


**Features**

User Authentication: Secure login and registration system using JWT.

Voting Dashboard: Interactive dashboard to view ongoing and upcoming polls.

Voting Interface: Easy-to-use interface to cast votes.

Admin Panel: Create, manage, and monitor voting events.

Real-time Updates: Instant vote count updates using WebSocket.

Data Security: Measures in place to protect user data and results.


**Technologies Used**

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JSON Web Tokens (JWT)

Real-time Communication: WebSocket

UI Framework: Material-UI

**Getting Started**

To run VoteForge locally:

1.Clone the repository 
git clone https://github.com/SaniyaParveenCode/VoteForge.git
cd VoteForge

2.Install dependencies
cd server
npm install
cd ../client
npm install

3.Configure environment variables
Create a .env file in the server directory and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4.Start the server
cd server
npm start

5.Start the client
cd ../client
npm start

6.Open your browser
Navigate to http://localhost:3000 to access the application.


**Author**

Developed by Sheikh Saniya Parveen


**License**

This project is for educational and portfolio purposes.
