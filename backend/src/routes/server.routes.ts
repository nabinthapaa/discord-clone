import express from "express";
import { ServerService } from "../services";
import { ServerController } from "../controllers";

const router = express.Router();

// INFO: create server
router.post("/", ServerController.createServer);

// INFO: get all servers of a user
router.get("/users/:userId");

// INFO: get all users from server
router.get("/:id/users");

// INFO: get server by id
router.get("/:id");

// INFO: add user to server
router.post("/:id/users/:userId");

// INFO: remove user from server
router.delete("/:id/users/:userId");

export default router;
