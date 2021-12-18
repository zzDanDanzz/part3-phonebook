const PORT = process.env.PORT || 3001;

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

const express = require("express");
var morgan = require('morgan')
const app = express();

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
    response.json(persons);
});

// information page about api
app.get("/info", (request, response) => {
    response.send(
        `<p>phonebook has info for ${persons.length
        } people</p><p>${new Date()}</p>`
    );
});

// getting one resource
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    // resource does not exist
    if (!person) {
        response.status(404).end();
        return;
    }

    // else return resource
    response.json(person);
});

// deleting a resource
app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    // does not exist for deletion to occur
    if (!person) {
        response.status(404).end();
        return;
    }

    // else delete
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
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

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
