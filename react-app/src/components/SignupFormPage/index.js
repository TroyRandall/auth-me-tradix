import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bank, setBank] = useState("");
  const [signupStage, setSignupStage] = useState(1);
  const [buyingPower, setBuyingPower] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastFour, setLastFour] = useState("");
  const [accountNickname, setAccountNickname] = useState("");
  const [errors, setErrors] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  if (sessionUser) {
    return <Redirect to={`/portfolios/${sessionUser.id}`} />;
  }

  const regex = RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
  );
  const spinner = <div id="signup-spinner"></div>;
  // useEffect(() => {
  //   setShowUsernameError(false);

  //   if (username.length < 3 || username.length > 20)
  //     setUsernameError('Your username must be between 3 and 20 characters long.');
  //   else if (/[^a-zA-Z\d\_]+/.test(username))
  //     setUsernameError('Your username can only have letters, numbers, and underscores.');
  //   else setUsernameError('');

  // }, [username]);

  function isNumber(n) {
    if (n.trim().length === 0) return false;
    return !isNaN(n);
  }

  const usernameCheck = async (e) => {
    e.preventDefault();
    const errors = {};
    if (username.length < 3 || username.length > 20) {
      errors.username =
        "Your username must be between 3 and 20 characters long.";
    }
    if (/[^a-zA-Z\d\_]+/.test(username)) {
      errors.username =
        "Your username can only have letters, numbers, and underscores.";
    }
    if (phone.length < 10) {
      errors.phone = "Phone number must be a minimum of 10 numbers";
    }
    if (!isNumber(phone)) {
      errors.phone = "Phone Number Must Be A Number";
    }
    if (address.length < 8) {
      errors.address = "An Address Must Have A Minimum of 8 Characters";
    }
    if (city.length < 2) {
      errors.city = "A City Must Have A Minimum of 2 Characters";
    }
    if (state.length < 2) {
      errors.state = "State Must Have A Minimum of 2 Letters";
    }
    if (Object.keys(errors).length > 0) {
      setShowUsernameError(true);
      setUsernameError(errors);
      return;
    } else {
      setSignupStage(signupStage + 1);
    }
  };
  // const addressCheck  = async (e) => {
  //   e.preventDefault();
  //   const errors = {};
  //   if(address.length === 0) errors.address = "Please enter your address";
  //   if(city.length === 0) errors.city = "Please enter your city";
  //   if(state.length === 0) errors.state = "please enter your state";
  //   if(phone.length === 0) errors.phone = "Please enter your phone number"
  //   setSignupStage(signupStage + 1);
  //     setUsernameError(errors)
  //     setShowUsernameError(true)
  //  }
  const handleSubmit1 = async (e) => {
    const errors = {};
    e.preventDefault();
    if (firstName.length === 0)
      errors.firstName = "Please enter your first name.";
    if (lastName.length === 0) errors.lastName = "Please enter your last name.";
    if (email.length === 0) errors.email = "Please enter your email.";
    else if (!email.trim().match(regex)) {
      errors.email = "Please provide a valid Email";
    }

    if (password.length < 6)
      errors.password = "Password must be at least 6 characters long";
    if (confirmPassword.length === 0)
      errors.confirmPassword = "Please retype your password.";
    else if (confirmPassword !== password)
      errors.confirmPassword = "Passwords must match!";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/users/${email}`);
    setTimeout(() => setLoading(false), 250);

    if (response.status === 409) {
      errors.email = "Email already in use.";
      setErrors(errors);
      return;
    }

    setErrors(errors);
    setSignupStage(2);
  };
  const handleSubmit2 = async (e) => {
    const errors = {};
    e.preventDefault();
    if (bank.length === 0)
      errors.bank = "Please enter your bank account information.";
    if (!lastFour || lastFour < 0)
      errors.lastFour =
        "Please enter the last four digit numbers of your bank account.";
    else if (lastFour.toString().length < 4)
      errors.lastFour = "Please enter the last four of your bank account.";
    if (accountNickname.length === 0)
      errors.accountNickname = "Please enter a nickname for your account.";
    if (!buyingPower || buyingPower <= 0)
      errors.buyingPower = "Buying Power must be greater than 0";
    else if (buyingPower > 1000000)
      errors.buyingPower =
        "Tradix's current max limit for an account is $1,000,000. Please deposit less money.";
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setLoading(true);
    if (password === confirmPassword) {
      const data = await dispatch(
        signUp(firstName, lastName, email, password, buyingPower, username)
      );
      if (data) {
        setLoading(false);
        setErrors(errors);
        setSignupStage(3);
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-page-left">
        <div className="signup-page-left-top">
          <Link to="/">
            <div className="landing-page-logo" id="signup-logo">
              <p className="landing-page-logo-text">Tradix</p>
              <i className="fa-solid fa-rocket"></i>
            </div>
          </Link>
          <p id="signup-title">Create your login</p>
          <p id="signup-support-text">
            We'll need you name, email, and a unique password. You'll use this
            login to access Tradix next time.
          </p>
        </div>

        <div className="signup-page-left-bottom">
          <img
            src="https://tradix.s3.us-east-2.amazonaws.com/rocket-signup.png"
            id="signup-image"
            alt="rocket-signup"
          />
        </div>
      </div>
      <div className="signup-page-right">
        {signupStage === 1 && (
          <form id="signup-form" onSubmit={handleSubmit1}>
            <p id="signup-id-warning" className="signup-form-heading">
              Enter your first and last name as they appear on your government
              ID.
            </p>
            <div className="signup-names">
              <div className="signup-names-inner">
                <input
                  type="text"
                  name="firstName"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className={errors.firstName ? "error-input" : null}
                  placeholder="First Name"
                />
                <p className="error-label">{errors.firstName}</p>
              </div>
              <div className="signup-names-inner">
                <input
                  type="text"
                  name="lastName"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className={errors.lastName ? "error-input" : null}
                  placeholder="Last Name"
                />
                <p className="error-label">{errors.lastName}</p>
              </div>
            </div>
            <div>
              <input
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={errors.email ? "error-input" : null}
                placeholder="Email"
              ></input>
              <p className="error-label">{errors.email}</p>
            </div>
            <div>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={errors.password ? "error-input" : null}
                placeholder="Password (min. 6 characters)"
              ></input>
              <p className="error-label">{errors.password}</p>
            </div>
            <div>
              <input
                type="password"
                name="repeat_password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className={errors.confirmPassword ? "error-input" : null}
                placeholder="Confirm Password"
              />
              <p className="error-label">{errors.repeatPassword}</p>
            </div>
            <div id="signup-login-container">
              <p id="signup-already">Already have an account?</p>
              <Link to="/login">
                <p id="signup-login">Log in instead</p>
              </Link>
            </div>
          </form>
        )}
        {/* step 2 */}
        {signupStage === 2 && (
          <form id="signup-form" onSubmit={usernameCheck}>
            <p className="signup-form-heading">Help us verify your indentity</p>
            <div>
              <input
                type="text"
                className={showUsernameError ? "error-input" : null}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder="Username"
              />
              {usernameError.username ? (
                <p className="error-label">{usernameError?.username}</p>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                className={showUsernameError ? "error-input" : null}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                placeholder="Address"
              />
              {usernameError.address ? (
                <p className="error-label">{usernameError?.address}</p>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                className={showUsernameError ? "error-input" : null}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                placeholder="City"
              />
              {usernameError.city ? (
                <p className="error-label">{usernameError?.city}</p>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                className={showUsernameError ? "error-input" : null}
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
                placeholder="State"
              />
              {usernameError.state ? (
                <p className="error-label">{usernameError?.state}</p>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                className={showUsernameError ? "error-input" : null}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder="Phone number"
              />
              {usernameError.phone ? (
                <p className="error-label">{usernameError?.phone}</p>
              ) : null}
            </div>
            {/* <p className='error-label'>
            {showUsernameError && usernameError ? Object.values(usernameError).map((error) => {
              return <p className='error-label'>{error}</p>
            }) : null}
          </p> */}
          </form>
        )}
        {signupStage === 3 && (
          <form id="signup-form" onSubmit={handleSubmit2}>
            <p className="signup-form-heading">
              Let's get your account funded!
            </p>
            <div>
              <input
                type="text"
                className={errors.bank ? "error-input" : null}
                value={bank}
                onChange={(e) => {
                  setBank(e.target.value);
                }}
                placeholder="Bank"
              />
              <p className="error-label">{errors.bank}</p>
            </div>
            <div>
              <input
                type="number"
                className={errors.lastFour ? "error-input" : null}
                placeholder="Last 4 digits of your bank account"
                maxLength={4}
                onChange={(e) => setLastFour(e.target.value)}
                value={lastFour}
              />
              <p className="error-label">{errors.lastFour}</p>
            </div>
            <div>
              <input
                type="text"
                className={errors.accountNickname ? "error-input" : null}
                placeholder="Account nickname"
                onChange={(e) => setAccountNickname(e.target.value)}
                value={accountNickname}
              />
              <p className="error-label">{errors.accountNickname}</p>
            </div>
            <div>
              <input
                type="number"
                className={errors.buyingPower ? "error-input" : null}
                placeholder="How much would you like to get started with?"
                onChange={(e) => setBuyingPower(e.target.value)}
                value={buyingPower}
              />
              <p className="error-label">{errors.buyingPower}</p>
            </div>
          </form>
        )}
        <div className="signup-bottom">
          <div id="signup-progress-bar-container">
            <div id={`signup-progress-bar-${signupStage}`}></div>
          </div>
          <div className="signup-button-container">
            <div className="signup-button">
              {signupStage === 1 && (
                <button
                  form="signup-form"
                  className="signup-button-bottom"
                  type="submit"
                >
                  {loading ? spinner : "Continue"}
                </button>
              )}
              {signupStage === 2 && (
                <button
                  form="signup-form"
                  className="signup-button-bottom"
                  type="submit"
                >
                  {loading ? spinner : "Continue"}
                </button>
              )}
              {signupStage === 3 && (
                <button
                  form="signup-form"
                  className="signup-button-bottom"
                  type="submit"
                >
                  {loading ? spinner : "Complete"}
                </button>
              )}
              {/* need to handle the click button when complete. go to a user profile home page */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;
