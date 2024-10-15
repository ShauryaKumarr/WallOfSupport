import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, browserSessionPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, runTransaction, query, limitToLast, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// Set persistence to session
setPersistence(auth, browserSessionPersistence);

// DOM elements
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const logoutButton = document.getElementById('logoutButton');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authToggleLink = document.getElementById('authToggleLink');
const addCommentButton = document.getElementById('addCommentButton');
const usernameInput = document.getElementById('usernameInput');

let isLoginMode = true;

// Authentication event listeners
loginButton.addEventListener('click', () => openAuthModal(true));
signupButton.addEventListener('click', () => openAuthModal(false));
logoutButton.addEventListener('click', handleLogout);
authForm.addEventListener('submit', handleAuthSubmit);
authToggleLink.addEventListener('click', toggleAuthMode);
addCommentButton.addEventListener('click', handleAddComment);

// Auth state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginButton.style.display = 'none';
    signupButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
    addCommentButton.style.display = 'inline-block';
  } else {
    loginButton.style.display = 'inline-block';
    signupButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
    addCommentButton.style.display = 'none';
  }
});

function openAuthModal(loginMode) {
  isLoginMode = loginMode;
  authTitle.textContent = loginMode ? 'Login' : 'Sign Up';
  authToggleLink.textContent = loginMode ? 'Sign up' : 'Login';
  if (usernameInput) {
    usernameInput.style.display = loginMode ? 'none' : 'block';
  }
  
  // Clear previous inputs
  document.getElementById('emailInput').value = '';
  document.getElementById('passwordInput').value = '';
  if (!loginMode) {
    usernameInput.value = ''; // Clear username field for signup
  }
  
  authModal.style.display = 'flex';
}

function toggleAuthMode(e) {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  authTitle.textContent = isLoginMode ? 'Login' : 'Sign Up';
  authToggleLink.textContent = isLoginMode ? 'Sign up' : 'Login';
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const username = usernameInput.value.trim();

  try {
    let userCredential;
    if (isLoginMode) {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      if (!username) {
        alert('Please enter a username.');
        return;
      }
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Store username in Realtime Database
      await set(ref(database, `users/${userCredential.user.uid}`), {
        username,
        email,
        contributions: 0,
      });
    }
    const user = userCredential.user;
    console.log('User authenticated:', user);
    authModal.style.display = 'none';
  } catch (error) {
    console.error('Authentication error:', error);
    alert(error.message);
  }
}

async function handleLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    alert(error.message);
  }
}

function handleAddComment() {
  const user = auth.currentUser;
  if (user) {
    showCommentForm();
  } else {
    alert('Please log in or sign up to add a comment.');
    openAuthModal(true);
  }
}

// Check toxicity using Cloud Function
async function checkToxicity(messageText) {
  const response = await fetch('https://us-central1-wallofsupport-22a63.cloudfunctions.net/checkToxicity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageText }),
  });
  const toxicityScore = await response.json();
  return toxicityScore;
}

// Check sentiment using Cloud Function
async function checkSentiment(messageText) {
  const response = await fetch('https://us-central1-wallofsupport-22a63.cloudfunctions.net/checkSentiment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageText }),
  });
  const sentimentScore = await response.json();
  return sentimentScore;
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
  const usersRef = ref(database, 'users');

  onValue(usersRef, (snapshot) => {
    const topContributorsList = document.getElementById('topContributorsList');
    topContributorsList.innerHTML = '';
    const contributors = {};

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      const username = userData.username || userData.email.split('@')[0];
      
      if (contributors[username]) {
        contributors[username] += userData.contributions || 0;
      } else {
        contributors[username] = userData.contributions || 0;
      }
    });

    const sortedContributors = Object.entries(contributors).sort((a, b) => b[1] - a[1]);

    sortedContributors.slice(0, 5).forEach(([username, contributions], index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${username}: ${contributions} contributions`;
      topContributorsList.appendChild(listItem);
    });
  });
}

window.onload = () => {
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
    infoIcon.style.color = '#333'; // Reset back to default
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

  document.getElementById('topContributorsToggle').addEventListener('click', toggleTopContributors);

  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementsByClassName('close')[0];

  closeBtn.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  displayTopContributors();

  // New line to hide the auth modal on page load
  modal.style.display = "none";
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
  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in to post a message.');
    return;
  }

  const messageInput = document.getElementById("messageInput");
  const locationInput = document.getElementById("locationInput");

  const messageId = `message-${Date.now()}`;
  const messageText = messageInput.value.trim();

  if (!messageText) {
    alert("Please write a message before posting.");
    return;
  }

  try {
    // Optionally, display a loading indicator
    // showLoadingIndicator();

    // **Check Toxicity**
    const toxicityScore = await checkToxicity(messageText);
    console.log('Toxicity Score:', toxicityScore);

    // Define a threshold for toxicity (e.g., 0.8)
    if (toxicityScore >= 0.8) {
      alert("Your message was detected as toxic and cannot be posted.");
      return;
    }

    // **Check Sentiment**
    const sentimentScore = await checkSentiment(messageText);
    console.log('Sentiment Score:', sentimentScore);

    // Optionally, provide feedback based on sentiment score
    if (sentimentScore < -0.5) {
      alert("Your message seems very negative. Please try to be more positive.");
    } 

    // Optionally, you can decide whether to proceed based on sentiment
    // For example, you might prevent posting if sentiment is too negative
    // if (sentimentScore < -0.9) {
    //   alert("Your message seems very negative. Please reach out to support.");
    //   return;
    // }

  } catch (error) {
    console.error('Error checking message:', error);
    alert('An error occurred while analyzing your message. Please try again.');
    return;
  } finally {
    // hideLoadingIndicator();
  }

  // Use the stored username if available to reduce redundant lookups
  let username = await getUsername(user.uid) || "Anonymous";
  localStorage.setItem('username', username); // Cache username locally

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const messageData = {
    uid: user.uid,
    username, // Use username instead of email
    message: messageText,
    location: locationInput.value,
    date,
    time,
    likes: 0,
  };

  await set(ref(database, `messages/${messageId}`), messageData);

  // Update user's contribution count
  const userRef = ref(database, `users/${user.uid}`);
  await runTransaction(userRef, (userData) => {
    if (userData === null) {
      return { contributions: 1, email: user.email, username };
    } else {
      return { ...userData, contributions: (userData.contributions || 0) + 1 };
    }
  });

  // Clear input fields after posting
  messageInput.value = "";
  locationInput.value = "";

  // Optionally, hide the comment form or display a success message
  // hideCommentForm();
  // alert('Your message has been posted!');
}

function displayMessages() {
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = ""; // Clear all messages before rendering new ones

  const messagesRef = ref(database, 'messages/');
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
      const messageIds = Object.keys(data);
      const totalMessages = messageIds.length;
      const batchSize = 20; // Render messages in batches of 20

      function renderBatch(startIndex) {
        const endIndex = Math.min(startIndex + batchSize, totalMessages);
        
        for (let i = startIndex; i < endIndex; i++) {
          const messageId = messageIds[i];
          const messageData = data[messageId];
          renderMessage(messageId, messageData);
        }

        if (endIndex < totalMessages) {
          // Schedule the next batch
          setTimeout(() => renderBatch(endIndex), 100);
        }
      }

      renderBatch(0);
    }
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
  nameElement.textContent = messageData.username || "Anonymous"; // Set the username correctly
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

// random positioning coordinates for message
function getRandomPosition() {
  const wall = document.getElementById("messages");
  const wallWidth = wall.offsetWidth;
  const wallHeight = wall.offsetHeight;

  const randomX = Math.floor(Math.random() * (wallWidth + 250)) - 250; // Allow negative values
  const randomY = Math.floor(Math.random() * wallHeight);

  return { x: randomX, y: randomY };
}

// set comment to random location initially
function positionAndAppendMessage(message) {
  const wall = document.getElementById("messages");
  const { x, y } = getRandomPosition();
  
  // Adjust position if it's negative
  const adjustedX = Math.max(0, x);
  const adjustedY = Math.max(0, y);
  
  message.style.left = `${adjustedX}px`;
  message.style.top = `${adjustedY}px`;

  wall.appendChild(message);

  // Dynamically expand page if needed
  const messageBottom = adjustedY + message.offsetHeight;
  const messageRight = adjustedX + message.offsetWidth;
  
  const currentHeight = wall.offsetHeight;
  const currentWidth = wall.offsetWidth;

  // Expand right
  if (messageRight > currentWidth) {
    wall.style.width = `${messageRight + 200}px`;
  }

  // Expand bottom
  if (messageBottom > currentHeight) {
    wall.style.height = `${messageBottom + 200}px`;
  }

  // Expand left
  if (x < 0) {
    const newWidth = currentWidth + Math.abs(x) + 200;
    wall.style.width = `${newWidth}px`;
    wall.style.marginLeft = `-${Math.abs(x)}px`;
    
    // Shift all existing messages to the right
    const allMessages = wall.querySelectorAll('.message');
    allMessages.forEach(msg => {
      const currentLeft = parseInt(msg.style.left);
      msg.style.left = `${currentLeft + Math.abs(x)}px`;
    });
  }
}

function incrementHeartCount(heartReaction, messageId) {
  const userId = localStorage.getItem("userId") || Date.now();  // Track user with a simple unique identifier
  localStorage.setItem("userId", userId);

  const likedMessages = JSON.parse(localStorage.getItem("likedMessages")) || [];

  // Prevent liking the same message multiple times
  if (likedMessages.includes(messageId)) {
    alert("You've already liked this message.");
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

// Allows user to drag comments through click input
function makeDraggable(element) {
  element.setAttribute("draggable", true);
  element.addEventListener(
    "dragstart",
    (event) => {
      drag_start(event);
      event.dataTransfer.setData("dragged-id", element.id);
    },
    false
  );

  // On load, position the element based on saved positions in localStorage
  const savedPosition = localStorage.getItem(element.id);
  if (savedPosition) {
    const { x, y } = JSON.parse(savedPosition);
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  } else {
    // Randomly position if no saved position exists
    const { x, y } = getRandomPosition();
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

// Helper function to get the username from the database
async function getUsername(uid) {
  const userRef = ref(database, `users/${uid}/username`);
  return (await get(userRef)).val();
}