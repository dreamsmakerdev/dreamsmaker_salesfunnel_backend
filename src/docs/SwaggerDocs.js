const mobileSwaggerJSDocs = require("swagger-jsdoc");

const port = process.env.PORT;

const swaggerOption = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Nft Backend Services",
      description: "Backend system for Nft Web Application",
      contact: {
        name: "Patoliya Parth",
        email: "patoliyaparth@codeedoc.com",
        url: "https://www.codeedoc.com",
      },
      servers: [`http://localhost:${port}`],
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-access-token",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./src/routes/web/*.js", "./src/routes/admin/*.js"],
};

const swaggerDocs = mobileSwaggerJSDocs(swaggerOption);

module.exports = swaggerDocs;
