
import LoginView from "@/views/auth/LoginView.vue"
import ResetPassword from "@/views/auth/ResetPassword.vue"
import RegisterView from "@/views/auth/RegisterView.vue"
import ForgotPassword from "@/views/auth/ForgotPassword.vue"

const authRouter = [
  {
    path: '/login',
    name: "login",
    component: LoginView
  },
  {
    path: '/register',
    name: "register",
    component: RegisterView
  },
  {
    path: '/forgot-password',
    name: "forgotPassword",
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: "resetPassword",
    component: ResetPassword,
    beforeEnter: (to, from, next) => {
      // Deve possuir o token no cabeçalho para entrar na tela
      if (to?.query?.token) {
        next()
      } else {
        next({
          name: "login"
        })
      }
    }
  }
]

export { authRouter }