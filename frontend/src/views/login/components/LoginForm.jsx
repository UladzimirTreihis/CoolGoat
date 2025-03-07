import { useApi } from '../../../utils/api';
import { useAuth } from '../../../auth/useAuth';
import './loginForm.scss';

const LoginForm = () => {

  const { setToken } = useAuth();
  const api = useApi();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { status, data } = await api.post('auth/login', {
      email: event.target.email.value,
      password: event.target.password.value
    });
    if (status === "success") {
      console.log("Login successful");
      event.target.reset();
      const access_token = data.access_token;
      setToken(access_token);
    } else {
      console.log("Login failed");
      console.log(data);
    }
  }

  return (
    <div id="login-form-container">
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <input type="email" id="email" placeholder="Introduzca su correo electrónico" required/>
          <input type="password" id="password" placeholder="Introduzca su contraseña" required/>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>    
  )
}

export default LoginForm;