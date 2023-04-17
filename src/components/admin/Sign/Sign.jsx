import { useState } from "react";
import InputField from "../../common/input/Input";
import Button from "../../common/button/Button";
import { useDispatch } from "react-redux";
import { openModal } from "../../../Features/modal";
import { notify } from "../../../utils/responseMsg";
import { validateSigninForm } from "../../../utils/validation";
import { adminSignin } from "../../../api/auth";
import { showLoader, hideLoader } from "../../../Features/loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./sign.css";

const SignIn = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    whats_app: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const errors = validateSigninForm(formData);

      if (errors) {
        notify("error", errors);
      } else {
        dispatch(showLoader(true));
        const { data } = await adminSignin(formData);

        sessionStorage.clear();

        localStorage.setItem(
          "token",
          JSON.stringify({
            token: data.token,
            refreshToken: data.refreshToken,
          })
        );

        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "/records";

        dispatch(hideLoader());
        notify("success", data.message);
      }
    } catch (error) {
      dispatch(showLoader(true));
      notify("error", error?.response?.data?.message || error.message);
      dispatch(hideLoader());
    }
  };

  return (
    <div className="sign-row">
      <div className="left-side">
        <img
          src="/images/Marketing consulting-amico.png"
          alt="images/Marketing consulting-amico.png"
        />
      </div>

      <div className="right-side">
        <div className="sign-in">
          <h2>Sign-In</h2>

          <div className="form">
            <form method="post" onSubmit={handleSubmit}>
              <div className="phone-info">
                <label htmlFor="whatsapp-input">whatsapp</label>
                <PhoneInput
                  country={"eg"}
                  value={formData.whats_app}
                  onChange={(e) => setFormData({ ...formData, whats_app: e })}
                />
              </div>

              <InputField
                type="password"
                name="password"
                placeholder={"password"}
                onChange={(e) => handleChange(e)}
              >
                Password
              </InputField>

              <Button type="submit" btnClass={"second-primary"}>
                SignIn
              </Button>
            </form>

            <div className="forget-now">
              <span onClick={() => dispatch(openModal(2))}>
                forget passsword?
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
