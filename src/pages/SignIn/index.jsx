import React, { useContext, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Backend } from "../../api";
import { backendurls, urls } from "../../constants/urls";
import { AuthContext } from "../../contexts/AuthContext";
import UserNameIcon from "../../assets/icons/UserNameIcon";
import PasswordRegisterIcon from "../../assets/icons/PasswordRegisterIcon";

function SignIn() {
  const { setUserToken, setLocalUserInfo } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const SignIn = (data) => {
    setLoading(true);
    Backend.post(`${backendurls.auth.login}`, data)
      .then((res) => {
        if (res.status == 200) {
          setUserToken(res.data?.refresh, res.data?.access);
          message.success("Tizimga muvaffaiyatli kirildi");
          navigate("/");
          setLocalUserInfo(res.data?.user);
        } else {
          message.error("Tizimda xatolik");
        }
      })
      .catch((err) => {
        if (err?.status === 400) {
          message.error("Foydalanuvchi nomi yoki parol xato!");
        } else {
          message.error("Tizimda xatolik");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    SignIn(values);
  };

  const onFinishField = () => {
    message.warning("Iltimos maydonlarni to'ldiring!");
  };

  const handleNavigate = () => {
    navigate("/register");
  };

  return (
    <div className="wrapper">
      <div className="card">
        <div className="card2">
          <div className="form__item">
            <Form
              className="form"
              onFinish={onFinish}
              onFinishFailed={onFinishField}
            >
              <p id="heading">Tizimga kiring</p>
              <div className="field">
                <span className="user__icon">
                  <UserNameIcon />
                </span>
                <Form.Item
                  name="login"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Input
                    className="input-field"
                    placeholder="Foydalanuvchi nomi Email yoki Telefon raqam"
                    autoComplete="off"
                  />
                </Form.Item>
              </div>
              <div className="field">
                <span className="password__icon">
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
                  <Input.Password className="input-field" placeholder="Parol" />
                </Form.Item>
              </div>
              <Form.Item className="btn__wrap">
                <Button
                  className="button1"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Tizimga kirish
                </Button>
              </Form.Item>
            </Form>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "rgba(243, 245, 247, 0.452)" }}>
                Parolingiz esdan chiqdimi?
              </p>
            </div>

            <p className="or">
              <span className="line"></span>
              <span className="content">yoki</span>
              <span className="line"></span>
            </p>
            <button className="register" onClick={() => handleNavigate()}>
              <span>Registratsiyadan o'ting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
