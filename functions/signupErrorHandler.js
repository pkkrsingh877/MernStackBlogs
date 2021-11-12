const signupErrorHandler = (err) => {
    const error = {
        username: '',
        password: '',
        email: ''
    }
    
    if(err.code === 11000){
        error.email = "This email is already registered!"
        console.log(error);
        return error;
    }

    Object.values(err.errors).forEach(({properties}) => {
        error[properties.path] = properties.message;
    });
    console.log(error);
    return error;
}

module.exports = signupErrorHandler;

// console.log(err.message, err.code);
// const newObject = Object.values(err.errors.username);
// console.log(Object.values(newObject['0'])[3], Object.values(newObject['0'])[1]);