const HEIGHTS = [
  450, 160, 550, 192, 380, 144, 500, 176, 420, 600,
  160, 480, 208, 144, 520, 176, 390, 570, 192, 144,
  460, 160, 410, 590, 176, 490, 208, 144, 530, 192,
];

const PINS = HEIGHTS.map((height, i) => ({
  id: i + 1,
  height,
  title: `Box ${i + 1}`,
}));

export default function PostGrid() {
  return (
    <div className="grid auto-rows-5 grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {PINS.map((pin) => (
        <div
          key={pin.id}
          style={{ gridRowEnd: `span ${Math.ceil(pin.height / 36)}` }}
          className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl bg-neutral-200/60 transition-all hover:bg-neutral-200"
        >
          <span className="text-sm font-medium text-gray-600">{pin.title}</span>
        </div>
      ))}
    </div>
  );
}