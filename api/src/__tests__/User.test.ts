import request from 'supertest';
import { app } from '../app';
import createConnection from '../database'

describe("Users", () => {

    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    // afterAll(async () => {
    //     const connection = getConnection();
    //     await connection.dropDatabase();
    //     await connection.close();
    // })

    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({ email: "user@example.com", name: "User Name"})
        
        expect(response.status).toBe(201);
    });

    it("Should not be able to create a user with exists email", async () => {
        const response = await request(app).post("/users").send({ email: "user@example.com", name: "User Name"})
        
        expect(response.status).toBe(400);
    });

    it("Should be able to get all surveys", async () => {
        await request(app).post("/users").send({ email: "user2@example.com", name: "User Name 2"})
        
        const response = await request(app).get("/surveys");
        
        expect(response.body.length).toBe(2);
    });

});