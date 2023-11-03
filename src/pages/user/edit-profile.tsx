import { FC, useState } from "react";
import Header from "../../components/layout/header";
import { useMe } from "../../hooks/useMe";
import { useForm } from "react-hook-form";
import FormInput from "../../components/form-input";
import BtnWithLoading from "../../components/btn-with-loading";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/graphql";
import toast from "react-hot-toast";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface Props {}

interface FormValues {
  email: string;
  password: string;
}

const EditProfile: FC<Props> = (props): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [willChangeEmail, setWillChangeEmail] = useState(false);
  const [willChangePassword, setWillChangePassword] = useState(false);

  const client = useApolloClient();

  const { data: userData } = useMe();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok, error },
    } = data;

    if (!ok && error) {
      return toast.error(error);
    }

    if (ok && userData) {
      // Update Cache
      // If user edits email, update cached email and change verified to false again
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }

      toast.success("Cập nhật thông tin thành công");
    }
  };

  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });

  const form = useForm<FormValues>({
    defaultValues: {
      email: userData?.me.email,
      password: "",
    },
  });
  const { register, handleSubmit, getValues, setValue } = form;

  const onSubmit = async (data: FormValues) => {
    const { email, password } = getValues();

    if (
      !willChangeEmail &&
      !willChangePassword &&
      email === userData?.me.email &&
      !password
    ) {
      return;
    }

    if (willChangeEmail && email === userData?.me.email) {
      return toast.error("Email mới không thể giống email cũ");
    }

    if (willChangePassword && !password && password.length < 6) {
      return toast.error("Vui lòng kiểm tra lại mật khẩu mới");
    }

    editProfile({
      variables: {
        input: {
          ...(willChangeEmail && { email }),
          ...(password !== "" && { password }),
        },
      },
    });

    setWillChangeEmail(false);
    setWillChangePassword(false);
    setValue("password", "");
  };

  return (
    <>
      <Header />
      <div className="border rounded-md p-6 pb-9 w-[500px] mx-auto mt-[8%] shadow">
        <h1 className="font-bold text-3xl text-primary mb-5">Edit Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="relative">
            <FormInput
              id="email"
              label="Email"
              register={register("email")}
              placeholder="Example@gmail.com"
              disabled={!willChangeEmail}
            />
            <button
              className="absolute top-1 right-0 text-xs underline rounded-md"
              onClick={() => setWillChangeEmail(true)}
            >
              {willChangeEmail ? "Nhập email mới" : "Đổi email"}
            </button>
          </div>

          <div className="relative">
            <FormInput
              id="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              register={register("password")}
              placeholder="Ít nhất 6 ký tự"
              disabled={!willChangePassword}
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
            <button
              className="absolute top-1 right-0 text-xs underline rounded-md"
              onClick={() => setWillChangePassword(true)}
            >
              {willChangePassword ? "Nhập mật khẩu mới" : "Đổi mật khẩu"}
            </button>
          </div>

          <BtnWithLoading
            content="Xác nhận"
            isLoading={false}
            customClasses="w-full"
            type="submit"
            disabled={false}
          />
        </form>
      </div>
    </>
  );
};

export default EditProfile;
