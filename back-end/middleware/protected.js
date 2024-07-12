const middleware = {
    // This function assigns any users whose email ends in '@gmail.com' as an admin
    assignAdmin: function (req, res, next) {
        function endsWithGmail(email) {
            if (email.length > 10) {
                return (email.slice(-10) === '@gmail.com');
            }
            return (false);
        }

        const emailCheck = endsWithGmail(req.body.username);

        if (emailCheck === true) {
            req.body.isAdmin = true;
            console.log('User is a gmail user');
        } else {
            req.body.isAdmin = false;
            console.log('User is NOT a gmail user');
        }
  
        console.log(req.body)
        next();
    },
    // This function checks if the user is an admin before proceeding with the request
    checkAdmin: function (req, res, next) {
        if (req.body.isAdmin === false) {
            return res.status(403).send('Error: You do not have access to this feature. Try signing up with your Gmail account.')
        }
        next();
    },
    // This function ensures the input of the new task does not exceed 140 characters
    tooLong: function (req, res, next) {
        if (req.body.inputTodo.length > 140) {
            return res.status(403).send('Error: Todo name has exceeded 140 characters');
        }
        next();
    },
    // This function does the same as the above but for the 'edit' field 
    tooLongEdit: function (req, res, next) {
        if (req.body.editValue.length > 140) {
            return res.status(403).send('Error: Todo name has exceeded 140 characters');
        }
        next();
    },
    // This function checks to see if the request content-type is of JSON format
    requireJsonContent: function (req, res, next) {
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(403).send('Error: This format is not compatible. Server requires application/json only');
        }
        next();
    }
};

module.exports = {
    middleware
};