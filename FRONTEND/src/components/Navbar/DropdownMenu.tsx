import React from "react";

interface DropdownMenuProps {
  logoutUser: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ logoutUser }) => {
  return (
    <div className="absolute top-[calc(100%+5px)] right-0 bg-white text-black shadow-md rounded-md min-w-[150px] z-50">
      <ul className="list-none">
        <li
          onClick={logoutUser}
          className="py-2 pl-3 font-bold cursor-pointer hover:bg-gray-100"
        >
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
