
� InsightCric - Advanced Cricket 
Analytics Platform 
InsightCric is a revolutionary cricket analytics platform that merges machine learning, real-time 
data processing, and intuitive visualization to deliver actionable cricket intelligence. Built on a 
modern microservices architecture, it empowers fans, analysts, and teams with deep, data
driven insights. 


� Overview 
InsightCric bridges the gap between raw cricket statistics and actionable intelligence. The 
platform leverages: 
● Real-time Processing: Live match analytics and instant updates. 
● Advanced Machine Learning: Predictive modeling for outcomes and player trends. 
● Personalized Curation: News and updates tailored to user-defined interests. 
● Modern UI: A high-end Glassmorphic interface for an immersive experience. 

Key Mission 
"To deliver the most accurate, real-time cricket analytics platform in the world, 
combining the art of the game with the science of numbers." 


✨ Key Features 
1. Win Predictor 🎯 
● ML-Powered: Utilizes historical data to forecast match outcomes. 
● Dynamic Probabilities: Real-time updates as the match situation shifts. 
● Accuracy Tracking: Monitor the performance of prediction models over time. 
2. Player Performance Analyzer 📊 
● In-depth Stats: Comprehensive batting and bowling performance data. 
● Trend Analysis: Form tracking and strike rate metrics. 
● Visualizations: Career progression graphs and heatmaps. 
3. ML Match Preview & Review 🧠 
● Neural Networks: Pattern analysis for upcoming matches. 
● Matchup Insights: Specific player-vs-player historical trends. 
● Conditions Impact: Analysis of pitch reports and weather effects. 
4. Personalized News Curator 📰 
● Tailored Feed: Content based on favorite teams and players. 
● Real-time Alerts: Instant notifications for injuries and team changes. 
● IPL Select probability: predict IPL select players. 


� Tech Stack 

Frontend 
● Framework: React 19.2.5 
● Routing: React Router DOM 7.14.2 
● Visualization: Recharts 3.8.1 
● Icons: Lucide React 1.8.0 
● Build Tool: Vite 5.4.21 
● Styling: Modern CSS3 with Glassmorphic variables 

Backend (Microservices) 
● Runtime: Node.js & Express.js 5.2.1 
● Database: MongoDB via Mongoose 9.5.0 
● Proxy: HTTP Proxy Middleware 3.0.5 
● Utils: CORS 2.8.6, Dotenv 17.4.2 




� Installation & Setup 
1. Clone the Repository 
git clone [https://github.com/Ishad-Shyamal/R26-IT-096.git](https://github.com/Ishad
Shyamal/R26-IT-096.git) 
cd R26-IT-096

3. Frontend Setup 
cd client 
npm install

5. Backend Setup 
The server requires installing dependencies for the root and each individual service. 
cd ../server 
npm install 
cd gateway && npm install 
cd ../microservice-1 && npm install

# Repeat for microservice-2, 3, and 4 
4. Configuration 
Create a .env file in each microservice directory: 
MONGO_URI=mongodb://localhost:27017/insightcric 
PORT=500X # (5001, 5002, etc.)


️ #Running the Application 
Option 1: Using Concurrently (Recommended) 
From the server directory: 
npm run dev 
This starts the Gateway and all four microservices simultaneously. 

Option 2: Manual Start 
In separate terminals: 
● Gateway: cd server/gateway && npm run dev 
● Microservices: cd server/microservice-X && npm run dev 
● Frontend: cd client && npm run dev 


� UI/UX Features 
● Glassmorphic Design: Elegant frosted-glass cards with depth and blur. 
● Dark Mode Optimized: Default high-contrast dark theme for long analytics sessions. 
● Responsive Grid: Dashboard cards rearrange based on screen size. 
● Interactive Charts: Hover-sensitive data points powered by Recharts. 

� Future Roadmap 
● Auth 2.0: Full JWT and OAuth implementation. 
● Real-time Sockets: Live scoreboard integration via WebSockets. 
● Mobile App: React Native expansion. 
● Containerization: Docker and Kubernetes support. 
● Caching: Redis layer for frequently accessed stats. 
