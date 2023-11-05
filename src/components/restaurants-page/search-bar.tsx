import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { RiSearch2Line } from "react-icons/ri";
import { useHistory } from "react-router-dom";

interface Props {
  initialSearchQuery: string;
}

interface FormValues {
  query: string;
}

const SearchBar: FC<Props> = ({ initialSearchQuery }): JSX.Element => {
  const history = useHistory();
  const form = useForm<FormValues>({
    defaultValues: {
      query: "",
    },
  });

  const { register, handleSubmit, setValue } = form;

  const onSubmit = async (data: FormValues) => {
    history.push(`/search?term=${data.query}`);
  };

  useEffect(() => {
    setValue("query", initialSearchQuery);
  }, []);

  return (
    <form
      className="bg-white rounded-full w-[40%] flex items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="h-[50px] aspect-square grid place-items-center">
        <RiSearch2Line size={20} />
      </div>
      <input
        type="search"
        id="search"
        className="flex-1 outline-none mr-4"
        placeholder="Tìm quán ăn, trà sữa yêu thích để đặt Loship giao ngay"
        {...register("query")}
      />
    </form>
  );
};

export default SearchBar;
