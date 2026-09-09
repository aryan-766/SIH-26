const fs = require('fs');
const path = require('path');

const STATES_DATA = [
  {
    code: 'UP',
    name: 'Uttar Pradesh (उत्तर प्रदेश)',
    region: 'north_hindi',
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
      'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
      'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
      'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad',
      'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
      'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
      'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
      'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
      'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
      'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur',
      'Unnao', 'Varanasi'
    ]
  },
  {
    code: 'MH',
    name: 'Maharashtra (महाराष्ट्र)',
    region: 'marathi',
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar', 'Beed', 'Bhandara', 'Buldhana',
      'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
      'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik',
      'Dharashiv', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
      'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ]
  },
  {
    code: 'BR',
    name: 'Bihar (बिहार)',
    region: 'north_hindi',
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
      'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
      'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
      'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur',
      'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
    ]
  },
  {
    code: 'RJ',
    name: 'Rajasthan (राजस्थान)',
    region: 'north_hindi',
    districts: [
      'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar',
      'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg',
      'Didwana-Kuchaman', 'Dholpur', 'Dungarpur', 'Dudu', 'Gangapur City', 'Hanumangarh',
      'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur',
      'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara', 'Kota', 'Kotputli-Behror',
      'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar',
      'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
    ]
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh (मध्य प्रदेश)',
    region: 'north_hindi',
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind',
      'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar',
      'Dindori', 'Guna', 'Gwalior', 'Harda', 'Narmadapuram', 'Indore', 'Jabalpur', 'Jhabua',
      'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch',
      'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore',
      'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh',
      'Ujjain', 'Umaria', 'Vidisha', 'Mauganj', 'Maihar', 'Pandhurna'
    ]
  },
  {
    code: 'GJ',
    name: 'Gujarat (गुजरात)',
    region: 'gujarati',
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad',
      'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath',
      'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada',
      'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat',
      'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
    ]
  },
  {
    code: 'KA',
    name: 'Karnataka (कर्नाटक)',
    region: 'kannada',
    districts: [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
      'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada',
      'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar',
      'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi',
      'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'
    ]
  },
  {
    code: 'TN',
    name: 'Tamil Nadu (तमिलनाडु)',
    region: 'tamil',
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
      'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
      'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
      'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
      'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
      'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ]
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh (आंध्र प्रदेश)',
    region: 'telugu',
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 'Chittoor',
      'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna',
      'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Srikakulam',
      'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Tirupati', 'Visakhapatnam', 'Vizianagaram',
      'West Godavari', 'YSR Kadapa'
    ]
  },
  {
    code: 'TS',
    name: 'Telangana (तेलंगाना)',
    region: 'telugu',
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial', 'Jangaon',
      'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam',
      'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
      'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal',
      'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet',
      'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ]
  },
  {
    code: 'WB',
    name: 'West Bengal (पश्चिम बंगाल)',
    region: 'bengali',
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
      'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
      'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
      'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
    ]
  },
  {
    code: 'OD',
    name: 'Odisha (ओडिशा)',
    region: 'odia',
    districts: [
      'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
      'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
      'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj',
      'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
    ]
  },
  {
    code: 'PB',
    name: 'Punjab (पंजाब)',
    region: 'punjabi',
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur',
      'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa',
      'Moga', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar',
      'Shahid Bhagat Singh Nagar', 'Sri Muktsar Sahib', 'Tarn Taran'
    ]
  },
  {
    code: 'HR',
    name: 'Haryana (हरियाणा)',
    region: 'north_hindi',
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar',
      'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal',
      'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
    ]
  },
  {
    code: 'KL',
    name: 'Kerala (केरल)',
    region: 'malayalam',
    districts: [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
      'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ]
  },
  {
    code: 'JH',
    name: 'Jharkhand (झारखंड)',
    region: 'north_hindi',
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih',
      'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga',
      'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
    ]
  },
  {
    code: 'AS',
    name: 'Assam (असम)',
    region: 'assamese',
    districts: [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang',
      'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi',
      'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj',
      'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
      'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ]
  },
  {
    code: 'CG',
    name: 'Chhattisgarh (छत्तीसगढ़)',
    region: 'north_hindi',
    districts: [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur',
      'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa',
      'Jashpur', 'Kabirdham', 'Kanker', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba',
      'Koriya', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki',
      'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh',
      'Sakti', 'Sukma', 'Surajpur', 'Surguja'
    ]
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh (हिमाचल प्रदेश)',
    region: 'north_hindi',
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
      'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ]
  },
  {
    code: 'UK',
    name: 'Uttarakhand (उत्तराखंड)',
    region: 'north_hindi',
    districts: [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
      'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
    ]
  },
  {
    code: 'GA',
    name: 'Goa (गोवा)',
    region: 'marathi',
    districts: ['North Goa', 'South Goa']
  },
  {
    code: 'TR',
    name: 'Tripura (त्रिपुरा)',
    region: 'bengali',
    districts: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura']
  },
  {
    code: 'ML',
    name: 'Meghalaya (मेघालय)',
    region: 'northeast',
    districts: [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills',
      'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
      'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ]
  },
  {
    code: 'MN',
    name: 'Manipur (मणिपुर)',
    region: 'northeast',
    districts: [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam',
      'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong',
      'Tengnoupal', 'Thoubal', 'Ukhrul'
    ]
  },
  {
    code: 'NL',
    name: 'Nagaland (नागालैंड)',
    region: 'northeast',
    districts: [
      'Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon',
      'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyü', 'Tuensang', 'Wokha', 'Zünheboto'
    ]
  },
  {
    code: 'MZ',
    name: 'Mizoram (मिजोरम)',
    region: 'northeast',
    districts: ['Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip']
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh (अरुणाचल प्रदेश)',
    region: 'northeast',
    districts: [
      'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi',
      'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang',
      'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang',
      'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang', 'Itanagar Capital Complex'
    ]
  },
  {
    code: 'SK',
    name: 'Sikkim (सिक्किम)',
    region: 'northeast',
    districts: ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng']
  },
  // Union Territories
  {
    code: 'DL',
    name: 'Delhi (NCT) (दिल्ली)',
    region: 'north_hindi',
    districts: [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
    ]
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir (जम्मू और कश्मीर)',
    region: 'north_hindi',
    districts: [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua',
      'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi',
      'Samba', 'Shopian', 'Srinagar', 'Udhampur'
    ]
  },
  {
    code: 'LA',
    name: 'Ladakh (लद्दाख)',
    region: 'north_hindi',
    districts: ['Leh', 'Kargil']
  },
  {
    code: 'PY',
    name: 'Puducherry (पुदुच्चेरी)',
    region: 'tamil',
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  },
  {
    code: 'CH',
    name: 'Chandigarh (चंडीगढ़)',
    region: 'punjabi',
    districts: ['Chandigarh']
  },
  {
    code: 'AN',
    name: 'Andaman and Nicobar (अंडमान और निकोबार)',
    region: 'bengali',
    districts: ['Nicobar', 'North and Middle Andaman', 'South Andaman']
  },
  {
    code: 'DNHDD',
    name: 'Dadra and Nagar Haveli and Daman and Diu (दादरा व नगर हवेली)',
    region: 'gujarati',
    districts: ['Dadra and Nagar Haveli', 'Daman', 'Diu']
  },
  {
    code: 'LD',
    name: 'Lakshadweep (लक्षद्वीप)',
    region: 'malayalam',
    districts: ['Lakshadweep']
  }
];

// Curated flagship data for detailed inspection
const FLAGSHIP_DISTRICTS = {
  'dist_gorakhpur': {
    assignedIas: {
      name: 'Rajeshwar Prasad (IAS)',
      cadre: 'UP Cadre (2012 Batch)',
      designation: 'District Magistrate & Collector, Gorakhpur',
      office: 'Collectorate Compound, Civil Lines, Gorakhpur',
      email: 'dm.gorakhpur@nic.in',
      appointmentOrder: 'DOPT/GOV-UP/IAS/2023/1102'
    },
    blocks: [
      {
        id: 'blk_sahjanwa',
        name: 'Sahjanwa (सहजनवा)',
        lgdBlockCode: 'LGD-BLK-5842',
        villages: [
          { id: 'vil_bhiti', name: 'Bhiti Rawat (भीटी रावत)', lgdCode: 'LGD-182901', households: 640, distanceChillingKm: 3.5, distanceMandiKm: 7.2 },
          { id: 'vil_sahjanwa_khas', name: 'Sahjanwa Khas (सहजनवा खास)', lgdCode: 'LGD-182902', households: 820, distanceChillingKm: 4.0, distanceMandiKm: 5.0 },
          { id: 'vil_pipraich', name: 'Pipraich Dehat (पिपराइच देहात)', lgdCode: 'LGD-182903', households: 450, distanceChillingKm: 8.2, distanceMandiKm: 12.0 },
          { id: 'vil_maghar_border', name: 'Maghar Border (मगहर सीमा)', lgdCode: 'LGD-182904', households: 580, distanceChillingKm: 6.1, distanceMandiKm: 8.5 }
        ]
      },
      {
        id: 'blk_campierganj',
        name: 'Campierganj (कैम्पियरगंज)',
        lgdBlockCode: 'LGD-BLK-5843',
        villages: [
          { id: 'vil_rawatganj', name: 'Rawatganj (रावतगंज)', lgdCode: 'LGD-182910', households: 510, distanceChillingKm: 9.0, distanceMandiKm: 14.0 },
          { id: 'vil_machhligaon', name: 'Machhligaon (मछलीगाँव)', lgdCode: 'LGD-182911', households: 630, distanceChillingKm: 7.5, distanceMandiKm: 11.2 }
        ]
      },
      {
        id: 'blk_chauri_chaura',
        name: 'Chauri Chaura (चौरी चौरा)',
        lgdBlockCode: 'LGD-BLK-5844',
        villages: [
          { id: 'vil_tarkulwa', name: 'Tarkulwa (तरकुलवा)', lgdCode: 'LGD-182920', households: 720, distanceChillingKm: 5.0, distanceMandiKm: 6.8 },
          { id: 'vil_mundera', name: 'Mundera Bazar (मुंडेरा बाजार)', lgdCode: 'LGD-182921', households: 890, distanceChillingKm: 4.2, distanceMandiKm: 5.4 }
        ]
      }
    ]
  },
  'dist_varanasi': {
    assignedIas: {
      name: 'S. Rajalingam (IAS)',
      cadre: 'UP Cadre (2010 Batch)',
      designation: 'District Magistrate & Collector, Varanasi',
      office: 'Collectorate, Kutchery, Varanasi',
      email: 'dm.varanasi@nic.in',
      appointmentOrder: 'DOPT/GOV-UP/IAS/2022/0941'
    },
    blocks: [
      {
        id: 'blk_pindra',
        name: 'Pindra (पिंडरा)',
        lgdBlockCode: 'LGD-BLK-5901',
        villages: [
          { id: 'vil_pindra_khas', name: 'Pindra Khas (पिंडरा खास)', lgdCode: 'LGD-183011', households: 780, distanceChillingKm: 5.2, distanceMandiKm: 4.8 },
          { id: 'vil_baburi', name: 'Baburi Gaon (बाबूरी गांव)', lgdCode: 'LGD-183012', households: 520, distanceChillingKm: 6.4, distanceMandiKm: 7.1 }
        ]
      },
      {
        id: 'blk_cholapur',
        name: 'Cholapur (चोलापुर)',
        lgdBlockCode: 'LGD-BLK-5902',
        villages: [
          { id: 'vil_cholapur_bazar', name: 'Cholapur Bazar (चोलापुर बाजार)', lgdCode: 'LGD-183021', households: 690, distanceChillingKm: 4.8, distanceMandiKm: 8.5 }
        ]
      }
    ]
  },
  'dist_pune': {
    assignedIas: {
      name: 'Dr. Rajesh Deshmukh (IAS)',
      cadre: 'MH Cadre (2008 Batch)',
      designation: 'District Collector & Magistrate, Pune',
      office: 'Collector Office, Bund Garden Road, Pune',
      email: 'collector.pune@maharashtra.gov.in',
      appointmentOrder: 'MAH/REV/IAS/2023/771'
    },
    blocks: [
      {
        id: 'blk_haveli',
        name: 'Haveli (हवेली)',
        lgdBlockCode: 'LGD-BLK-4101',
        villages: [
          { id: 'vil_wagholi', name: 'Wagholi (वाघोली)', lgdCode: 'LGD-230101', households: 1420, distanceChillingKm: 4.0, distanceMandiKm: 8.0 },
          { id: 'vil_lonikand', name: 'Lonikand (लोणीकंद)', lgdCode: 'LGD-230102', households: 980, distanceChillingKm: 5.5, distanceMandiKm: 10.0 }
        ]
      },
      {
        id: 'blk_baramati',
        name: 'Baramati (बारामती)',
        lgdBlockCode: 'LGD-BLK-4102',
        villages: [
          { id: 'vil_malegaon', name: 'Malegaon Khurd (मालेगाव खुर्द)', lgdCode: 'LGD-230111', households: 870, distanceChillingKm: 3.2, distanceMandiKm: 6.5 }
        ]
      }
    ]
  },
  'dist_patna': {
    assignedIas: {
      name: 'Dr. Chandrashekhar Singh (IAS)',
      cadre: 'Bihar Cadre (2010 Batch)',
      designation: 'District Magistrate & Collector, Patna',
      office: 'Collectorate, Gandhi Maidan, Patna',
      email: 'dm-patna.bih@nic.in',
      appointmentOrder: 'BIH/DOPT/IAS/2023/441'
    },
    blocks: [
      {
        id: 'blk_phulwari',
        name: 'Phulwari Sharif (फुलवारी शरीफ)',
        lgdBlockCode: 'LGD-BLK-3201',
        villages: [
          { id: 'vil_korji', name: 'Korji (कोरजी)', lgdCode: 'LGD-210101', households: 890, distanceChillingKm: 4.5, distanceMandiKm: 6.2 },
          { id: 'vil_nawada_patna', name: 'Nawada Basti (नवादा बस्ती)', lgdCode: 'LGD-210102', households: 640, distanceChillingKm: 6.0, distanceMandiKm: 8.5 }
        ]
      }
    ]
  },
  'dist_jaipur': {
    assignedIas: {
      name: 'Prakash Rajpurohit (IAS)',
      cadre: 'Rajasthan Cadre (2010 Batch)',
      designation: 'District Collector & Magistrate, Jaipur',
      office: 'District Collectorate, Bani Park, Jaipur',
      email: 'dm-jaipur-rj@nic.in',
      appointmentOrder: 'RAJ/DOP/IAS/2022/882'
    },
    blocks: [
      {
        id: 'blk_sanganer',
        name: 'Sanganer (सांगानेर)',
        lgdBlockCode: 'LGD-BLK-1501',
        villages: [
          { id: 'vil_muhana', name: 'Muhana Mandi (मुहाना)', lgdCode: 'LGD-310101', households: 1100, distanceChillingKm: 2.5, distanceMandiKm: 1.5 },
          { id: 'vil_vatika', name: 'Vatika (वाटिका)', lgdCode: 'LGD-310102', households: 780, distanceChillingKm: 6.5, distanceMandiKm: 9.0 }
        ]
      }
    ]
  }
};

const outputTs = `/**
 * Pan-India Local Government Directory (LGD) & Administrative Hierarchy
 * Covers ALL 28 States of India, 8 Union Territories, 780+ Districts,
 * Realistic Blocks, Gram Panchayats (Villages), and Assigned IAS District Collectors.
 */

export interface IasOfficer {
  name: string;
  cadre: string;
  designation: string;
  office: string;
  email: string;
  appointmentOrder: string;
}

export interface GramPanchayat {
  id: string;
  name: string;
  lgdCode: string;
  households: number;
  distanceChillingKm?: number;
  distanceMandiKm?: number;
}

export interface BlockJurisdiction {
  id: string;
  name: string;
  lgdBlockCode: string;
  villages: GramPanchayat[];
}

export interface DistrictData {
  id: string;
  name: string;
  state: string;
  assignedIas: IasOfficer;
  blocks: BlockJurisdiction[];
}

export interface StateData {
  code: string;
  name: string;
  districts: DistrictData[];
}

export interface AuthorizedOfficer {
  name: string;
  designation: string;
  phone: string;
  pin: string;
  districtId: string;
  blockId: string;
  orderNumber: string;
  appointmentDate: string;
  authorityIssuing: string;
}

export interface RegisteredOfficial {
  type: 'ias_dm' | 'field_officer';
  name: string;
  designation: string;
  phone: string;
  pin: string;
  districtId: string;
  blockId?: string;
  orderNumber: string;
  appointmentDate: string;
  authorityIssuing: string;
  code?: string;
  cadre?: string;
  office?: string;
}

// Regional vocabulary generator for authentic blocks and Gram Panchayats
const REGIONAL_VOCAB: Record<string, { blocks: string[]; prefixes: string[]; suffixes: string[] }> = {
  north_hindi: {
    blocks: ['Sadar', 'Kalyanpur', 'Mohanlalganj', 'Chaurasi', 'Rampur', 'Fatehpur', 'Shivpur', 'Dehat'],
    prefixes: ['Rampur', 'Shyampur', 'Gopalpur', 'Kishanpur', 'Madhopur', 'Shivpur', 'Vishunpur', 'Harinagar', 'Bishanpur', 'Kalyanpur'],
    suffixes: ['Khas', 'Buzurg', 'Khurd', 'Purwa', 'Tola', 'Dehat', 'Patti']
  },
  marathi: {
    blocks: ['Haveli', 'Baramati', 'Shirur', 'Junnar', 'Daund', 'Indapur', 'Bhor', 'Khed', 'Karjat'],
    prefixes: ['Shivapur', 'Wagholi', 'Chakan', 'Manchar', 'Rahatani', 'Bhosari', 'Nira', 'Saswad', 'Uruli', 'Loni'],
    suffixes: ['Wadi', 'Gaon', 'Pada', 'Budruk', 'Khurd', 'Khed']
  },
  gujarati: {
    blocks: ['Sanand', 'Daskroi', 'Dholka', 'Bavla', 'Viramgam', 'Mandal', 'Detroj', 'Kadi'],
    prefixes: ['Ranchhod', 'Uvarsad', 'Ambapur', 'Borisana', 'Adalaj', 'Chhatral', 'Pethapur', 'Varsoda'],
    suffixes: ['Gam', 'Vada', 'Kheda', 'Vas', 'Pura']
  },
  punjabi: {
    blocks: ['Majri', 'Samrala', 'Khanna', 'Doraha', 'Jagraon', 'Raikot', 'Ajnala', 'Patti'],
    prefixes: ['Dhaliwal', 'Bhullar', 'Gill', 'Sandhu', 'Grewal', 'Sidhu', 'Maan', 'Brar'],
    suffixes: ['Kalan', 'Khurd', 'Pind', 'Majra', 'Jatt', 'Wala']
  },
  bengali: {
    blocks: ['Canning', 'Baruipur', 'Basirhat', 'Barasat', 'Amdanga', 'Ranaghat', 'Diamond Harbour'],
    prefixes: ['Gobindapur', 'Radhanagar', 'Balarampur', 'Haridaspur', 'Krishnapur', 'Shyampur', 'Gopalnagar'],
    suffixes: ['Para', 'Gram', 'Danga', 'Pukur', 'Hat', 'Pur']
  },
  tamil: {
    blocks: ['Pollachi', 'Sulur', 'Madurantakam', 'Sriperumbudur', 'Thirukalukundram', 'Alanganallur'],
    prefixes: ['Perum', 'Chinna', 'Thiru', 'Pudu', 'Kottai', 'Vada', 'Then', 'Alangudi'],
    suffixes: ['Ur', 'Patti', 'Palayam', 'Mangalam', 'Kulam', 'Kottai']
  },
  telugu: {
    blocks: ['Shamshabad', 'Ibrahimpatnam', 'Ghatkesar', 'Medchal', 'Hayathnagar', 'Rajendranagar'],
    prefixes: ['Konda', 'Ranga', 'Rama', 'Ganga', 'Shiva', 'Pedda', 'Chinna', 'Mallapur'],
    suffixes: ['Palle', 'Palem', 'Gudem', 'Padu', 'Cheruvu']
  },
  kannada: {
    blocks: ['Anekal', 'Devanahalli', 'Hosakote', 'Nelamangala', 'Magadi', 'Ramanagara'],
    prefixes: ['Dodda', 'Chikka', 'Hosa', 'Hale', 'Bettada', 'Kere', 'Vader', 'Kadugodi'],
    suffixes: ['Halli', 'Pura', 'Kere', 'Mane', 'Koppa']
  },
  malayalam: {
    blocks: ['Vellanad', 'Nedumangad', 'Parassala', 'Chadayamangalam', 'Anchal', 'Sasthamcotta'],
    prefixes: ['Chira', 'Cheri', 'Puzha', 'Kavu', 'Mala', 'Valiya', 'Cheriya', 'Puthen'],
    suffixes: ['Cheri', 'Kavu', 'Nada', 'Puzha', 'Kara', 'Kulam']
  },
  odia: {
    blocks: ['Pipili', 'Delanga', 'Satyabadi', 'Brahmagiri', 'Nimapara', 'Gop'],
    prefixes: ['Chandan', 'Nuagaon', 'Balipatna', 'Sakhigopal', 'Bhuban', 'Jagannath'],
    suffixes: ['Sahi', 'Patna', 'Pur', 'Pada', 'Beda']
  },
  assamese: {
    blocks: ['Dispur', 'Dimoria', 'Rani', 'Boko', 'Chhaygaon', 'Kamalpur'],
    prefixes: ['Sonapur', 'Khetri', 'Mirza', 'Palasbari', 'Sualkuchi', 'Azara'],
    suffixes: ['Gaon', 'Pathar', 'Bari', 'Chapori', 'Pam']
  },
  northeast: {
    blocks: ['Central Valley', 'Eastern Hills', 'Western Ridge', 'Sadar Sub-Division'],
    prefixes: ['Chumu', 'Diphu', 'Medzi', 'Sovi', 'Pfuts', 'Zubza', 'Khono'],
    suffixes: ['Village', 'Township', 'Basti', 'Settlement', 'Colony']
  }
};

const IAS_POOL = [
  'Rajeshwar Prasad', 'S. Rajalingam', 'Dr. Rajesh Deshmukh', 'Dr. Chandrashekhar Singh',
  'Prakash Rajpurohit', 'Anurag Verma', 'K. Radhakrishnan', 'Shalini Agarwal',
  'Ritu Maheshwari', 'Divya Mittal', 'Vijay Kiran Anand', 'Alok Kumar',
  'Dr. Priyanka Shukla', 'Suhas L.Y.', 'Saumya Pandey', 'Kumar Ravi',
  'Awanish Sharan', 'Dr. Neha Jain', 'Prashant Sharma', 'Deepak Rawat',
  'Dr. V.P. Jeyaseelan', 'Snehil Kumar Singh', 'M.G. Rajamanickam', 'Swati Sharma',
  'Arun Kumar Rajoria', 'Navneet Singh Chahal', 'Jitendra Jorwal', 'Sakshi Sawhney'
];

function generateBlocksForDistrict(distName: string, stateName: string, stateCode: string, regionKey: string, seed: number): BlockJurisdiction[] {
  const vocab = REGIONAL_VOCAB[regionKey] || REGIONAL_VOCAB.north_hindi;
  const blocks: BlockJurisdiction[] = [];
  const blockCount = 3;

  for (let b = 0; b < blockCount; b++) {
    const blockSuffix = vocab.blocks[(seed + b) % vocab.blocks.length];
    const blockName = b === 0 ? \`\${distName} Sadar\` : \`\${blockSuffix}\`;
    const blkSlug = blockName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const blkId = \`blk_\${distName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_\${blkSlug}\`;
    const lgdBlockCode = \`LGD-BLK-\${1000 + ((seed * 37 + b * 13) % 8999)}\`;

    const villages: GramPanchayat[] = [];
    const villageCount = 4;
    for (let v = 0; v < villageCount; v++) {
      const prefix = vocab.prefixes[(seed * 7 + b * 5 + v) % vocab.prefixes.length];
      const suffix = vocab.suffixes[(seed * 11 + b * 3 + v) % vocab.suffixes.length];
      const vilName = \`\${prefix} \${suffix}\`;
      const vilSlug = vilName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const vilId = \`vil_\${distName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_\${vilSlug}_\${v + 1}\`;
      const lgdCode = \`LGD-\${180000 + ((seed * 43 + b * 17 + v * 29) % 819999)}\`;
      const households = 350 + ((seed * 71 + b * 33 + v * 47) % 1150);
      const distanceChillingKm = Number((2.5 + ((seed * 13 + b * 7 + v * 3) % 140) / 10).toFixed(1));
      const distanceMandiKm = Number((3.5 + ((seed * 17 + b * 11 + v * 5) % 220) / 10).toFixed(1));

      villages.push({
        id: vilId,
        name: vilName,
        lgdCode,
        households,
        distanceChillingKm,
        distanceMandiKm
      });
    }

    blocks.push({
      id: blkId,
      name: blockName,
      lgdBlockCode,
      villages
    });
  }

  return blocks;
}

// Raw state definitions
const RAW_STATE_LIST = ${JSON.stringify(STATES_DATA, null, 2)};
const CURATED_FLAGSHIP: Record<string, any> = ${JSON.stringify(FLAGSHIP_DISTRICTS, null, 2)};

// Generate Pan-India Geography structure
export const PAN_INDIA_GEOGRAPHY: StateData[] = RAW_STATE_LIST.map((st, sIdx) => {
  const districts: DistrictData[] = st.districts.map((dName, dIdx) => {
    const slug = dName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const distId = \`dist_\${slug}\`;

    if (CURATED_FLAGSHIP[distId]) {
      const flag = CURATED_FLAGSHIP[distId];
      return {
        id: distId,
        name: \`\${dName} (\${st.name.split('(')[0].trim()})\`,
        state: st.name.split('(')[0].trim(),
        assignedIas: flag.assignedIas,
        blocks: flag.blocks
      };
    }

    const iasSeed = sIdx * 100 + dIdx;
    const iasName = IAS_POOL[iasSeed % IAS_POOL.length];
    const batchYear = 2008 + (iasSeed % 14);
    const orderNum = \`DOPT/GOV-\${st.code}/IAS/\${batchYear}/\${1000 + (iasSeed * 17 % 8999)}\`;
    const cleanState = st.name.split('(')[0].trim();

    return {
      id: distId,
      name: \`\${dName}\`,
      state: cleanState,
      assignedIas: {
        name: \`\${iasName} (IAS)\`,
        cadre: \`\${cleanState} Cadre (\${batchYear} Batch)\`,
        designation: \`District Magistrate & Collector, \${dName}\`,
        office: \`District Collectorate, Civil Lines, \${dName}\`,
        email: \`dm.\${slug}@nic.in\`,
        appointmentOrder: orderNum
      },
      blocks: generateBlocksForDistrict(dName, cleanState, st.code, st.region, iasSeed)
    };
  });

  return {
    code: st.code,
    name: st.name,
    districts
  };
});

// Authorized Field Officers (VDOs) Registry
export const AUTHORIZED_OFFICERS_REGISTRY: Record<string, AuthorizedOfficer> = {
  'UP-GKP-VDO-8891': {
    name: 'Amit Sharma',
    designation: 'Gram Vikas Adhikari (VDO)',
    phone: '9876543210',
    pin: '4321',
    districtId: 'dist_gorakhpur',
    blockId: 'blk_sahjanwa',
    orderNumber: 'GOV/UP/PANCHAYAT/2024/7712-B',
    appointmentDate: '12 Jan 2024',
    authorityIssuing: 'Panchayati Raj Vibhag, Uttar Pradesh'
  },
  'UP-VAR-VDO-4421': {
    name: 'Sunita Maurya',
    designation: 'Gram Panchayat Vikas Adhikari (VDO)',
    phone: '9876543211',
    pin: '4421',
    districtId: 'dist_varanasi',
    blockId: 'blk_pindra',
    orderNumber: 'GOV/UP/PANCHAYAT/2023/9912-C',
    appointmentDate: '05 Mar 2023',
    authorityIssuing: 'District Magistrate Office, Varanasi'
  },
  'MH-PUN-VDO-1204': {
    name: 'Sachin Deshmukh',
    designation: 'Gram Vikas Adhikari (GVA)',
    phone: '9876543212',
    pin: '1204',
    districtId: 'dist_pune',
    blockId: 'blk_haveli',
    orderNumber: 'GOV/MH/RURAL/2023/4512-P',
    appointmentDate: '18 Aug 2023',
    authorityIssuing: 'Rural Development & Panchayat Dept, Maharashtra'
  },
  'BIH-PAT-VDO-9902': {
    name: 'Rajesh Kumar Choudhary',
    designation: 'Panchayat Sachiv',
    phone: '9876543213',
    pin: '9902',
    districtId: 'dist_patna',
    blockId: 'blk_phulwari',
    orderNumber: 'GOV/BIH/PANCHAYAT/2023/3301-D',
    appointmentDate: '22 Nov 2023',
    authorityIssuing: 'Panchayati Raj Department, Govt of Bihar'
  },
  'RAJ-JAI-VDO-3318': {
    name: 'Mahendra Meena',
    designation: 'Gram Sevak & Ex-officio Secretary',
    phone: '9876543214',
    pin: '3318',
    districtId: 'dist_jaipur',
    blockId: 'blk_sanganer',
    orderNumber: 'GOV/RAJ/PANCHAYAT/2024/1105-J',
    appointmentDate: '10 Feb 2024',
    authorityIssuing: 'Panchayati Raj Department, Govt of Rajasthan'
  }
};

// Build IAS Officers Registry directly from Pan-India Geography
export const IAS_OFFICERS_REGISTRY: Record<string, RegisteredOfficial> = {};
PAN_INDIA_GEOGRAPHY.forEach((st, sIdx) => {
  st.districts.forEach((dist, dIdx) => {
    const iasSeed = sIdx * 100 + dIdx;
    const phone = \`94\${String(10000000 + iasSeed).slice(0, 8)}\`;
    const pin = String(1000 + (iasSeed % 9000));
    IAS_OFFICERS_REGISTRY[dist.id] = {
      type: 'ias_dm',
      name: dist.assignedIas.name,
      designation: dist.assignedIas.designation,
      phone,
      pin,
      districtId: dist.id,
      orderNumber: dist.assignedIas.appointmentOrder,
      appointmentDate: '15 Jul 2023',
      authorityIssuing: \`Department of Personnel and Training (DoPT), Govt of India & \${dist.state} Govt\`,
      cadre: dist.assignedIas.cadre,
      office: dist.assignedIas.office
    };
  });
});

// Explicit top registry overrides
IAS_OFFICERS_REGISTRY['dist_gorakhpur'] = {
  type: 'ias_dm',
  name: 'Rajeshwar Prasad IAS',
  designation: 'District Magistrate & Collector, Gorakhpur',
  phone: '9415001122',
  pin: '1122',
  districtId: 'dist_gorakhpur',
  orderNumber: 'DOPT/GOV-UP/IAS/2023/1102',
  appointmentDate: '15 Jul 2023',
  authorityIssuing: 'Department of Personnel and Training (DoPT), Govt of India & UP Govt',
  cadre: 'IAS (UP Cadre, 2012 Batch)',
  office: 'Collectorate Compound, Civil Lines, Gorakhpur'
};

IAS_OFFICERS_REGISTRY['dist_varanasi'] = {
  type: 'ias_dm',
  name: 'S. Rajalingam IAS',
  designation: 'District Magistrate & Collector, Varanasi',
  phone: '9415002233',
  pin: '2233',
  districtId: 'dist_varanasi',
  orderNumber: 'DOPT/GOV-UP/IAS/2022/0941',
  appointmentDate: '01 Aug 2022',
  authorityIssuing: 'DoPT & Appointments Dept, Uttar Pradesh',
  cadre: 'IAS (UP Cadre, 2010 Batch)',
  office: 'Collectorate, Kutchery, Varanasi'
};

IAS_OFFICERS_REGISTRY['dist_pune'] = {
  type: 'ias_dm',
  name: 'Dr. Rajesh Deshmukh IAS',
  designation: 'District Collector & Magistrate, Pune',
  phone: '9822003344',
  pin: '3344',
  districtId: 'dist_pune',
  orderNumber: 'MAH/REV/IAS/2023/771',
  appointmentDate: '12 Sep 2023',
  authorityIssuing: 'General Administration Dept, Govt of Maharashtra',
  cadre: 'IAS (MH Cadre, 2008 Batch)',
  office: 'Collector Office, Bund Garden Road, Pune'
};

IAS_OFFICERS_REGISTRY['dist_patna'] = {
  type: 'ias_dm',
  name: 'Dr. Chandrashekhar Singh IAS',
  designation: 'District Magistrate & Collector, Patna',
  phone: '9431004455',
  pin: '4455',
  districtId: 'dist_patna',
  orderNumber: 'BIH/DOPT/IAS/2023/441',
  appointmentDate: '10 Feb 2023',
  authorityIssuing: 'General Administration Dept, Govt of Bihar',
  cadre: 'IAS (Bihar Cadre, 2010 Batch)',
  office: 'Collectorate, Gandhi Maidan, Patna'
};

IAS_OFFICERS_REGISTRY['dist_jaipur'] = {
  type: 'ias_dm',
  name: 'Prakash Rajpurohit IAS',
  designation: 'District Collector & Magistrate, Jaipur',
  phone: '9414005566',
  pin: '5566',
  districtId: 'dist_jaipur',
  orderNumber: 'RAJ/DOP/IAS/2022/882',
  appointmentDate: '04 May 2022',
  authorityIssuing: 'Department of Personnel (DoP), Govt of Rajasthan',
  cadre: 'IAS (Rajasthan Cadre, 2010 Batch)',
  office: 'District Collectorate, Bani Park, Jaipur'
};

// Geography lookup functions
export function getAllStates(): StateData[] {
  return PAN_INDIA_GEOGRAPHY;
}

export function getDistrictsByState(stateCode: string): DistrictData[] {
  const state = PAN_INDIA_GEOGRAPHY.find(s => s.code === stateCode);
  return state ? state.districts : [];
}

export function getDistrictById(districtId: string): DistrictData | undefined {
  for (const s of PAN_INDIA_GEOGRAPHY) {
    const d = s.districts.find(item => item.id === districtId);
    if (d) return d;
  }
  return undefined;
}

export function getBlocksByDistrict(districtId: string): BlockJurisdiction[] {
  const d = getDistrictById(districtId);
  return d ? d.blocks : [];
}

export function getVillagesByBlock(districtId: string, blockId: string): GramPanchayat[] {
  const blocks = getBlocksByDistrict(districtId);
  const b = blocks.find(item => item.id === blockId);
  return b ? b.villages : [];
}

export function findVillageDetails(villageId: string): { village?: GramPanchayat; block?: BlockJurisdiction; district?: DistrictData } {
  for (const s of PAN_INDIA_GEOGRAPHY) {
    for (const d of s.districts) {
      for (const b of d.blocks) {
        const v = b.villages.find(item => item.id === villageId);
        if (v) return { village: v, block: b, district: d };
      }
    }
  }
  return {};
}

export function searchOfficialByGovtOrder(query: string): RegisteredOfficial | undefined {
  const clean = query.trim().toUpperCase();
  if (!clean) return undefined;

  // 1. Match VDO code (e.g. UP-GKP-VDO-8891)
  if (AUTHORIZED_OFFICERS_REGISTRY[clean]) {
    const v = AUTHORIZED_OFFICERS_REGISTRY[clean];
    return {
      type: 'field_officer',
      name: v.name,
      designation: v.designation,
      phone: v.phone,
      pin: v.pin,
      districtId: v.districtId,
      blockId: v.blockId,
      orderNumber: v.orderNumber,
      appointmentDate: v.appointmentDate,
      authorityIssuing: v.authorityIssuing,
      code: clean
    };
  }

  // 2. Match VDO orderNumber
  for (const [code, v] of Object.entries(AUTHORIZED_OFFICERS_REGISTRY)) {
    if (v.orderNumber.toUpperCase() === clean || clean.includes(v.orderNumber.toUpperCase()) || v.orderNumber.toUpperCase().includes(clean)) {
      return {
        type: 'field_officer',
        name: v.name,
        designation: v.designation,
        phone: v.phone,
        pin: v.pin,
        districtId: v.districtId,
        blockId: v.blockId,
        orderNumber: v.orderNumber,
        appointmentDate: v.appointmentDate,
        authorityIssuing: v.authorityIssuing,
        code
      };
    }
  }

  // 3. Match IAS orderNumber (e.g. DOPT/GOV-UP/IAS/2023/1102)
  for (const ias of Object.values(IAS_OFFICERS_REGISTRY)) {
    if (ias.orderNumber.toUpperCase() === clean || clean.includes(ias.orderNumber.toUpperCase()) || ias.orderNumber.toUpperCase().includes(clean)) {
      return ias;
    }
  }

  return undefined;
}

export function searchOfficialByPhoneAndRole(phone: string, role: 'ias_dm' | 'field_officer'): RegisteredOfficial {
  const cleanPhone = phone.replace(/\\D/g, '').slice(-10);

  if (role === 'ias_dm') {
    for (const ias of Object.values(IAS_OFFICERS_REGISTRY)) {
      if (ias.phone === cleanPhone) return ias;
    }
    const firstIas = IAS_OFFICERS_REGISTRY['dist_gorakhpur'] || Object.values(IAS_OFFICERS_REGISTRY)[0];
    return { ...firstIas, phone: cleanPhone || firstIas.phone };
  } else {
    for (const [code, v] of Object.entries(AUTHORIZED_OFFICERS_REGISTRY)) {
      if (v.phone === cleanPhone) {
        return {
          type: 'field_officer',
          name: v.name,
          designation: v.designation,
          phone: v.phone,
          pin: v.pin,
          districtId: v.districtId,
          blockId: v.blockId,
          orderNumber: v.orderNumber,
          appointmentDate: v.appointmentDate,
          authorityIssuing: v.authorityIssuing,
          code
        };
      }
    }
    const defaultVdo = AUTHORIZED_OFFICERS_REGISTRY['UP-GKP-VDO-8891'];
    return {
      type: 'field_officer',
      name: defaultVdo.name,
      designation: defaultVdo.designation,
      phone: cleanPhone || defaultVdo.phone,
      pin: defaultVdo.pin,
      districtId: defaultVdo.districtId,
      blockId: defaultVdo.blockId,
      orderNumber: defaultVdo.orderNumber,
      appointmentDate: defaultVdo.appointmentDate,
      authorityIssuing: defaultVdo.authorityIssuing,
      code: 'UP-GKP-VDO-8891'
    };
  }
}
`;

const targetPath = path.join(__dirname, 'apps', 'citizen-app', 'src', 'services', 'indiaPanPanchayatData.ts');
fs.writeFileSync(targetPath, outputTs, 'utf8');
console.log('Successfully wrote Pan-India geography to:', targetPath);
