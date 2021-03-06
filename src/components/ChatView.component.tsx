import { parseJSON } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import friendAPI from '../apis/friend';
import { useAppDispatch, useAppSelector } from '../hooks';
import { FriendshipEnum } from '../interfaces';
import { store } from '../state';
import {
  GetBucketPrivateChannelChatMessage,
  GetPrivateChannelChatMessage,
  SendPrivateChannelChat,
} from '../state/reducers/ChatMessageSlice';
import { DeleteFriend, UpdateFriend } from '../state/reducers/FriendSlice';
import AvatarIcon from './AvatarIcon.component';
import ChatMessage from './ChatMessage.component';
import Icon from './Icon.component';

interface ChatViewProps {
  className?: string;
}

function ChatView({ className = '' }: ChatViewProps) {
  const [viewMemberList, setViewMemberList] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const textAreaMessage = useRef<HTMLTextAreaElement>(null);
  const { privateChannelId } = useParams();
  const dispatch = useAppDispatch();
  const CurrentPrivateChannel = useAppSelector((state) => {
    if (!state.PrivateChannelList) return null;
    if (!privateChannelId) return null;
    const privateChannel = state.PrivateChannelList[privateChannelId];
    if (!privateChannel) return null;
    return privateChannel;
  });
  const CurrentUser = useAppSelector((state) => state.CurrentUser);
  const BucketChatMessages = useAppSelector((state) => {
    if (!privateChannelId) return null;
    if (!state.ChatMessages) return null;
    const bucketChat = state.ChatMessages[privateChannelId];
    if (!bucketChat) return null;
    return bucketChat;
  });

  const Friendship = useAppSelector((state) => {
    if (!CurrentPrivateChannel) return null;
    if (CurrentPrivateChannel.isGroup) return null;
    return state.Friends[CurrentPrivateChannel.participants[0]._id]
      .friendshipStatus;
  });

  const newBucketDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!BucketChatMessages || Object.keys(BucketChatMessages).length === 0)
      return;
    if (!newBucketDiv.current) return;
    const availableBuckets = Object.keys(BucketChatMessages).map((bucketId) =>
      parseInt(bucketId)
    );
    const smallestBucketId = Math.min(...availableBuckets);
    if (smallestBucketId === 0) return;
    const smallestBucket = BucketChatMessages[smallestBucketId];
    let observer: IntersectionObserver | null = null;
    if (smallestBucket === undefined || smallestBucket !== null) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && privateChannelId) {
            dispatch(
              GetBucketPrivateChannelChatMessage({
                privateChannelId,
                bucketId: smallestBucketId - 1,
              })
            );
            observer!.unobserve(entry.target);
          }
        },
        {
          rootMargin: '10px',
        }
      );
      observer.observe(newBucketDiv.current);
    }

    return () => {
      if (newBucketDiv.current && observer)
        observer.unobserve(newBucketDiv.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BucketChatMessages, privateChannelId]);

  useEffect(() => {
    if (textAreaMessage.current !== null) {
      textAreaMessage.current.style.height = '0px';
      const scrollHeight = textAreaMessage.current.scrollHeight;
      textAreaMessage.current.style.height = scrollHeight + 'px';
    }
  }, [draftMessage]);

  useEffect(() => {
    if (!privateChannelId) return;
    const state = store.getState();
    setDraftMessage('');
    if (
      state.ChatMessages === null ||
      state.ChatMessages[privateChannelId] === undefined
    )
      dispatch(GetPrivateChannelChatMessage(privateChannelId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privateChannelId]);

  return (
    <div className={className}>
      <div className="shadow-elevation-low z-[2] flex h-12 flex-none items-center overflow-hidden px-2">
        <div className="flex items-center overflow-hidden">
          <div className="text-muted mx-2">
            <Icon.Alias />
          </div>
          <div className="font-display text-header-primary whitespace-nowrap text-base font-semibold leading-5">
            {CurrentPrivateChannel !== null
              ? CurrentPrivateChannel.isGroup
                ? CurrentPrivateChannel.privateChannelName
                : CurrentPrivateChannel.participants[0].username
              : ''}
          </div>
        </div>
        <div className="ml-auto flex">
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.AudioCall />
          </div>
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.VideoCall />
          </div>
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.Pin />
          </div>
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.AddMember />
          </div>
          {CurrentPrivateChannel && CurrentPrivateChannel.isGroup && (
            <div
              className="text-interactive mx-2 cursor-pointer"
              onClick={() => setViewMemberList(!viewMemberList)}
            >
              <Icon.Members />
            </div>
          )}
          <div className="text-normal mx-2 flex">
            <input
              className="bg-tertiary font-primary placeholder:text-muted placeholder-not-shown:w-[13.25rem] h-6 w-[7.25rem] flex-1 rounded-l pl-[0.375rem] text-sm font-medium leading-5 outline-none transition-[width] duration-[250ms] focus:w-[13.25rem]"
              placeholder="Search"
              type="text"
            />
            <div className="bg-tertiary text-muted flex h-6 w-7 cursor-text items-center justify-center rounded-r px-[0.125rem]">
              <Icon.MagnifyingGlass />
            </div>
          </div>
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.DMInbox />
          </div>
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.Help />
          </div>
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="scrollbar-4 -webkit-scrollbar-thumb:min-h-[2.5rem] scrollbar-thumb-rounded-lg -webkit-scrollbar-thumb:bg-tertiary scrollbar-track scrollbar-thumb-border flex flex-1 flex-col-reverse overflow-y-scroll">
            <div className="min-h-[1.875rem]"></div>
            {BucketChatMessages &&
              Object.keys(BucketChatMessages)
                .filter((bucketId) => BucketChatMessages[bucketId])
                .flatMap((bucketId) =>
                  BucketChatMessages[bucketId]!.chatMessages.map(
                    ({ _id, timestamp, senderId, content }) => ({
                      channelId: BucketChatMessages[bucketId]!.channelId,
                      bucketId: BucketChatMessages[bucketId]!.bucketId,
                      _id,
                      timestamp: parseJSON(timestamp),
                      senderId,
                      content,
                    })
                  )
                )
                .map((_chatMessage, index, ChatMessages) => {
                  const currentChatMessage =
                    ChatMessages[ChatMessages.length - 1 - index];
                  const previousChatMessage =
                    ChatMessages[ChatMessages.length - 2 - index] ?? null;
                  const isConsecutive =
                    previousChatMessage !== null &&
                    previousChatMessage.senderId ===
                      currentChatMessage.senderId;
                  return (
                    <ChatMessage
                      key={currentChatMessage._id}
                      message={currentChatMessage}
                      isConsecutive={isConsecutive}
                    />
                  );
                })}
            <div ref={newBucketDiv}></div>

            <div className="m-4 flex flex-col">
              <AvatarIcon
                src={
                  CurrentPrivateChannel && !CurrentPrivateChannel.isGroup
                    ? CurrentPrivateChannel.participants[0].avatar
                    : undefined
                }
                width="w-20"
                height="h-20"
              />
              <label
                className="text-header-primary font-display my-2 text-[2rem] font-bold leading-10"
                onClick={() => {
                  console.log(Friendship);
                }}
              >
                {CurrentPrivateChannel && CurrentPrivateChannel.isGroup
                  ? CurrentPrivateChannel.privateChannelName
                  : CurrentPrivateChannel?.participants[0].username}
              </label>
              {CurrentPrivateChannel && !CurrentPrivateChannel.isGroup && (
                <>
                  <label className="text-header-secondary font-primary text-base leading-5">
                    This is the beginning of your direct message history with
                    <strong className="font-semibold">
                      {` @${CurrentPrivateChannel.participants[0].username} `}
                    </strong>
                    .
                  </label>
                  <div className="mt-4 flex flex-wrap items-center gap-y-1">
                    <label className="text-header-secondary font-primary my-[0.1875rem] text-sm leading-[1.125rem]">
                      No servers in common
                    </label>
                    <div className="bg-interactive-muted mx-4 my-[0.625rem] h-1 w-1 rounded-[50%]"></div>
                    {Friendship === null && (
                      <button
                        className="text-interactive-active font-primary bg-brand-experiment active:bg-brand-experiment-600 hover:bg-brand-experiment-560 mr-2 h-6 min-h-[1.5rem] min-w-[3.25rem] flex-none rounded-[0.1875rem] px-4 py-[0.125rem] text-sm font-medium leading-4"
                        onClick={async (e) => {
                          await friendAPI.post(
                            `/${CurrentPrivateChannel.participants[0].username}/${CurrentPrivateChannel.participants[0].discriminator}`
                          );
                        }}
                      >
                        Add Friend
                      </button>
                    )}
                    {Friendship === FriendshipEnum.Pending && (
                      <button className="text-interactive-active font-primary bg-brand-experiment mr-2 h-6 min-h-[1.5rem] min-w-[3.25rem] flex-none cursor-not-allowed rounded-[0.1875rem] px-4 py-[0.125rem] text-sm font-medium leading-4 opacity-50">
                        Friend Request Sent
                      </button>
                    )}
                    {Friendship === FriendshipEnum.Requested && (
                      <>
                        <label className="text-header-secondary font-primary mr-2 text-sm leading-[1.125rem]">
                          Sent you a friend request:
                        </label>
                        <button
                          className="text-interactive-active font-primary bg-brand-experiment active:bg-brand-experiment-600 hover:bg-brand-experiment-560 mr-2 h-6 min-h-[1.5rem] min-w-[3.25rem] flex-none rounded-[0.1875rem] px-4 py-[0.125rem] text-sm font-medium leading-4"
                          onClick={async (e) => {
                            await dispatch(
                              UpdateFriend({
                                username:
                                  CurrentPrivateChannel.participants[0]
                                    .username,
                                discriminator:
                                  CurrentPrivateChannel.participants[0]
                                    .discriminator,
                                friendshipStatus: FriendshipEnum.Friend,
                              })
                            );
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="text-interactive-active font-primary bg-interactive-muted active:bg-muted mr-2 h-6 min-h-[1.5rem] min-w-[3.25rem] flex-none rounded-[0.1875rem] px-4 py-[0.125rem] text-sm font-medium leading-4 hover:bg-[#686d73]"
                          onClick={async (e) => {
                            await dispatch(
                              DeleteFriend({
                                username:
                                  CurrentPrivateChannel.participants[0]
                                    .username,
                                discriminator:
                                  CurrentPrivateChannel.participants[0]
                                    .discriminator,
                              })
                            );
                          }}
                        >
                          Ignore
                        </button>
                      </>
                    )}
                    {Friendship === FriendshipEnum.Friend && (
                      <button
                        className="text-interactive-active font-primary bg-interactive-muted active:bg-muted mr-2 h-6 min-h-[1.5rem] min-w-[3.25rem] flex-none rounded-[0.1875rem] px-4 py-[0.125rem] text-sm font-medium leading-4 hover:bg-[#686d73]"
                        onClick={async (e) => {
                          await dispatch(
                            DeleteFriend({
                              username:
                                CurrentPrivateChannel.participants[0].username,
                              discriminator:
                                CurrentPrivateChannel.participants[0]
                                  .discriminator,
                            })
                          );
                        }}
                      >
                        Remove Friend
                      </button>
                    )}
                    {Friendship !== FriendshipEnum.Blocked && (
                      <button
                        className="text-interactive-active font-primary bg-interactive-muted active:bg-muted mr-2 h-6 min-h-[1.5rem] min-w-[3.25rem] flex-none rounded-[0.1875rem] px-4 py-[0.125rem] text-sm font-medium leading-4 hover:bg-[#686d73]"
                        onClick={async (e) => {
                          await dispatch(
                            UpdateFriend({
                              username:
                                CurrentPrivateChannel.participants[0].username,
                              discriminator:
                                CurrentPrivateChannel.participants[0]
                                  .discriminator,
                              friendshipStatus: FriendshipEnum.Blocked,
                            })
                          );
                        }}
                      >
                        Block
                      </button>
                    )}

                    {Friendship === FriendshipEnum.Blocked && (
                      <button
                        className="text-interactive-active font-primary bg-interactive-muted active:bg-muted mr-2 h-6 min-h-[1.5rem] min-w-[3.25rem] flex-none rounded-[0.1875rem] px-4 py-[0.125rem] text-sm font-medium leading-4 hover:bg-[#686d73]"
                        onClick={async (e) => {
                          await dispatch(
                            DeleteFriend({
                              username:
                                CurrentPrivateChannel.participants[0].username,
                              discriminator:
                                CurrentPrivateChannel.participants[0]
                                  .discriminator,
                            })
                          );
                        }}
                      >
                        Unblock
                      </button>
                    )}
                  </div>
                </>
              )}
              {CurrentPrivateChannel && CurrentPrivateChannel.isGroup && (
                <label className="text-header-secondary font-primary text-base leading-5">
                  Welcome to the beginning of the
                  <strong className="font-semibold">
                    {` ${CurrentPrivateChannel.privateChannelName} `}
                  </strong>
                  group.
                </label>
              )}
            </div>
          </div>
          <div className="relative mb-6 mt-[-0.5rem] flex flex-none px-4">
            <span className="bg-channeltextarea-background flex-none rounded-l-lg px-4 py-[0.625rem]">
              <div className="text-interactive">
                <Icon.AttachPlus className="cursor-pointer" />
              </div>
            </span>
            <textarea
              className="bg-channeltextarea-background font-primary text-normal scrollbar-3 scrollbar-thumb-rounded-lg -webkit-scrollbar-thumb:bg-[rgba(24,25,28,.6)] scrollbar-thumb-border placeholder:text-channeltextarea-placeholder max-h-[29.375rem] min-h-[2.75rem] flex-1 resize-none overflow-y-auto overflow-x-hidden rounded-r-lg py-[0.625rem] outline-none placeholder:whitespace-nowrap"
              rows={1}
              placeholder={`Message ${
                CurrentPrivateChannel !== null
                  ? CurrentPrivateChannel.isGroup
                    ? CurrentPrivateChannel.privateChannelName
                    : `@${CurrentPrivateChannel.participants[0].username}`
                  : ''
              }`}
              ref={textAreaMessage}
              value={draftMessage}
              onChange={(e) => {
                setDraftMessage((e.target as HTMLTextAreaElement).value);
              }}
              onKeyDown={(e) => {
                if (
                  !BucketChatMessages ||
                  Object.keys(BucketChatMessages).length === 0 ||
                  !privateChannelId
                )
                  return e.preventDefault();
                if (e.key !== 'Enter') return;
                if (e.shiftKey) return;
                e.preventDefault();
                if (
                  !draftMessage.trim() &&
                  Friendship === FriendshipEnum.Friend
                )
                  return;
                dispatch(
                  SendPrivateChannelChat({
                    privateChannelId,
                    content: (e.target as HTMLTextAreaElement).value,
                  })
                );
                setDraftMessage('');
              }}
            ></textarea>
            <div className="absolute right-5 top-1 flex flex-none items-center">
              <div className="text-interactive mx-1 cursor-pointer p-1">
                <Icon.Gift />
              </div>
              <div className="text-interactive mx-1 cursor-pointer p-1">
                <Icon.GIF />
              </div>
              <div className="text-interactive mx-1 cursor-pointer p-1">
                <Icon.Sticker />
              </div>
            </div>
          </div>
        </div>
        {CurrentPrivateChannel &&
          CurrentPrivateChannel.isGroup &&
          viewMemberList &&
          CurrentUser && (
            <div className="bg-secondary scrollbar-2 -webkit-scrollbar-thumb:min-h-[2.5rem] scrollbar-thumb-rounded -webkit-scrollbar-thumb:bg-transparent scrollbar-thumb-border hover-scrollbar-thumb flex w-60 flex-none flex-col overflow-y-scroll">
              <label className="font-display text-channel-default pt-6 pr-2 pl-4 text-xs font-semibold uppercase tracking-[0.015625rem]">
                Members???{CurrentPrivateChannel.participants.length}
              </label>
              {[
                ...CurrentPrivateChannel.participants,
                {
                  _id: CurrentUser._id,
                  avatar: CurrentUser.avatar,
                  username: CurrentUser.username,
                  discriminator: CurrentUser.discriminator,
                },
              ].map((participant) => (
                <div
                  key={participant._id}
                  className="group text-interactive hover:bg-modifier-hover ml-2 flex h-11 flex-none cursor-pointer items-center rounded-[0.25rem] px-2 py-[0.0625rem]"
                >
                  <AvatarIcon src={participant.avatar} />
                  <label className="font-primary text-channel-default group-hover:text-interactive-hover ml-3 mt-[0.0625rem] cursor-pointer truncate text-base font-medium leading-5">
                    {participant.username}
                  </label>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default ChatView;
