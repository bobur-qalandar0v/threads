import { Button, Form, Input, message } from "antd";
import React, { useContext } from "react";
import EmailIcon from "../../assets/icons/EmailIcon";
import PhoneIcon from "../../assets/icons/PhoneIcon";
import PasswordRegisterIcon from "../../assets/icons/PasswordRegisterIcon";
import UserRegisterIcon from "../../assets/icons/UserRegisterIcon";
import UserNameIcon from "../../assets/icons/UserNameIcon";
import { useNavigate } from "react-router-dom";
import InputTel from "./InputTel";
import { API } from "../../api";
import { urls } from "../../constants/urls";
import { AuthContext } from "../../contexts/AuthContext";

function SignUp() {
  const { setUserData } = useContext(AuthContext);

  const navigate = useNavigate();

  const SignUp = (data) => {
    API.post(`${urls.auth.user}`, data).then((res) => {
      setUserData(res.data.id);
      navigate("/login");
      message.open({
        type: "success",
        content: "Registratsiyadan o'tildi",
      });
    });
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      profile_default_img:
        "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png",
    };

    SignUp(payload);
  };

  const onFinishFailed = () => {
    message.warning("Iltimos maydonlarni to'ldiring!");
  };

  const handleNavigate = () => {
    navigate("/login");
  };

  return (
    <div className="signup">
      <div className="signup__wrap">
        <div className="card">
          <div className="card2">
            <div className="form__item">
              <Form
                className="form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <p id="heading">Ro'yxatdan o'ting</p>
                <div className="field">
                  <span className="email__icon icons">
                    <EmailIcon />
                  </span>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      className="input-field"
                      placeholder="Elektron pochta-manzil"
                    />
                  </Form.Item>
                </div>
                <div className="field">
                  <span className="phone__icon icons">
                    <PhoneIcon />
                  </span>
                  <Form.Item
                    name="phone-number"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <InputTel />
                  </Form.Item>
                </div>
                <div className="field">
                  <span className="password__icon icons">
                    <PasswordRegisterIcon />
                  </span>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input.Password
                      className="input-field"
                      placeholder="Parol"
                    />
                  </Form.Item>
                </div>
                <div className="field">
                  <span className="user__icon icons">
                    <UserRegisterIcon />
                  </span>
                  <Form.Item
                    name="name_and_surname"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      className="input-field"
                      placeholder="Ism va Familya"
                    />
                  </Form.Item>
                </div>
                <div className="field">
                  <span className="username__icon icons">
                    <UserNameIcon />
                  </span>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      className="input-field"
                      placeholder="Foydalanuvchi nomi"
                    />
                  </Form.Item>
                </div>
                <Form.Item className="btn__wrap">
                  <Button className="button1" htmlType="submit">
                    Ro'yxatdan o'tish
                  </Button>
                  <p className="or">
                    <span className="line"></span>
                    <span className="content">yoki</span>
                    <span className="line"></span>
                  </p>
                  <div className="request">
                    <p>Hisobingiz bormi?</p>
                    <button onClick={() => handleNavigate()}>
                      Tizimga kiring
                    </button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        <div className="footer">
          <span>©&nbsp; 2025</span>
          <span>Mavzular shartlari</span>
          <span>Maxfiylik siyosati</span>
          <span>Cookie siyosati</span>
          <span>Muammo haqida xabar bering</span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
