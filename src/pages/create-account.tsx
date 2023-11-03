import { FC, useState } from "react";
import AuthHeader from "../components/layout/auth-header";
import AuthSwitchBtns from "../components/auth-switch-btns";
import { path } from "../constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import FormInput from "../components/form-input";
import BtnWithLoading from "../components/btn-with-loading";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import Helmet from "react-helmet";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from "../__generated__/graphql";
import FormSelect from "../components/form-select";
import { useHistory } from "react-router-dom";
import AuthCommitContent from "../components/auth-commit-content";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
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
  role: Yup.mixed<UserRole>()
    .oneOf(Object.values(UserRole))
    .required("Vui lòng chọn vai trò"),
});

interface FormValues {
  email: string;
  password: string;
  role: UserRole;
}

const CreateAccount: FC<Props> = (props): JSX.Element => {
  const history = useHistory();
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      role: UserRole.Client,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState, getValues } = form;
  const { errors } = formState;

  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { error, ok },
    } = data;

    if (error) {
      toast.error(error);
    }

    if (ok) {
      toast.success("Đăng ký tài khoản thành công. Vui lòng xác thực email!");
      history.push(path.login);
    }
  };

  const [createAccountMutation, { loading }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const { email, password, role } = getValues();
    createAccountMutation({
      variables: { createAccountInput: { email, password, role } },
    });
  };

  return (
    <>
      <Helmet>
        <title>Tạo tài khoản | Loship</title>
      </Helmet>
      <AuthHeader content="Đăng ký và nhận ngay ưu đãi lên đến 40% ngay hôm nay" />

      <div className="w-[400px] mx-auto min-h-[300px]">
        <h1 className="font-extrabold text-2xl mt-8 text-center">
          Đăng ký thành viên Loship
        </h1>
        <AuthSwitchBtns isActive="signup" switchTo={path.login} />

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

          <FormSelect
            id="role"
            label="Vai trò"
            options={Object.keys(UserRole).map((role) => role)}
            register={register("role")}
            errorMsg={errors.role?.message}
          />

          <BtnWithLoading
            content="Đăng ký"
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

export default CreateAccount;
