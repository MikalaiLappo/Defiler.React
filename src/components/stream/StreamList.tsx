import { Link } from 'react-router-dom';

import { useInterval } from '../../hooks/useInterval';
import { IStream } from '../../types/stream';

type IStreamListProps = {
  streams: IStream[];
  currentStream: IStream | null;
  refreshData: (a: string, b: string) => void;
};

const StreamList = ({
  streams,
  currentStream,
  refreshData,
}: IStreamListProps) => {
  const sortedList = [...streams].sort((a, b) => {
    const typeIndex = (type) => {
      return ['defiler', 'progamer', 'other', 'heresy'].findIndex(
        (x) => x === type,
      );
    };

    const ta = typeIndex(a.type);
    const tb = typeIndex(b.type);
    if (ta === tb) return b.fame - a.fame;

    return ta - tb;
  });

  useInterval(() => {
    refreshData('streams', 'online');
  }, 60000);

  return (
    <>
      <div className="stream-list-header"></div>
      {sortedList.map((stream, index) => {
        const styles = stream.pic
          ? {
              backgroundImage: `url('/images/pic/${stream.pic}.png')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }
          : {};
        return (
          <Link to={'/stream/' + stream.id} key={index}>
            <div
              className={`stream-block ${
                currentStream && currentStream.id === stream.id
                  ? 'chosen'
                  : null
              }`}
            >
              <div className={`stream-icon ${stream.pic}`} style={styles}>
                &nbsp;
              </div>
              <div className={`stream-race ${stream.race}`}>&nbsp;</div>
              {stream.name}
            </div>
          </Link>
        );
      })}
      <div className="stream-list-footer"></div>
    </>
  );
};

export default StreamList;
