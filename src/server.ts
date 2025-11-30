import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import 'dotenv/config';

import {
    createUser,
    getUser,
    updateUserTimestamp,
    deleteUser,
    insertMessage,
    readMessages,
    queuedMessages,
    unqueueMessages,
    deleteMessage
} from "./db.js";

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ---------------------- USERS CRUD ----------------------

// Create user
app.post("/users", async (req, res) => {
    try {
        const { user_id } = req.body;
        const result = await createUser(user_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Get user
app.get("/users/:user_id", async (req, res) => {
    try {
        const result = await getUser(req.params.user_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Update user timestamp
app.put("/users/:user_id", async (req, res) => {
    try {
        const result = await updateUserTimestamp(req.params.user_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Delete user
app.delete("/users/:user_id", async (req, res) => {
    try {
        const result = await deleteUser(req.params.user_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// ---------------------- MESSAGES CRUD ----------------------

// Insert message
app.post("/messages", async (req, res) => {
    try {
        const { user_id, queued, message } = req.body;
        const result = await insertMessage(user_id, queued, message);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Read user messages
app.get("/messages/:user_id", async (req, res) => {
    try {
        const result = await readMessages(req.params.user_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Get queued messages
app.get("/messages/:user_id/queued", async (req, res) => {
    try {
        const result = await queuedMessages(req.params.user_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Unqueue messages
app.put("/messages/:user_id/unqueue", async (req, res) => {
    try {
        const result = await unqueueMessages(req.params.user_id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Delete a message
app.delete("/messages/:id", async (req, res) => {
    try {
        const result = await deleteMessage(Number(req.params.id));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// ---------------------- START SERVER ----------------------
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export { app };