// is this going to cause any problems for heroku
const PORT = process.env.PORT || 3001;

const express = require("express");
const morgan = require('morgan')
const app = express();
const Contact = require('./note')
const errorHandler = require('./errorHandler');

app.use(express.json());
app.use(express.static('build'))

// Only show request content if request method is POST
morgan.token('content', (req, res) => req.method == "POST" ? "## request-content: " + JSON.stringify(req.body) : " "
)

app.use(
    morgan('method: :method ## url: :url ## status-code: :status ## content-len: :res[content-length] ## response-time: :response-time ms :content')
)

// getting all resources
app.get("/api/persons", (request, response) => {
    Contact.find()
        .then(contacts => {
            response.json(contacts);
        })
});

// information page about api
app.get("/info", (request, response) => {
    response.send(
        `<p>phonebook has info for ${persons.length
        } people</p><p>${new Date()}</p>`
    );
});

// getting one resource
app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Contact.findById(id).then(contact => {
        // resource does not exist
        if (!contact) {
            response.status(404).end();
            return
        }
        // found contact, send
        response.json(contact)
    })
        // send errors to error handler
        .catch(err => { next(err) })

});

// deleting a resource
app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    Contact.findByIdAndDelete(id)
        .then((exists) => {
            // if user does not exist for deletion
            if (!exists) {
                response.status(404).end();
                return;
            }
            // otherwise send 204 after successful delete
            response.status(204).end()
        })
        // send errors to error handler
        .catch(err => next(err))

});

// adding a resource
app.post("/api/persons/", (request, response) => {
    const id = Math.floor(Math.random() * 1000000);
    const name = request.body.name;
    const number = request.body.number;

    // Incomplete information
    if (!name || !number) {
        response.statusMessage = "information incomplete";
        response.status(400).json({ error: "name and/or number missing" });
        return;
    }

    // name already exists
    const alreadyExists = persons.find((person) => person.name === name);
    if (alreadyExists) {
        response.statusMessage = "name is a duplicate";
        response.status(400).json({ error: "name is a duplicate" });
        return;
    }

    // else we just add new person
    const newPerson = { id: id, name: name, number: number };
    persons = persons.concat(newPerson);
    response.status(200).json(newPerson);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
