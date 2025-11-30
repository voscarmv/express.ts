import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/server.js";

describe("Users CRUD", () => {

    it("POST /users → creates a user", async () => {
        const res = await request(app)
            .post("/users")
            .send({ user_id: "testuser" });

        expect(res.status).toBe(200);
        expect(res.body[0].user_id).toBe("testuser");
    });

    it("GET /users/:user_id → retrieves user", async () => {
        await request(app).post("/users").send({ user_id: "abc" });

        const res = await request(app).get("/users/abc");
        expect(res.status).toBe(200);
        expect(res.body[0].user_id).toBe("abc");
    });

    it("PUT /users/:user_id → updates user timestamp", async () => {
        await request(app).post("/users").send({ user_id: "abc2" });

        const res = await request(app).put("/users/abc2");

        expect(res.status).toBe(200);
        expect(res.body[0].updated_at).toBeDefined();
    });

    it("DELETE /users/:user_id → deletes user", async () => {
        await request(app).post("/users").send({ user_id: "deleteMe" });

        const res = await request(app).delete("/users/deleteMe");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].user_id).toBe("deleteMe");
    });
});

describe("Messages CRUD", () => {

    it("POST /messages → inserts a message", async () => {
        await request(app).post("/users").send({ user_id: "m1" });

        const res = await request(app)
            .post("/messages")
            .send({
                user_id: "m1",
                queued: true,
                message: { hello: "world" }
            });

        expect(res.status).toBe(200);
        expect(res.body[0].user_id).toBe("m1");
        expect(JSON.parse(res.body[0].message).hello).toBe("world");
    });

    it("GET /messages/:user_id → gets all messages", async () => {
        await request(app).post("/users").send({ user_id: "m2" });

        await request(app)
            .post("/messages")
            .send({ user_id: "m2", queued: false, message: { a: 1 } });

        const res = await request(app).get("/messages/m2");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(JSON.parse(res.body[0].message).a).toBe(1);
    });

    it("GET /messages/:user_id/queued → gets queued messages only", async () => {
        await request(app).post("/users").send({ user_id: "m3" });

        await request(app).post("/messages").send({
            user_id: "m3",
            queued: true,
            message: { q: 1 }
        });

        await request(app).post("/messages").send({
            user_id: "m3",
            queued: false,
            message: { q: 2 }
        });

        const res = await request(app).get("/messages/m3/queued");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(JSON.parse(res.body[0].message).q).toBe(1);
    });

    it("PUT /messages/:user_id/unqueue → unqueues all messages", async () => {
        await request(app).post("/users").send({ user_id: "m4" });

        await request(app)
            .post("/messages")
            .send({ user_id: "m4", queued: true, message: { hello: 1 } });

        const res = await request(app).put("/messages/m4/unqueue");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].queued).toBe(false);
    });

    it("DELETE /messages/:id → deletes a message", async () => {
        await request(app).post("/users").send({ user_id: "m5" });

        const create = await request(app)
            .post("/messages")
            .send({ user_id: "m5", queued: false, message: { x: 1 } });

        const id = create.body[0].id;

        const res = await request(app).delete(`/messages/${id}`);

        expect(res.status).toBe(200);
        expect(res.body[0].id).toBe(id);
    });
});
