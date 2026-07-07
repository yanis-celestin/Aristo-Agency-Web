// Aristo landing page — Express web server
// Serves the static pages in /public. Edit the HTML in that folder
// to change the design or copy; no server changes needed.

const express = require('express');
const path = require('path');

const app = express();

// Hosting providers (like Hostinger) tell the app which port to use
// via the PORT environment variable. Fall back to 3000 for local dev.
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, 'public');

// Serve everything in /public. The `extensions` option means a request
// for "/our-services" will also find "our-services.html".
app.use(express.static(publicDir, { extensions: ['html'] }));

// If nothing matched above, serve the styled 404 page.
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Aristo site running at http://localhost:${PORT}`);
});
