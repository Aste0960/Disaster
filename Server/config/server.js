require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const https = require("https");

let fetch;
(async () => {
  fetch = (await import("node-fetch")).default;
})();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins; adjust this in production for security
};
app.use(cors(corsOptions));

// API to fetch earthquake data
app.get("/api/earthquakes", async (req, res) => {
  try {
    const {
      starttime = "1970-01-01",
      endtime = "2025-01-01",
      minmag = 0,
      maxmag = 10,
      mindepth = 0,
      maxdepth = 900,
    } = req.query;

    const irisURL = `https://ds.iris.edu/ieb/index.html?format=text&nodata=404&starttime=${starttime}&endtime=${endtime}&minmag=${minmag}&maxmag=${maxmag}&mindepth=${mindepth}&maxdepth=${maxdepth}&orderby=time-desc&src=usgs&limit=1000&maxlat=15.0&minlat=3.0&maxlon=48.0&minlon=33.0&zm=8&mt=ter`;

    // Fetch data from IRIS
    const response = await fetch(irisURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Node.js fetch)",
      },
    });

    const data = await response.text();

    // Send data to the frontend
    res.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Unable to fetch data. Please try again later." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
