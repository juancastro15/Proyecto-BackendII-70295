import TicketManager from "../services/mongo/ticket.dao.js";

const ticketManager = new TicketManager();

export const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.tid;
    const ticket = await ticketManager.getTicketById(ticketId);
    if (ticket) {
      res.sendSuccess(ticket); // respondo usando customResponses.js
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    console.log(error);
  }
};