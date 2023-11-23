import { FC, ReactNode } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

interface Props {
  open: boolean;
  onClose: () => void;
  heading: string;
  children: ReactNode;
}

const CustomModal: FC<Props> = ({
  open,
  onClose,
  heading,
  children,
}): JSX.Element => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{
        modal: "customModal",
      }}
    >
      <h3 className="bg-blue-900 text-white px-5 py-3 font-bold text-xl">
        {heading}
      </h3>
      <div className="p-6">{children}</div>
    </Modal>
  );
};

export default CustomModal;
