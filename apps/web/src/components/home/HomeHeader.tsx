import { NotificationButton } from "./NotificationButton";

interface HomeHeaderProps {
  appName?: string;
  tagline?: string;
}

export function HomeHeader({
  appName = "Chat-it",
  tagline = "Connect. Chat. Share.",
}: HomeHeaderProps) {
  return (
    <header className="flex items-center justify-between pt-2 pb-4">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-tight text-[#102448]">
          {appName}
        </h1>
        <p className="mt-0.5 text-[13px] font-normal text-[#9FA0B5]">
          {tagline}
        </p>
      </div>

      <NotificationButton />
    </header>
  );
}
