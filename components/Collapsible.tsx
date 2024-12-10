import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { PropsWithChildren, useState } from "react";
import { TouchableOpacity, useColorScheme, View, Text } from "react-native";

interface CollapsibleProps {
  title: string;
}

const Collapsible: React.FC<PropsWithChildren<CollapsibleProps>> = ({
  children,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <View className="bg-white p-4 rounded-lg shadow-md">
      <TouchableOpacity
        className="flex-row items-center gap-2"
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isOpen ? "chevron-down" : "chevron-forward-outline"}
          size={18}
          color={theme === "dark" ? "#FFFFFF" : "#000000"}
        />
        <Text className="font-semibold text-lg">{title}</Text>
      </TouchableOpacity>
      {isOpen && <View className="mt-2 ml-6">{children}</View>}
    </View>
  );
};

export default Collapsible;
