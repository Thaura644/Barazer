import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import { fetchPollData } from "@/lib/pollService"; // A service to fetch poll data

const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    const loadPollData = async () => {
      try {
        const data = await fetchPollData(); // Fetch data from your API
        setPollData(data);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPollData();
  }, []);

  const screenWidth = Dimensions.get("window").width;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white flex justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!pollData || pollData.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white p-5">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text className="text-2xl font-JakartaBold">Insights</Text>
          <View className="flex-1 h-fit flex justify-center items-center">
            <Text className="text-3xl font-JakartaBold mt-3">
              No Data Available
            </Text>
            <Text className="text-base mt-2 text-center px-7">
              Data about polls, votes, and statistics will appear here when
              available.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="text-2xl font-JakartaBold mb-5">Insights</Text>

        {/* Pie Chart for Votes Distribution */}
        <Text className="text-lg font-JakartaBold mb-2">
          Votes Distribution
        </Text>
        <PieChart
          data={pollData.votesDistribution.map((item) => ({
            name: item.category,
            population: item.count,
            color: item.color,
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        {/* Bar Chart for Participation Trends */}
        <Text className="text-lg font-JakartaBold mt-5 mb-2">
          Participation Trends
        </Text>
        <BarChart
          data={{
            labels: pollData.participationTrends.map((trend) => trend.month),
            datasets: [
              {
                data: pollData.participationTrends.map((trend) => trend.count),
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          verticalLabelRotation={30}
        />

        {/* Line Chart for Poll Outcomes */}
        <Text className="text-lg font-JakartaBold mt-5 mb-2">
          Outcomes Over Time
        </Text>
        <LineChart
          data={{
            labels: pollData.pollOutcomes.map((outcome) => outcome.date),
            datasets: [
              {
                data: pollData.pollOutcomes.map((outcome) => outcome.result),
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#022173",
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          bezier
        />

        <Text className="text-center mt-5 text-sm text-gray-500">
          Data reflects citizen participation and governance statistics.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
