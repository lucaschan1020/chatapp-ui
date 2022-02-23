import Notice from './Notice.component';
import ServerList from './ServerList.component';
import PrivateChannelList from './PrivateChannelList.component';
import ChatView from './ChatView.component';

function Main() {
  return (
    <>
      <ServerList className="bg-tertiary w-[4.5rem] flex-none" />
      <div className="flex flex-1 flex-col">
        <div className="bg-tertiary">
          <Notice className="bg-cyan-600">
            Want to take full advantage of Discord with better performance,
            in-game overlay, and more? Get the desktop app!
          </Notice>
        </div>
        <div className="flex min-h-0 flex-1">
          <PrivateChannelList className="bg-secondary flex w-60 flex-none flex-col" />
          <ChatView className="bg-primary flex flex-1 flex-col" />
        </div>
      </div>
    </>
  );
}
export default Main;