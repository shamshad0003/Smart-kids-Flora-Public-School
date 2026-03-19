import { deleteAssignment } from "../actions";
import { Trash2 } from "lucide-react";

export default function DeleteAssignmentButton({ id }: { id: string }) {
    return (
        <form action={async () => { await deleteAssignment(id); }}>
            <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
            </button>
        </form>
    );
}
