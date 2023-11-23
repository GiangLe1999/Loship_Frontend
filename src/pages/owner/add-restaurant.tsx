import { ChangeEvent, FC, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/layout/header";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../__generated__/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import FormInput from "../../components/form-input";
import BtnWithLoading from "../../components/btn-with-loading";
import { MdUpload } from "react-icons/md";
import { blobToBase64 } from "../../utils/blob-to-base64";
import StyledImage from "../../components/styled-image";
import toast from "react-hot-toast";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

const schema: any = Yup.object({
  name: Yup.string().required("Vui lòng nhập tên cửa hàng"),
  address: Yup.string().required("Vui lòng nhập địa chỉ cửa hàng"),
  categoryName: Yup.string().required("Vui lòng nhập tên danh mục cửa hàng"),
});

interface FormValues {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
  file2: FileList;
}

interface Props {}

const AddRestaurant: FC<Props> = (props): JSX.Element => {
  const history = useHistory();
  const client = useApolloClient();
  const [imageUrl1, setImageUrl1] = useState();
  const [imageUrl2, setImageUrl2] = useState();

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, error, restaurantId },
    } = data;

    if (ok) {
      const { name, categoryName, address } = getValues();
      setIsUploading(false);

      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });

      if (queryResult) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult?.myRestaurants,
              restaurants: [
                {
                  address,
                  category: { __typename: "Category", name: categoryName },
                  coverImg: imageUrl1,
                  coverImg2: imageUrl2,
                  id: restaurantId,
                  isPromoted: false,
                  name,
                  __typename: "Restaurant",
                },
                ...queryResult?.myRestaurants?.restaurants,
              ],
            },
          },
        });
      }

      history.replace("/");

      return toast.success("Tạo cửa hàng thành công");
    }

    if (error) {
      setIsUploading(false);
      return toast.error(error);
    }
  };
  const [isUploading, setIsUploading] = useState(false);

  const [createRestaurantMutation, { loading, data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });

  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      address: "",
      categoryName: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState, getValues } = form;
  const { errors } = formState;

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);
      const { file, file2, name, address, categoryName } = data;
      const actualFile1 = file[0];
      const formBody1 = new FormData();
      formBody1.append("file", actualFile1);
      const { url: coverImg } = await (
        await fetch(`${process.env.REACT_APP_SERVER_URL}/uploads`, {
          method: "POST",
          body: formBody1,
        })
      ).json();
      setImageUrl1(coverImg);

      const actualFile2 = file2[0];
      const formBody2 = new FormData();
      formBody2.append("file", actualFile2);
      const { url: coverImg2 } = await (
        await fetch(`${process.env.REACT_APP_SERVER_URL}/uploads`, {
          method: "POST",
          body: formBody2,
        })
      ).json();
      setImageUrl2(coverImg2);

      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
            coverImg2,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) {
      return;
    }

    const file = files[0];
    const base64: any = await blobToBase64(file);
    setImage(base64.toString());
  };

  const uploadFile2Handler = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) {
      return;
    }

    const file = files[0];
    const base64: any = await blobToBase64(file);
    setImage2(base64.toString());
  };

  return (
    <>
      <Helmet>
        <title>Tạo cửa hàng | Loship</title>
      </Helmet>

      <Header />

      <div className="border rounded-md p-6 pb-9 w-[500px] mx-auto mt-[5%] shadow bg-white">
        <h1 className="font-bold text-3xl text-primary mb-5">
          Tạo cửa hàng mới
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            id="name"
            label="Tên cửa hàng"
            register={register("name")}
            placeholder="Nhập tên cửa hàng"
            errorMsg={errors.name?.message}
          />

          <FormInput
            id="address"
            label="Địa chỉ cửa hàng"
            register={register("address")}
            placeholder="Nhập địa chỉ cửa hàng"
            errorMsg={errors.address?.message}
          />

          <FormInput
            id="categoryName"
            label="Danh mục cửa hàng"
            register={register("categoryName")}
            placeholder="Nhập tên danh mục cửa hàng"
            errorMsg={errors.categoryName?.message}
          />

          <label
            htmlFor="file"
            className="w-full bg-[#eeeeee92] rounded-md flex flex-col gap-y-2 items-center justify-center h-32 mb-4 cursor-pointer hover:opacity-60 transition"
          >
            <input
              type="file"
              id="file"
              hidden
              {...register("file", { onChange: uploadFileHandler })}
            />

            {image ? (
              <StyledImage
                src={image}
                alt=""
                wrapperClasses="w-full h-full"
                imageClasses="!object-contain"
              />
            ) : (
              <>
                <MdUpload size={30} />
                <p className="text-sm font-bold">
                  Upload ảnh thumbnail của cửa hàng
                </p>
              </>
            )}
          </label>

          <label
            htmlFor="file2"
            className="w-full bg-[#eeeeee92] rounded-md flex flex-col gap-y-2 items-center justify-center h-32 mb-4 cursor-pointer hover:opacity-60 transition"
          >
            <input
              type="file"
              id="file2"
              hidden
              {...register("file2", { onChange: uploadFile2Handler })}
            />

            {image2 ? (
              <StyledImage
                src={image2}
                alt=""
                wrapperClasses="w-full h-full"
                imageClasses="!object-contain"
              />
            ) : (
              <>
                <MdUpload size={30} />
                <p className="text-sm font-bold">Upload ảnh bìa của cửa hàng</p>
              </>
            )}
          </label>

          <BtnWithLoading
            content="Xác nhận"
            isLoading={isUploading}
            customClasses="w-full"
            type="submit"
            disabled={false}
          />
        </form>
      </div>
    </>
  );
};

export default AddRestaurant;
