export interface Player {
  player_name: string;
  performance_score: number;
  marker_score: number;
  geopolitical: number; // 0=Sheffield Shield/AUS, 1=Ranji Trophy/IND, 2=PSL/PAK, 3=Afghanistan, 4=LPL/SL & others
  was_selected: number; // 0 or 1
  team: string;
  role: string;
  tournament: string;
  news: string[];
  awards: string[];
}

const rawData: [string, number, number, number, number][] = [
  ["Abdul Malik", 5.11, 2.67, 3, 1],
  ["Shahidullah Kamal", 6.05, 3.33, 3, 1],
  ["Bahir Shah", 7.61, 4.0, 3, 1],
  ["Munir Ahmad Kakar", 4.27, 2.4, 3, 1],
  ["Darwish Rasooli", 9.88, 4.67, 3, 1],
  ["Zubaid Akbari", 0.13, 3.33, 3, 0],
  ["Rohullah Arab", 0.11, 2.67, 3, 0],
  ["Khatir Stanikzai", 0.23, 2.93, 3, 0],
  ["Faridoon Dawoodzai", 0.19, 2.4, 3, 0],
  ["Wafiullah Tarakhil", 3.3, 2.0, 3, 1],
  ["Mohammad Ishaq", 5.22, 3.33, 3, 1],
  ["Azizullah Mia Khil", 3.95, 2.4, 3, 1],
  ["Faisal Khan Ahmadzai", 0.09, 2.67, 3, 0],
  ["Nazifullah Amiri", 0.18, 2.93, 3, 0],
  ["Wahidullah Zadran", 0.18, 1.6, 3, 0],
  ["Henry Hunt", 4.27, 1.33, 0, 1],
  ["Liam Scott", 0.35, 1.33, 0, 0],
  ["Nathan McAndrew", 0.5, 1.33, 0, 0],
  ["Jordan Buckingham", 0.35, 1.2, 0, 0],
  ["Henry Thornton", 0.26, 1.07, 0, 0],
  ["Jake Lehmann", 3.68, 1.33, 0, 1],
  ["Sam Elliott", 0.42, 1.33, 0, 0],
  ["Fergus O'Neill", 0.47, 1.33, 0, 0],
  ["Corey Rocchiccioli", 0.49, 1.33, 0, 0],
  ["Liam Hatcher", 0.54, 1.33, 0, 0],
  ["Cameron Gannon", 0.54, 1.33, 0, 0],
  ["Jason Sangha", 3.69, 1.33, 0, 1],
  ["Ben Kellaway", 0.12, 1.47, 0, 0],
  ["Mackenzie Harvey", 2.9, 1.33, 0, 1],
  ["Campbell Kellaway", 3.01, 1.33, 0, 1],
  ["Harry Nielsen", 2.62, 1.2, 0, 1],
  ["Matthew Gilkes", 2.79, 1.33, 0, 1],
  ["Ben Manenti", 0.28, 1.33, 0, 0],
  ["Anamul Haque Enam", 12.04, 7.33, 1, 1],
  ["Zakir Hasan", 11.14, 6.67, 1, 1],
  ["Mahidul Islam Ankon", 9.33, 6.0, 1, 1],
  ["Pritom Kumar", 8.72, 5.6, 1, 1],
  ["Jishan Alam", 8.06, 4.67, 1, 1],
  ["Saif Hassan", 15.31, 8.67, 1, 1],
  ["Tanvir Islam", 0.69, 7.33, 1, 0],
  ["Rejaur Rahman Raja", 0.43, 5.33, 1, 0],
  ["Musfik Hasan", 0.35, 4.0, 1, 0],
  ["Nasum Ahmed Jr", 0.59, 8.0, 1, 0],
  ["Mahmudul Hasan Joy", 13.51, 7.73, 1, 1],
  ["Shahadat Hossain Dipu", 11.44, 6.93, 1, 1],
  ["Enamul Haque Bijoy", 14.72, 8.67, 1, 1],
  ["Mominul Haque (domestic only status in dataset context)", 18.88, 9.33, 1, 1],
  ["Shadman Islam", 15.29, 8.0, 1, 1],
  ["Najmul Hossain Apu", 8.12, 5.33, 1, 1],
  ["Akbar Ali", 9.95, 7.33, 1, 1],
  ["Nurul Hasan Sohan", 16.14, 10.0, 1, 1],
  ["Ben McKinney", 4.67, 1.33, 0, 1],
  ["Rocky Flintoff", 0.0, 1.6, 0, 0],
  ["Archie Vaughan", 0.28, 1.47, 0, 0],
  ["Farhan Ahmed", 0.35, 1.2, 0, 0],
  ["Sonny Baker", 0.28, 1.33, 0, 0],
  ["Henry Crocombe", 0.33, 1.6, 0, 0],
  ["James Rew", 5.45, 1.73, 0, 1],
  ["Tom Rew", 3.84, 1.6, 0, 1],
  ["Alex Horton", 2.9, 1.33, 0, 1],
  ["Ben Geddes", 3.52, 1.6, 0, 1],
  ["Luc Benkenstein", 0.04, 1.33, 0, 0],
  ["Dan Mousley", 0.06, 1.87, 0, 0],
  ["George Thomas", 3.26, 1.87, 0, 1],
  ["James Coles", 0.14, 1.6, 0, 0],
  ["George Bell", 4.0, 1.73, 0, 1],
  ["Jack Carson", 0.3, 1.47, 0, 0],
  ["Jack Haynes", 4.8, 1.6, 0, 1],
  ["George Hill", 0.23, 1.73, 0, 0],
  ["John Turner", 0.14, 1.47, 0, 0],
  ["Priyansh Arya", 3.03, 1.73, 1, 1],
  ["Vaibhav Suryavanshi", 5.61, 2.13, 1, 1],
  ["Digvesh Rathi", 0.01, 1.33, 1, 0],
  ["Kartik Sharma", 2.32, 1.47, 1, 0],
  ["Prashant Veer", 0.0, 0.8, 1, 0],
  ["Salil Arora", 1.57, 1.87, 1, 0],
  ["Ashok Sharma", 0.03, 0.8, 1, 0],
  ["Kumar Kushagra", 0.62, 0.13, 1, 0],
  ["Anshul Kamboj", 0.02, 1.33, 1, 0],
  ["Harsh Dubey", 0.04, 1.07, 1, 0],
  ["Auqib Nabi", 0.02, 0.67, 1, 0],
  ["Mangesh Yadav", 0.1, 0.8, 1, 0],
  ["Tejasvi Dahiya", 2.8, 1.33, 1, 1],
  ["Akshat Raghuwanshi", 2.14, 0.53, 1, 0],
  ["Ayush Mhatre", 1.92, 0.8, 1, 0],
  ["Sarthak Ranjan", 1.96, 1.07, 1, 0],
  ["Sakib Hussain", 0.08, 1.47, 1, 0],
  ["Manav Suthar", 0.43, 1.07, 1, 0],
  ["Atharva Taide", 2.58, 1.2, 1, 1],
  ["Aman Mokhade", 2.18, 1.07, 1, 0],
  ["Angkrish Raghuwanshi", 3.12, 1.47, 1, 1],
  ["Prabhsimran Singh", 3.74, 1.87, 1, 1],
  ["Brijesh Sharma", 0.07, 1.73, 1, 0],
  ["Jake Egan", 3.21, 1.07, 4, 1],
  ["Reuben Wilson", 0.24, 1.07, 4, 0],
  ["Tom Mayes", 0.31, 1.2, 4, 0],
  ["Liam McCarthy", 0.29, 1.2, 4, 0],
  ["Sam Topping", 1.86, 0.93, 4, 0],
  ["Cade Carmichael", 3.53, 1.33, 4, 1],
  ["Chris de Freitas", 3.03, 1.2, 4, 1],
  ["Morgan Topping", 2.94, 1.07, 4, 1],
  ["Theo van Woerkom", 0.09, 1.2, 4, 0],
  ["Gavin Roulston", 2.64, 1.07, 4, 1],
  ["Matthew Foster", 0.15, 1.2, 4, 0],
  ["Seamus Lynch", 2.47, 1.07, 4, 1],
  ["Scott Macbeth", 0.19, 1.07, 4, 0],
  ["James West", 0.13, 1.07, 4, 0],
  ["Fionn Hand", 0.13, 1.33, 4, 0],
  ["Adam Leckey", 2.4, 1.07, 4, 0],
  ["Sebastian Dijkstra", 2.22, 0.93, 4, 0],
  ["Luke Murray", 0.18, 1.07, 4, 0],
  ["Lachlan Stackpole", 4.38, 1.07, 4, 1],
  ["Max Chu", 3.74, 1.07, 4, 1],
  ["Matthew Boyle", 3.61, 1.07, 4, 1],
  ["Simon Keene", 3.7, 1.07, 4, 1],
  ["Jacob Cumming", 3.33, 1.07, 4, 1],
  ["Curtis Heaphy", 3.23, 0.93, 4, 1],
  ["Rhys Mariu", 3.19, 1.07, 4, 1],
  ["Jesse Tashkoff", 3.16, 0.93, 4, 1],
  ["Bharat Popli", 3.57, 1.07, 4, 1],
  ["Tim Pringle", 0.4, 1.07, 4, 0],
  ["Fraser Sheat", 0.35, 1.07, 4, 0],
  ["Rohit Gulati", 0.34, 0.93, 4, 0],
  ["Michael Rae", 0.33, 0.93, 4, 0],
  ["Adithya Ashok", 0.27, 1.07, 4, 0],
  ["Zak Gibson", 0.28, 1.07, 4, 0],
  ["Simon Johnston", 0.26, 1.07, 4, 0],
  ["Ben Lister", 0.24, 0.93, 4, 0],
  ["Matt Bacon", 0.23, 1.07, 4, 0],
  ["Mohammad Huraira", 10.21, 3.73, 2, 1],
  ["Abdul Faseeh", 4.77, 2.4, 2, 1],
  ["Yasir Khan", 0.0, 2.93, 2, 0],
  ["Shahzaib Khan", 4.29, 2.0, 2, 1],
  ["Hassan Nawaz", 5.73, 2.67, 2, 1],
  ["Saad Masood", 4.67, 2.13, 2, 1],
  ["Abdul Faseeh Jr (emerging)", 3.79, 1.87, 2, 1],
  ["Mohammad Faiq", 3.18, 0.93, 2, 1],
  ["Arafat Minhas", 0.11, 3.33, 2, 0],
  ["Mubasir Khan", 0.13, 4.0, 2, 0],
  ["Qasim Akram", 0.22, 4.67, 2, 0],
  ["Abbas Afridi", 0.33, 5.6, 2, 0],
  ["Ali Raza", 0.19, 1.6, 2, 0],
  ["Khawaja Nafay", 4.78, 2.4, 2, 1],
  ["Lhuan-dre Pretorius", 3.07, 0.8, 4, 1],
  ["Gavin Kaplan", 5.65, 0.93, 4, 1],
  ["Connor Esterhuizen", 5.0, 1.07, 4, 1],
  ["Jordan Hermann", 3.86, 1.07, 4, 1],
  ["Rubin Hermann", 3.61, 0.8, 4, 1],
  ["Daniel Smith", 4.32, 0.93, 4, 1],
  ["Delano Potgieter", 0.17, 0.93, 4, 0],
  ["Dian Forrester", 3.24, 0.93, 4, 1],
  ["Lesiba Ngoepe", 3.27, 0.93, 4, 1],
  ["Meeka-eel Prince", 3.17, 0.93, 4, 1],
  ["Matthew Boast", 0.54, 1.07, 4, 0],
  ["Kyle Simmonds", 0.38, 0.93, 4, 0],
  ["Shaun von Berg", 0.38, 0.93, 4, 0],
  ["Mihlali Mpongwana", 0.2, 1.07, 4, 0],
  ["Beyers Swanepoel", 0.19, 1.07, 4, 0],
  ["Tshepo Moreki", 0.22, 0.93, 4, 0],
  ["Alfred Mothoa", 0.26, 1.07, 4, 0],
  ["Gideon Peters", 0.21, 0.93, 4, 0],
  ["Junaid Dawood", 0.23, 1.07, 4, 0],
  ["Clyde Fortuin", 2.5, 0.93, 4, 1],
  ["Shevon Daniel", 4.0, 1.33, 4, 1],
  ["Ahan Wickramasinghe", 3.84, 1.33, 4, 1],
  ["Ravindu Rasantha", 3.61, 1.33, 4, 1],
  ["Sohan de Livera", 3.5, 1.2, 4, 1],
  ["Sahan Kosala", 3.39, 1.2, 4, 1],
  ["Nipun Dhananjaya", 3.3, 1.33, 4, 1],
  ["Janishka Perera", 3.16, 1.2, 4, 1],
  ["Vishen Halambage", 0.0, 1.33, 4, 0],
  ["Dhananjaya Lakshan", 0.19, 1.33, 4, 0],
  ["Ravindu Fernando", 0.16, 1.33, 4, 0],
  ["Sonal Dinusha", 0.33, 1.2, 4, 0],
  ["Ashian Daniel", 0.36, 1.2, 4, 0],
  ["Dilum Sudeera", 0.34, 1.07, 4, 0],
  ["Garuka Sanketh", 0.29, 1.2, 4, 0],
  ["Dulaj Samuditha", 0.27, 1.07, 4, 0],
  ["Traveen Mathew", 0.27, 1.07, 4, 0],
  ["Tharindu Rathnayake", 0.29, 1.2, 4, 0],
  ["Chamindu Wijesinghe", 0.14, 1.33, 4, 0],
  ["Vishad Randika", 2.62, 1.2, 4, 1],
  ["Vimath Dinsara", 2.94, 1.87, 4, 1],
  ["Kavija Gamage", 0.1, 2.13, 4, 0],
  ["Dulnith Sigera", 2.14, 0.93, 4, 0],
  ["Vigneshwaran Akash", 0.26, 1.87, 4, 0],
  ["Jewel Andrew", 3.27, 1.33, 4, 1],
  ["Ackeem Auguste", 3.52, 1.2, 4, 1],
  ["Amir Jangoo", 3.63, 1.47, 4, 1],
  ["Rivaldo Clarke", 3.18, 1.2, 4, 1],
  ["Kevlon Anderson", 4.13, 1.33, 4, 1],
  ["Shaqkere Parris", 3.66, 1.33, 4, 1],
  ["Carlon Tuckett", 3.31, 1.2, 4, 1],
  ["Giovonte Depeiza", 0.06, 1.33, 4, 0],
  ["Navin Bidaisee", 0.09, 1.33, 4, 0],
  ["Mavendra Dindyal", 2.99, 1.2, 4, 1],
  ["Johann Jeremiah", 2.82, 1.07, 4, 1],
  ["Johann Layne", 0.31, 1.33, 4, 0],
  ["Jediah Blades", 0.28, 1.2, 4, 0],
  ["Ramon Simmonds", 0.15, 1.33, 4, 0],
  ["Nathan Edward", 0.28, 1.33, 4, 0],
  ["Amari Goodridge", 0.25, 1.07, 4, 0],
  ["Mbeki Joseph", 0.23, 1.2, 4, 0],
  ["Zishan Motara", 0.2, 1.33, 4, 0],
  ["Renico Smith", 0.15, 1.2, 4, 0],
  ["Kelvin Pittman", 0.12, 1.2, 4, 0],
  ["Antum Naqvi", 4.02, 1.2, 4, 1],
  ["Tashinga Musekiwa", 0.06, 1.33, 4, 0],
  ["Tinotenda Maposa", 0.15, 1.33, 4, 0],
  ["Tafadzwa Tsiga", 2.98, 1.2, 4, 1],
  ["Vincent Masekesa", 0.33, 1.07, 4, 0],
  ["Newman Nyamhuri", 0.29, 1.2, 4, 0],
  ["Takudzwanashe Kaitano", 3.46, 1.33, 4, 1],
  ["Panashe Taruvinga", 3.23, 1.2, 4, 1],
  ["Kian Blignaut", 2.83, 1.07, 4, 1],
  ["Tanaka Chivanga", 0.23, 1.07, 4, 0],
  ["Brandon Mavuta", 0.25, 1.2, 4, 0],
  ["Ernest Masuku", 0.23, 1.07, 4, 0],
  ["Clive Chitumba", 3.31, 1.33, 4, 1],
  ["Ainsley Ndlovu", 0.31, 1.2, 4, 0],
  ["Tapiwa Mufudza", 0.29, 1.07, 4, 0],
  ["Brian Mudzinganyama", 3.06, 1.2, 4, 1],
  ["William Mashinge", 0.25, 1.07, 4, 0],
  ["Charlton Tshuma", 0.21, 1.07, 4, 0]
];

// Geopolitical Tournament Mapping
const tournamentMap: Record<number, string> = {
  0: "Sheffield Shield",
  1: "Ranji Trophy",
  2: "Pakistan Super League",
  3: "Ahmad Shah Abdali 4-Day",
  4: "Lanka Premier League"
};

const playerRealData: Record<string, { role: string; team: string }> = {
  "Abdul Malik": { role: "Top-order Batter", team: "Amo Region" },
  "Shahidullah Kamal": { role: "Batter", team: "Mis-e Ainak" },
  "Bahir Shah": { role: "Batter", team: "Band-e-Amir" },
  "Munir Ahmad Kakar": { role: "WK Batter", team: "Mis-e Ainak" },
  "Darwish Rasooli": { role: "Top-order Batter", team: "Amo Region" },
  "Zubaid Akbari": { role: "All-rounder", team: "Boost Region" },
  "Rohullah Arab": { role: "All-rounder", team: "Band-e-Amir" },
  "Khatir Stanikzai": { role: "Bowler", team: "Speen Ghar" },
  "Faridoon Dawoodzai": { role: "Bowler", team: "Amo Region" },
  "Wafiullah Tarakhil": { role: "Batter", team: "Boost Region" },
  "Mohammad Ishaq": { role: "WK Batter", team: "Afghanistan Emerging" },
  "Azizullah Mia Khil": { role: "Batter", team: "Boost Region" },
  "Faisal Khan Ahmadzai": { role: "All-rounder", team: "Speen Ghar" },
  "Nazifullah Amiri": { role: "All-rounder", team: "Mis-e Ainak" },
  "Wahidullah Zadran": { role: "Off-spin Bowler", team: "Afghanistan U19" },
  "Henry Hunt": { role: "Batter", team: "South Australia" },
  "Liam Scott": { role: "All-rounder", team: "South Australia" },
  "Nathan McAndrew": { role: "Fast Bowler", team: "South Australia" },
  "Jordan Buckingham": { role: "Fast Bowler", team: "South Australia" },
  "Henry Thornton": { role: "Fast Bowler", team: "South Australia" },
  "Jake Lehmann": { role: "Batter", team: "South Australia" },
  "Sam Elliott": { role: "Seam All-rounder", team: "Victoria" },
  "Fergus O'Neill": { role: "Fast Bowler", team: "Victoria" },
  "Corey Rocchiccioli": { role: "Off Spin Bowler", team: "Western Australia" },
  "Liam Hatcher": { role: "Fast Bowler", team: "New South Wales" },
  "Cameron Gannon": { role: "Fast Bowler", team: "Queensland" },
  "Jason Sangha": { role: "Batter", team: "South Australia" },
  "Ben Kellaway": { role: "Batting All-rounder", team: "Western Australia" },
  "Mackenzie Harvey": { role: "Batter", team: "South Australia" },
  "Campbell Kellaway": { role: "Batter", team: "Victoria" },
  "Harry Nielsen": { role: "WK Batter", team: "South Australia" },
  "Matthew Gilkes": { role: "WK Batter", team: "New South Wales" },
  "Ben Manenti": { role: "Spin All-rounder", team: "South Australia" },
  "Anamul Haque Enam": { role: "Batter", team: "Khulna Division" },
  "Zakir Hasan": { role: "WK Batter", team: "Sylhet Division" },
  "Mahidul Islam Ankon": { role: "WK Batter", team: "Dhaka Division" },
  "Pritom Kumar": { role: "Batter", team: "Rajshahi Division" },
  "Jishan Alam": { role: "Batter", team: "Sylhet Division" },
  "Saif Hassan": { role: "Top-order Batter", team: "Dhaka Division" },
  "Tanvir Islam": { role: "Left-arm Spinner", team: "Chattogram Division" },
  "Rejaur Rahman Raja": { role: "Fast Bowler", team: "Sylhet Division" },
  "Musfik Hasan": { role: "Fast Bowler", team: "Rangpur Division" },
  "Nasum Ahmed Jr": { role: "Left-arm Spinner", team: "Sylhet Division" },
  "Mahmudul Hasan Joy": { role: "Top-order Batter", team: "Chattogram Division" },
  "Shahadat Hossain Dipu": { role: "Batter", team: "Chattogram Division" },
  "Enamul Haque Bijoy": { role: "Batter", team: "Khulna Division" },
  "Mominul Haque (domestic only status in dataset context)": { role: "Batter", team: "Dhaka Division" },
  "Shadman Islam": { role: "Top-order Batter", team: "Dhaka Division" },
  "Najmul Hossain Apu": { role: "Batter", team: "Barishal Division" },
  "Akbar Ali": { role: "WK Batter", team: "Rangpur Division" },
  "Nurul Hasan Sohan": { role: "WK Batter", team: "Rangpur Division" },
  "Ben McKinney": { role: "Batter", team: "Durham" },
  "Rocky Flintoff": { role: "Batting All-rounder", team: "Lancashire" },
  "Archie Vaughan": { role: "Spin All-rounder", team: "Somerset" },
  "Farhan Ahmed": { role: "Off Spin Bowler", team: "Nottinghamshire" },
  "Sonny Baker": { role: "Fast Bowler", team: "Hampshire" },
  "Henry Crocombe": { role: "Fast Bowler", team: "Sussex" },
  "James Rew": { role: "WK Batter", team: "Somerset" },
  "Tom Rew": { role: "WK Batter", team: "Somerset" },
  "Alex Horton": { role: "WK Batter", team: "Glamorgan" },
  "Ben Geddes": { role: "Batter", team: "Surrey" },
  "Luc Benkenstein": { role: "Batting All-rounder", team: "Essex" },
  "Dan Mousley": { role: "Batting All-rounder", team: "Warwickshire" },
  "George Thomas": { role: "Batter", team: "Glamorgan" },
  "James Coles": { role: "Batting All-rounder", team: "Sussex" },
  "George Bell": { role: "WK Batter", team: "Lancashire" },
  "Jack Carson": { role: "Off Spin Bowler", team: "Sussex" },
  "Jack Haynes": { role: "Batter", team: "Nottinghamshire" },
  "George Hill": { role: "Seam Bowling All-rounder", team: "Yorkshire" },
  "John Turner": { role: "Fast Bowler", team: "Hampshire" },
  "Priyansh Arya": { role: "Batter", team: "Delhi" },
  "Vaibhav Suryavanshi": { role: "Batter", team: "Bihar" },
  "Digvesh Rathi": { role: "Leg Spinner", team: "Delhi" },
  "Kartik Sharma": { role: "WK Batter", team: "Rajasthan" },
  "Prashant Veer": { role: "All-rounder", team: "Uttar Pradesh" },
  "Salil Arora": { role: "WK Batter", team: "Punjab" },
  "Ashok Sharma": { role: "Fast Bowler", team: "Rajasthan" },
  "Kumar Kushagra": { role: "WK Batter", team: "Jharkhand" },
  "Anshul Kamboj": { role: "Fast Bowler", team: "Haryana" },
  "Harsh Dubey": { role: "All-rounder", team: "Vidarbha" },
  "Auqib Nabi": { role: "Fast Bowler", team: "Jammu & Kashmir" },
  "Mangesh Yadav": { role: "All-rounder", team: "Madhya Pradesh" },
  "Tejasvi Dahiya": { role: "WK Batter", team: "Delhi" },
  "Akshat Raghuwanshi": { role: "Batter", team: "Madhya Pradesh" },
  "Ayush Mhatre": { role: "Batter", team: "Mumbai" },
  "Sarthak Ranjan": { role: "Batter", team: "Delhi" },
  "Sakib Hussain": { role: "Fast Bowler", team: "Bihar" },
  "Manav Suthar": { role: "Spin Bowler", team: "Rajasthan" },
  "Atharva Taide": { role: "Batter", team: "Vidarbha" },
  "Aman Mokhade": { role: "Batter", team: "Vidarbha" },
  "Angkrish Raghuwanshi": { role: "WK Batter", team: "Mumbai" },
  "Prabhsimran Singh": { role: "WK Batter", team: "Punjab" },
  "Brijesh Sharma": { role: "Fast Bowler", team: "West Bengal" },
  "Jake Egan": { role: "Batter", team: "Leinster Lightning" },
  "Reuben Wilson": { role: "Fast Bowler", team: "North West Warriors" },
  "Tom Mayes": { role: "Fast Bowler", team: "North West Warriors" },
  "Liam McCarthy": { role: "Fast Bowler", team: "Munster Reds" },
  "Sam Topping": { role: "Batter", team: "Northern Knights" },
  "Cade Carmichael": { role: "Batter", team: "Leinster Lightning" },
  "Chris de Freitas": { role: "Batter", team: "Leinster Lightning" },
  "Morgan Topping": { role: "Batter", team: "Northern Knights" },
  "Theo van Woerkom": { role: "Batting All-rounder", team: "Northern Knights" },
  "Gavin Roulston": { role: "WK Batter", team: "Northern Knights" },
  "Matthew Foster": { role: "Seam All-rounder", team: "North West Warriors" },
  "Seamus Lynch": { role: "Batter", team: "Munster Reds" },
  "Scott Macbeth": { role: "Fast Bowler", team: "North West Warriors" },
  "James West": { role: "Off Spin All-rounder", team: "Leinster Lightning" },
  "Fionn Hand": { role: "Seam All-rounder", team: "Leinster Lightning" },
  "Adam Leckey": { role: "WK Batter", team: "Northern Knights" },
  "Sebastian Dijkstra": { role: "Batter", team: "North West Warriors" },
  "Luke Murray": { role: "Fast Bowler", team: "Munster Reds" },
  "Lachlan Stackpole": { role: "Batter", team: "Auckland" },
  "Max Chu": { role: "WK Batter", team: "Otago" },
  "Matthew Boyle": { role: "Batter", team: "Otago" },
  "Simon Keene": { role: "Batter", team: "Auckland" },
  "Jacob Cumming": { role: "Batter", team: "Otago" },
  "Curtis Heaphy": { role: "Batter", team: "Wellington" },
  "Rhys Mariu": { role: "Batter", team: "Canterbury" },
  "Jesse Tashkoff": { role: "Batter", team: "Wellington" },
  "Bharat Popli": { role: "Batter", team: "Northern Districts" },
  "Tim Pringle": { role: "Spin Bowler", team: "Northern Districts" },
  "Fraser Sheat": { role: "Fast Bowler", team: "Canterbury" },
  "Rohit Gulati": { role: "Fast Bowler", team: "Auckland" },
  "Michael Rae": { role: "Fast Bowler", team: "Canterbury" },
  "Adithya Ashok": { role: "Leg Spin Bowler", team: "Auckland" },
  "Zak Gibson": { role: "Fast Bowler", team: "Northern Districts" },
  "Simon Johnston": { role: "Fast Bowler", team: "Wellington" },
  "Ben Lister": { role: "Fast Bowler", team: "Auckland" },
  "Matt Bacon": { role: "Fast Bowler", team: "Wellington" },
  "Mohammad Huraira": { role: "Top-order Batter", team: "Northern (Pakistan Domestic)" },
  "Abdul Faseeh": { role: "Batter", team: "Central Punjab" },
  "Yasir Khan": { role: "Opener", team: "Khyber Pakhtunkhwa" },
  "Shahzaib Khan": { role: "Batter", team: "Balochistan U19" },
  "Hassan Nawaz": { role: "Batter", team: "Northern" },
  "Saad Masood": { role: "Middle-order Batter", team: "Sindh" },
  "Abdul Faseeh Jr (emerging)": { role: "Batter", team: "Lahore Whites" },
  "Mohammad Faiq": { role: "Top-order Batter", team: "Lahore Region Whites" },
  "Arafat Minhas": { role: "All-rounder", team: "Southern Punjab" },
  "Mubasir Khan": { role: "All-rounder", team: "Islamabad Region" },
  "Qasim Akram": { role: "All-rounder", team: "Central Punjab" },
  "Abbas Afridi": { role: "Bowler", team: "Karachi Kings" },
  "Ali Raza": { role: "Bowler", team: "Khyber Pakhtunkhwa U19" },
  "Khawaja Nafay": { role: "Batter", team: "Karachi Region" },
  "Lhuan-dre Pretorius": { role: "WK Batter", team: "Titans" },
  "Gavin Kaplan": { role: "Batter", team: "Boland" },
  "Connor Esterhuizen": { role: "Batter", team: "Dolphins" },
  "Jordan Hermann": { role: "Batter", team: "Warriors" },
  "Rubin Hermann": { role: "Batter", team: "North West" },
  "Daniel Smith": { role: "WK Batter", team: "Western Province" },
  "Delano Potgieter": { role: "Batting All-rounder", team: "Lions" },
  "Dian Forrester": { role: "Batter", team: "North West" },
  "Lesiba Ngoepe": { role: "Batter", team: "North West" },
  "Meeka-eel Prince": { role: "Batter", team: "North West" },
  "Matthew Boast": { role: "Fast Bowler", team: "Warriors" },
  "Kyle Simmonds": { role: "Spin All-rounder", team: "Western Province" },
  "Shaun von Berg": { role: "Leg Spin All-rounder", team: "Boland" },
  "Mihlali Mpongwana": { role: "Seam All-rounder", team: "Western Province" },
  "Beyers Swanepoel": { role: "Fast Bowling All-rounder", team: "Lions" },
  "Tshepo Moreki": { role: "Fast Bowler", team: "Western Province" },
  "Alfred Mothoa": { role: "Fast Bowler", team: "North West" },
  "Gideon Peters": { role: "Fast Bowler", team: "Warriors" },
  "Junaid Dawood": { role: "Off Spin Bowler", team: "Titans" },
  "Clyde Fortuin": { role: "WK Batter", team: "Boland" },
  "Shevon Daniel": { role: "Batter", team: "SSC" },
  "Ahan Wickramasinghe": { role: "Batter", team: "Colts" },
  "Ravindu Rasantha": { role: "Batter", team: "NCC" },
  "Sohan de Livera": { role: "WK Batter", team: "BRC" },
  "Sahan Kosala": { role: "WK Batter", team: "Bloomfield" },
  "Nipun Dhananjaya": { role: "Batter", team: "Army SC" },
  "Janishka Perera": { role: "Batter", team: "NCC" },
  "Vishen Halambage": { role: "Batting All-rounder", team: "Panadura Sports Club" },
  "Dhananjaya Lakshan": { role: "Batting All-rounder", team: "Colombo CC" },
  "Ravindu Fernando": { role: "Batting All-rounder", team: "Colts" },
  "Sonal Dinusha": { role: "Spin All-rounder", team: "SCC" },
  "Ashian Daniel": { role: "Off Spin Bowler", team: "Police SC" },
  "Dilum Sudeera": { role: "Left-arm Spinner", team: "Ragama CC" },
  "Garuka Sanketh": { role: "Fast Bowler", team: "Bloomfield" },
  "Dulaj Samuditha": { role: "Left-arm Medium", team: "Kurunegala YCC" },
  "Traveen Mathew": { role: "Off Spin Bowler", team: "NCC" },
  "Tharindu Rathnayake": { role: "Spin All-rounder", team: "Tamil Union" },
  "Chamindu Wijesinghe": { role: "Seam All-rounder", team: "SCC" },
  "Vishad Randika": { role: "WK Batter", team: "Bloomfield" },
  "Vimath Dinsara": { role: "Batter", team: "Royal College" },
  "Kavija Gamage": { role: "Batting All-rounder", team: "Kingswood College" },
  "Dulnith Sigera": { role: "Batter", team: "Mahanama College" },
  "Vigneshwaran Akash": { role: "Leg Spin Bowler", team: "St Josephs College" },
  "Jewel Andrew": { role: "WK Batter", team: "Antigua & Barbuda" },
  "Ackeem Auguste": { role: "Batter", team: "Windward Islands" },
  "Amir Jangoo": { role: "WK Batter", team: "Trinidad & Tobago" },
  "Rivaldo Clarke": { role: "WK Batter", team: "Jamaica" },
  "Kevlon Anderson": { role: "Batter", team: "Guyana" },
  "Shaqkere Parris": { role: "Batter", team: "Jamaica" },
  "Carlon Tuckett": { role: "Batter", team: "Barbados" },
  "Giovonte Depeiza": { role: "Batting All-rounder", team: "Barbados" },
  "Navin Bidaisee": { role: "Batting All-rounder", team: "Trinidad & Tobago" },
  "Mavendra Dindyal": { role: "Batter", team: "Trinidad & Tobago" },
  "Johann Jeremiah": { role: "Batter", team: "Leeward Islands" },
  "Johann Layne": { role: "Fast Bowler", team: "Barbados" },
  "Jediah Blades": { role: "Fast Bowler", team: "Barbados" },
  "Ramon Simmonds": { role: "Left-arm Fast Bowler", team: "Barbados" },
  "Nathan Edward": { role: "Fast Bowler", team: "Windward Islands" },
  "Amari Goodridge": { role: "Fast Bowler", team: "Guyana" },
  "Mbeki Joseph": { role: "Fast Bowler", team: "Leeward Islands" },
  "Zishan Motara": { role: "Leg Spin Bowler", team: "Trinidad & Tobago" },
  "Renico Smith": { role: "Spin All-rounder", team: "Jamaica" },
  "Kelvin Pittman": { role: "Fast Bowling All-rounder", team: "Guyana" },
  "Antum Naqvi": { role: "Batter", team: "Mid West Rhinos" },
  "Tashinga Musekiwa": { role: "Batting All-rounder", team: "Mid West Rhinos" },
  "Tinotenda Maposa": { role: "Fast Bowler", team: "Mountaineers" },
  "Tafadzwa Tsiga": { role: "WK Batter", team: "Eagles" },
  "Vincent Masekesa": { role: "Leg Spin Bowler", team: "Eagles" },
  "Newman Nyamhuri": { role: "Fast Bowler", team: "Mountaineers" },
  "Takudzwanashe Kaitano": { role: "Batter", team: "Mountaineers" },
  "Panashe Taruvinga": { role: "WK Batter", team: "Rocks" },
  "Kian Blignaut": { role: "Batter", team: "Eagles" },
  "Tanaka Chivanga": { role: "Fast Bowler", team: "Southern Rocks" },
  "Brandon Mavuta": { role: "Spin All-rounder", team: "Eagles" },
  "Ernest Masuku": { role: "Fast Bowler", team: "Mountaineers" },
  "Clive Chitumba": { role: "WK Batter", team: "Tuskers" },
  "Ainsley Ndlovu": { role: "Left-arm Spinner", team: "Tuskers" },
  "Tapiwa Mufudza": { role: "Off Spin Bowler", team: "Eagles" },
  "Brian Mudzinganyama": { role: "Batter", team: "Rangers" },
  "William Mashinge": { role: "Fast Bowler", team: "Mountaineers" },
  "Charlton Tshuma": { role: "Fast Bowler", team: "Rangers" }
};

export const players: Player[] = rawData.map(([name, perf, marker, geo, selected]) => {
  const tournament = tournamentMap[geo] || "Domestic Championship";
  const realMappedData = playerRealData[name] || { role: "All-Rounder", team: "Domestic Team" };
  const roleLower = realMappedData.role.toLowerCase();

  const newsItems: string[] = [];
  const awards: string[] = [];

  const isBowler = roleLower.includes("bowler") || roleLower.includes("spinner");
  const isBatter = roleLower.includes("batter") || roleLower.includes("opener");

  // 🎯 Dynamic & Realistic News Generation logic based on exact performance score
  if (perf >= 10.0) {
    const runs = Math.round(perf * 15 + 30);
    newsItems.push(`${name} played a game-changing innings in ${tournament}, scoring ${runs} runs to dominate the fixture.`);
    newsItems.push(`National selectors have highlighted ${name}'s superb form following multiple match-winning performances.`);
    awards.push("Century Scorer", "Man of the Match");
  } else if (perf >= 5.0) {
    if (isBowler) {
      const wkts = Math.min(6, Math.max(3, Math.round(perf / 1.5)));
      newsItems.push(`${name} spearheaded the bowling attack in ${tournament}, taking ${wkts} key wickets.`);
      newsItems.push(`Coaches praised ${name} for maintaining high consistency and tight line-and-length in recent matches.`);
      awards.push(wkts >= 5 ? "Wicket Milestone" : "Best Bowler");
    } else {
      const runs = Math.round(perf * 10 + 10);
      newsItems.push(`${name} anchored the innings in ${tournament}, scoring a valuable ${runs} runs under pressure.`);
      newsItems.push(`Selectors keep a close eye on ${name}'s steady progress across domestic matches this season.`);
      awards.push("Man of the Match");
    }
  } else if (perf >= 1.0) {
    if (isBowler) {
      const wkts = Math.max(1, Math.round(perf * 2));
      newsItems.push(`${name} chipped in with ${wkts} crucial ${wkts === 1 ? 'wicket' : 'wickets'} during a tight spell in ${tournament}.`);
      newsItems.push(`Analysts note ${name}'s potential to develop into a reliable regular option.`);
    } else {
      const runs = Math.round(perf * 12 + 5);
      newsItems.push(`${name} contributed a handy ${runs} runs for ${realMappedData.team} in the latest ${tournament} match.`);
      newsItems.push(`Technical team is working with ${name} to convert these starts into big match-winning scores.`);
    }
  } else {
    // Low performance (perf < 1.0)
    if (isBowler) {
      newsItems.push(`${name} bowled a compact spell for ${realMappedData.team} in ${tournament}, working on discipline and control.`);
      newsItems.push(`${name} continues to gain valuable match exposure in competitive domestic fixtures.`);
    } else {
      const runs = Math.max(1, Math.round(perf * 20));
      newsItems.push(`${name} scored ${runs} ${runs === 1 ? 'run' : 'runs'} in ${tournament} as he looks to find consistency in upcoming games.`);
      newsItems.push(`${name} remains an emerging prospect focusing on refining technique for upcoming fixtures.`);
    }
  }

  return {
    player_name: name,
    performance_score: perf,
    marker_score: marker,
    geopolitical: geo,
    was_selected: selected,
    team: realMappedData.team,
    role: realMappedData.role,
    tournament,
    news: newsItems,
    awards,
  };
});

export const tournamentNames = Object.values(tournamentMap);
export const teams = Array.from(new Set(Object.values(playerRealData).map(p => p.team)));

export function getNationalSelectionProbability(player: Player): number {
  const perfWeight = player.performance_score * 0.5;
  const markerWeight = player.marker_score * 0.25;
  const priorSelectionBonus = player.was_selected === 1 ? 2.5 : 0;
  const awardBonus = Math.min(1.5, player.awards.length * 0.5);

  const rawScore = perfWeight + markerWeight + priorSelectionBonus + awardBonus;
  const normalizedProb = rawScore / 16.5;

  return Math.min(0.98, Math.max(0.02, normalizedProb));
}

export function getPerformanceTier(score: number): string {
  if (score >= 8) return "Elite";
  if (score >= 6) return "Strong";
  if (score >= 4) return "Average";
  if (score >= 2) return "Developing";
  return "Emerging";
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case "Elite": return "text-emerald-400";
    case "Strong": return "text-blue-400";
    case "Average": return "text-yellow-400";
    case "Developing": return "text-orange-400";
    default: return "text-slate-400";
  }
}

export function getTierBg(tier: string): string {
  switch (tier) {
    case "Elite": return "bg-emerald-500/20 border-emerald-500/40";
    case "Strong": return "bg-blue-500/20 border-blue-500/40";
    case "Average": return "bg-yellow-500/20 border-yellow-500/40";
    case "Developing": return "bg-orange-500/20 border-orange-500/40";
    default: return "bg-slate-500/20 border-slate-500/40";
  }
}