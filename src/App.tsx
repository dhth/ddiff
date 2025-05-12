import { useState } from "react";
import Header from "./Header.tsx";
import { type Event, Events } from "./Event.tsx";

const debug = false;

interface Inputs {
  owner: string;
  repo: string;
}

function initInputs(): Inputs {
  return {
    owner: "",
    repo: "",
  };
}

enum InputType {
  Owner,
  Repo,
}

function inputsMissing(inputs: Inputs): boolean {
  return inputs.owner == "" || inputs.repo == "";
}

function eventToString(event: Event): string {
  const createdAt = event.created_at
    ? event.created_at.toLocaleTimeString()
    : "unknown time";

  return `- ${event.type} by @${event.actor.login} at ${createdAt}
`;
}

type FetchResult =
  | { success: true; data: Event[] }
  | { success: false; error: string };

async function fetchEvents(owner: string, repo: string): Promise<FetchResult> {
  // I miss elm/gleam
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/events`,
    );

    if (!response.ok) {
      return {
        success: false,
        error: `non-success response code from Github, status: ${response.status}`,
      };
    }

    const data = await response.json();
    const events = Events.safeParse(data);
    if (!events.success) {
      return { success: false, error: events.error.toString() };
    } else {
      return { success: true, data: events.data };
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected error";

    return { success: false, error: errorMessage };
  }
}

function App() {
  const [inputs, setInputs] = useState(initInputs());
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<FetchResult | null>(null);

  const submitDisabled = fetching || inputsMissing(inputs);

  function inputChangeHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    inputType: InputType,
  ): void {
    switch (inputType) {
      case InputType.Owner:
        return setInputs({ ...inputs, owner: e.target.value });
      case InputType.Repo:
        return setInputs({ ...inputs, repo: e.target.value });
    }
  }

  async function submitHandler(e: React.FormEvent) {
    setFetching(true);
    e.preventDefault();
    fetchEvents(inputs.owner, inputs.repo).then((results) => {
      setFetching(false);
      setResult(results);
    });
  }

  let debugSection;
  if (debug) {
    const debugRepr = `
owner     ${inputs.owner}
repo      ${inputs.repo}
fetching  ${fetching}
`.trim();
    debugSection = (
      <div className="flex flex-col gap-4 px-4 py-2 border-1 border-dashed border-slate-400 border-opacity-20 text-slate-50">
        <p className="text-lg text-amber-400">Debug</p>
        <pre>{debugRepr}</pre>
      </div>
    );
  }

  let resultSection;

  if (result != null) {
    const [borderClass, contents] = result.success
      ? ["border-slate-400", result.data.map(eventToString)]
      : ["border-red-400", result.error];

    resultSection = (
      <div
        className={`flex flex-col gap-4 px-4 py-2 border-1 border-dashed ${borderClass} border-opacity-20 text-slate-50 overflow-x-auto`}
      >
        <pre>{contents}</pre>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-800">
        <div className="py-10 flex flex-col gap-6 w-2/3 max-sm:w-full max-sm:px-4 mx-auto">
          <Header />
          {debugSection}
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-6 px-4 py-6 border-1 border-dashed border-slate-400 border-opacity-20">
              <div className="flex gap-4 items-center">
                <label
                  className="text-rose-400 font-semibold py-1"
                  htmlFor="owner"
                >
                  owner?
                </label>
                <input
                  id="base"
                  className="outline-slate-400 outline-1 outline-dashed text-white px-2 w-sm py-1"
                  placeholder="gleam-lang"
                  autoComplete="off"
                  value={inputs.owner}
                  onChange={(e) => inputChangeHandler(e, InputType.Owner)}
                ></input>
              </div>

              <div className="flex gap-4 items-center">
                <label
                  className="text-rose-400 font-semibold py-1"
                  htmlFor="repo"
                >
                  repo?
                </label>
                <input
                  id="repo"
                  className="outline-slate-400 outline-1 outline-dashed text-white px-2 py-1 w-sm"
                  placeholder="gleam"
                  autoComplete="off"
                  value={inputs.repo}
                  onChange={(e) => inputChangeHandler(e, InputType.Repo)}
                ></input>
              </div>

              <button
                className="bg-lime-300 hover:bg-lime-200 disabled:bg-slate-400 px-4 py-1 font-semibold self-start"
                disabled={submitDisabled}
              >
                Get results
              </button>
            </div>
          </form>
          {resultSection}
        </div>
      </div>
    </>
  );
}

export default App;
