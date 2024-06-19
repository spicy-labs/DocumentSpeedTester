
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse();
  console.log(message)

  if (message.event == "preparing") {
    showPreparationScreen();
  }

  if (message.event == "force-reload") {
    location.reload();
  }

  if (message.event == "reload") {

    if (message.sleep) {
      const maxSleepTime = message.maxSleepTime ?? 2;
      showSleepingPopup();
      setTimeout(() => location.reload(), getRandomNumberBetween(1, maxSleepTime) * 1000);

    }
    else {
      location.reload();
    }

  }

  return false;
})


function showSleepingPopup() {
  // Create a div element to act as the modal background
  const modalBackground = document.createElement('div');
  modalBackground.style.position = 'fixed';
  modalBackground.style.top = '0';
  modalBackground.style.left = '0';
  modalBackground.style.width = '100%';
  modalBackground.style.height = '100%';
  modalBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalBackground.style.display = 'flex';
  modalBackground.style.justifyContent = 'center';
  modalBackground.style.alignItems = 'center';
  modalBackground.style.zIndex = '1000';

  // Create a div element to act as the modal content
  const modalContent = document.createElement('div');
  modalContent.style.padding = '20px';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.borderRadius = '10px';
  modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  modalContent.style.fontSize = '24px';
  modalContent.style.fontWeight = 'bold';
  modalContent.style.textAlign = 'center';

  // Set the text content of the modal
  modalContent.textContent = 'Sleeping 💤';

  // Append the modal content to the modal background
  modalBackground.appendChild(modalContent);

  // Append the modal background to the body
  document.body.appendChild(modalBackground);
}

function showPreparationScreen() {
  // Create the overlay div
  const overlay = document.createElement('div');
  overlay.id = 'preparation-screen';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'white';
  overlay.style.color = 'black';
  overlay.style.textAlign = 'center';
  overlay.style.zIndex = '1000'; // Ensure it is above other elements
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Create the main message
  const message = document.createElement('h1');
  message.textContent = 'Preparing test';
  message.style.fontSize = '3em';

  // Create the subtext
  const subtext = document.createElement('p');
  subtext.textContent = '...this will take 1 minute';
  subtext.style.fontSize = '1.5em';
  subtext.style.color = 'gray';

  // Append the message and subtext to the overlay
  overlay.appendChild(message);
  overlay.appendChild(subtext);

  // Append the overlay to the body
  document.body.appendChild(overlay);
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
