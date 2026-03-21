# week-5-project-express

So now you have a clear picture of all 3 files:

- server.js → starts the server with listen() - app.js → creates Express app, sets up middleware - router.js → maps URLs to handler functions
  Now one more piece — you have a controllers/ folder. What do you think goes in there, given what you just said about the router?
  ❯ to handle HTTP requests/responses
  ● Exactly! So the router says "this URL goes to this controller", and the controller actually does the work — calls the API, processes the data, sends the response.
  So the flow is:

Request → router → controller → response
