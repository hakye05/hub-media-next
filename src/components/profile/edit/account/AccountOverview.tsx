import ReadonlyRow from "../../../ui/fields/ReadOnlyRow";
import StatusText, { type Status } from "../../../ui/StatusText";
import Pane from "../Pane";
import DeleteAccountRow from "./DeleteAccountRow";

type Props = {
  email: string;
  notice: Status;
  onEditEmail: () => void;
  onEditPassword: () => void;
  onDelete: () => void;
};

export default function AccountOverview({
  email,
  notice,
  onEditEmail,
  onEditPassword,
  onDelete,
}: Props) {
  return (
    <Pane title="Account details">
      <div className="flex flex-col gap-5">
        <ReadonlyRow label="Email" editLabel="Change email" onEdit={onEditEmail}>
          {email}
        </ReadonlyRow>

        <ReadonlyRow label="Password" editLabel="Change password" onEdit={onEditPassword}>
          <span className="tracking-widest">••••••••••••</span>
        </ReadonlyRow>

        <StatusText status={notice} />

        <DeleteAccountRow onDelete={onDelete} />
      </div>
    </Pane>
  );
}