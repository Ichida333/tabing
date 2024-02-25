const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
}
});

UserSchema.plugin(passportLocalMongoose, {
  errorMessages: {
      UserExistsError: 'そのユーザー名はすでに使われています。',
      MissingPasswordError: 'パスワードを入力してください。',
      AttemptTooSoonError: 'アカウントがロックされてます。時間をあけて再度試してください。',
      TooManyAttemptsError: 'ログインの失敗が続いたため、アカウントをロックしました。',
      NoSaltValueStoredError: '認証ができませんでした。',
      IncorrectPasswordError: 'パスワードまたはユーザー名が間違っています。',
      IncorrectUsernameError: 'パスワードまたはユーザー名が間違っています。',
  }
});


const User = mongoose.model("User", UserSchema);

module.exports = User;
