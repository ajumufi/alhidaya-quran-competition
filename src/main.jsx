
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import {
  Menu, X, ArrowUpRight, CheckCircle2, BookOpen,
  Trophy, CalendarDays, MapPin, ShieldCheck,
  MessageCircle, Send, Bot
} from 'lucide-react'

import './style.css'
import Admin from './Admin'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

const districtsByState = {
  'Andhra Pradesh': ['Alluri Sitharama Raju','Anakapalli','Anantapur','Annamayya','Bapatla','Chittoor','Dr B R Ambedkar Konaseema','East Godavari','Eluru','Guntur','Kakinada','Krishna','Kurnool','Nandyal','NTR','Palnadu','Parvathipuram Manyam','Prakasam','Sri Potti Sriramulu Nellore','Sri Sathya Sai','Srikakulam','Tirupati','Visakhapatnam','Vizianagaram','West Godavari','YSR Kadapa'],
  'Arunachal Pradesh': ['Anjaw','Bichom','Changlang','Dibang Valley','East Kameng','East Siang','Itanagar Capital Complex','Kamle','Keyi Panyor','Kra Daadi','Kurung Kumey','Lepa Rada','Lohit','Longding','Lower Dibang Valley','Lower Siang','Lower Subansiri','Namsai','Pakke Kessang','Papum Pare','Shi Yomi','Siang','Tawang','Tirap','Upper Siang','Upper Subansiri','West Kameng','West Siang'],
  'Assam': ['Baksa','Bajali','Barpeta','Biswanath','Bongaigaon','Cachar','Charaideo','Chirang','Darrang','Dhemaji','Dhubri','Dibrugarh','Dima Hasao','Goalpara','Golaghat','Hailakandi','Hojai','Jorhat','Kamrup','Kamrup Metropolitan','Karbi Anglong','Karimganj','Kokrajhar','Lakhimpur','Majuli','Morigaon','Nagaon','Nalbari','Sivasagar','Sonitpur','South Salmara-Mankachar','Sribhumi','Tamulpur','Tinsukia','Udalguri','West Karbi Anglong'],
  'Bihar': ['Araria','Arwal','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran','Gaya','Gopalganj','Jamui','Jehanabad','Kaimur','Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura','Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur','Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan','Supaul','Vaishali','West Champaran'],
  'Chhattisgarh': ['Balod','Baloda Bazar','Balrampur-Ramanujganj','Bastar','Bemetara','Bijapur','Bilaspur','Dantewada','Dhamtari','Durg','Gariaband','Gaurela-Pendra-Marwahi','Janjgir-Champa','Jashpur','Kabirdham','Kanker','Khairagarh-Chhuikhadan-Gandai','Kondagaon','Korba','Korea','Mahasamund','Manendragarh-Chirmiri-Bharatpur','Mohla-Manpur-Ambagarh Chowki','Mungeli','Narayanpur','Raigarh','Raipur','Rajnandgaon','Sakti','Sarangarh-Bilaigarh','Sukma','Surajpur','Surguja'],
  'Goa': ['North Goa','South Goa'],
  'Gujarat': ['Ahmedabad','Amreli','Anand','Aravalli','Banaskantha','Bharuch','Bhavnagar','Botad','Chhota Udepur','Dahod','Dang','Devbhoomi Dwarka','Gandhinagar','Gir Somnath','Jamnagar','Junagadh','Kheda','Kutch','Mahisagar','Mehsana','Morbi','Narmada','Navsari','Panchmahal','Patan','Porbandar','Rajkot','Sabarkantha','Surat','Surendranagar','Tapi','Vadodara','Valsad'],
  'Haryana': ['Ambala','Bhiwani','Charkhi Dadri','Faridabad','Fatehabad','Gurugram','Hisar','Jhajjar','Jind','Kaithal','Karnal','Kurukshetra','Mahendragarh','Nuh','Palwal','Panchkula','Panipat','Rewari','Rohtak','Sirsa','Sonipat','Yamunanagar'],
  'Himachal Pradesh': ['Bilaspur','Chamba','Hamirpur','Kangra','Kinnaur','Kullu','Lahaul and Spiti','Mandi','Shimla','Sirmaur','Solan','Una'],
  'Jharkhand': ['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','East Singhbhum','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahibganj','Seraikela-Kharsawan','Simdega','West Singhbhum'],
  'Karnataka': ['Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru Urban','Bidar','Chamarajanagar','Chikkaballapur','Chikkamagaluru','Chitradurga','Dakshina Kannada','Davanagere','Dharwad','Gadag','Hassan','Haveri','Kalaburagi','Kodagu','Kolar','Koppal','Mandya','Mysuru','Raichur','Ramanagara','Shivamogga','Tumakuru','Udupi','Uttara Kannada','Vijayanagara','Vijayapura','Yadgir'],
  'Kerala': ['Alappuzha','Ernakulam','Idukki','Kannur','Kasaragod','Kollam','Kottayam','Kozhikode','Malappuram','Palakkad','Pathanamthitta','Thiruvananthapuram','Thrissur','Wayanad'],
  'Madhya Pradesh': ['Agar Malwa','Alirajpur','Anuppur','Ashoknagar','Balaghat','Barwani','Betul','Bhind','Bhopal','Burhanpur','Chhatarpur','Chhindwara','Damoh','Datia','Dewas','Dhar','Dindori','Guna','Gwalior','Harda','Indore','Jabalpur','Jhabua','Katni','Khandwa','Khargone','Maihar','Mandla','Mandsaur','Mauganj','Morena','Narmadapuram','Narsinghpur','Neemuch','Niwari','Panna','Pandhurna','Raisen','Rajgarh','Ratlam','Rewa','Sagar','Satna','Sehore','Seoni','Shahdol','Shajapur','Sheopur','Shivpuri','Sidhi','Singrauli','Tikamgarh','Ujjain','Umaria','Vidisha'],
  'Maharashtra': ['Ahilyanagar','Akola','Amravati','Beed','Bhandara','Buldhana','Chandrapur','Chhatrapati Sambhajinagar','Dharashiv','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar','Nashik','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'],
  'Manipur': ['Bishnupur','Chandel','Churachandpur','Imphal East','Imphal West','Jiribam','Kakching','Kamjong','Kangpokpi','Noney','Pherzawl','Senapati','Tamenglong','Tengnoupal','Thoubal','Ukhrul'],
  'Meghalaya': ['East Garo Hills','East Jaintia Hills','East Khasi Hills','Eastern West Khasi Hills','North Garo Hills','Ri Bhoi','South Garo Hills','South West Garo Hills','South West Khasi Hills','West Garo Hills','West Jaintia Hills','West Khasi Hills'],
  'Mizoram': ['Aizawl','Champhai','Hnahthial','Khawzawl','Kolasib','Lawngtlai','Lunglei','Mamit','Saiha','Saitual','Serchhip'],
  'Nagaland': ['Chumoukedima','Dimapur','Kiphire','Kohima','Longleng','Meluri','Mokokchung','Mon','Niuland','Noklak','Peren','Phek','Shamator','Tseminyu','Tuensang','Wokha','Zunheboto'],
  'Odisha': ['Angul','Balangir','Balasore','Bargarh','Bhadrak','Boudh','Cuttack','Deogarh','Dhenkanal','Gajapati','Ganjam','Jagatsinghpur','Jajpur','Jharsuguda','Kalahandi','Kandhamal','Kendrapara','Kendujhar','Khordha','Koraput','Malkangiri','Mayurbhanj','Nabarangpur','Nayagarh','Nuapada','Puri','Rayagada','Sambalpur','Subarnapur','Sundargarh'],
  'Punjab': ['Amritsar','Barnala','Bathinda','Faridkot','Fatehgarh Sahib','Fazilka','Ferozepur','Gurdaspur','Hoshiarpur','Jalandhar','Kapurthala','Ludhiana','Malerkotla','Mansa','Moga','Pathankot','Patiala','Rupnagar','Sahibzada Ajit Singh Nagar','Sangrur','Shahid Bhagat Singh Nagar','Sri Muktsar Sahib','Tarn Taran'],
  'Rajasthan': ['Ajmer','Alwar','Balotra','Banswara','Baran','Barmer','Beawar','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh','Churu','Dausa','Deeg','Dholpur','Didwana-Kuchaman','Dudu','Dungarpur','Gangapur City','Hanumangarh','Jaipur','Jaipur Rural','Jaisalmer','Jalore','Jhalawar','Jhunjhunu','Jodhpur','Jodhpur Rural','Karauli','Kekri','Khairthal-Tijara','Kota','Kotputli-Behror','Nagaur','Neem Ka Thana','Pali','Phalodi','Pratapgarh','Rajsamand','Salumbar','Sanchore','Sawai Madhopur','Shahpura','Sikar','Sirohi','Sri Ganganagar','Tonk','Udaipur'],
  'Sikkim': ['Gangtok','Gyalshing','Mangan','Namchi','Pakyong','Soreng'],
  'Tamil Nadu': ['Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kancheepuram','Kanniyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai','Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'],
  'Telangana': ['Adilabad','Bhadradri Kothagudem','Hanamkonda','Hyderabad','Jagtial','Jangaon','Jayashankar Bhupalpally','Jogulamba Gadwal','Kamareddy','Karimnagar','Khammam','Komaram Bheem Asifabad','Mahabubabad','Mahabubnagar','Mancherial','Medak','Medchal-Malkajgiri','Mulugu','Nagarkurnool','Nalgonda','Narayanpet','Nirmal','Nizamabad','Peddapalli','Rajanna Sircilla','Rangareddy','Sangareddy','Siddipet','Suryapet','Vikarabad','Wanaparthy','Warangal','Yadadri Bhuvanagiri'],
  'Tripura': ['Dhalai','Gomati','Khowai','North Tripura','Sepahijala','South Tripura','Unakoti','West Tripura'],
  'Uttar Pradesh': ['Agra','Aligarh','Ambedkar Nagar','Amethi','Amroha','Auraiya','Ayodhya','Azamgarh','Baghpat','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bhadohi','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur','Jhansi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kheri','Kushinagar','Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Prayagraj','Raebareli','Rampur','Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shrawasti','Siddharthnagar','Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'],
  'Uttarakhand': ['Almora','Bageshwar','Chamoli','Champawat','Dehradun','Haridwar','Nainital','Pauri Garhwal','Pithoragarh','Rudraprayag','Tehri Garhwal','Udham Singh Nagar','Uttarkashi'],
  'West Bengal': ['Alipurduar','Bankura','Birbhum','Cooch Behar','Dakshin Dinajpur','Darjeeling','Hooghly','Howrah','Jalpaiguri','Jhargram','Kalimpong','Kolkata','Malda','Murshidabad','Nadia','North 24 Parganas','Paschim Bardhaman','Paschim Medinipur','Purba Bardhaman','Purba Medinipur','Purulia','South 24 Parganas','Uttar Dinajpur'],
  'Andaman and Nicobar Islands': ['Nicobar','North and Middle Andaman','South Andaman'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli','Daman','Diu'],
  'Delhi': ['Central Delhi','East Delhi','New Delhi','North Delhi','North East Delhi','North West Delhi','Shahdara','South Delhi','South East Delhi','South West Delhi','West Delhi'],
  'Jammu and Kashmir': ['Anantnag','Bandipora','Baramulla','Budgam','Doda','Ganderbal','Jammu','Kathua','Kishtwar','Kulgam','Kupwara','Poonch','Pulwama','Rajouri','Ramban','Reasi','Samba','Shopian','Srinagar','Udhampur'],
  'Ladakh': ['Kargil','Leh'],
  'Lakshadweep': ['Lakshadweep'],
  'Puducherry': ['Karaikal','Mahe','Puducherry','Yanam']
}

function AlHidayaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState([
    {
      from: 'bot',
      text: 'Assalamu Alaikum! Welcome to Al Hidaya Islamic University. How can I help you?\n\nനമസ്കാരം! എന്താണ് അറിയേണ്ടത്?'
    }
  ])

  const getReply = (rawQuestion) => {
    const q = rawQuestion.toLowerCase().replace(/[?.,!]/g, ' ').trim()
    const has = (...words) => words.some(word => q.includes(word))

    if (has('date', 'when', 'തീയതി', 'എപ്പോൾ', 'eppol', 'epo')) {
      return 'The Quran Interpretation Competition will be held on 27 January 2027.\n\nമത്സരം 2027 ജനുവരി 27-നാണ് നടക്കുന്നത്.'
    }

    if (has('venue', 'where', 'location', 'സ്ഥലം', 'എവിടെ', 'evide', 'uliyil', 'kannur')) {
      return 'The event venue is Al Hidaya Islamic University, Uliyil, Mattannur, Kannur, Kerala, India.\n\nവേദി: അൽ ഹിദായ ഇസ്ലാമിക് യൂണിവേഴ്സിറ്റി, ഉളിയിൽ, മട്ടന്നൂർ, കണ്ണൂർ, കേരളം.'
    }

    if (has('prize', 'award', 'സമ്മാനം', 'സമ്മാന', 'prize money')) {
      return 'Competition prizes:\n1st Prize: ₹1,00,000\n2nd Prize: ₹50,000\n3rd Prize: ₹25,000\n\nAll prizes include a certificate.'
    }

    if (has('register', 'registration', 'apply', 'രജിസ്റ്റർ', 'രജിസ്ട്രേഷൻ', 'അപേക്ഷ', 'register cheyy')) {
      return 'To register, go to the Register section on this website and complete all required fields. Upload your passport-size photo and submit the form.\n\nരജിസ്റ്റർ ചെയ്യാൻ വെബ്സൈറ്റിലെ Register ഭാഗത്ത് ആവശ്യമായ വിവരങ്ങൾ പൂരിപ്പിച്ച് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്ത് Submit Details അമർത്തുക.'
    }

    if (has('registration number', 'reg number', 'card', 'നമ്പർ', 'കാർഡ്', 'number')) {
      return 'After a successful registration, your registration card and registration number will appear on the website. Please save or print the card.'
    }

    if (has('category', 'student', 'open', 'വിഭാഗം', 'കാറ്റഗറി')) {
      return 'The registration form currently provides these categories: Student, Open and Other. Select the category that applies to you.'
    }

    if (has('contact', 'phone', 'mobile', 'email', 'ബന്ധപ്പെട', 'വിളിക്ക', 'നമ്പർ')) {
      return 'You can contact Al Hidaya Islamic University:\nEmail: ahiuofficial@gmail.com\n+91 8590449652\n+91 8590990325\n+91 9497167463'
    }

    if (has('hello', 'hi', 'salam', 'assalamu', 'ഹലോ', 'നമസ്കാരം', 'സലാം')) {
      return 'Wa Alaikum Assalam! You can ask me about registration, competition date, venue, prizes or contact details.\n\nരജിസ്ട്രേഷൻ, തീയതി, വേദി, സമ്മാനങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.'
    }

    return 'I can help with registration, competition date, venue, prizes, registration card and contact details. Please ask about one of these topics.\n\nരജിസ്ട്രേഷൻ, മത്സരത്തീയതി, വേദി, സമ്മാനങ്ങൾ, രജിസ്ട്രേഷൻ കാർഡ്, ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ എന്നിവ ചോദിക്കാം.'
  }

  const sendMessage = (e) => {
    e?.preventDefault()
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return

    const reply = getReply(cleanQuestion)
    setChat(previous => [
      ...previous,
      { from: 'user', text: cleanQuestion },
      { from: 'bot', text: reply }
    ])
    setQuestion('')
  }

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: 9999,
      fontFamily: 'inherit'
    }}>
      {isOpen && (
        <div style={{
          width: 'min(360px, calc(100vw - 32px))',
          height: 'min(490px, calc(100vh - 110px))',
          marginBottom: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '18px',
          background: '#ffffff',
          color: '#17383a',
          border: '1px solid #d7e3df',
          boxShadow: '0 18px 55px rgba(0,0,0,0.24)'
        }}>
          <div style={{
            padding: '15px 16px',
            background: '#073b3b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e4c477',
              color: '#073b3b',
              display: 'grid',
              placeItems: 'center'
            }}>
              <Bot size={21} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '14px' }}>Al Hidaya Assistant</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Competition information · 2027</div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              style={{ border: 0, background: 'transparent', color: '#fff', cursor: 'pointer', padding: '5px' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px',
            background: '#f4f7f5',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {chat.map((item, index) => (
              <div
                key={index}
                style={{
                  alignSelf: item.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  whiteSpace: 'pre-line',
                  padding: '10px 12px',
                  borderRadius: item.from === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                  background: item.from === 'user' ? '#dceee7' : '#ffffff',
                  border: '1px solid #e1e9e5',
                  fontSize: '13px',
                  lineHeight: 1.55
                }}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid #e3eae6', background: '#fff' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '9px' }}>
              {['Registration', 'Date', 'Venue', 'Prizes'].map(topic => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    const reply = getReply(topic)
                    setChat(previous => [
                      ...previous,
                      { from: 'user', text: topic },
                      { from: 'bot', text: reply }
                    ])
                  }}
                  style={{
                    border: '1px solid #cbdcd4',
                    borderRadius: '20px',
                    background: '#f7faf8',
                    color: '#174b43',
                    padding: '5px 9px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '7px' }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Type your question..."
                aria-label="Type your question"
                style={{
                  minWidth: 0,
                  flex: 1,
                  border: '1px solid #ccd9d2',
                  borderRadius: '22px',
                  padding: '10px 13px',
                  outline: 'none',
                  fontSize: '13px'
                }}
              />
              <button
                type="submit"
                aria-label="Send message"
                style={{
                  width: '40px',
                  height: '40px',
                  flexShrink: 0,
                  border: 0,
                  borderRadius: '50%',
                  background: '#0b6259',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <Send size={17} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(value => !value)}
        aria-label={isOpen ? 'Close Al Hidaya Assistant' : 'Open Al Hidaya Assistant'}
        style={{
          marginLeft: 'auto',
          width: '58px',
          height: '58px',
          border: '2px solid #e4c477',
          borderRadius: '50%',
          background: '#073b3b',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
          cursor: 'pointer'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
      </button>
    </div>
  )
}

function RegistrationCardPage() {
  const [card] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem('alhidayaRegistrationCard') || 'null'
      )
    } catch {
      return null
    }
  })

  if (!card) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f4f7f5',
        padding: '20px',
        fontFamily: 'inherit'
      }}>
        <div style={{
          maxWidth: '430px',
          width: '100%',
          padding: '30px',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 10px 35px rgba(0,0,0,0.1)'
        }}>
          <h2>Registration Card Not Found</h2>
          <p>Please complete your registration first.</p>
          <a href="/" style={{ color: '#0b6259', fontWeight: 700 }}>
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#edf2ef',
      padding: '24px',
      fontFamily: 'inherit'
    }}>
      <div className="registration-card-print" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '30px 25px',
        borderRadius: '20px',
        border: '2px solid #c9a45c',
        background: 'linear-gradient(145deg, #073b3b, #092c35)',
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 18px 45px rgba(0,0,0,0.18)'
      }}>
        <div style={{
          color: '#e4c477',
          fontSize: '12px',
          letterSpacing: '2px',
          fontWeight: 800
        }}>
          AL HIDAYA ISLAMIC UNIVERSITY
        </div>

        <h1 style={{
          fontSize: 'clamp(21px, 5vw, 29px)',
          margin: '14px 0 5px'
        }}>
          REGISTRATION CONFIRMED
        </h1>

        <p style={{
          color: '#d9e5e2',
          fontSize: '12px',
          letterSpacing: '1px',
          margin: 0
        }}>
          QURAN INTERPRETATION COMPETITION · 2027
        </p>

        <div style={{
          height: '1px',
          background: 'rgba(228,196,119,0.45)',
          margin: '25px 0'
        }} />

        <div style={{
          color: '#d9e5e2',
          fontSize: '11px',
          letterSpacing: '1.5px'
        }}>
          PARTICIPANT NAME
        </div>

        <div style={{
          fontSize: '20px',
          fontWeight: 800,
          margin: '8px 0 22px',
          overflowWrap: 'anywhere'
        }}>
          {card.fullName}
        </div>

        <div style={{
          color: '#d9e5e2',
          fontSize: '11px',
          letterSpacing: '1.5px'
        }}>
          YOUR REGISTRATION NUMBER
        </div>

        <div style={{
          color: '#f0cf7d',
          fontSize: 'clamp(25px, 6vw, 34px)',
          fontWeight: 900,
          letterSpacing: '1px',
          margin: '12px 0'
        }}>
          {card.registrationCode}
        </div>

        <div style={{
          display: 'inline-block',
          padding: '7px 15px',
          borderRadius: '30px',
          background: 'rgba(45,190,130,0.16)',
          color: '#9af0c6',
          fontSize: '12px',
          fontWeight: 700
        }}>
          ✓ Successfully Registered
        </div>

        <div style={{
          height: '1px',
          background: 'rgba(228,196,119,0.45)',
          margin: '25px 0 17px'
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '13px',
          textAlign: 'left'
        }}>
          <span style={{ color: '#d9e5e2' }}>Event Date</span>
          <strong>27 January 2027</strong>
        </div>

        <p style={{
          color: '#d9e5e2',
          fontSize: '12px',
          lineHeight: 1.6,
          margin: '20px 0 0'
        }}>
          Please save this registration card for future reference.
        </p>

        <div className="card-actions" style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '24px'
        }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '11px 20px',
              border: '1px solid #e4c477',
              borderRadius: '8px',
              background: '#e4c477',
              color: '#123438',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Print / Save Card
          </button>

          <a
            href="/"
            style={{
              padding: '11px 20px',
              border: '1px solid #e4c477',
              borderRadius: '8px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700
            }}
          >
            Home
          </a>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            margin: 0 !important;
          }
          .registration-card-print {
            box-shadow: none !important;
            margin: 30px auto !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .card-actions {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const elements = document.querySelectorAll('[data-scroll-animate]')

    if (!('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    )

    elements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    whatsapp: '',
    email: '',
    state: '',
    district: '',
    aadhaar_number: '',
    institution: '',
    category: ''
  })

  const [photo, setPhoto] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const update = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function submit(e) {
    e.preventDefault()
    setMessage(null)

    if (!supabase) {
      return setMessage({
        type: 'error',
        text: 'Registration service is not connected yet.'
      })
    }

    setBusy(true)
    let photoPath = null

    try {
      if (!/^\d{12}$/.test(form.aadhaar_number)) {
        throw new Error('Please enter a valid 12-digit Aadhaar number.')
      }

      if (!photo) {
        throw new Error('Please upload your passport-size photo.')
      }

      const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      photoPath = `${Date.now()}-${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('participant-photos')
        .upload(photoPath, photo, {
          upsert: false,
          contentType: photo.type
        })

      if (uploadError) throw uploadError

      const { data: savedRegistrationCode, error } = await supabase.rpc(
        'register_participant',
        {
          p_full_name: form.full_name.trim(),
          p_phone: form.phone.trim(),
          p_whatsapp: form.whatsapp.trim(),
          p_email: form.email.trim() || null,
          p_state: form.state,
          p_district: form.district.trim(),
          p_aadhaar_number: form.aadhaar_number,
          p_photo_path: photoPath,
          p_institution: form.institution.trim(),
          p_category: form.category
        }
      )

      if (error) throw error

      if (!savedRegistrationCode) {
        throw new Error(
          'Registration was submitted, but the registration number was not returned. Please contact the organisers.'
        )
      }

      sessionStorage.setItem(
        'alhidayaRegistrationCard',
        JSON.stringify({
          registrationCode: savedRegistrationCode,
          fullName: form.full_name.trim()
        })
      )

      window.location.assign('/registration-card')

    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Could not submit your details. Please try again.'
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="topline">
        <span>AL HIDAYA ISLAMIC UNIVERSITY</span>
        <span>QURAN INTERPRETATION COMPETITION · 2027</span>
      </div>

      <header className="header">
        <a className="brand" href="#home" aria-label="Al Hidaya home">
          <img
            src="/assets/college-logo.png"
            onError={e => { e.currentTarget.style.display = 'none' }}
            alt="College logo"
          />
          <span>
            <b>AL HIDAYA</b>
            <small>ISLAMIC UNIVERSITY</small>
          </span>
        </a>

        <button
          className="menuBtn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#prizes" onClick={() => setMenuOpen(false)}>Prizes</a>
          <a href="#register" onClick={() => setMenuOpen(false)}>Details</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="navCta" href="#register" onClick={() => setMenuOpen(false)}>
            Register now <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>

      <main id="home">
        <section className="hero" data-scroll-animate>
          <div className="heroGlow"></div>

          <div className="heroCopy">
            <div className="eyebrow">
              <span></span> A NATIONAL-LEVEL QURAN EVENT
            </div>

            <div className="programmeHeading">
              <img
                src="/assets/programme-heading.png"
                alt="Programme heading"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <div className="headingFallback">
                <span>AL HIDAYA</span>
                <h1>
                  All India Quran
                  <br />
                  <em>Competition</em>
                </h1>
              </div>
            </div>

            <p className="heroText">
              Explore the profound meanings and teachings of the Holy Quran.
              A platform for knowledge, reflection and excellence.
            </p>

            <div className="heroMeta">
              <span><CalendarDays /> 27 January 2027</span>
              <span><MapPin /> Al Hidaya Islamic University, Kannur</span>
            </div>

            <a className="primaryBtn" href="#register">
              Register now <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="posterFrame">
            <div className="posterTag">OFFICIAL EVENT POSTER</div>
            <img
              src="/assets/event-poster.jpg"
              alt="Quran Interpretation Competition official poster"
            />
          </div>
        </section>

        <section className="stats" data-scroll-animate>
          <div data-scroll-animate>
            <span>01</span>
            <b>27 JAN</b>
            <small>2027 · EVENT DATE</small>
          </div>
          <div data-scroll-animate>
            <span>02</span>
            <b>QURAN</b>
            <small>KNOWLEDGE & EXCELLENCE</small>
          </div>
          <div data-scroll-animate>
            <span>03</span>
            <b>₹1 LAKH</b>
            <small>FIRST PRIZE</small>
          </div>
        </section>

        <section className="section about" id="about" data-scroll-animate>
          <div className="sectionLabel">THE EVENT</div>
          <h2>
            Knowledge that brings
            <br />
            <em>the Quran closer.</em>
          </h2>
          <p>
            Join participants for an inspiring Quran Interpretation Competition.
            Discover, understand and share the deep meanings and teachings
            of the Holy Quran.
          </p>

          <div className="featureGrid">
            <article data-scroll-animate>
              <BookOpen />
              <h3>Deep understanding</h3>
              <p>Explore Quranic meanings and teachings through learning and reflection.</p>
            </article>
            <article data-scroll-animate>
              <Trophy />
              <h3>Recognising excellence</h3>
              <p>Compete for prestigious prizes and certificates.</p>
            </article>
            <article data-scroll-animate>
              <ShieldCheck />
              <h3>Participant details</h3>
              <p>Share your details with the event organisers. They will contact you with further information.</p>
            </article>
          </div>
        </section>

        <section className="prizeSection" id="prizes" data-scroll-animate>
          <div className="sectionLabel light">AWARDS & RECOGNITION</div>
          <h2>Big rewards. <em>Greater purpose.</em></h2>

          <div className="prizeGrid">
            <div className="prizeCard first" data-scroll-animate>
              <small>1ST PRIZE</small>
              <strong>₹1,00,000</strong>
              <span>WITH CERTIFICATE</span>
            </div>
            <div className="prizeCard second" data-scroll-animate>
              <small>2ND PRIZE</small>
              <strong>₹50,000</strong>
              <span>WITH CERTIFICATE</span>
            </div>
            <div className="prizeCard third" data-scroll-animate>
              <small>3RD PRIZE</small>
              <strong>₹25,000</strong>
              <span>WITH CERTIFICATE</span>
            </div>
          </div>
        </section>

        <section className="section registerSection" id="register" data-scroll-animate>
          <div className="registerIntro">
            <div className="sectionLabel">TAKE PART</div>
            <h2>
              Your journey
              <br />
              starts <em>here.</em>
            </h2>
            <p>
              Fill in your details. Our organisers will contact you
              through WhatsApp with further information.
            </p>
          </div>

          <form className="regForm" onSubmit={submit} data-scroll-animate>
            <div className="formHead">
              <div>
                <span>PARTICIPANT DETAILS</span>
                <h3>Enter your information</h3>
              </div>
              <span className="requiredNote">* Required fields</span>
            </div>

            {message && (
              <div className={message.type === 'success' ? 'alert success' : 'alert error'}>
                {message.type === 'success' ? <CheckCircle2 /> : null}
                {message.text}
              </div>
            )}

            <div className="field">
              <label>Full name *</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={update}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="twoFields">
              <div className="field">
                <label>Mobile number *</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={update}
                  required
                  pattern="[0-9+\-\s]{10,15}"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className="field">
                <label>WhatsApp number *</label>
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={update}
                  required
                  pattern="[0-9+\-\s]{10,15}"
                  placeholder="WhatsApp number"
                />
              </div>
            </div>

            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                placeholder="name@example.com"
              />
            </div>

            <div className="twoFields">
              <div className="field">
                <label>State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={e => setForm({
                    ...form,
                    state: e.target.value,
                    district: ''
                  })}
                  required
                >
                  <option value="">Select state / UT</option>
                  {Object.keys(districtsByState).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>District *</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={update}
                  required
                  disabled={!form.state}
                >
                  <option value="">
                    {form.state ? 'Select district' : 'First select a state'}
                  </option>
                  {(districtsByState[form.state] || []).map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Aadhaar Number (12 digits) *</label>
              <input
                type="password"
                name="aadhaar_number"
                value={form.aadhaar_number}
                onChange={update}
                required
                inputMode="numeric"
                maxLength={12}
                minLength={12}
                pattern="[0-9]{12}"
                autoComplete="off"
                placeholder="Enter 12-digit Aadhaar number"
              />
              <small>Only authorised organisers should access this information.</small>
            </div>

            <div className="field">
              <label>Passport-size Photo *</label>
              <input
                id="participant-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => setPhoto(e.target.files?.[0] || null)}
                required
              />
              <small>Upload JPG, PNG or WEBP image. Maximum recommended size: 2 MB.</small>
            </div>

            <div className="twoFields">
              <div className="field">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={update} required>
                  <option value="">Select category</option>
                  <option>Student</option>
                  <option>Open</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Institution / College name *</label>
              <input
                name="institution"
                value={form.institution}
                onChange={update}
                required
                placeholder="Enter institution name"
              />
            </div>

            <button className="submitBtn" disabled={busy}>
              {busy ? 'Submitting…' : 'Submit Details'}
              <ArrowUpRight size={18} />
            </button>

            <p className="privacyNote">
              Your details are shared with the event organisers only.
              Our organisers will contact you through WhatsApp.
            </p>
          </form>
        </section>

        <section
          className="section"
          id="contact"
          data-scroll-animate
          style={{ paddingTop: '72px', paddingBottom: '80px' }}
        >
          <div className="sectionLabel">GET IN TOUCH</div>
          <h2>Contact <em>Al Hidaya Islamic University.</em></h2>
          <p>For enquiries about the Quran Interpretation Competition 2027, contact the college through the details below.</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            marginTop: '32px'
          }}>
            <article data-scroll-animate style={{
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '16px'
            }}>
              <h3>College Email Address</h3>
              <a href="mailto:ahiuofficial@gmail.com">ahiuofficial@gmail.com</a>
            </article>

            <article data-scroll-animate style={{
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '16px'
            }}>
              <h3>More Contact Numbers</h3>
              <p><a href="tel:+918590449652">+91 8590449652</a></p>
              <p><a href="tel:+918590990325">+91 8590990325</a></p>
              <p><a href="tel:+919497167463">+91 9497167463</a></p>
            </article>

            <article data-scroll-animate style={{
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '16px'
            }}>
              <h3>College Location</h3>
              <p>Al Hidaya Islamic University</p>
              <a
                href="https://www.ahiu.in/#h.bh81k2dv69hv"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open College Location ↗
              </a>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer" data-scroll-animate>
        <div className="footerMain">
          <div className="footerBrand">
            <img
              src="/assets/college-logo.png"
              onError={e => { e.currentTarget.style.display = 'none' }}
              alt="Al Hidaya logo"
            />
            <div>
              <b>AL HIDAYA</b>
              <small>ISLAMIC UNIVERSITY</small>
            </div>
          </div>

          <p>
            Al Hidaya Islamic University
            <br />
            Uliyil, Mattannur, Kannur, Kerala, India
          </p>

          <div className="footerLinks">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#register">Register</a>
          </div>
        </div>

        <div className="footerBottom">
          <span>© 2027 Al Hidaya Islamic University. All rights reserved.</span>
          <span>Quran Interpretation Competition 2027</span>
        </div>
      </footer>

      <AlHidayaChatbot />
    </div>
  )
}

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'

createRoot(document.getElementById('root')).render(
  currentPath === '/admin'
    ? <Admin />
    : currentPath === '/registration-card'
      ? <RegistrationCardPage />
      : <App />
)
