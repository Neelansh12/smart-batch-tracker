const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        console.log("Validation successful");
        next();
    } catch (err) {
        console.log("Validation failed");
        return res.status(400).json({ error: err.errors });
    }
};

module.exports = validate;
