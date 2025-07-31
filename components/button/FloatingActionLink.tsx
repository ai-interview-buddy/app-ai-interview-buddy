import { Href, Link } from "expo-router";
import React from "react";
import { FloatingActionButton } from "./FloatingActionButton";

type FloatingActionLink = {
  href: Href;
  onPress?: () => Promise<void>;
};

export const FloatingActionLink = ({ href, onPress }: FloatingActionLink) => {
  return (
    <Link href={href} push asChild>
      <FloatingActionButton onPress={onPress} />
    </Link>
  );
};
