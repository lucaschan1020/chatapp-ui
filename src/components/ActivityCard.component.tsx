import AvatarIcon from '@/components/AvatarIcon.component';

const ActivityCard = () => {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-lg border-[0.0625rem] border-solid border-modifier-accent bg-secondary p-4 hover:bg-[#18191c]">
      <AvatarIcon />
      <div className="flex flex-1 flex-col">
        <label className="truncate font-primary text-base font-semibold leading-5 text-normal">
          John Doe
        </label>
        <label className="truncate font-primary text-sm font-normal leading-[1.125rem] text-header-secondary">
          <span className="uppercase">Valorant</span> - 25m
        </label>
      </div>
      <img
        className="h-6 w-6 rounded"
        src="https://cdn.discordapp.com/app-icons/700136079562375258/e55fc8259df1548328f977d302779ab7.webp?size=64"
        alt="appIcon"
      />
    </div>
  );
};

export default ActivityCard;
