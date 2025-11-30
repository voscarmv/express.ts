import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";

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

// ---------------------- Types ----------------------

type CreateUserBody = { user_id: string };

type CreateMessageBody = {
    user_id: string;
    queued: boolean;
    message: object;
};

// ---------------------- USERS CRUD ----------------------

app.post(
    "/users",
    async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
        try {
            const { user_id } = req.body;
            const result = await createUser(user_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

app.get(
    "/users/:user_id",
    async (req: Request<{ user_id: string }>, res: Response) => {
        try {
            const result = await getUser(req.params.user_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

app.put(
    "/users/:user_id",
    async (req: Request<{ user_id: string }>, res: Response) => {
        try {
            const result = await updateUserTimestamp(req.params.user_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

app.delete(
    "/users/:user_id",
    async (req: Request<{ user_id: string }>, res: Response) => {
        try {
            const result = await deleteUser(req.params.user_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

// ---------------------- MESSAGES CRUD ----------------------

app.post(
    "/messages",
    async (req: Request<{}, {}, CreateMessageBody>, res: Response) => {
        try {
            const { user_id, queued, message } = req.body;
            const result = await insertMessage(user_id, queued, message);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

app.get(
    "/messages/:user_id",
    async (req: Request<{ user_id: string }>, res: Response) => {
        try {
            const result = await readMessages(req.params.user_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

app.get(
    "/messages/:user_id/queued",
    async (req: Request<{ user_id: string }>, res: Response) => {
        try {
            const result = await queuedMessages(req.params.user_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

app.put(
    "/messages/:user_id/unqueue",
    async (req: Request<{ user_id: string }>, res: Response) => {
        try {
            const result = await unqueueMessages(req.params.user_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

app.delete(
    "/messages/:id",
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const result = await deleteMessage(Number(req.params.id));
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

// ---------------------- START SERVER ----------------------

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export { app };
