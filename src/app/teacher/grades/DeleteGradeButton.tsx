import { deleteGrade } from "../actions";
import { Trash2 } from "lucide-react";

export default function DeleteGradeButton({ id }: { id: string }) {
    return (
        <form action={deleteGrade.bind(null, id)}>
            <button type="submit" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
            </button>
        </form>
    );
}
