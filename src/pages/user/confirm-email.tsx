import { gql, useApolloClient, useMutation } from "@apollo/client";
import { FC, useEffect } from "react";
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from "../../__generated__/graphql";
import Logo from "../../components/logo";
import { Link, useHistory } from "react-router-dom";
import { ImSpinner } from "react-icons/im";
import { BsCheckCircleFill } from "react-icons/bs";
import { RiErrorWarningFill } from "react-icons/ri";
import { useMe } from "../../hooks/useMe";
import { Helmet } from "react-helmet";

interface Props {}

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

const ConfirmEmail: FC<Props> = (props): JSX.Element => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: { verified: true },
      });
      history.push("/");
    }
  };

  const [verifyEmail, { loading, data: verifyEmailData }] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, { onCompleted });

  useEffect(() => {
    const code = window.location.href.split("code=")[1];
    verifyEmail({ variables: { input: { code } } });
  }, []);
  return (
    <>
      <Helmet>
        <title>Xác thực Email | Loship</title>
      </Helmet>
      <div>
        <div className="flex items-center justify-center py-3 border-b shadow-sm">
          <Logo wrapperClasses="w-[160px] h-5" />
        </div>

        <div className="w-[500px] mx-auto rounded-md p-6 text-center border mt-[10%]">
          <h1 className="font-bold text-3xl text-primary mb-3">
            Thực hiện xác minh Email
          </h1>
          <p className="text-sm">Cảm ơn bạn vì đã tin tưởng Loship</p>
          {loading ? (
            <>
              <ImSpinner
                className="animate-spin text-primary mx-auto my-4"
                size={40}
              />
              <p>
                Vui lòng chờ trong giây lát để chúng tôi xử lý thông tin ...
              </p>
            </>
          ) : (
            <>
              {!verifyEmailData?.verifyEmail.ok ? (
                <>
                  <p className="my-2 flex items-center justify-center gap-1 text-lg font-bold text-primary">
                    Xác thức không thành công
                    <RiErrorWarningFill className="text-primary" />
                  </p>
                  <p className="text-sm my-2">
                    Vui lòng kiểm tra lại mã xác thức hoặc trở lại trang chủ{" "}
                    <Link to="/" className="text-blue_link font-extrabold">
                      Loship
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="my-2 flex items-center justify-center gap-1 text-lg font-bold text-emerald-700">
                    Xác thức thành công
                    <BsCheckCircleFill className="text-emerald-700" />
                  </p>
                  <p className="text-sm my-2">
                    Vui lòng trở lại trang chủ{" "}
                    <Link to="/" className="text-blue_link font-extrabold">
                      Loship
                    </Link>{" "}
                    để tiếp tục sử dụng dịch vụ
                  </p>
                </>
              )}
            </>
          )}

          <div className="border-t pt-4 mt-5 text-xs">
            <p className="font-bold">
              Conditions of Use Privacy Notice Cookies & Internet Advertising
            </p>
            <p>© 1996-2023, Loship.vn - All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmEmail;
