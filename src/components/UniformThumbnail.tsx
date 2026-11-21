import React, { useState } from 'react';
import { Colorway, UniformItem } from '../types/uniform';

interface UniformThumbnailProps {
  item: UniformItem;
  colorway: Colorway;
  className?: string;
}

export const UniformThumbnail: React.FC<UniformThumbnailProps> = ({
  item,
  colorway,
  className = 'w-full h-full',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const hue = colorway.hueDeg ?? 0;
  const sat = colorway.saturate ?? 1;
  const bri = colorway.brightness ?? 1;
  const filterStyle =
    hue !== 0 || sat !== 1 || bri !== 1
      ? `hue-rotate(${hue}deg) saturate(${sat}) brightness(${bri})`
      : undefined;

  if (imgFailed) {
    return (
      <div
        className={`${className} rounded-xl flex flex-col items-center justify-center p-2 text-center`}
        style={{
          background: `linear-gradient(135deg, ${colorway.primary}22 0%, ${colorway.secondary}22 100%)`,
        }}
      >
        <span className="text-xs font-semibold text-slate-800 leading-tight">{item.name}</span>
        <span className="text-[10px] text-slate-500 mt-0.5">{item.sport}</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative flex items-center justify-center overflow-hidden bg-[#DDE2EA]`}>
      <img
        src={item.imageUrl}
        alt={`${item.name} — ${colorway.name}`}
        referrerPolicy="no-referrer"
        draggable={false}
        onError={() => setImgFailed(true)}
        style={{ filter: filterStyle }}
        className="w-full h-full object-cover select-none transition-[filter,transform] duration-300"
      />
    </div>
  );
};
