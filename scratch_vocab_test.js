// Generator script that outputs the complete indiaPanPanchayatData.ts file

const fs = require('fs');
const path = require('path');

const REGIONAL_VOCAB = {
  north_hindi: {
    blockSuffixes: ['Sadar', 'Dehat', 'Kalyanpur', 'Mohanlalganj', 'Chaurasi', 'Rampur', 'Fatehpur', 'Shivpur', 'Govindpur'],
    villagePrefixes: ['Rampur', 'Shyampur', 'Gopalpur', 'Kishanpur', 'Madhopur', 'Shivpur', 'Vishunpur', 'Harinagar', 'Bishanpur', 'Kalyanpur', 'Chandpur', 'Sultanpur', 'Mirzapur', 'Bhagwanpur'],
    villageSuffixes: ['Khas', 'Buzurg', 'Khurd', 'Purwa', 'Tola', 'Dehat', 'Patti', 'Basti']
  },
  marathi: {
    blockSuffixes: ['Haveli', 'Baramati', 'Shirur', 'Junnar', 'Daund', 'Indapur', 'Bhor', 'Khed', 'Karjat', 'Ambegaon'],
    villagePrefixes: ['Shivapur', 'Wagholi', 'Chakan', 'Manchar', 'Rahatani', 'Bhosari', 'Nira', 'Saswad', 'Uruli', 'Loni', 'Dehu', 'Alandi'],
    villageSuffixes: ['Wadi', 'Gaon', 'Pada', 'Budruk', 'Khurd', 'Khed', 'Wada']
  },
  gujarati: {
    blockSuffixes: ['Sanand', 'Daskroi', 'Dholka', 'Bavla', 'Viramgam', 'Mandal', 'Detroj', 'Kadi', 'Kalol'],
    villagePrefixes: ['Ranchhod', 'Uvarsad', 'Ambapur', 'Borisana', 'Adalaj', 'Chhatral', 'Pethapur', 'Varsoda', 'Randesan', 'Raysan'],
    villageSuffixes: ['Gam', 'Vada', 'Kheda', 'Vas', 'Pura', 'Moti', 'Nani']
  },
  punjabi: {
    blockSuffixes: ['Majri', 'Samrala', 'Khanna', 'Doraha', 'Jagraon', 'Raikot', 'Ajnala', 'Patti', 'Nabha'],
    villagePrefixes: ['Dhaliwal', 'Bhullar', 'Gill', 'Sandhu', 'Grewal', 'Sidhu', 'Maan', 'Brar', 'Chahal', 'Virk'],
    villageSuffixes: ['Kalan', 'Khurd', 'Pind', 'Majra', 'Jatt', 'Wala', 'Dyal']
  },
  bengali: {
    blockSuffixes: ['Canning', 'Baruipur', 'Basirhat', 'Barasat', 'Amdanga', 'Ranaghat', 'Diamond Harbour', 'Habra'],
    villagePrefixes: ['Gobindapur', 'Radhanagar', 'Balarampur', 'Haridaspur', 'Krishnapur', 'Shyampur', 'Gopalnagar', 'Santoshpur'],
    villageSuffixes: ['Para', 'Gram', 'Danga', 'Pukur', 'Hat', 'Pur', 'Gachi']
  },
  tamil: {
    blockSuffixes: ['Pollachi', 'Sulur', 'Madurantakam', 'Sriperumbudur', 'Thirukalukundram', 'Alanganallur', 'Melur'],
    villagePrefixes: ['Perum', 'Chinna', 'Thiru', 'Pudu', 'Kottai', 'Vada', 'Then', 'Alangudi', 'Kovil'],
    villageSuffixes: ['Ur', 'Patti', 'Palayam', 'Mangalam', 'Kulam', 'Kottai', 'Nagar']
  },
  telugu: {
    blockSuffixes: ['Shamshabad', 'Ibrahimpatnam', 'Ghatkesar', 'Medchal', 'Hayathnagar', 'Rajendranagar', 'Shadnagar'],
    villagePrefixes: ['Konda', 'Ranga', 'Rama', 'Ganga', 'Shiva', 'Pedda', 'Chinna', 'Mallapur', 'Ananth'],
    villageSuffixes: ['Palle', 'Palem', 'Gudem', 'Padu', 'Cheruvu', 'Puram']
  },
  kannada: {
    blockSuffixes: ['Anekal', 'Devanahalli', 'Hosakote', 'Nelamangala', 'Magadi', 'Ramanagara', 'Channapatna'],
    villagePrefixes: ['Dodda', 'Chikka', 'Hosa', 'Hale', 'Bettada', 'Kere', 'Vader', 'Kadugodi', 'Sarjapura'],
    villageSuffixes: ['Halli', 'Pura', 'Kere', 'Mane', 'Koppa', 'Nagara']
  },
  malayalam: {
    blockSuffixes: ['Vellanad', 'Nedumangad', 'Parassala', 'Chadayamangalam', 'Anchal', 'Sasthamcotta', 'Kottarakkara'],
    villagePrefixes: ['Chira', 'Cheri', 'Puzha', 'Kavu', 'Mala', 'Valiya', 'Cheriya', 'Puthen', 'Kuttanad'],
    villageSuffixes: ['Cheri', 'Kavu', 'Nada', 'Puzha', 'Kara', 'Kulam', 'Vila']
  },
  odia: {
    blockSuffixes: ['Pipili', 'Delanga', 'Satyabadi', 'Brahmagiri', 'Nimapara', 'Gop', 'Kakatpur', 'Balianta'],
    villagePrefixes: ['Chandan', 'Nuagaon', 'Balipatna', 'Sakhigopal', 'Bhuban', 'Jagannath', 'Bikrampur'],
    villageSuffixes: ['Sahi', 'Patna', 'Pur', 'Pada', 'Beda']
  },
  assamese: {
    blockSuffixes: ['Dispur', 'Dimoria', 'Rani', 'Boko', 'Chhaygaon', 'Kamalpur', 'Rangia', 'Hajo'],
    villagePrefixes: ['Sonapur', 'Khetri', 'Mirza', 'Palasbari', 'Sualkuchi', 'Azara', 'Bihpuria'],
    villageSuffixes: ['Gaon', 'Pathar', 'Bari', 'Chapori', 'Pam', 'Tiniali']
  },
  northeast: {
    blockSuffixes: ['Central', 'Eastern', 'Western', 'Valley', 'Hills', 'Sadar', 'Sub-Division'],
    villagePrefixes: ['Chumuke', 'Diphupar', 'Medziphema', 'Sovima', 'Pfutsero', 'Zubza', 'Khonoma', 'Longsa'],
    villageSuffixes: ['Village', 'Township', 'Basti', 'Settlement', 'Colony']
  }
};

const IAS_NAMES = [
  'Rajeshwar Prasad', 'S. Rajalingam', 'Dr. Rajesh Deshmukh', 'Dr. Chandrashekhar Singh',
  'Prakash Rajpurohit', 'Anurag Verma', 'K. Radhakrishnan', 'Shalini Agarwal',
  'Ritu Maheshwari', 'Divya Mittal', 'Vijay Kiran Anand', 'Alok Kumar',
  'Dr. Priyanka Shukla', 'Suhas L.Y.', 'Saumya Pandey', 'Kumar Ravi',
  'Awanish Sharan', 'Dr. Neha Jain', 'Prashant Sharma', 'Deepak Rawat',
  'Dr. V.P. Jeyaseelan', 'Snehil Kumar Singh', 'M.G. Rajamanickam', 'Swati Sharma',
  'Arun Kumar Rajoria', 'Navneet Singh Chahal', 'Jitendra Jorwal', 'Sakshi Sawhney'
];

console.log('Vocab & IAS generators configured.');
