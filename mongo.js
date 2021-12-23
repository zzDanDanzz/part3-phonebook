if (process.argv.length != 5 && process.argv.length != 3 && process.argv.length != 6) {
    printUsage()
    process.exit()
}

const mongoose = require('mongoose')
const password = process.argv[2]
mongoose.connect(`mongodb+srv://dandan:${password}@cluster0.caglw.mongodb.net/phonebookDatabase?retryWrites=true&w=majority`)

// Contact schema
const schema = mongoose.Schema({
    name: String,
    number: Number
})

// Contact model
const Contact = mongoose.model('Contact', schema)

const name = process.argv[3]
const number = process.argv[4]

if (process.argv.length === 5) {
    createNewContact(name, number, password)
} else if (process.argv.length === 3) {
    getAllContacts()
} else if (process.argv.length === 6) {
    updateContact(name, number)
}

function createNewContact(name, number) {
    console.log(`Creating new contact...`);

    const contact = new Contact({ name, number })
    contact.save().then((result) => {
        console.log(`added ${result.name} with number ${result.number} to contacts`);
    }).catch((err) => {
        console.log('There was an error creating the new contact ::: ', err);
    }).finally(() => {
        mongoose.connection.close()
    })
}

function getAllContacts() {
    console.log("Getting all contacts...");
    Contact.find().then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} :: ${contact.number}`);
        })
    }).catch(err => {
        console.log("Could not get contacts :(", err);
    }).finally(() => {
        mongoose.connection.close()
    })

}

function updateContact(name, number) {
    console.log('Updating contact ...');
    Contact.findOneAndUpdate({ name }, { number }).then(res => {
        console.log("res ::: ", res);
    }).catch(err => console.log('err\nerr\nerr\nerr\n ::: ', err))
    .finally(() => mongoose.connection.close());
}

function printUsage() {
    console.log(
        `
        To view all contacts:
        node mongo.js <password>
        
        To add a new contact:
        node mongo.js <password> <name> <number>
        `
    );
}
