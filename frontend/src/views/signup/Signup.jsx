import SignupForm from "./components/SignupForm";
import './signup.scss';

const Signup = () => {
  return (
    <div id="signup-container">
      <div className="content">
        <SignupForm/>
      </div>
    </div>
  );
}

export default Signup;