import { FC, useState } from "react";
import AuthHeader from "../components/layout/auth-header";
import AuthSwitchBtns from "../components/auth-switch-btns";
import { LOCAL_STRORAGE_TOKEN, path } from "../constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import FormInput from "../components/form-input";
import BtnWithLoading from "../components/btn-with-loading";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import Helmet from "react-helmet";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/graphql";
import AuthCommitContent from "../components/auth-commit-content";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { useHistory } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface Props {}

const schema = Yup.object({
  email: Yup.string()
    .email("Email của bạn không hợp lệ")
    .required("Vui lòng nhập vào email"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập vào mật khẩu"),
});

interface FormValues {
  email: string;
  password: string;
}

const Login: FC<Props> = (props): JSX.Element => {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState, getValues } = form;
  const { errors } = formState;

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { error, token, ok },
    } = data;

    if (error) {
      toast.error(error);
    }

    if (ok && token) {
      localStorage.setItem(LOCAL_STRORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      toast.success("Đăng nhập thành công!");
    }
  };

  const [loginMutation, { loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, { onCompleted });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const { email, password } = getValues();
    loginMutation({ variables: { loginInput: { email, password } } });
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập | Loship</title>
      </Helmet>
      <AuthHeader content="Đăng nhập để nhận ngay nhiều ưu đãi hấp dẫn hôm nay" />

      <div className="w-[400px] mx-auto min-h-[300px]">
        <h1 className="font-extrabold text-2xl mt-8 text-center">
          Đăng nhập với Email
        </h1>
        <AuthSwitchBtns isActive="login" switchTo={path.signup} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-10 shadow-md border px-4 pt-6 py-8 rounded-md"
        >
          <FormInput
            id="email"
            label="Email"
            register={register("email")}
            errorMsg={errors.email?.message}
            placeholder="Example@gmail.com"
          />

          <div className="relative">
            <FormInput
              id="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              register={register("password")}
              errorMsg={errors.password?.message}
              placeholder="Ít nhất 6 ký tự"
            />
            <div
              className="absolute right-3 top-[34px] cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <span className="text-sm font-extrabold">Ẩn</span>
              ) : (
                <span className="text-sm font-extrabold">Hiện</span>
              )}
            </div>
          </div>

          <BtnWithLoading
            content="Đăng nhập"
            isLoading={loading}
            customClasses="w-full"
            type="submit"
            disabled={loading}
          />
        </form>

        <AuthCommitContent />
      </div>
    </>
  );
};

export default Login;
