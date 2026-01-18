import { ButtonDanger } from "@/components/button/ButtonDanger";
import { MainContainer } from "@/components/container/MainContainer";
import AlertPolyfill from "@/components/ui/alert-web/AlertPolyfill";
import { Text } from "@/components/ui/text";
import { useUiStore } from "@/lib/storage/uiStore";
import { useAuthStore } from "@/lib/supabase/authStore";
import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Link, Stack } from "expo-router";
import type React from "react";
import { useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type MenuItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
};

const AccountScreen: React.FC = () => {
  const { user, logOut } = useAuthStore();
  const { markAsOpened, hasOpenedWebVersion } = useUiStore();

  useEffect(() => {
    markAsOpened("hasOpenedAccount");
  }, []);

  const handleLogout = () => {
    AlertPolyfill("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {},
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logOut(),
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      id: "homepage",
      title: "Homepage",
      icon: "home-outline",
      href: "https://aiinterviewbuddy.com",
    },
    {
      id: "documentation",
      title: "Documentation",
      icon: "document-text-outline",
      href: "https://docs.aiinterviewbuddy.com",
    },
    {
      id: "terms",
      title: "Terms of Service",
      icon: "document-text-outline",
      href: "https://aiinterviewbuddy.com/terms-of-service",
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "shield-checkmark-outline",
      href: "https://aiinterviewbuddy.com/privacy-policy",
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MainContainer>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: "white",
              marginHorizontal: 20,
              borderRadius: 24,
              padding: 32,
              marginTop: 20,
              alignItems: "center",
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
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
              {user?.avatar ? (
                <Image
                  source={{ uri: user?.avatar }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentFit="cover"
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

            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#1D252C",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {user?.name}
            </Text>

            <ButtonDanger icon="log-out-outline" label="Logout" onPress={handleLogout} />
          </View>

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
            <Link href={`/account/web-version`} push asChild>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 18,
                  borderBottomColor: "#F3F4F6",
                }}
              >
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
                  <Ionicons name="globe-outline" size={20} color="#FFC629" />
                </View>

                <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: "#1D252C" }}>Use the web version</Text>

                {!hasOpenedWebVersion && (
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: "#EF4444", // Red color
                      marginRight: 8,
                    }}
                  />
                )}

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </Link>
          </View>

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
                onPress={() => Linking.openURL(item.href)}
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 18,
                  borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: "#F3F4F6",
                }}
              >
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

                <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: "#1D252C" }}>{item.title}</Text>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

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
            <Link href={`/account/delete`} push asChild>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 18,
                  borderBottomColor: "#F3F4F6",
                }}
              >
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
                  <Ionicons name="warning-outline" size={20} color="#ff2929ff" />
                </View>

                <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", color: "#1D252C" }}>Delete my account</Text>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </Link>
          </View>

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
              AI Interview Buddy {Application.nativeApplicationVersion}
            </Text>
          </View>
        </ScrollView>
      </MainContainer>
    </>
  );
};

export default AccountScreen;
