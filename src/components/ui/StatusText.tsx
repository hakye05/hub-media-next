export type Status = { type: "error" | "success"; text: string } | null;

export default function StatusText({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p
      className={`px-1 text-[13px] ${
        status.type === "error" ? "text-red-500" : "text-green-600"
      }`}
    >
      {status.text}
    </p>
  );
}