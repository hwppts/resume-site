require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Path = require("path");

const PORT = process.env.PORT || 3000;

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(data) {
    const auth = Buffer.from(
        `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`
    ).toString("base64");

    const response = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`
        },
        body: JSON.stringify({
            Messages: [
                {
                    From: {
                        Email: process.env.OWNER_EMAIL,
                        Name: process.env.OWNER_NAME
                    },
                    To: [
                        {
                            Email: process.env.OWNER_EMAIL,
                            Name: process.env.OWNER_NAME
                        }
                    ],
                    Subject: "Нове повідомлення",
                    TextPart: JSON.stringify(data)
                }
            ]
        })
    });

    return response.json();
}

async function start() {
    const server = Hapi.server({
        port: PORT,
        host: "localhost",
        routes: {
            files: {
                relativeTo: Path.join(__dirname, "public")
            }
        }
    });

    await server.register(Inert);

    server.route({
        method: "GET",
        path: "/",
        handler: (req, h) => h.file("index.html")
    });

    server.route({
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "."
            }
        }
    });

    server.route({
        method: "POST",
        path: "/api/contact",
        handler: async (req, h) => {
            const { name, email, subject, message } = req.payload;

            if (!name || !email || !subject || !message) {
                return h.response({ message: "Заповніть всі поля" }).code(400);
            }

            if (!isValidEmail(email)) {
                return h.response({ message: "Некоректний email" }).code(400);
            }

            try {
                await sendEmail({ name, email, subject, message });

                return { message: "Успішно надіслано" };
            } catch (e) {
                console.log(e);
                return h.response({ message: "Помилка відправки" }).code(500);
            }
        }
    });

    await server.start();
    console.log("Server running on:", server.info.uri);
}

start();