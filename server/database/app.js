//xrwvm-fullstack_developer_capstone/server/database/app.js
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const Reviews = require('./review');
const Dealerships = require('./dealership');

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));

// Connect to MongoDB and populate data
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    try {
      await Reviews.deleteMany({});
      await Reviews.insertMany(reviews_data.reviews);
      console.log("✅ Inserted reviews:", reviews_data.reviews.length);

      await Dealerships.deleteMany({});
      await Dealerships.insertMany(dealerships_data.dealerships);
      console.log("✅ Inserted dealerships:", dealerships_data.dealerships.length);
    } catch (err) {
      console.error("❌ Error during DB initialization:", err);
    }

    // ✅ Start server only after DB is ready
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  })
  .catch(err => console.error("❌ MongoDB connection error:", err));


//const Reviews = require('./review');

//const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
    console.log("✅ Inserted dealerships:", dealerships_data['dealerships'].length);
  });
  
} catch (error) {
  res.status(500).json({ error: 'Error fetching documents' });
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// app.js
app.get('/getDealers', async (req, res) => {
    console.log("🔥 /fetchDealers endpoint hit"); // ← これを必ず確認
    try {
        const documents = await Dealerships.find().limit(5);
        res.json(documents);
    } catch (error) {
        console.error("❌ Error in /fetchDealers:", error);
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});






// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
//Write your code here
    try {
        const documents = await Dealerships.find({ state: req.params.state });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships by state' });
    }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
//Write your code here
    try {
        const documents = await Dealerships.find({ id: parseInt(req.params.id) });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealer by id' });
    }
});

//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  data = JSON.parse(req.body);
  const documents = await Reviews.find().sort( { id: -1 } )
  let new_id = documents[0]['id']+1

  const review = new Reviews({
		"id": new_id,
		"name": data['name'],
		"dealership": data['dealership'],
		"review": data['review'],
		"purchase": data['purchase'],
		"purchase_date": data['purchase_date'],
		"car_make": data['car_make'],
		"car_model": data['car_model'],
		"car_year": data['car_year'],
	});

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
		console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
