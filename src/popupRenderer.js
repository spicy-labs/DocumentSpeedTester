export function renderTest(buttonCallback) {
  const appDiv = document.getElementById('app');
  appDiv.innerHTML = ''; // Clear previous content

  // Create and append the h3 element
  const h3 = document.createElement('h3');
  h3.textContent = 'Set number of tests and press Run Tests';
  appDiv.appendChild(h3);

  // Create and append the warning message
  const warning = document.createElement('p');
  warning.textContent = 'Do not leave or minimize that tab. Trying to access other CHILI stuff will cause errors in testing.';
  warning.style.color = 'red';
  appDiv.appendChild(warning);

  // Create and append the number input
  const numberInput = document.createElement('input');
  numberInput.id = "numberInput";
  numberInput.type = 'number';
  numberInput.value = 5;
  numberInput.min = '1';
  numberInput.style.fontSize = '2em';
  appDiv.appendChild(numberInput);

  // Create and append the button
  const runButton = document.createElement('button');
  runButton.textContent = 'Run Tests';
  runButton.style.fontSize = '2em';
  runButton.style.backgroundColor = 'green';
  runButton.style.color = 'white';
  runButton.addEventListener("click", buttonCallback)

  appDiv.appendChild(runButton);
  // Create and append the checkbox for random sleep
  const randomSleepCheckbox = document.createElement('input');
  randomSleepCheckbox.type = 'checkbox';
  randomSleepCheckbox.id = 'randomSleepCheckbox';
  appDiv.appendChild(randomSleepCheckbox);

  // Create and append the label for the checkbox
  const checkboxLabel = document.createElement('label');
  checkboxLabel.htmlFor = 'randomSleepCheckbox';
  checkboxLabel.textContent = 'Random sleep between tests';
  appDiv.appendChild(checkboxLabel);

  // Create and append the div for max time input
  const maxTimeDiv = document.createElement('div');
  maxTimeDiv.id = 'maxTimeDiv';
  maxTimeDiv.style.display = 'none'; // Initially hidden
  appDiv.appendChild(maxTimeDiv);

  // Create and append the label for max time input
  const maxTimeLabel = document.createElement('label');
  maxTimeLabel.htmlFor = 'maxTimeInput';
  maxTimeLabel.textContent = 'Max time (s)';
  maxTimeDiv.appendChild(maxTimeLabel);

  // Create and append the number input for max time
  const maxTimeInput = document.createElement('input');
  maxTimeInput.id = 'maxTimeInput';
  maxTimeInput.type = 'number';
  maxTimeInput.value = 5;
  maxTimeInput.min = '2';
  maxTimeInput.max = '15';
  maxTimeDiv.appendChild(maxTimeInput);

  // Add event listener to checkbox to show/hide max time input
  randomSleepCheckbox.addEventListener('change', function() {
    if (randomSleepCheckbox.checked) {
      maxTimeDiv.style.display = 'block';
    } else {
      maxTimeDiv.style.display = 'none';
    }
  });

}

export function renderPrepare(buttonCallback) {
  const appDiv = document.getElementById('app');
  appDiv.innerHTML = ''; // Clear previous content

  // Create and append the first instruction paragraph
  const instruction1 = document.createElement('h3');
  instruction1.textContent = "Press prepare, the page will reload and please wait until all frames have loaded before pressing Test.";
  appDiv.appendChild(instruction1);

  // Create and append the second instruction paragraph
  const instruction2 = document.createElement('p');
  instruction2.textContent = "We strongly suggest:";
  appDiv.appendChild(instruction2);

  // Create and append the unordered list
  const ul = document.createElement('ul');
  const li1 = document.createElement('li');
  li1.textContent = "Keep your dev tools open to make sure all frame requests are complete";
  ul.appendChild(li1);

  const li2 = document.createElement('li');
  li2.textContent = "Turn on Disable Cache in the network tab to test worst case scenario";
  ul.appendChild(li2);

  appDiv.appendChild(ul);

  // Create and append the big red button
  const button = document.createElement('button');
  button.textContent = "prepare";
  button.style.backgroundColor = 'red';
  button.style.color = 'white';
  button.style.fontSize = '20px';
  button.style.padding = '10px 20px';
  button.style.border = 'none';
  button.style.cursor = 'pointer';

  button.addEventListener("click", buttonCallback)

  appDiv.appendChild(button);
}
