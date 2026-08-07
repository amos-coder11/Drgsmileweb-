import { HeroToGalleryMorph } from "@/components/HeroToGalleryMorph";
import { MotionOrchestrator } from "@/components/MotionOrchestrator";

export default function Home() {
  return (
    <MotionOrchestrator>
      <HeroToGalleryMorph />
    </MotionOrchestrator>
  );
}
