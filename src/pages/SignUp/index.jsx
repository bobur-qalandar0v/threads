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

  const checkUsernameAvailability = async (username) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      const response = await Backend.post("/check/username", formData);
      console.log("username: ", response);
      return response.data.available;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const checkEmailAvailability = async (email) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      const response = await Backend.post("/check/email", formData);
      console.log("email ", response);
      return response.data.available;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const checkPhoneAvailability = async (phone) => {
    try {
      const formData = new FormData();
      formData.append("phone", phone);
      const response = await Backend.post("/check/phone", formData);
      console.log("phone ", response);
      return response.data.available;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const SignUp = (data) => {
    setLoading(true);
    Backend.post(`${backendurls.auth.register}`, data)
      .then((res) => {
        if (res.status == 201) {
          setUserToken(res.data?.refresh, res.data?.access);
          setLocalUserInfo(res.data?.user);
          navigate("/");
          message.success(res.data?.message);
          window.location.reload();
        }
      })
      .catch((err) => {
        if (err.status === 500) {
          message.error("Tizimda xatolik");
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      phone: values?.phone?.replace(/\D/g, ""),
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
                      {
                        validator: async (_, value) => {
                          if (value) {
                            try {
                              const formattedPhone = value.replace(/\D/g, "");
                              const isAvailable = await checkPhoneAvailability(
                                formattedPhone
                              );
                              if (!isAvailable) {
                                return Promise.reject(
                                  new Error("Bu telefon raqami band!")
                                );
                              }
                            } catch (err) {
                              console.log("Telefon tekshirishda xato!", err);
                              return Promise.reject(
                                new Error("Telefon raqamni tekshirib bolmadi")
                              );
                            }
                          }
                          return Promise.resolve();
                        },
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
                      {
                        validator: async (_, value) => {
                          if (!value) {
                            return Promise.resolve();
                          }
                          const isAvailable = await checkEmailAvailability(
                            value
                          );
                          if (!isAvailable) {
                            return Promise.reject(new Error("Bu email band!"));
                          }
                          return Promise.resolve();
                        },
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
                      {
                        validator: async (_, value) => {
                          if (value && value.length >= 3) {
                            const isAvailable = await checkUsernameAvailability(
                              value
                            );
                            if (!isAvailable) {
                              return Promise.reject(
                                new Error("Bu foydalanuvchi nomi band!")
                              );
                            }
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      className="input-field"
                      placeholder="Foydalanuvchi nomi"
                      onBlur={(e) => {
                        if (e.target.value) {
                          checkUsernameAvailability(e.target.value);
                        }
                      }}
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
