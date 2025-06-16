const registerScreenTranslation = {
  en: {
    register: {
      error: {
        empty: 'Please fill in all fields',
        password_mismatch:
            'Passwords do not match',
        password_to_short:
            'Minimum 8 characters',
        failed:
            'Registration failed. Please try again.'
      },
      subtitle: 'Create your account',
      name:
          {
            label: 'Name',
            placeholder:
                'Enter your name'
          },
      email: {
        label: 'Email',
        placeholder:
            'Enter your email'
      },
      password: {
        label: 'Password',
        placeholder:
            'Create a password'
      },
      confirm_password: {
        label: 'Confirm Password',
        placeholder:
            'Confirm your password'
      },
      loading: 'Loading...',
      create_account:
          'Create Account',
      already_account:
          'Already have an account?',
      signin:
          'Sign in',
      success_email_sent: 'Confirmation link sent to your email'
    }
  },
  ru: {
    register: {
      error: {
        empty: 'Пожалуйста, заполните все поля',
        password_mismatch: 'Пароли не совпадают',
        password_to_short:
            'Минимальная длина пароля 8 символов',
        failed: 'Не удалось зарегистрироваться. Попробуйте еще раз.'
      },
      subtitle: 'Создайте аккаунт',
      name: {
        label: 'Имя',
        placeholder: 'Введите ваше имя'
      },
      email: {
        label: 'Электронная почта',
        placeholder: 'Введите вашу почту'
      },
      password: {
        label: 'Пароль',
        placeholder: 'Придумайте пароль'
      },
      confirm_password: {
        label: 'Подтвердите пароль',
        placeholder: 'Повторите пароль'
      },
      loading: 'Загрузка...',
      create_account: 'Создать аккаунт',
      already_account: 'Уже есть аккаунт?',
      signin: 'Войти',
      success_email_sent: 'Письмо со ссылкой для подтверждения регистрации было отправлено на ваш email'
    }
  }
};

export default registerScreenTranslation;
