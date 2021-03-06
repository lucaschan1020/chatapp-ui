import { useAppDispatch, useAppSelector } from '../hooks';
import { ChangeFriendListSelectedIndex } from '../state/reducers/ViewStateSlice';
import FriendList from './FriendList.component';
import FriendSearch from './FriendSearch.component';
import Icon from './Icon.component';
import TabItem from './TabItem.component';

interface FriendViewProps {
  className?: string;
}

function FriendView({ className = '' }: FriendViewProps) {
  const selectedIndex = useAppSelector(
    (state) => state.ViewState.FriendListSelectedIndex
  );
  const dispatch = useAppDispatch();
  const tabItemSelected = (index: number) => {
    dispatch(ChangeFriendListSelectedIndex(index));
  };
  return (
    <div className={className}>
      <div className="shadow-elevation-low z-[2] flex h-12 flex-none items-center px-2">
        <div className="flex flex-1 overflow-hidden">
          <div className="text-muted mx-2">
            <Icon.Friends className="h-6 w-6" />
          </div>
          <div className="font-display text-header-primary font-semibold">
            Friends
          </div>
          <div className="bg-modifier-accent ml-4 mr-2 h-6 w-[0.0625rem]"></div>
          <div className="flex flex-1">
            <TabItem
              index={0}
              isSelected={selectedIndex === 0}
              onClick={tabItemSelected}
            >
              Online
            </TabItem>
            <TabItem
              index={1}
              isSelected={selectedIndex === 1}
              onClick={tabItemSelected}
            >
              All
            </TabItem>
            <TabItem
              index={2}
              isSelected={selectedIndex === 2}
              onClick={tabItemSelected}
            >
              Pending
            </TabItem>
            <TabItem
              index={3}
              isSelected={selectedIndex === 3}
              onClick={tabItemSelected}
            >
              Blocked
            </TabItem>
            <TabItem
              index={4}
              isSelected={selectedIndex === 4}
              onClick={tabItemSelected}
              backgroundColor="bg-interactive-green-normal active:bg-modifier-active"
              color="text-interactive-active"
              selectedBackgroundColor="bg-inherit hover:bg-modifier-hover active:bg-modifier-active"
              selectedColor="text-interactive-green-normal"
            >
              Add Friend
            </TabItem>
          </div>
        </div>
        <div className="flex">
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.GroupDM />
          </div>
          <div className="bg-modifier-accent mx-2 h-6 w-[0.0625rem]"></div>
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.DMInbox />
          </div>
          <div className="text-interactive mx-2 cursor-pointer">
            <Icon.Help />
          </div>
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col overflow-y-hidden">
          {selectedIndex < 4 && <FriendList index={selectedIndex} />}
          {selectedIndex === 4 && <FriendSearch />}
        </div>
        <div className="hidden min-w-[22.5rem] max-w-[26.25rem] flex-[0_1_30%] lg:flex">
          <div className="-webkit-scrollbar-thumb:min-h-[2.5rem] -webkit-scrollbar-thumb:bg-scrollbar-thin-thumb scrollbar-2 scrollbar-thumb-border border-modifier-accent scrollbar-thumb-rounded ml-[0.125rem] flex flex-1 flex-col overflow-x-hidden overflow-y-scroll border-l-[0.0625rem] border-solid pr-2 pt-4 pb-4 pl-4">
            <label className="font-display text-header-primary mt-2 mb-4 text-xl font-bold leading-6">
              Active Now
            </label>
            <div className="flex flex-col p-4 text-center">
              <label className="font-display text-header-primary mb-1 text-base font-semibold leading-5">
                It's quiet for now...
              </label>
              <label className="font-primary text-interactive-normal text-sm leading-[1.125rem]">
                When a friend starts an activity???like playing a game or hanging
                out on voice???we'll show it here!
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendView;
