import { Link } from "expo-router";
import React from "react";
import { Text, TouchableHighlight, View } from "react-native";

type DetailedCardProps = {
  title: string;
  description: string;
};

export default function DetailedCard({
  title,
  description,
}: DetailedCardProps) {
  return (
    <View className="flex-1 self-auto p-6 mr-10 relative border border-gray-300 rounded-full">
      <TouchableHighlight className="bg-orange-500 rounded-full opacity-70 text-justify">
        <Text className="text-base">{title}</Text>
      </TouchableHighlight>
      <Text className="mt-2">{description}</Text>
      <TouchableHighlight>
        <Link href={"#"} className="text-blue-500">
          Learn more
        </Link>
      </TouchableHighlight>
    </View>
  );
}
