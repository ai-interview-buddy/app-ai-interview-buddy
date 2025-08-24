"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useColorScheme } from "nativewind"
import type React from "react"
import { useState } from "react"
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"

// Types
type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type MenuItem = {
  id: string
  title: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
}

const AccountScreen: React.FC = () => {
  const { colorScheme } = useColorScheme()
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content"
  const router = useRouter()

  // Mock user data
  const [user] = useState<User>({
    id: "1",
    name: "Verissimo Ribeiro",
    email: "vj@gmail.com",
    avatar: "/professional-headshot.png",
  })

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Handle logout logic here
          console.log("User logged out")
          // router.replace('/login');
        },
      },
    ])
  }

  const menuItems: MenuItem[] = [
    {
      id: "homepage",
      title: "Homepage",
      icon: "home-outline",
      onPress: () => {
        // Handle homepage navigation
        console.log("Navigate to homepage")
      },
    },
    {
      id: "roadmap",
      title: "Road map",
      icon: "map-outline",
      onPress: () => {
        // Handle roadmap navigation
        console.log("Navigate to roadmap")
      },
    },
    {
      id: "terms",
      title: "Terms of Service",
      icon: "document-text-outline",
      onPress: () => {
        // Handle terms navigation
        console.log("Navigate to terms")
      },
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "shield-checkmark-outline",
      onPress: () => {
        // Handle privacy policy navigation
        console.log("Navigate to privacy policy")
      },
    },
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FEFBED" }}>
      <StatusBar barStyle={barStyle} backgroundColor="#FEFBED" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 32,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#1D252C" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1D252C",
            }}
          >
            Account
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* User Profile Section */}
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 24,
            padding: 32,
            alignItems: "center",
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#F8F9FA",
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              overflow: "hidden",
            }}
          >
            {user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFC629" + "20",
                }}
              >
                <Ionicons name="person" size={48} color="#FFC629" />
              </View>
            )}
          </View>

          {/* User Info */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: "#1D252C",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {user.name}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            {user.email}
          </Text>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#FEF2F2",
              borderWidth: 1,
              borderColor: "#FECACA",
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 24,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#DC2626",
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 20,
            marginBottom: 32,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
            overflow: "hidden",
          }}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: "#FFC629" + "15",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Ionicons name={item.icon} size={20} color="#FFC629" />
              </View>

              {/* Title */}
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1D252C",
                }}
              >
                {item.title}
              </Text>

              {/* Arrow */}
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View
          style={{
            alignItems: "center",
            paddingBottom: 32,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#9CA3AF",
              fontWeight: "500",
            }}
          >
            AI Interview Buddy v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AccountScreen
