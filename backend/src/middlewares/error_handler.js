export default function error_handler(err, req, res, next) {
    console.error(err.stack || err);

    const dbStatusMap = {
        '42P01': 500,  // undefined_table is a schema error, not client side issue
        '23505': 409,  // unique_violation
        '23503': 404,  // foreign_key_violation — referenced row not found
        '23502': 400,  // not_null_violation
        '22001': 400,  // string_data_right_truncation
        '22023': 400,  // invalid_parameter_value
    };

    const status = Number.isInteger(err.code)
        ? Math.min(Math.max(err.code, 400), 599)  // clamp to valid HTTP range
        : (dbStatusMap[err.code] ?? 500);

    const message = err.message ?? 'Internal server error';

    res.status(status).json({ 
        success: false,
        error: message 
    });
};
