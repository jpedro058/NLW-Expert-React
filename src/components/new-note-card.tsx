import { ChangeEvent, FormEvent, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";

interface onNoteCreatedProps {
  onNoteCreated: (content: string) => void;
}

let recognition: SpeechRecognition | null;

export function NewNoteCard(props: onNoteCreatedProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");

  function handleShowOnboarding() {
    setShouldShowOnboarding(false);
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
    setContent(event.target.value);
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === "") {
      toast.error("You must write a note before saving it");
      return;
    }

    props.onNoteCreated(content);

    toast.success("Note saved");

    setContent("");
    setShouldShowOnboarding(true);
  }

  function handleStartRecording() {
    setIsRecording(true);
    setShouldShowOnboarding(false);

    const isSpeechRecognitionAvailable =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    if (!isSpeechRecognitionAvailable) {
      toast.error("Speech recognition is not available in your browser");
      setIsRecording(false);
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-GB";
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce((acc, result) => {
        return acc.concat(result[0].transcript);
      }, "");

      setContent(transcript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    recognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (recognition) {
      recognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col text-left bg-slate-800 space-y-3 p-5 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-2xl text-slate-200">Add a new note</span>
        <p className="text-slate-400 text-sm leading-6 ">
          Save an audio note that will be automatically transcribed to text
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="outline-none md:rounded-md bg-slate-700 overflow-hidden z-10 fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh]">
          <Dialog.Close
            className="absolute top-0 right-0 bg-slate-800 p-5 text-slate-400 hover:text-slate-200 
            transition-all duration-200 ease-out
          "
          >
            <X size={24} />
          </Dialog.Close>

          <form>
            <div className=" flex flex-1 flex-col gap-3 p-5">
              <span className="text-base text-slate-200">Add a new note</span>

              {shouldShowOnboarding ? (
                <p className="text-slate-400 text-sm leading-6 ">
                  Start{" "}
                  <button
                    className="text-lime-400 font-medium hover:underline"
                    onClick={handleStartRecording}
                    type="button"
                  >
                    recording an audio
                  </button>{" "}
                  or if you prefer{" "}
                  <button
                    className="text-lime-400 font-medium hover:underline"
                    onClick={handleShowOnboarding}
                    type="button"
                  >
                    you can write a note
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="bg-transparent resize-none text-slate-200 rounded-md text-sm  flex-1 outline-none"
                  placeholder="Write your note here"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                className="flex justify-center items-center fixed bottom-0 w-full bg-slate-900 text-slate-300 text-sm font-medium py-4 outline-none hover:bg-slate-800
            transition-all duration-200 ease-out
          "
                type="submit"
                onClick={handleStopRecording}
              >
                <div className="animate-pulse w-4 h-4 bg-red-400 rounded-full mr-2 inline-block"></div>
                Stop recording
              </button>
            ) : (
              <button
                className="fixed bottom-0 w-full bg-lime-400 text-slate-950 text-sm font-medium py-4 outline-none hover:bg-lime-500
            transition-all duration-200 ease-out
          "
                type="button"
                onClick={handleSaveNote}
              >
                Save note
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
