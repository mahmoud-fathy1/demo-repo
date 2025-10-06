const app = require("./app.js");
const db = require("./config/db");
const capitalizeWords = require("./utils/capitalizeWords.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query, validationResult, matchedData, body } = require("express-validator");
const User = require("./models/user.model.js");

require("dotenv").config();

app.get("/hello", query("person").notEmpty(), (req, res) => {
    let result = validationResult(req);
    console.log("is Valid", result.isEmpty());
    console.log("Erros", result.array());

    if (result.isEmpty()) {
        res.send(`Hello, ${req.query.person}!`);
    }

    // if (req.query.person) {
    //     res.send(`Hello, ${req.query.person}!`);
    // }

    res.status(404).send(result.array()[0].msg);
});

app.get("/getData", query("mydata").notEmpty().escape(), (req, res) => {
    let result = validationResult(req);

    let data = matchedData(req);

    console.log(data);

    if (result.isEmpty()) {
        res.send(`${data.mydata}`);
        // res.send(`${req.query.mydata}`); //! Data Before Sanitization
        return;
    }

    res.status(404).send(result.array());
});

const emailValidator = function () {
    return body("email").isEmail();
};

app.post("/signup", emailValidator(), async (req, res) => {
    let email = req.body.email;

    let result = validationResult(req);
    let data = matchedData(req);

    console.log(data);

    if (result.isEmpty()) {
        console.log(`${req.body.email}`);

        res.send(`${email}`);
        return;
    }

    res.status(404).send(result.array());

    // let password = req.body.password;
    // let role = req.body.role;

    // if (role !== "admin" || role !== "user") {
    //     res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    // }

    // let hashedPassword = await bcrypt.hash(password, 12);

    // let user = await User.create({
    //     email,
    //     password: hashedPassword,
    //     role,
    // });

    // res.json({
    //     status: "Success",
    //     message: "Signup Successful",
    //     data: {
    //         id: user._id,
    //         email: user.email,
    //     },
    // });
});
app.post("/login", emailValidator().isLength({ min: 5 }), async (req, res) => {
    let email = req.body.email;

    let result = validationResult(req);
    let data = matchedData(req);

    console.log(data);

    if (result.isEmpty()) {
        console.log(`${req.body.email}`);

        res.send(`${email}`);
        return;
    }

    res.status(404).send(result.array());

    // let password = req.body.password;
    // let role = req.body.role;

    // if (role !== "admin" || role !== "user") {
    //     res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    // }

    // let hashedPassword = await bcrypt.hash(password, 12);

    // let user = await User.create({
    //     email,
    //     password: hashedPassword,
    //     role,
    // });

    // res.json({
    //     status: "Success",
    //     message: "Signup Successful",
    //     data: {
    //         id: user._id,
    //         email: user.email,
    //     },
    // });
});

app.get("/search", query("keyword").notEmpty(), (req, res) => {
    let keyword = req.query.keyword;

    let result = validationResult(req);

    let data = matchedData(req);
    console.log(data);

    console.log(`(${keyword})`);
    console.log(`(${data.keyword})`);

    if (result.isEmpty()) {
        return res.send(`${keyword}`);
    }

    res.status(404).send(result.array());
});

app.post("/data", body("addresses.**.number").isNumeric(), (req, res) => {
    console.log(req.body.country);
});

db();

app.listen(process.env.PORT, () => {
    console.log(`Server Started on port: ${process.env.PORT}`);
    console.log(`hello`);
    console.log(`hello`);
    console.log(`hello`);
    console.log(`hello`);
    console.log(`hello`);
    console.log(`hello`);
});
