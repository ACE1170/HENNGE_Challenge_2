import fetch from 'node-fetch'; // if using node v18+, native fetch is available, else install node-fetch

const contactEmail = "your-email@example.com";  // Replace with your email
const githubUrl = "https://gist.github.com/YOUR_ACCOUNT/GIST_ID";  // Replace with your secret gist URL
const framework = "react";

const body = JSON.stringify({
  contact_email: contactEmail,
  github_url: githubUrl,
  solution_framework: framework,
});

const credentials = Buffer.from(`${contactEmail}:HENNGECHALLENGE`).toString('base64');

async function submitMission3() {
  try {
    const response = await fetch('https://api.challenge.hennge.com/challenges/frontend-password-validation/001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error submitting mission 3:', error.message);
  }
}

submitMission3();
