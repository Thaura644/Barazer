import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import tw from "twrnc";

import Collapsible from "@/components/Collapsible";
import DetailedCard from "@/components/DetailedCard";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { icons, images } from "@/constants";
import { fetchDynamicData } from "@/lib/dataService";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [dynamicData, setDynamicData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDynamicData();
        setDynamicData(data);
      } catch (error) {
        console.error("Error fetching dynamic data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const renderCard = ({ item }: { item: any }) => (
    <DetailedCard title={item.title} description={item.description} />
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100 px-4 py-6`}>
      <ScrollView contentContainerStyle={tw`pb-24`}>
        {/* Header Section */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800 pt-10`}>
            Welcome, {user?.firstName} 👋
          </Text>
          <TouchableOpacity
            onPress={handleSignOut}
            style={tw`justify-center items-center p-3 bg-red-500 rounded-full`}
          >
            <Image source={icons.out} style={tw`w-4 h-4`} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <GoogleTextInput
          icon={icons.search}
          containerStyle={tw`bg-white shadow-lg mb-6`}
          handlePress={() => router.push("/(root)/find-ride")}
        />

        {/* Discover Insights */}
        <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>
          Discover Insights
        </Text>
        <View style={tw`h-64 mb-6`}>
          <Map />
        </View>

        {/* Featured Engagements */}
        <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>
          Featured Engagements
        </Text>

        {/* Dynamic Data List */}
        <FlatList
          data={dynamicData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCard}
          ListEmptyComponent={() =>
            loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <View style={tw`items-center justify-center py-10`}>
                <Image
                  source={images.noResult}
                  style={tw`w-40 h-40 mb-3`}
                  resizeMode="contain"
                />
                <Text style={tw`text-sm text-gray-500`}>
                  No data available at the moment.
                </Text>
              </View>
            )
          }
        />

        {/* Collapsible Sections */}
        <Collapsible title="Current Polls" style={tw`mb-6`}>
          <Text style={tw`text-gray-700`}>
            Participate in ongoing polls and have your say!
          </Text>
        </Collapsible>

        <Collapsible title="Recent Bills">
          <Text style={tw`text-gray-700`}>
            Explore the latest government bills and vote!
          </Text>
        </Collapsible>
      </ScrollView>
    </SafeAreaView>
  );
}
