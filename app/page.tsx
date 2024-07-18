import Config from "./components/config";
import NewList from "./components/newList"
import ReadLists from "./components/readLists";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-white to-stone-200 dark:from-black dark:to-stone-950 gap-4">
      <Config />
      <NewList />
      <ReadLists />
    </main>
  );
}
