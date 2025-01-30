import { Router } from "express";
import { getTicketById } from "../controllers/tickets.controller.js";
import { authorization } from "../middlewares/authorization.js";
import { passportCall } from "../utilities/passportCall.js";

const router = Router();

router.get("/:tid", passportCall("jwt"), authorization("user"), getTicketById);

export default router;