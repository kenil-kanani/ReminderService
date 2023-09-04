const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');
const { subscribeMessage, createChannel } = require('./utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('./config/serverConfig');

// const { sendBasicEmail } = require('./services/email-service')
const TicketController = require('./controllers/ticket-controller');
const jobs = require('./utils/job');
const EmailService = require('./services/email-service');

const setupAndStartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('reminderservice/api/v1/tickets', TicketController.create);

    const channel = await createChannel();
    await subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY);

    app.listen(PORT, () => {
        console.log("Server started at PORT : ", PORT);
        // jobs();
    });
}

setupAndStartServer();