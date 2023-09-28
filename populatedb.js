const Catagory = require('./models/catagory');
const Product = require('./models/product');
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
// This populates the db

// Creates array of created catagories
const catagories = [];

// Create a catagory, save to database and on catagories array
async function createCatagory(index, name) {
    const catagory = new Catagory({ name: name })
    await catagory.save()
    .then(savedDoc => {
      console.log(savedDoc)
      catagories[index] = savedDoc
      console.log(catagories)
    })
    .catch(err => console.log(err))
    
    console.log(`Added catagory: ${name}`)
}

// Creates a product and save to database
async function createProduct(name, flavor, catagory, inventory, price, imgurl) {
    const product = new Product({
        name,
        flavor,
        catagory,
        inventory,
        price,
        imgurl
    })

    await product.save()
    console.log(`Added product: ${name}`)
}

async function addCatagories() {
  console.log('initiate cata')
    await Promise.all([
        createCatagory(0, 'preworkout'),
        createCatagory(1, 'protien')
    ])
}

async function addProducts() {
  console.log('initiate prod')
    await Promise.all([
        createProduct(
            'Bucked Up',
            'Ice Berry',
            catagories[0],
            10,
            39.99,
            'https://firebasestorage.googleapis.com/v0/b/inventory-express.appspot.com/o/buckedup.png?alt=media&token=328bceaa-2821-469d-9d01-28bff44dd95d'
        ),
        createProduct(
            'C4',
            'Fruit Punch',
            catagories[0],
            6,
            19.99,
            'https://firebasestorage.googleapis.com/v0/b/inventory-express.appspot.com/o/c4.png?alt=media&token=c84f1f52-fc6f-47b2-8ac1-1a33abaf4e89'
        ),
        createProduct(
            'Ghost',
            'Sour Patch',
            catagories[0],
            10,
            39.99,
            'https://firebasestorage.googleapis.com/v0/b/inventory-express.appspot.com/o/ghost.png?alt=media&token=86df128e-2f28-4355-8e02-eca512c934c3'
        ),
        createProduct(
            'Thavage',
            'Peach Berry',
            catagories[0],
            2,
            59.99,
            'https://firebasestorage.googleapis.com/v0/b/inventory-express.appspot.com/o/thavage.png?alt=media&token=d09ea5c4-5baa-44ad-a8ea-a4165aa1fad2'
        ),
        createProduct(
            'Ghost',
            'Chips ahoy',
            catagories[1],
            20,
            69.99,
            'https://firebasestorage.googleapis.com/v0/b/inventory-express.appspot.com/o/ghost.jpg?alt=media&token=5f647aab-c6ce-465e-a9c9-64fff59a5817'
        ),
        createProduct(
            'ISO100',
            'Gourmet Chocolate',
            catagories[1],
            20,
            79.99,
            'https://firebasestorage.googleapis.com/v0/b/inventory-express.appspot.com/o/iso100.jpg?alt=media&token=0a446af6-0f90-44ff-9084-6ffeac22ddcf'
        ),
    ])
}
