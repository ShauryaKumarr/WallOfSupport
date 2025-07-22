import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set, onValue, runTransaction, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyEqGnnMr0IcvrPs_PcLxvb9Nw1ozE_Xc",
  authDomain: "wallofsupport-22a63.firebaseapp.com",
  databaseURL: "https://wallofsupport-22a63-default-rtdb.firebaseio.com",
  projectId: "wallofsupport-22a63",
  storageBucket: "wallofsupport-22a63.appspot.com",
  messagingSenderId: "240950716993",
  appId: "1:240950716993:web:b54a37bd8dcab30f2c34c0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM elements
const addCommentButton = document.getElementById('addCommentButton');
const usernameInput = document.getElementById('usernameInput');

// Add comment button listener
addCommentButton.addEventListener('click', showCommentForm);

// Check toxicity using Cloud Function (simplified - no auth required)
async function checkToxicity(messageText) {
  try {
    const response = await fetch('https://us-central1-wallofsupport-22a63.cloudfunctions.net/checkToxicity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageText }),
    });
    
    if (!response.ok) {
      console.log('Toxicity API returned error:', response.status);
      return 0; // Return safe score if API fails
    }
    
    const toxicityScore = await response.json();
    return typeof toxicityScore === 'number' ? toxicityScore : 0;
  } catch (error) {
    console.log('Toxicity check failed:', error.message);
    return 0; // Return safe score if check fails
  }
}

// Check sentiment using Cloud Function (simplified - no auth required)
async function checkSentiment(messageText) {
  try {
    const response = await fetch('https://us-central1-wallofsupport-22a63.cloudfunctions.net/checkSentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageText }),
    });
    
    if (!response.ok) {
      console.log('Sentiment API returned error:', response.status);
      return 0; // Return neutral score if API fails
    }
    
    const sentimentScore = await response.json();
    return typeof sentimentScore === 'number' ? sentimentScore : 0;
  } catch (error) {
    console.log('Sentiment check failed:', error.message);
    return 0; // Return neutral score if check fails
  }
}

// Perform content analysis in background (non-blocking)
async function performBackgroundContentAnalysis(messageText) {
  // Run these checks in the background - they won't affect the user experience
  setTimeout(async () => {
    try {
      const toxicityScore = await checkToxicity(messageText);
      if (toxicityScore > 0.7) {
        console.log('High toxicity detected:', toxicityScore);
      }
    } catch (error) {
      console.log('Background toxicity check failed (non-critical):', error.message);
    }

    try {
      const sentimentScore = await checkSentiment(messageText);
      if (sentimentScore < -0.5) {
        console.log('Negative sentiment detected:', sentimentScore);
      } else if (sentimentScore > 0.5) {
        console.log('Positive sentiment detected:', sentimentScore);
      }
    } catch (error) {
      console.log('Background sentiment check failed (non-critical):', error.message);
    }
  }, 1000); // Run after 1 second delay
}

const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic of the" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CW", name: "Curaçao" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and McDonald Islands" },
  { code: "VA", name: "Holy See" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran, Islamic Republic of" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea, Democratic People's Republic of" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia (Federated States of)" },
  { code: "MD", name: "Moldova, Republic of" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MK", name: "North Macedonia" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine, State of" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Réunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "BL", name: "Saint Barthélemy" },
  { code: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "MF", name: "Saint Martin (French part)" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SX", name: "Sint Maarten (Dutch part)" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan, Province of China" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania, United Republic of" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom of Great Britain and Northern Ireland" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "US", name: "United States of America" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela (Bolivarian Republic of)" },
  { code: "VN", name: "Viet Nam" },
  { code: "VG", name: "Virgin Islands (British)" },
  { code: "VI", name: "Virgin Islands (U.S.)" },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

const quotes = [
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "When you feel like giving up, remember why you held on for so long in the first place.",
  "You are never too far gone to be loved and cherished.",
  "The struggle you're in today is developing the strength you need for tomorrow. - Robert Tew",
  "Do not fear failure but rather fear not trying. - Roy T. Bennett",
  "You are loved, not because you are perfect, but because you are enough.",
  "Every setback is a setup for a comeback. - Joel Osteen",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't. - Rikki Rogers",
  "You are stronger than you think, braver than you believe, and loved more than you know.",
  "It's okay to not be okay. What matters is that you keep going.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "You are worthy of love, no matter where you are on your journey.",
  "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway. - Earl Nightingale",
  "Sometimes, the bravest thing you can do is just keep going.",
];

function toggleTopContributors() {
  const topContributors = document.getElementById('topContributors');
  const topContributorsList = document.getElementById('topContributorsList');
  
  if (!topContributors || !topContributorsList) {
    console.error('Top contributors elements not found');
    return;
  }
  
  topContributors.classList.toggle('top-contributors-expanded');
  
  if (topContributors.classList.contains('top-contributors-expanded')) {
    topContributorsList.classList.remove('hidden');
    setTimeout(() => {
      topContributorsList.style.opacity = '1';
    }, 50);
  } else {
    topContributorsList.style.opacity = '0';
    setTimeout(() => {
      topContributorsList.classList.add('hidden');
    }, 300);
  }
}

function displayTopContributors() {
  // Directly count from messages since it's more reliable
  countContributorsFromMessages();
}

// Count contributors from messages directly 
function countContributorsFromMessages() {
  const messagesRef = ref(database, 'messages');
  
  try {
    onValue(messagesRef, (snapshot) => {
      const topContributorsList = document.getElementById('topContributorsList');
      if (!topContributorsList) {
        return;
      }
      
      topContributorsList.innerHTML = '';
      const contributors = {};

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const messageData = childSnapshot.val();
          const username = messageData?.username || 'Anonymous';
          
          if (username && username !== 'Anonymous') {
            contributors[username] = (contributors[username] || 0) + 1;
          }
        });

        const sortedContributors = Object.entries(contributors).sort((a, b) => b[1] - a[1]);

        if (sortedContributors.length > 0) {
          sortedContributors.slice(0, 5).forEach(([username, contributions], index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${username}: ${contributions} post${contributions === 1 ? '' : 's'}`;
            topContributorsList.appendChild(listItem);
          });
        } else {
          // Show message when no contributors yet
          const listItem = document.createElement('li');
          listItem.textContent = 'No contributors yet. Be the first!';
          listItem.style.fontStyle = 'italic';
          listItem.style.color = 'var(--text-muted)';
          topContributorsList.appendChild(listItem);
        }
      } else {
        // Show message when no messages exist
        const listItem = document.createElement('li');
        listItem.textContent = 'No contributors yet. Be the first!';
        listItem.style.fontStyle = 'italic';
        listItem.style.color = 'var(--text-muted)';
        topContributorsList.appendChild(listItem);
      }
    });
  } catch (error) {
    console.error('Error loading contributors:', error);
    const topContributorsList = document.getElementById('topContributorsList');
    if (topContributorsList) {
      topContributorsList.innerHTML = '<li style="color: var(--text-muted); font-style: italic;">Unable to load contributors</li>';
    }
  }
}

// Hide loading spinner immediately when script loads
document.addEventListener('DOMContentLoaded', () => {
  const loadingSpinner = document.getElementById("loadingSpinner");
  if (loadingSpinner) {
    loadingSpinner.classList.add("hidden");
  }
});

// Handle viewport changes and ensure messages stay visible
function handleViewportChange() {
  const wall = document.getElementById("messages");
  const messages = wall.querySelectorAll('.message');
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  messages.forEach(message => {
    const rect = message.getBoundingClientRect();
    let x = parseInt(message.style.left) || 0;
    let y = parseInt(message.style.top) || 0;
    let needsReposition = false;
    
    // Check if message is outside viewport bounds
    if (x < 0 || x + 300 > viewportWidth) {
      x = Math.max(20, Math.min(viewportWidth - 320, x));
      needsReposition = true;
    }
    
    if (y < 0 || y + 150 > viewportHeight - 100) {
      y = Math.max(20, Math.min(viewportHeight - 170, y));
      needsReposition = true;
    }
    
    if (needsReposition) {
      message.style.left = `${x}px`;
      message.style.top = `${y}px`;
      
      // Update localStorage with new position
      const position = { x, y };
      localStorage.setItem(message.id, JSON.stringify(position));
    }
  });
  
  // Update wall container size
  const minWallWidth = Math.max(viewportWidth, 800);
  const minWallHeight = Math.max(viewportHeight, 600);
  
  wall.style.width = `${minWallWidth}px`;
  wall.style.height = `${minWallHeight}px`;
}

window.onload = () => {
  // Ensure loading spinner is hidden
  const loadingSpinner = document.getElementById("loadingSpinner");
  if (loadingSpinner) {
    loadingSpinner.classList.add("hidden");
  }

  const locationInput = document.getElementById("locationInput");
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.code.toLowerCase();
    option.textContent = country.name;
    locationInput.appendChild(option);
  });

  showRandomQuote();
  displayMessages();
  
  const addCommentButton = document.getElementById("addCommentButton");
  const backButton = document.getElementById("backButton");
  const postButton = document.getElementById("postButton");
  
  // Add comment button listener
  addCommentButton.addEventListener("click", showCommentForm);
  backButton.addEventListener("click", hideCommentForm);
  postButton.addEventListener("click", addMessage);
  
  // Add event listener for info icon
  const infoIcon = document.getElementById("infoIcon");
  const closePopupButton = document.getElementById("closeInfoPopup");

  // Add hover effect to info icon
  infoIcon.addEventListener("mouseenter", () => {
    infoIcon.style.color = '#ff6347';
  });
  infoIcon.addEventListener("mouseleave", () => {
    infoIcon.style.color = '#d2691e';
  });

  // Event listener for toggling the popup
  infoIcon.addEventListener("click", toggleInfoPopup);

  closePopupButton.addEventListener("click", toggleInfoPopup);

  const messageInput = document.getElementById("messageInput");
  const charCount = document.getElementById("charCount");
  const characterLimit = 250;

  messageInput.addEventListener("input", function () {
    const currentLength = messageInput.value.length;
    charCount.textContent = `${currentLength}/${characterLimit} characters`;

    if (currentLength > characterLimit) {
      messageInput.value = messageInput.value.substring(0, characterLimit);
      charCount.textContent = `${characterLimit}/${characterLimit} characters`;
    }
  });

  charCount.textContent = `0/${characterLimit} characters`;

  // Initialize top contributors functionality
  const topContributorsToggle = document.getElementById('topContributorsToggle');
  const topContributorsList = document.getElementById('topContributorsList');
  const topContributors = document.getElementById('topContributors');
  
  if (topContributorsToggle && topContributorsList && topContributors) {
    // Ensure proper initial state
    topContributors.classList.remove('top-contributors-expanded');
    topContributors.classList.add('top-contributors-collapsed');
    topContributorsList.classList.add('hidden');
    topContributorsList.style.opacity = '0';
    
    topContributorsToggle.addEventListener('click', toggleTopContributors);
  } else {
    console.error('Top contributors elements not found');
  }

  displayTopContributors();
  
  // Handle window resize and orientation changes
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleViewportChange, 300);
  });
  
  // Handle device orientation changes (mobile)
  window.addEventListener('orientationchange', () => {
    setTimeout(handleViewportChange, 500); // Delay for orientation change to complete
  });

  // Listen for new messages to update top contributors in real-time
  const messagesRef = ref(database, 'messages');
  onValue(messagesRef, () => {
    displayTopContributors();
  });
};

function showCommentForm() {
  const commentForm = document.getElementById("wall");
  commentForm.style.display = "flex";
  const addCommentButton = document.getElementById("addCommentButton");
  addCommentButton.style.display = "none";
}

function hideCommentForm() {
  const commentForm = document.getElementById("wall");
  commentForm.style.display = "none";
  const addCommentButton = document.getElementById("addCommentButton");
  addCommentButton.style.display = "block";
}

async function addMessage() {
  const messageInput = document.getElementById("messageInput");
  const locationInput = document.getElementById("locationInput");
  const usernameInput = document.getElementById("usernameInput");
  const loadingSpinner = document.getElementById("loadingSpinner");

  const messageId = `message-${Date.now()}`;
  const messageText = messageInput.value.trim();
  const username = usernameInput.value.trim() || "Anonymous";

  if (!messageText) {
    alert("Please write a message before posting.");
    return;
  }

  if (!username || username === "") {
    alert("Please enter your name or username.");
    return;
  }

  try {
    // Show loading spinner
    loadingSpinner.classList.remove("hidden");

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const messageData = {
      username,
      message: messageText,
      location: locationInput.value,
      date,
      time,
      likes: 0,
      timestamp: Date.now()
    };

    // Post to Firebase
    await set(ref(database, `messages/${messageId}`), messageData);

    // Clear form only after successful post
    messageInput.value = "";
    usernameInput.value = "";
    locationInput.value = "";

    // Run optional content analysis in background (won't affect user experience)
    try {
      performBackgroundContentAnalysis(messageText);
    } catch (error) {
      console.log('Background content analysis failed (non-critical):', error.message);
    }

    alert('Your message has been posted!');
    hideCommentForm();
  } catch (error) {
    console.error('Error posting message:', error);
    if (error instanceof TypeError && error.message.includes('Cannot set properties of null')) {
      console.error('A DOM element required for post-submission actions was not found.');
      alert('Your message was posted, but there was an issue updating the page. Please refresh to see all changes.');
    } else {
      alert('An error occurred while posting your message. Please try again.');
    }
  } finally {
    // Hide loading spinner
    loadingSpinner.classList.add("hidden");
  }
}

function displayMessages() {
  const messagesContainer = document.getElementById("messages");
  const messagesRef = ref(database, 'messages/');

  onValue(messagesRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const messageId = childSnapshot.key;
      const messageData = childSnapshot.val();
      const existingMessage = document.getElementById(messageId);

      if (!existingMessage) {
        renderMessage(messageId, messageData);
      } else {
        updateExistingMessage(existingMessage, messageData);
      }
    });
  });
}

function renderMessage(messageId, messageData) {
  const messagesContainer = document.getElementById("messages");
  const existingMessage = document.getElementById(messageId);
  if (existingMessage) {
    updateExistingMessage(existingMessage, messageData);
    return;
  }

  const newMessage = document.createElement("div");
  newMessage.className = "message";
  newMessage.id = messageId;

  const textElement = document.createElement("p");
  textElement.textContent = messageData.message;
  newMessage.appendChild(textElement);

  const dateTimeElement = document.createElement("div");
  dateTimeElement.className = "date-time";
  const nameElement = document.createElement("p");
  nameElement.textContent = messageData.username || "Anonymous";
  const dateElement = document.createElement("p");
  dateElement.textContent = new Date(parseInt(messageId.split('-')[1])).toLocaleString();
  dateTimeElement.appendChild(nameElement);
  dateTimeElement.appendChild(dateElement);
  newMessage.appendChild(dateTimeElement);

  if (messageData.location) {
    const flag = document.createElement("img");
    flag.className = "flag";
    flag.alt = messageData.location;
    flag.src = `https://flagcdn.com/24x18/${messageData.location}.png`;
    newMessage.appendChild(flag);
  }

  const reactions = document.createElement("div");
  reactions.className = "reactions";

  // Show likes from the database
  const heartReaction = document.createElement("button");
  heartReaction.className = "reaction";
  heartReaction.innerHTML = `<span>❤️</span> <span class="heart-count">${messageData.likes || 0}</span>`;

  heartReaction.addEventListener("click", () => incrementHeartCount(heartReaction, messageId));

  reactions.appendChild(heartReaction);
  newMessage.appendChild(reactions);

  makeDraggable(newMessage);
  positionAndAppendMessage(newMessage);
  messagesContainer.appendChild(newMessage);
}

function updateExistingMessage(messageElement, messageData) {
  const textElement = messageElement.querySelector("p");
  textElement.textContent = messageData.message;

  const dateTimeElement = messageElement.querySelector(".date-time");
  const nameElement = dateTimeElement.querySelector("p:first-child");
  const username = messageData.username || "Anonymous";
  nameElement.textContent = username;

  const heartCount = messageElement.querySelector(".heart-count");
  heartCount.innerHTML = messageData.likes || 0;
}

// Get viewport-aware positioning for messages
function getVisiblePosition() {
  const wall = document.getElementById("messages");
  const isMobile = window.innerWidth <= 768;
  const messageWidth = isMobile ? 280 : 300;
  const messageHeight = isMobile ? 120 : 150;
  
  // Get current viewport size
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate safe bounds within viewport (with appropriate padding for mobile)
  const padding = isMobile ? 20 : 50;
  const footerHeight = isMobile ? 120 : 80; // Account for footer
  
  const maxX = Math.max(viewportWidth - messageWidth - padding, padding);
  const maxY = Math.max(viewportHeight - messageHeight - footerHeight - padding, padding);
  
  // Ensure minimum bounds
  const minX = padding;
  const minY = padding;
  
  // Generate random position within safe visible bounds
  const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

  return { x: randomX, y: randomY };
}

// Position message in a smart grid-like pattern to avoid overlaps
function getSmartPosition(existingMessages) {
  const isMobile = window.innerWidth <= 768;
  const messageWidth = isMobile ? 300 : 380; // Message width + margin
  const messageHeight = isMobile ? 140 : 220; // Message height + margin
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = isMobile ? 15 : 30; // Edge padding
  const footerHeight = isMobile ? 120 : 80; // Account for footer
  
  // For mobile, use a simpler grid with better spacing
  const availableWidth = viewportWidth - (padding * 2);
  const availableHeight = viewportHeight - footerHeight - (padding * 2);
  
  const cols = Math.max(1, Math.floor(availableWidth / messageWidth));
  const rows = Math.max(1, Math.floor(availableHeight / messageHeight));
  
  // Try to find an empty grid position first
  for (let attempts = 0; attempts < 20; attempts++) {
    const col = Math.floor(Math.random() * cols);
    const row = Math.floor(Math.random() * rows);
    
    // Calculate position with better mobile spacing
    const randomOffset = isMobile ? 20 : 60;
    const x = col * messageWidth + padding + Math.random() * randomOffset - (randomOffset / 2);
    const y = row * messageHeight + padding + Math.random() * randomOffset - (randomOffset / 2);
    
    // Ensure position stays within bounds
    const boundedX = Math.max(padding, Math.min(viewportWidth - messageWidth - padding, x));
    const boundedY = Math.max(padding, Math.min(viewportHeight - messageHeight - footerHeight - padding, y));
    
    // Check if this position is too close to existing messages
    const minDistance = isMobile ? 80 : 140;
    let tooClose = false;
    existingMessages.forEach(msg => {
      const msgRect = msg.getBoundingClientRect();
      const distance = Math.sqrt(Math.pow(boundedX - msgRect.left, 2) + Math.pow(boundedY - msgRect.top, 2));
      if (distance < minDistance) {
        tooClose = true;
      }
    });
    
    if (!tooClose) {
      return { x: boundedX, y: boundedY };
    }
  }
  
  // If no good grid position found, use visible random position
  return getVisiblePosition();
}

// set comment to smart location and expand container as needed
function positionAndAppendMessage(message) {
  const wall = document.getElementById("messages");
  const existingMessages = wall.querySelectorAll('.message');
  
  // Get smart position that avoids overlaps and stays visible
  const { x, y } = getSmartPosition(existingMessages);
  
  message.style.left = `${x}px`;
  message.style.top = `${y}px`;

  wall.appendChild(message);

  // Ensure wall container is large enough to contain all messages
  const messageBottom = y + 200; // Message height + some buffer
  const messageRight = x + 350; // Message width + some buffer
  
  // Get current wall dimensions
  const currentWallHeight = wall.offsetHeight;
  const currentWallWidth = wall.offsetWidth;

  // Expand wall container if needed
  if (messageRight > currentWallWidth) {
    wall.style.width = `${messageRight + 100}px`;
  }

  if (messageBottom > currentWallHeight) {
    wall.style.height = `${messageBottom + 100}px`;
  }
  
  // Ensure minimum wall size for proper layout
  const minWallWidth = Math.max(window.innerWidth, 800);
  const minWallHeight = Math.max(window.innerHeight, 600);
  
  if (currentWallWidth < minWallWidth) {
    wall.style.width = `${minWallWidth}px`;
  }
  
  if (currentWallHeight < minWallHeight) {
    wall.style.height = `${minWallHeight}px`;
  }
}

function incrementHeartCount(heartReaction, messageId) {
  // Prevent double-clicking by checking if button is already processing
  if (heartReaction.disabled) {
    return;
  }
  
  // Disable button temporarily to prevent double-clicks
  heartReaction.disabled = true;
  heartReaction.style.opacity = '0.6';

  const userId = localStorage.getItem("userId") || Date.now();
  localStorage.setItem("userId", userId);

  const likedMessages = JSON.parse(localStorage.getItem("likedMessages")) || [];

  // Prevent liking the same message multiple times
  if (likedMessages.includes(messageId)) {
    alert("You've already liked this message.");
    // Re-enable button
    heartReaction.disabled = false;
    heartReaction.style.opacity = '1';
    return;
  }

  const messageRef = ref(database, `messages/${messageId}/likes`);

  // Use a transaction to increment likes safely
  runTransaction(messageRef, (currentLikes) => {
    return (currentLikes || 0) + 1;
  }).then(() => {
    // Store this message as liked in localStorage
    likedMessages.push(messageId);
    localStorage.setItem("likedMessages", JSON.stringify(likedMessages));

    // Update the like count visually
    const heartCount = heartReaction.querySelector(".heart-count");
    heartCount.innerHTML = parseInt(heartCount.innerHTML) + 1;
  }).catch((error) => {
    console.error('Transaction failed:', error);
  }).finally(() => {
    // Re-enable button after transaction completes
    setTimeout(() => {
      heartReaction.disabled = false;
      heartReaction.style.opacity = '1';
    }, 500); // Small delay to prevent rapid clicking
  });
}

// message initially appears at random location on board
function showRandomQuote() {
  const quoteContainer = document.getElementById("quoteContainer");
  quoteContainer.textContent =
    quotes[Math.floor(Math.random() * quotes.length)];

  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteContainer.textContent = quotes[randomIndex];
  }, 10000);
}

// Allows user to drag comments through click input and touch
function makeDraggable(element) {
  // Desktop drag and drop
  element.setAttribute("draggable", true);
  element.addEventListener(
    "dragstart",
    (event) => {
      drag_start(event);
      event.dataTransfer.setData("dragged-id", element.id);
    },
    false
  );

  // Mobile touch support
  let isDragging = false;
  let dragStartTime = 0;
  let startX, startY, initialX, initialY;
  let moveThreshold = 10; // Minimum movement to start dragging

  // Touch start
  element.addEventListener('touchstart', (e) => {
    // Don't start dragging if touching a button (like the like button)
    if (e.target.closest('.reaction')) {
      return;
    }
    
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    dragStartTime = Date.now();
    
    const rect = element.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    // Prepare for potential drag
    element.style.transition = 'none';
    
    e.preventDefault(); // Prevent scrolling
  }, { passive: false });

  // Touch move
  element.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Start dragging if moved far enough
    if (!isDragging && distance > moveThreshold) {
      isDragging = true;
      element.style.zIndex = '1000';
      element.style.transform = 'rotate(0deg) scale(1.05)';
      element.style.boxShadow = 'var(--shadow-xl)';
    }
    
    if (isDragging) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const messageWidth = element.offsetWidth;
      const messageHeight = element.offsetHeight;
      
      // Calculate new position with boundary constraints
      let newX = initialX + deltaX;
      let newY = initialY + deltaY;
      
      // Keep within viewport bounds
      newX = Math.max(10, Math.min(viewportWidth - messageWidth - 10, newX));
      newY = Math.max(10, Math.min(viewportHeight - messageHeight - 100, newY)); // Account for footer
      
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    }
    
    e.preventDefault(); // Prevent scrolling
  }, { passive: false });

  // Touch end
  element.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - dragStartTime;
    
    if (isDragging) {
      isDragging = false;
      element.style.transition = 'all 0.3s ease';
      element.style.zIndex = 'auto';
      element.style.transform = 'rotate(-1deg)';
      element.style.boxShadow = 'var(--shadow-lg)';
      
      // Save position to localStorage
      const rect = element.getBoundingClientRect();
      const position = { x: rect.left, y: rect.top };
      localStorage.setItem(element.id, JSON.stringify(position));
    } else {
      // If it was a quick tap without dragging, restore transition
      element.style.transition = 'all 0.3s ease';
    }
  });

  // On load, position the element based on saved positions in localStorage
  const savedPosition = localStorage.getItem(element.id);
  if (savedPosition) {
    const { x, y } = JSON.parse(savedPosition);
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  } else {
    // Use visible positioning if no saved position exists
    const { x, y } = getVisiblePosition();
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  }
}

function drag_start(event) {
  var style = window.getComputedStyle(event.target, null);
  event.dataTransfer.setData(
    "text/plain",
    parseInt(style.getPropertyValue("left"), 10) -
      event.clientX +
      "," +
      (parseInt(style.getPropertyValue("top"), 10) - event.clientY)
  );
}

// Store dragged message positions in localStorage
function drop(event) {
  var offset = event.dataTransfer.getData("text/plain").split(",");
  var element = document.getElementById(event.dataTransfer.getData("dragged-id"));
  
  let newX = event.clientX + parseInt(offset[0], 10);
  let newY = event.clientY + parseInt(offset[1], 10);

  element.style.left = newX + "px";
  element.style.top = newY + "px";
  event.preventDefault();

  // Save the new position in localStorage
  const position = { x: newX, y: newY };
  localStorage.setItem(element.id, JSON.stringify(position));

  return false;
}

function drag_over(event) {
  event.preventDefault();
  return false;
}

document.body.addEventListener("dragover", drag_over, false);
document.body.addEventListener("drop", drop, false);

function toggleInfoPopup() {
  const popup = document.getElementById("infoPopup");
  if (popup.style.display === "none" || popup.style.display === "") {
    popup.style.display = "block";
  } else {
    popup.style.display = "none";
  }
}

