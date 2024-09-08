const pool = require("./database");
const Joi = require("joi");

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", function (error, results) {
    if (error) {
      throw error;
    }
    return response.status(200).send(results.rows);
  });
};

const bcrypt = require("bcrypt");
const saltRounds = 10;

const addUser = async (request, response) => {
  const userschema = Joi.object({
    Fullname: Joi.string().min(3).required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().min(6).required(),
  });

  const { error } = userschema.validate(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  const { Fullname, Email, Password } = request.body;

  try {
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const sqlQuery = `INSERT INTO users ("Fullname", "Email", "Password") VALUES ($1, $2, $3) RETURNING *`;

    pool.query(
      sqlQuery,
      [Fullname, Email, hashedPassword],
      (error, results) => {
        if (error) {
          console.error("Error executing query", error.stack);
          return response.status(500).send("Server error");
        }

        return response.status(201).json({
          message: "User added successfully",
          user: results.rows[0], // Optionally return the inserted user
        });
      }
    );
  } catch (err) {
    console.error("Error hashing password", err);
    return response.status(500).send("Error creating user");
  }
};

const updateUser = (request, response) => {
  let id = +request.params.id;
  const userschema = Joi.object({
    Fullname: Joi.string().min(3).required(),
    Email: Joi.string().email().required(),
  });

  const { error } = userschema.validate(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message); // Return validation error
  }

  const { Fullname, Email } = request.body;

  const sqlQuery = `UPDATE users SET "Fullname" = $1, "Email" = $2 WHERE id = $3 RETURNING *`;

  pool.query(sqlQuery, [Fullname, Email, id], (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);
      return response.status(500).send("Server error");
    }

    if (results.rowCount === 0) {
      return response.status(404).send(`User with ID ${id} not found`);
    }

    return response.status(200).json({
      message: `User with ID ${id} updated successfully`,
      user: results.rows[0],
    });
  });
};

const getUserById = (request, response) => {
  let id = +request.params.id;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);
      return response.status(500).send("Server error");
    }

    if (results.rows.length === 0) {
      return response.status(404).send(`User with ID:${id} not found`);
    }

    return response.status(200).json(results.rows[0]);
  });
};

const deleteUserById = (request, response) => {
  let id = +request.params.id;

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);
      return response.status(500).send("Server error");
    }

    if (results.rowCount === 0) {
      return response.status(404).send(`User with ID:${id} not found`);
    }

    return response.status(200).send(`Deleted User ID:${id}`);
  });
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  getUserById,
  deleteUserById,
};
