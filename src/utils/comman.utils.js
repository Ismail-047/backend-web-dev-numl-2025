/**
 * Sends a standardized JSON response to the client.
 *
 * @param {Object} res - The response object (from Express).
 * @param {number} status - The HTTP status code to send in the response.
 * @param {boolean} success - A boolean indicating whether the request was successful or not.
 * @param {string} message - A message that provides details about the request's outcome.
 * @param {Object | null} [data=null] - Optional data to include in the response. If no data is provided, it defaults to null.
 * 
 * @returns {Object} The response object with the appropriate status and body, in JSON format.
 */
export const sendRes = async (res, status, message, data = null) => {
    const response = { message };
    if (data) response.data = data;
    return res.status(status).json(response);
}

/**
 * Logs detailed error information to the console, including the context, error message, stack trace, and timestamp.
 *
 * @function logError
 * 
 * @param {string} context - The context or module where the error occurred.
 * @param {Error} error - The error object containing the message and stack trace.
 *
 * @returns {void} This function does not return any value, it just logs the error to the console.
 */
export const logError = (context, error) => {
    console.error(`
 ------------------------------------------------------------------------
 [ERROR] Internal Server Error in "${context}"
    \nERROR MESSAGE: ${error.message}
    \nERROR STACK: ${error.stack}
 \nTIMESTAMP: ${new Date().toISOString()}
 ------------------------------------------------------------------------
 `);
}

/**
 * Generates a random 6-digit number (verificaiton code)
 * 
 * @function generateVerificationCode
 * 
 * @returns {Number} A 6-digit random number 
 */
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

/**
 * Calculates an expiry time based on the current time and a specified number of minutes.
 *
 * @function getExpiryTime
 * @param {number} minutes - The number of minutes to add to the current time.
 * 
 * @returns {Date} A `Date` object representing the expiry time.
 */
export const getExpiryTime = (minutes) => {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60000);
}

/**
 * Validates the format of an email address using a regular expression.
 *
 * @function validateEmailFormat
 * @param {string} email - The email address to validate.
 * 
 * @returns {boolean} `true` if the email is in a valid format, otherwise `false`.
 */
export const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
