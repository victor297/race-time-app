import React from "react";
import { Input, InputField, InputSlot } from "~/components/ui/input";
import clsx from "clsx";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
type SearchProps = {
  searchText?: string;
  placeholder?: string;
  onSearchText?: (searchText: string) => void;
};
const AppSearch = ({
  searchText,
  onSearchText,
  placeholder = "Search...",
}: SearchProps) => {
  const [value, setValue] = React.useState<string>(searchText || "");
  const handleTextChange = (val: string) => {
    setValue(val);
    onSearchText && onSearchText(val);
  };
  const handleTextClear = () => {
    setValue("");
    onSearchText && onSearchText("");
  };
  const handleSubmitEditing = () => {
    onSearchText && onSearchText(value);
  };
  return (
    <>
      <Input
        className={clsx(
          "h-[46px] text-secondary-500 rounded-[46px] border border-[#EDF1F3] px-[12px] bg-white"
        )}
        size={"md"}
        variant={"outline"}
      >
        <InputSlot>
          <Feather name="search" size={24} color="grey" />
        </InputSlot>
        <InputField
          type={"text"}
          placeholder={placeholder}
          value={value}
          onChangeText={handleTextChange}
          returnKeyType={"search"}
          onBlur={handleSubmitEditing}
          onSubmitEditing={handleSubmitEditing}
        />
        {value != "" && (
          <TouchableOpacity onPress={handleTextClear}>
            <InputSlot>
              <EvilIcons name="close" size={12} color="grey" />
            </InputSlot>
          </TouchableOpacity>
        )}
      </Input>
    </>
  );
};

export default AppSearch;
