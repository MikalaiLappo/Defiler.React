import React from 'react';

/* interface IReplaysResponse {
  total: number;
  replays: Replay[];
} */

export interface IReplay {
  id: number;
  title: string;
  firstCountry: string; // could be codegend list ig
  secondCountry: string;
  firstRace: IRace;
  secondRace: IRace;
  firstName: null | string;
  secondName: null | string;
  map: string; // probably may be `null` (according to messed up reps.ru swagger)
  mapUrl: string;
  mapUrlFull: string;
  type: IReplayType;
  status: IReplayStatus;
  link: string;
}

type IRace = 'Zerg' | 'Terran' | 'Protoss' | 'All';
type IReplayType = 'Replay' | 'VOD';
type IReplayStatus = 'Park / Archive' | '1x1' | 'Game of the Week'; // idk reps.ru api/model is abyssmal

type IRepsruReplaysProps = { replays: IReplay[] };
const RepsruReplays = ({ replays }: IRepsruReplaysProps) => {
  if (replays.length == 0) return <></>;

  const repsList = replays.map((rep, index) => {
    return (
      <div className="item" key={index}>
        <span className="start"> {'>>'} </span>
        <a
          href={'https://reps.ru/replay/' + rep.id}
          target="_blank"
          rel="noreferrer"
        >
          {rep.title}
        </a>
        <br />
      </div>
    );
  });

  return (
    <div className="repsru_replays">
      <h4>replays.</h4>
      {repsList}
    </div>
  );
};

export default RepsruReplays;
