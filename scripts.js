const countries = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    // ... [other countries] ...
    { code: "ZW", name: "Zimbabwe" }
];

window.onload = () => {
    const locationInput = document.getElementById('locationInput');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        locationInput.appendChild(option);
    });
}

function showCommentForm() {
    const commentForm = document.getElementById('wall');
    commentForm.style.display = 'flex';
    commentForm.style.margin = '20px auto'; // Center the form
    const addCommentButton = document.getElementById('addCommentButton');
    addCommentButton.style.display = 'none';
}

function hideCommentForm() {
    const commentForm = document.getElementById('wall');
    commentForm.style.display = 'none';
    const addCommentButton = document.getElementById('addCommentButton');
    addCommentButton.style.display = 'block';
}

function getRandomPosition() {
    const wall = document.getElementById('messages');
    const wallWidth = wall.clientWidth;
    const wallHeight = wall.clientHeight;

    const randomX = Math.floor(Math.random() * (wallWidth - 200)); // Adjust for message width
    const randomY = Math.floor(Math.random() * (wallHeight - 200)); // Adjust for message height

    return { x: randomX, y: randomY };
}

function addMessage() {
    const messageInput = document.getElementById('messageInput');
    const mediaInput = document.getElementById('mediaInput');
    const locationInput = document.getElementById('locationInput');

    const messageText = messageInput.value.trim();
    const mediaFile = mediaInput.files[0];
    const locationValue = locationInput.value;

    if (messageText) {
        const messagesContainer = document.getElementById('messages');
        const newMessage = document.createElement('div');
        newMessage.className = 'message';

        const textElement = document.createElement('p');
        textElement.textContent = messageText;
        newMessage.appendChild(textElement);

        if (mediaFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const image = document.createElement('img');
                image.src = e.target.result;
                newMessage.appendChild(image);
                positionAndAppendMessage(newMessage);
            };
            reader.readAsDataURL(mediaFile);
        } else {
            positionAndAppendMessage(newMessage);
        }

        if (locationValue) {
            const flag = document.createElement('img');
            flag.className = 'flag';
            flag.src = `https://flagcdn.com/20x15/${locationValue.toLowerCase()}.png`; // Using flagcdn for flag images
            flag.alt = locationValue;
            newMessage.appendChild(flag);
        }

        messageInput.value = '';
        mediaInput.value = '';
        locationInput.value = '';
    }
}

function positionAndAppendMessage(message) {
    const { x, y } = getRandomPosition();
    message.style.left = `${x}px`;
    message.style.top = `${y}px`;
    const messagesContainer = document.getElementById('messages');
    messagesContainer.appendChild(message);
}
