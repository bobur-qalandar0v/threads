import { Button, Form, Input, message } from "antd";
import React, { useContext, useState } from "react";
import EmailIcon from "../../assets/icons/EmailIcon";
import PhoneIcon from "../../assets/icons/PhoneIcon";
import PasswordRegisterIcon from "../../assets/icons/PasswordRegisterIcon";
import UserRegisterIcon from "../../assets/icons/UserRegisterIcon";
import UserNameIcon from "../../assets/icons/UserNameIcon";
import { useNavigate } from "react-router-dom";
import InputTel from "./InputTel";
import { Backend } from "../../api";
import { backendurls } from "../../constants/urls";
import { AuthContext } from "../../contexts/AuthContext";

function SignUp() {
  const { setUserToken, setLocalUserInfo } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const SignUp = (data) => {
    setLoading(true);
    Backend.post(`${backendurls.auth.register}`, data)
      .then((res) => {
        if (res.status == 201) {
          setUserToken(res.data?.refresh, res.data?.access);
          setLocalUserInfo(res.data.user);
          navigate("/");
          message.success(res.data?.message);
        }
      })
      .catch((err) => {
        if (err.status === 500) {
          message.error("Tizimda xatolik");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      phone:
        values?.phone?.slice(0, 4) +
        "" +
        values?.phone?.slice(5, 7) +
        "" +
        values?.phone?.slice(8, 11) +
        "" +
        values?.phone?.slice(12, 14) +
        "" +
        values?.phone?.slice(15, 17),
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
                  <span className="user__icon icons">
                    <UserRegisterIcon />
                  </span>
                  <Form.Item
                    name="fullname"
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
                  <span className="phone__icon icons">
                    <PhoneIcon />
                  </span>
                  <Form.Item
                    name="phone"
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

                <Form.Item className="btn__wrap">
                  <Button
                    className="button1"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                  >
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
