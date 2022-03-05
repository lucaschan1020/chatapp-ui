import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { PrivateChannelItem } from '../interfaces';
import { ViewStateSlice, PrivateChannelListSlice } from '../state';
import leadingZero from '../utilities/leading-zero';
import AvatarIcon from './AvatarIcon.component';
import Icon from './Icon.component';

interface PrivateChannelListProps {
  className?: string;
}

function PrivateChannelList({ className = '' }: PrivateChannelListProps) {
  const currentUser = useAppSelector((state) => state.CurrentUser);
  useEffect(() => {
    const privateChannels: PrivateChannelItem[] = [
      { participants: ['sadsadasd| Elexir Wizard', 'Jackson Wong'] },
      { participants: ['Jay'] },
      { participants: ['Alex'] },
      { participants: ['Sam'] },
      { participants: ['Jeremy', 'Kelvin'] },
      { participants: ['Sam', 'Lucas', 'Ming Fong', 'Desmond', 'Mun Haw'] },
      { participants: ['Sam'] },
      { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
      // { participants: ['Sam'] },
    ];

    dispatch(PrivateChannelListSlice.AddPrivateChannels(privateChannels));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useAppDispatch();
  const PrivateChannelList = useAppSelector(
    (state) => state.PrivateChannelList
  );

  return (
    <div className={className}>
      <div className="shadow-elevation-low flex h-12 w-60 flex-none">
        <button className="bg-tertiary font-primary text-muted m-[0.55rem] flex-auto rounded-[0.25rem] px-[0.375rem] text-left text-sm">
          Find or start a conversation
        </button>
      </div>
      <div className="scrollbar-2 -webkit-scrollbar-thumb:min-h-[2.5rem] scrollbar-thumb-rounded -webkit-scrollbar-thumb:bg-transparent scrollbar-thumb-border hover-scrollbar-thumb flex flex-col overflow-y-scroll pt-2">
        <Link to="/channels/@me">
          <div className="text-channel-default hover:bg-modifier-hover hover:text-interactive-hover my-[0.0625rem] ml-[0.5rem] flex h-[2.625rem] flex-none  cursor-pointer items-center justify-start rounded-[0.25rem] active:bg-[rgba(79,84,92,0.24)] active:text-white">
            <Icon.Friends className="ml-3 h-6 w-6" />
            <label className="font-primary ml-4 font-medium">Friends</label>
          </div>
        </Link>
        <div className="text-channel-default hover:bg-modifier-hover hover:text-interactive-hover my-[0.0625rem] ml-[0.5rem] flex h-[2.625rem] flex-none cursor-pointer items-center justify-start rounded-[0.25rem] active:bg-[rgba(79,84,92,0.24)] active:text-white">
          <Icon.Nitro className="ml-3 h-6 w-6" />
          <label className="font-primary ml-4 font-medium">Nitro</label>
        </div>
        <div className="text-channel-default hover:text-interactive-hover flex h-10 flex-none items-center justify-between pt-[1.125rem] pr-[0.5rem] pb-[0.25rem] pl-[1.125rem]">
          <label className="font-display h-[1.125rem] cursor-default text-xs font-semibold uppercase tracking-[0.015625rem]">
            Direct Messages
          </label>
          <Icon.DMPlus className="h-4 w-4 cursor-pointer" />
        </div>
        {PrivateChannelList.map((privateChannel, index) => (
          <Link to={`/channels/@me/${index}`} key={index}>
            <div
              className="group text-channel-default hover:bg-modifier-hover hover:text-interactive-hover my-[0.0625rem] ml-[0.5rem] flex h-[2.625rem] flex-none cursor-pointer items-center justify-start rounded-[0.25rem] px-2 active:bg-[rgba(79,84,92,0.24)] active:text-white"
              onClick={() =>
                dispatch(ViewStateSlice.ChangeCurrentChat(privateChannel))
              }
            >
              <AvatarIcon
                src={
                  privateChannel.avatarSrc
                    ? privateChannel.avatarSrc
                    : undefined
                }
              />
              <div className="ml-3 flex flex-1 flex-col truncate">
                <label className="font-primary cursor-pointer truncate text-base font-medium leading-5">
                  {privateChannel.participants.join(', ')}
                </label>
                {privateChannel.participants.length > 1 && (
                  <label className="font-primary mt-[-0.125rem] cursor-pointer truncate text-xs font-medium">
                    {privateChannel.participants.length} Members
                  </label>
                )}
              </div>

              <Icon.Cross className="text-channel-default hover:text-interactive-hover active:text-interactive-active ml-auto mr-[0.125rem] hidden h-4 w-4 flex-none group-hover:block" />
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-secondary-alt mt-auto flex h-[3.3125rem] flex-none items-center px-2">
        <AvatarIcon src={currentUser?.avatar} />
        <span className="font-primary ml-2 mr-1 flex w-[5.25rem] flex-col justify-center">
          <label className="text-header-primary truncate text-sm font-semibold leading-[1.125rem]">
            {currentUser?.name}
          </label>
          <label className="text-header-secondary text-xs font-medium leading-[0.8125rem]">
            #{leadingZero(currentUser?.discriminator ?? 0, 4)}
          </label>
        </span>
        <div className="flex flex-1 justify-around">
          <button className="text-interactive hover:bg-modifier-hover h-8 w-8 rounded-[0.25rem]">
            <Icon.Mute className="mx-auto" />
          </button>
          <button className="text-interactive hover:bg-modifier-hover h-8 w-8 rounded-[0.25rem]">
            <Icon.Deafen className="mx-auto" />
          </button>
          <button className="text-interactive hover:bg-modifier-hover h-8 w-8 rounded-[0.25rem]">
            <Icon.Setting className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivateChannelList;
