import { useUser } from "@clerk/clerk-expo";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { forumApi } from "@/lib/forum"; // Replace with actual API logic
import { Ride } from "@/types/type";

const Rides = () => {
  const { user } = useUser();
  const router = useRouter();

  const [searchingForums, setSearchingForums] = useState(false);
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [textData, setTextData] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [processingData, setProcessingData] = useState(false);

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  const handleCreateForum = async () => {
    try {
      const result = await forumApi.createForum({ userId: user?.id });
      if (result.success) {
        router.push(`/forum/${result.forumId}`);
      } else {
        console.error("Failed to create forum");
      }
    } catch (error) {
      console.error("Error creating forum:", error);
    }
  };

  const handleSearchForums = async (query: string) => {
    setSearchingForums(true);
    try {
      const results = await forumApi.searchForums(query);
      console.log("Found similar forums:", results);
    } catch (error) {
      console.error("Error searching for forums:", error);
    } finally {
      setSearchingForums(false);
    }
  };

  const handleTextDonation = async () => {
    if (!textData.trim()) {
      alert("Please enter some text.");
      return;
    }
    setProcessingData(true);
    try {
      const result = await dataApi.donateTextData({
        userId: user?.id,
        text: textData,
      });
      console.log("Donation response:", result);
      alert("Data donated successfully!");
    } catch (error) {
      console.error("Error donating text data:", error);
    } finally {
      setProcessingData(false);
      setDonationModalVisible(false);
      setTextData("");
    }
  };

  const handleStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access microphone is required.");
        return;
      }
      const recordingInstance = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recordingInstance.recording);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording completed. File stored at:", uri);
        setRecording(null);

        // Upload the audio file
        setProcessingData(true);
        const result = await dataApi.donateVoiceData({
          userId: user?.id,
          audioUri: uri,
        });
        console.log("Voice donation response:", result);
        alert("Voice data donated successfully!");
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    } finally {
      setProcessingData(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No forums found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <Text className="text-2xl font-JakartaBold my-5">All Forums</Text>
            <TouchableOpacity
              onPress={handleCreateForum}
              style={{ marginBottom: 20 }}
            >
              <Text className="text-xl text-blue-600">Create New Forum</Text>
            </TouchableOpacity>
            <Text className="text-xl font-JakartaBold my-3">
              Search Similar Forums
            </Text>
            <TouchableOpacity
              onPress={() => handleSearchForums("example query")}
              style={{
                padding: 10,
                backgroundColor: "#4CAF50",
                borderRadius: 5,
              }}
            >
              {searchingForums ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white">Search</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDonationModalVisible(true)}
              style={{
                padding: 10,
                backgroundColor: "#FF5722",
                borderRadius: 5,
                marginTop: 20,
              }}
            >
              <Text className="text-white">Donate Data (Text/Voice)</Text>
            </TouchableOpacity>
          </>
        }
      />

      {/* Modal for Data Donation */}
      <Modal
        visible={donationModalVisible}
        animationType="slide"
        onRequestClose={() => setDonationModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white p-5">
          <Text className="text-xl font-JakartaBold mb-5">
            Donate Your Data
          </Text>
          <TextInput
            placeholder="Enter your text data..."
            className="border p-3 rounded mb-5"
            multiline
            value={textData}
            onChangeText={setTextData}
          />
          <TouchableOpacity
            onPress={handleTextDonation}
            style={{
              padding: 10,
              backgroundColor: "#4CAF50",
              borderRadius: 5,
              marginBottom: 20,
            }}
          >
            {processingData ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white">Submit Text Data</Text>
            )}
          </TouchableOpacity>
          {recording ? (
            <TouchableOpacity
              onPress={handleStopRecording}
              style={{
                padding: 10,
                backgroundColor: "#FF5722",
                borderRadius: 5,
              }}
            >
              <Text className="text-white">Stop Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleStartRecording}
              style={{
                padding: 10,
                backgroundColor: "#4CAF50",
                borderRadius: 5,
              }}
            >
              <Text className="text-white">Start Voice Recording</Text>
            </TouchableOpacity>
          )}
          <Button
            title="Close"
            onPress={() => setDonationModalVisible(false)}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Rides;
