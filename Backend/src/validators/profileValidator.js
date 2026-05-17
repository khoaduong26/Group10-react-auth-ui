const { body } =
    require("express-validator");

const updateProfileValidator = [

    body("fullName")
        .notEmpty()
        .withMessage(
            "Full name is required"
        ),

    body("phone")
        .isLength({
            min: 10,
            max: 11
        })
        .withMessage(
            "Phone number invalid"
        ),

    body("address")
        .notEmpty()
        .withMessage(
            "Address is required"
        )
];

module.exports =
    updateProfileValidator;