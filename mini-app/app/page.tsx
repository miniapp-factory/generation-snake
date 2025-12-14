import { description, title } from "@/lib/metadata";
import { Metadata } from 'next';
export const metadata: Metadata = {
  other: {
    'base:app_id': '691fc2b0e5985ba8ba0cc245',
  },
};
import Game2048 from "@/components/2048-game";
import { generateMetadata } from "@/lib/farcaster-embed";

export { generateMetadata };

export default function Home() {
  // NEVER write anything here, only use this page to import components
  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <span className="text-2xl">{title}</span>
      <span className="text-muted-foreground">{description}</span>
      <Game2048 />
    </main>
  );
}
