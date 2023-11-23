import { FC } from "react";
import { Category } from "../../__generated__/graphql";
import StyledImage from "../styled-image";
import { Link } from "react-router-dom";

interface Props {
  category: Category;
}

const CategoryItem: FC<Props> = ({ category }): JSX.Element => {
  return (
    <Link to={`/category/${category.slug}`}>
      <StyledImage
        wrapperClasses="w-full aspect-square rounded-lg overflow-hidden bg-white"
        src={category.coverImg || ""}
        alt={category.name}
      />

      <h3 className="text-center font-extrabold mt-2 text-[#333] line-clamp-2">
        {category.name}
      </h3>
    </Link>
  );
};

export default CategoryItem;
