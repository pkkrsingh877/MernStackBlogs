const loginErrorHandler = (err) => {
    const error = {
        username: '',
        password: ''
    }
    if(err.message === 'Password is incorrect!'){
        error.password = 'Password is incorrect!'; 
    }
    if(err.message === 'Username is incorrect!'){
        error.username = 'Username is incorrect!';
    }
    return error;
}

module.exports = loginErrorHandler;