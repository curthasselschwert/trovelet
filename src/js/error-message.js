var ErrorMessage = {

  get: function(value) {
    if (!value) {
      throw new Error('Value is required to get error message.');
    }

    if (typeof(value) != 'string') {
      throw new Error('Value must be a string.');
    }

    if (value.match(/invalid email/)) {
      return "Whoops! That doesn't look like a valid email.";
    }

    if (value.match(/empty name/)) {
      return "Please enter your email address.";
    }

    if (value.match(/empty password/)) {
      return "Please enter a password.";
    }

    if (value.match(/already taken/)) {
      return "Whoops! It looks like this email already has an account.";
    }

    throw new Error(value + ' does not have a matching message.');
  }

}

module.exports = ErrorMessage;
