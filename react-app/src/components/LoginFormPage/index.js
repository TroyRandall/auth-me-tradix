import React, { useState  } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link, useHistory} from "react-router-dom";
import './LoginForm.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to={`/portfolios/${sessionUser.id}`} />;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = await dispatch(login(email, password));
  //   if (data) {
  //     setErrors(data);
  //   }
  // };

  const demoLogin = async (e) => {
    const email = "john@smith.com";
    const password = "password";
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };
  const onLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setTimeout(() => {
        setErrors({});
        const errors = {};
        errors.login = "Please fill out all fields";
        setErrors(errors);
      }, 1);
      return;
    }

    const data = await dispatch(login(email, password));
    if (data) {
      setErrors({});
      const errors = {};
      errors.login = "Invalid Credentials";
      setErrors(errors);
    }

  };

  return (
    <div className='login-page'>
      <div className='login-page-left'>
        <img src="https://tradix.s3.us-east-2.amazonaws.com/Login-pic.jpg" alt="people together" />
      </div>
      <div className='login-page-right'>
        <div className='login-form-container'>
          <h1 id="login-title">Log in to Tradix </h1>
          <form id="login-form" onSubmit={onLogin}>
            <div className='login-form-input'>
              <label htmlFor='email'>Email</label>
              <input
                name='email'
                type='text'
                className={errors.login ? "login-failed-input" : null}
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='login-form-input'>
              <label htmlFor='password'>Password</label>
              <input
                name='password'
                type='password'
                className={errors.login ? "login-failed-input" : null}
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.login && <p id="login-failed-text">{errors.login}</p>}
            <button type='submit' id="login-submit">Login</button>
          </form>
          <Link to="/sign-up" ><p id="login-create-account">Not on Tradix? <span id="create-an-account">Create an account</span></p></Link>
          <p>Don't feel like doing that? <span id="login-demo-user" onClick={demoLogin}>Log in as Demo User </span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginFormPage;
