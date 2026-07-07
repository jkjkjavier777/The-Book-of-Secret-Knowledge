async function editFile(filePath, newContent) {
  const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${filePath}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Node.js Bot',
    'Authorization': `token ${GITHUB_TOKEN}`
  };

  // First, get the current file's SHA
  try {
    const getResponse = await fetch(url, { headers });
    if (!getResponse.ok) return `Error: Could not fetch ${filePath}.`;
    const fileData = await getResponse.json();
    const sha = fileData.sha;

    // Prepare the update payload
    const payload = {
      message: `Update ${filePath}`,
      content: Buffer.from(newContent).toString('base64'),
      sha: sha
    };

    // Send the update request
    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!updateResponse.ok) return `Error: Could not update ${filePath}.`;
    return `Successfully updated ${filePath}.`;
  } catch (err) {
    return `Error: ${err.message}`;
  }
}