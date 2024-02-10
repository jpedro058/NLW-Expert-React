import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { enGB } from "date-fns/locale";
import { X } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string;
    content: string;
    date: Date;
  };

  onNoteDeleted: (id: string) => void;
}

export default function NoteCard(props: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col text-left bg-slate-800 space-y-3 p-5 overflow-hidden outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-base text-slate-200">
          {formatDistanceToNow(props.note.date, {
            addSuffix: true,
            locale: enGB,
          })}
        </span>
        <p className="text-slate-400 text-sm leading-6 ">
          {props.note.content}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none"></div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="outline-none md:rounded-md bg-slate-700 overflow-hidden z-10 inset-0 md:inset-auto fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh]">
          <Dialog.Close
            className="absolute top-0 right-0 bg-slate-800 p-5 text-slate-400 hover:text-slate-200 
            transition-all duration-200 ease-out
          "
          >
            <X size={24} />
          </Dialog.Close>

          <div className="flex-1 flex-col gap-3 p-5">
            <span className="text-base text-slate-200">
              {formatDistanceToNow(props.note.date, {
                addSuffix: true,
                locale: enGB,
              })}
            </span>
            <p className="text-slate-400 text-sm leading-6 ">
              {props.note.content}
            </p>
          </div>

          <button
            className="fixed bottom-0 w-full bg-slate-800 text-slate-300 text-sm font-medium py-4 outline-none group "
            onClick={() => props.onNoteDeleted(props.note.id)}
          >
            Do you{" "}
            <span className="text-red-400 group-hover:underline">
              want to delete this note{" "}
            </span>{" "}
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
