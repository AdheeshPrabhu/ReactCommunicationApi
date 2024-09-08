const pool = require("./database");
const Joi = require("joi");
const fs = require("fs");

const getdocs = (request, response) => {
  pool.query("SELECT * FROM docs", function (error, results) {
    if (error) {
      throw error;
    }
    return response.status(200).send(results.rows);
  });
};

const addDoc = (request, response) => {
  let { name, description } = request.body;

  let sqlQuery = `INSERT INTO docs(name,description ) VALUES ('${request.file.filename}', '${description}' )`;
  pool.query(sqlQuery, function (error, results) {
    if (error) {
      throw error;
    }
    return response.status(200).send("Added Doc.");
  });
};

const updateDoc = (request, response) => {
  let id = +request.params.id;
  const docschema = Joi.object({
    description: Joi.string().min(2).required(),
  });

  const { error } = docschema.validate(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  let { description } = request.body;

  console.log(request.body);

  if (Number.isNaN(id)) {
    return response.status(200).send(` Sorry try latter. `);
  }
  {
    if (id != null) {
      let sqlQuery = `UPDATE docs SET "description" = '${description}' where id = ${id}`;
      pool.query(sqlQuery, function (error, results) {
        if (error) {
          console.log("UdateQuery", sqlQuery);
          throw error;
        }
        return response.status(200).send(`Updated doc ${id} `);
      });
    } else {
      return response.status(200).send(` Sorry try latter `);
    }
  }
};

const getDocById = (request, response) => {
  let id = +request.params.id;
  pool.query(`SELECT * FROM docs where id = ${id}`, function (error, results) {
    if (error) {
      throw error;
    }
    return response.status(200).send(results.rows);
  });
};

const deleteDocById = (request, response) => {
  let id = +request.params.id;

  pool.query(
    `select name FROM docs where id = ${id}`,
    function (error, results) {
      if (error) {
        throw error;
      }
      console.log(results);
      fs.unlink("./uploads/" + results.rows[0].name, (err) => {});
    }
  );

  pool.query(`DELETE FROM docs where id = ${id}`, function (error, results) {
    if (error) {
      throw error;
    }
    return response.status(200).send(`Deleted docs ID:${id}`);
  });
};

module.exports = {
  getdocs,
  addDoc,
  updateDoc,
  getDocById,
  deleteDocById,
};
