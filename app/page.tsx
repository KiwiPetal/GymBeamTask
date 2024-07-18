import Config from "./components/config";
import NewList from "./components/newList"
import ReadLists from "./components/readLists";

export default function Home() {
  return (
    <main className="z-20 flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-white to-stone-200 dark:from-black dark:to-stone-950 gap-4">
      <Config />
      <NewList />
      <ReadLists />
      <div className="fixed bottom-0 flex items-center justify-center w-full h-10 text-lg font-bold text-stone-400 dark:text-stone-700 bg-stone-200/25 dark:bg-stone-900/25 backdrop-blur-md">
      <a href="https://github.com/KiwiPetal/GymBeamTask"
        className="appearance-none cursor-pointer">
      Repo of this project
      </a>
      </div>
    </main>
  );
}
