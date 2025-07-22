import { Image } from "@/components/ui/image";

type Props = {
  className?: string;
};

const RadialBgSource = require("@/assets/images/logo-radial-bg.png");

export function LogoRadialBg({ className = "w-36 h-36 justify-center items-center mb-3" }: Props) {
  return <Image source={RadialBgSource} className={className} alt="Ai Interview Buddy Logo"/>;
}
