import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";


// Add Firebase products that you want to use
import {getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Initialize Firebasex
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function checkToxicity(messageText) {
  const apiKey = 'AIzaSyDmjMjPEkQ7D6wbDjflwlzvuhakmXqHExA';
  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`;

  const requestBody = {
    comment: { text: messageText },
    languages: ['en'],
    requestedAttributes: { TOXICITY: {} },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Error in response from Perspective API", response.statusText);
      return null;
    }

    const result = await response.json();

    // Check if the result contains the expected attributeScores
    if (!result.attributeScores || !result.attributeScores.TOXICITY) {
      console.error('Unexpected response format:', result);
      return null;
    }

    const toxicityScore = result.attributeScores.TOXICITY.summaryScore.value;
    return toxicityScore;
  } catch (error) {
    console.error('Error checking toxicity:', error);
    return null;
  }
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
];

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

  addCommentButton.addEventListener("click", showCommentForm);
  backButton.addEventListener("click", hideCommentForm);
  postButton.addEventListener("click", addMessage);
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
  const nameInput = document.getElementById("nameInput");
  const messageInput = document.getElementById("messageInput");
  const locationInput = document.getElementById("locationInput");

  const messageId = `message-${Date.now()}`; // Unique ID
  let nameText = nameInput.value.trim();
  const messageText = messageInput.value.trim();

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Set default name to "Anonymous" if name is empty
  if (!nameText) {
    nameText = "Anonymous";
  }

  // Prevent empty comments and enforce a character limit
  const characterLimit = 200;
  if (!messageText) {
    alert("Please write a message before posting.");
    return;
  } else if (messageText.length > characterLimit) {
    alert(`Your message is too long. Please keep it under ${characterLimit} characters.`);
    return;
  }

  // Check toxicity of the message
  const toxicityScore = await checkToxicity(messageText);
  if (toxicityScore === null) {
    alert("There was an error checking the toxicity of the message. Please try again.");
    return;
  }

  // Define the toxicity threshold (e.g., 0.7 for moderate filtering)
  const toxicityThreshold = 0.3;
  if (toxicityScore >= toxicityThreshold) {
    alert("Your message is too toxic and cannot be posted.");
    return;
  } else {
    set(ref(database, 'messages/' + messageId), {
      username: nameText,
      message: messageText,
      location: locationInput.value,
      date,
      time,
    });
  }

  // Clear input fields
  nameInput.value = "";
  messageInput.value = "";
  locationInput.value = "";


}



function displayMessages() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.innerHTML = ""; 
  
    const messagesRef = ref(database, 'messages/');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach((messageId) => {
          const messageData = data[messageId];
  
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
          dateElement.textContent = new Date(parseInt(messageId.split('-')[1])).toLocaleString(); // Assuming messageId is based on timestamp
          dateTimeElement.appendChild(nameElement);
          dateTimeElement.appendChild(dateElement);
          newMessage.appendChild(dateTimeElement);
  
          if (messageData.location) {
            const flag = document.createElement("img");
            flag.className = "flag";
            flag.src = `https://flagcdn.com/25x18/${messageData.location}.png`;
            flag.alt = messageData.location;
            newMessage.appendChild(flag);
          }
  
          const reactions = document.createElement("div");
          reactions.className = "reactions";
          const heartReaction = document.createElement("button");
          heartReaction.className = "reaction";
          heartReaction.innerHTML =
            '<span>❤️</span> <span class="heart-count">0</span>';
          heartReaction.addEventListener("click", () => incrementHeartCount(heartReaction));
          reactions.appendChild(heartReaction);
  
          newMessage.appendChild(reactions);
  
          // Make the message draggable
          makeDraggable(newMessage);
  
          // Position the message randomly (optional)
          positionAndAppendMessage(newMessage);
        });
      }
    });
  }

// random positioning coordinates for message
function getRandomPosition() {
  const wall = document.getElementById("messages");
  const wallWidth = wall.scrollWidth;
  const wallHeight = wall.scrollHeight;

  const randomX = Math.floor(Math.random() * (wallWidth - 200));
  const randomY = Math.floor(Math.random() * (wallHeight - 200));

  return { x: randomX, y: randomY };
}

// set comment to random location initially
function positionAndAppendMessage(message) {
  const { x, y } = getRandomPosition();
  message.style.left = `${x}px`;
  message.style.top = `${y}px`;
  const messagesContainer = document.getElementById("messages");
  messagesContainer.appendChild(message);
}

// message can only be liked once daily
function incrementHeartCount(heartReaction) {
  const heartCount = heartReaction.querySelector(".heart-count");
  let count = parseInt(heartCount.innerHTML);
  heartCount.innerHTML = count + 1;
  heartReaction.onclick = null;
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

// allows user to drag comments through click input
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

function drop(event) {
  var offset = event.dataTransfer.getData("text/plain").split(",");
  var element = document.getElementById(
    event.dataTransfer.getData("dragged-id")
  );
  element.style.left = event.clientX + parseInt(offset[0], 10) + "px";
  element.style.top = event.clientY + parseInt(offset[1], 10) + "px";
  event.preventDefault();
  return false;
}

function drag_over(event) {
  event.preventDefault();
  return false;
}

document.body.addEventListener("dragover", drag_over, false);
document.body.addEventListener("drop", drop, false);