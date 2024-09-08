import { query } from "./database";
import { object, string, date } from "joi";

const getChat = (request, response) => {
  query("SELECT * FROM messages", (error, results) => {
    if (error) {
      console.error("Error fetching messages:", error);
      return response.status(500).send("Internal Server Error");
    }
    return response.status(200).json(results.rows);
  });
};

const addChat = (request, response) => {
  const chatSchema = object({
    user: string().min(3).required(),
    text: string().min(1).required(),
    timestamp: date().iso().required(),
  });

  const { error } = chatSchema.validate(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  const { user, text, timestamp } = request.body;

  const sqlQuery = `INSERT INTO messages("user", text, timestamp) VALUES ($1, $2, $3)`;
  const values = [user, text, timestamp];

  query(sqlQuery, values, (error, results) => {
    if (error) {
      console.error("Error inserting chat message:", error);
      return response.status(500).send("Internal Server Error");
    }
    return response.status(201).send("Chat message added successfully.");
  });
};

export default {
  getChat,
  addChat,
};
