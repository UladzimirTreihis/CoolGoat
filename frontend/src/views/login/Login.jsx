import LoginForm from "./components/LoginForm";
import './login.scss';

const Login = () => {
  return (
    <div id="login-container">
      <div className="content">
        <LoginForm/>
      </div>
    </div>
  );
}

export default Login;