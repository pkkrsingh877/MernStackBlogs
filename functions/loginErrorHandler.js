const loginErrorHandler = (err) => {
    const error = {
        username: '',
        password: ''
    }
    Object.values(err.errors).forEach(({properties}) => {
        error[properties.path] = properties.message;
    });
    console.log(error.username, error.password);
    return error;
}

module.exports = loginErrorHandler;