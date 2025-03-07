import { useApi } from '../../../utils/api';
import { useAuth } from '../../../auth/useAuth';
import './signupForm.scss';

const SignupForm = () => {

  const { setToken } = useAuth();
  const api = useApi();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { status, data } = await api.post('auth/signup', {
      username: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value
    });
    if (status === "success") {
      console.log("Signup successful");
      event.target.reset();
    } else {
      console.log("Signup failed");
      console.log(data);
    }
  }

  return (
    <div id="signup-form-container">
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <h2>Crear una cuenta</h2>
          <input type="text" id="name" placeholder="Introduzca su nombre" required/>
          <input type="email" id="email" placeholder="Introduzca su correo electrónico" required/>
          <input type="password" id="password" placeholder="Introduzca su contraseña" required/>
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>    
  )
}

export default SignupForm;