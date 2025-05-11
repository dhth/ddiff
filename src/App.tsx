import Header from "./Header.tsx";

function App() {
  return (
    <>
      <div className="min-h-screen bg-zinc-800">
        <div className="w-2/3 max-sm:w-full max-sm:px-4 mx-auto">
          <Header />
          <form>
            <div className="mt-6 flex flex-col gap-6 px-4 py-6 border-1 border-dashed border-slate-400 border-opacity-20">
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
                  placeholder="owner/repo"
                  autoComplete="off"
                ></input>
              </div>

              <div className="flex gap-4 items-center">
                <label
                  className="text-rose-400 font-semibold py-1"
                  htmlFor="basehead"
                >
                  basehead?
                </label>
                <input
                  id="basehead"
                  className="outline-slate-400 outline-1 outline-dashed text-white px-2 w-sm py-1"
                  placeholder="basehead"
                  autoComplete="off"
                ></input>
              </div>

              <button className="bg-lime-300 hover:bg-lime-200 px-4 py-1 font-semibold self-start cursor-pointer">
                Get results
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
