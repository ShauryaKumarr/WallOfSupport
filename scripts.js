const config = {
    perspectiveApiKey: 'AIzaSyAAxz0XFQgVFCfszxMssrevtma0cLm0vKw',
    naturalLanguageApiKey: 'AIzaSyAL1Q6Fd5T5IxABMtx3GTvpEbBLd4m_Usc'
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
    { code: "ZW", name: "Zimbabwe" }
];


const quotes = [
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt"
];

window.onload = () => {
    const locationInput = document.getElementById('locationInput');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code.toLowerCase(); 
        option.textContent = country.name;
        locationInput.appendChild(option);
    });

    showRandomQuote();
};

 function showCommentForm() {
    const commentForm = document.getElementById('wall');
    commentForm.style.display = 'flex';
    const addCommentButton = document.getElementById('addCommentButton');
    addCommentButton.style.display = 'none';
}
 function hideCommentForm() {
    const commentForm = document.getElementById('wall');
    commentForm.style.display = 'none';
    const addCommentButton = document.getElementById('addCommentButton');
    addCommentButton.style.display = 'block';
}

async function addMessage() {
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    const locationInput = document.getElementById('locationInput');
    
    const messageId = `message-${Date.now()}`; // Unique ID
    
    let nameText = nameInput.value.trim();
    const messageText = messageInput.value.trim();
    const locationValue = locationInput.value;
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Set default name to "Anonymous" if name is empty
    if (!nameText) {
        nameText = "Anonymous";
    }

    // Prevent empty comments and enforce a character limit
    const characterLimit = 200; // Set the character limit here
    if (!messageText) {
        alert("Please write a message before posting.");
        return;
    } else if (messageText.length > characterLimit) {
        alert(`Your message is too long. Please keep it under ${characterLimit} characters.`);
        return;
    }

    // Check for toxicity and sentiment
    console.log("Add message function triggered");
    const isToxic = awaitcheckToxicity(messageText);
    console.log("Toxicity check completed", isToxic);
    const sentimentScore = awaitcheckSentiment(messageText);
    console.log("Sentiment check completed", sentimentScore);

    if (isToxic) {
        alert("Your message was detected as potentially harmful and cannot be posted.");
        return;
    } else if (sentimentScore < 0) {  // Check for negative sentiment
        alert("Your message appears to be negative. Please keep it positive.");
        return;
    }

    // const messagesContainer = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.className = 'message';
    newMessage.id = messageId; 

    const textElement = document.createElement('p');
    textElement.textContent = messageText;
    newMessage.appendChild(textElement);

    const dateTimeElement = document.createElement('div');
    dateTimeElement.className = 'date-time';
    const nameElement = document.createElement('p');
    nameElement.textContent = nameText;
    const dateElement = document.createElement('p');
    dateElement.textContent = `${date} ${time}`;
    dateTimeElement.appendChild(nameElement);
    dateTimeElement.appendChild(dateElement);
    newMessage.appendChild(dateTimeElement);

    if (locationValue) {
        const flag = document.createElement('img');
        flag.className = 'flag';
        flag.src = `https://flagcdn.com/25x18/${locationValue}.png`;
        flag.alt = locationValue;
        newMessage.appendChild(flag);
    }

    const reactions = document.createElement('div');
    reactions.className = 'reactions';
    const heartReaction = document.createElement('button');
    heartReaction.className = 'reaction';
    heartReaction.innerHTML = '<span>❤️</span> <span class="heart-count">0</span>';
    heartReaction.onclick = () => incrementHeartCount(heartReaction);
    reactions.appendChild(heartReaction);

    newMessage.appendChild(reactions);

    positionAndAppendMessage(newMessage);

    nameInput.value = '';
    messageInput.value = '';
    locationInput.value = '';
    
    // Make the message draggable
    makeDraggable(newMessage);
    
}
function getRandomPosition() {
    const wall = document.getElementById('messages');
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
    const messagesContainer = document.getElementById('messages');
    messagesContainer.appendChild(message);
}

// message can only be liked once daily
function incrementHeartCount(heartReaction) {
    const heartCount = heartReaction.querySelector('.heart-count');
    let count = parseInt(heartCount.innerHTML);
    heartCount.innerHTML = count + 1;
    heartReaction.onclick = null;
}

function showRandomQuote() {
    const quoteContainer = document.getElementById('quoteContainer');
    quoteContainer.textContent = quotes[Math.floor(Math.random() * quotes.length)]; 

    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteContainer.textContent = quotes[randomIndex];
    }, 10000); 
}

function makeDraggable(element) {
    element.setAttribute('draggable', true);
    element.addEventListener('dragstart', (event) => {
        drag_start(event);
        event.dataTransfer.setData("dragged-id", element.id);
    }, false);
}

function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + 
    (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
}

function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var element = document.getElementById(event.dataTransfer.getData("dragged-id"));
    element.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    element.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}

function drag_over(event) {
    event.preventDefault();
    return false;
}

// utilizing google cloud API for content filtering
async function checkToxicity(messageText) {
    const response = awaitfetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
    });

    const result = await response.json();
    const score = result.attributeScores.TOXICITY.summaryScore.value;

    return score >= 0.4; // adjust the threshold based on sensitivity
}

// utilizing another google API for sentiment analysis
async function checkSentiment(messageText) {
    const apiKey = config.naturalLanguageApiKey; 
    const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;

    const body = {
        document: {
            type: "PLAIN_TEXT",
            content: messageText
        },
        encodingType: "UTF8"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        const sentimentScore = result.documentSentiment.score; 

        return sentimentScore;
    } catch (error) {
        console.error('Error checking sentiment:', error);
        return 0; 
    }
}

document.body.addEventListener('dragover', drag_over, false);
document.body.addEventListener('drop', drop, false);
