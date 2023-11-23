import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FC, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import Header from "../../components/layout/header";
import FormInput from "../../components/form-input";
import BtnWithLoading from "../../components/btn-with-loading";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import { FaCircleMinus } from "react-icons/fa6";
import { blobToBase64 } from "../../utils/blob-to-base64";
import StyledImage from "../../components/styled-image";
import { MdUpload } from "react-icons/md";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface Props {}

const schema: any = Yup.object({
  name: Yup.string().required("Vui lòng nhập tên món ăn"),
  description: Yup.string().required("Vui lòng nhập mô tả về món ăn"),
  price: Yup.string().required("Vui lòng nhập giá món ăn"),
});

interface FormValues {
  name: string;
  description: string;
  price: string;
  dishOptions: { name: string; extra: string }[];
  file: FileList;
}

interface IParams {
  restaurantId: string;
}

const AddDish: FC<Props> = (props): JSX.Element => {
  const history = useHistory();
  const { restaurantId } = useParams<IParams>();
  const [image, setImage] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) {
      return;
    }

    const file = files[0];
    const base64: any = await blobToBase64(file);
    setImage(base64.toString());
  };

  const [createDishMutation, { error }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { input: { id: Number(restaurantId) } },
      },
    ],
  });

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      dishOptions: [],
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState, control } = form;
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "dishOptions",
    control,
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      const { name, description, price, dishOptions, file } = formData;
      setIsCreating(true);
      const actualFile = file[0];
      const formImage = new FormData();
      formImage.append("file", actualFile);
      const { url: photo } = await (
        await fetch(`${process.env.REACT_APP_SERVER_URL}/uploads`, {
          method: "POST",
          body: formImage,
        })
      ).json();

      const options = dishOptions.map((option) => ({
        ...option,
        extra: Number(option.extra),
      }));

      createDishMutation({
        variables: {
          input: {
            name,
            description,
            price: Number(price),
            restaurantId: Number(restaurantId),
            options,
            photo,
          },
        },
      });

      if (!error) {
        toast.success("Tạo món ăn thành công");
      } else {
        toast.error("Không thể tạo món ăn");
      }

      history.goBack();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tạo món ăn | Loship</title>
      </Helmet>
      <Header />
      <div className="border rounded-md p-6 pb-9 w-[500px] mx-auto mt-[5%] shadow bg-white">
        <h1 className="font-bold text-3xl text-primary mb-5">Tạo món ăn mới</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            id="name"
            label="Tên món ăn"
            register={register("name")}
            placeholder="Nhập tên món ăn"
            errorMsg={errors.name?.message}
          />

          <FormInput
            id="description"
            label="Mô tả món ăn"
            register={register("description")}
            placeholder="Nhập đoạn mô tả ngắn về món ăn"
            errorMsg={errors.description?.message}
          />

          <FormInput
            id="price"
            label="Giá món ăn"
            type="number"
            register={register("price")}
            placeholder="Nhập giá món ăn"
            errorMsg={errors.price?.message}
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
                <p className="text-sm font-bold">Upload thumbnail của món ăn</p>
              </>
            )}
          </label>

          <hr className="my-6" />

          <button
            type="button"
            className="flex items-center gap-1 bg-emerald-700 text-white px-2 py-1 mb-4 text-xs rounded-md my-2 hover:scale-105 transition"
            onClick={() => append({ name: "", extra: "" })}
          >
            <FiPlus /> Thêm option
          </button>

          {fields.map((field, index) => (
            <div className="flex items-center gap-4 relative" key={field.id}>
              <FormInput
                id="optionName"
                label="Tên option"
                register={register(`dishOptions.${index}.name` as const)}
                placeholder="Nhập tên option"
              />
              <FormInput
                id="optionPrice"
                label="Giá tính thêm"
                type="number"
                register={register(`dishOptions.${index}.extra` as const)}
                placeholder="Nhập giá tính thêm"
              />

              <button
                onClick={() => remove(index)}
                className="rounded-md right-0 top-0 text-red-700 text-[10px] py-[2px] px-1"
              >
                <FaCircleMinus size={16} />
              </button>
            </div>
          ))}

          <BtnWithLoading
            content="Xác nhận tạo"
            isLoading={isCreating}
            customClasses="w-full mt-3"
            type="submit"
            disabled={false}
          />
        </form>
      </div>
    </>
  );
};

export default AddDish;
