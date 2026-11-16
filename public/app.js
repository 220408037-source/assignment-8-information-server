const responseOutput = document.querySelector('#response-output');
const responseStatus = document.querySelector('#response-status');
const routeButtons = document.querySelectorAll('button[data-path]');

async function callRoute(button) {
  const method = button.dataset.method;
  const path = button.dataset.path;
  const originalText = button.textContent;

  routeButtons.forEach((item) => { item.disabled = true; });
  responseStatus.textContent = `${method} ${path} ...`;
  responseOutput.textContent = 'Waiting for the server response...';

  try {
    const response = await fetch(path, { method });
    const contentType = response.headers.get('content-type') || '';
    let body;

    if (contentType.includes('application/json')) {
      const json = await response.json();
      body = JSON.stringify(json, null, 2);
    } else {
      body = await response.text();
    }

    responseStatus.textContent = `${response.status} ${response.statusText}`;
    responseOutput.textContent = body;
  } catch (error) {
    responseStatus.textContent = 'Request failed';
    responseOutput.textContent = `Could not complete the request: ${error.message}`;
  } finally {
    routeButtons.forEach((item) => { item.disabled = false; });
    button.textContent = originalText;
  }
}

routeButtons.forEach((button) => {
  button.addEventListener('click', () => callRoute(button));
});
