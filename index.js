const PORT = process.env.PORT || 3001;

const express = require('express');
const morgan = require('morgan');

const app = express();
const Contact = require('./note');
const errorHandler = require('./errorHandler');

app.use(express.json());
app.use(express.static('build'));

// Only show request content if request method is POST
morgan.token('content', (req) => (req.method === 'POST' ? `## request-content: ${JSON.stringify(req.body)}` : ' '));

app.use(
  morgan('method: :method ## url: :url ## status-code: :status ## content-len: :res[content-length] ## response-time: :response-time ms :content'),
);

// getting all resources
app.get('/api/persons', (request, response) => {
  Contact.find()
    .then((contacts) => {
      response.json(contacts);
    });
});

// information page about api
app.get('/info', async (request, response) => {
  const count = await Contact.count();
  response.send(
    `<p>phonebook has info for ${count} people</p><p>${new Date()}</p>`,
  );
});

// getting one resource
app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Contact.findById(id).then((contact) => {
    // resource does not exist
    if (!contact) {
      response.status(404).end();
      return;
    }
    // found contact, send
    response.json(contact);
  })
    // send errors to error handler
    .catch((err) => { next(err); });
});

// deleting a resource
app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Contact.findByIdAndDelete(id)
    .then((exists) => {
      // if user does not exist for deletion
      if (!exists) {
        response.status(404).end();
      } else {
        // otherwise send 204 after successful delete
        response.status(204).end();
      }
    })
    // send errors to error handler
    .catch((err) => next(err));
});

// adding a resource
app.post('/api/persons/', async (request, response, next) => {
  const { name } = request.body;
  const { number } = request.body;

  new Contact({ name, number })
    .save()
    .then((contact) => {
      response.status(200).json(contact);
    })
    .catch((err) => next(err));
});

// Updating a resource
app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  const { number } = request.body;
  if (!number) {
    response.statusMessage = 'information incomplete';
    response.status(400).json({ error: 'number missing' });
    return;
  }
  Contact.findByIdAndUpdate(id, { number }, { new: true, runValidators: true, context: 'query' })
    .then((updatedContact) => {
      if (updatedContact) {
        response.json(updatedContact);
      } else {
        response.status(400).json({ error: 'user does not exist' });
      }
    })
    .catch((err) => next(err));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
