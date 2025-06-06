import React, { useContext } from "react";
import { Button, Form, Input, message } from "antd";
import UserIcon from "../../assets/icons/UsreIcon";
import PasswordIcon from "../../assets/icons/PasswordIcon";
import { useNavigate } from "react-router-dom";
import { API } from "../../api";
import { urls } from "../../constants/urls";
import { AuthContext } from "../../contexts/AuthContext";

function SignIn() {
  const { setUserToken } = useContext(AuthContext);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const SignIn = (data) => {
    API.post(`${urls.auth.login}`, data)
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          setUserToken(res.data.token);
          message.success("Kirish bajarildi");
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response.data.error == "Unauthorized") {
          message.error("Foydalanuvchi nomi yoki parol xato!");
        }
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
                  <UserIcon />
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
                    placeholder="Foydalanuchi nomi"
                    autoComplete="off"
                  />
                </Form.Item>
              </div>
              <div className="field">
                <span className="password__icon">
                  <PasswordIcon />
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
                <Button className="button1" htmlType="submit">
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
