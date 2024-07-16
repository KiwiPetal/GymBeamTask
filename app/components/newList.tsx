"use client";
import {useEffect, useRef, useState} from "react";

// TODO Animations for Params
// TODO Content checks
export default function NewList() {
  const [listName, setListName] = useState("");
  const [itemList, setItemList] = useState<Iitem[]>([]);
  const [active, setActive] = useState(false)
  // TODO                              ^ read from storage

  type Iitem = {
    id: number,
    name: string,
    props: Iitemprops
  }
  type Iitemprops = {
    details?: string,
    tags?: string[],
    priority?: "1" | "2" | "3"
  }
  const handleFocus = () => {
    setActive(true);
  };
  const handleBlur = () => contentCheck();

  const contentCheck = () => {
    if (listName === "") {
      console.log("Empty")
      return setActive(false);
    } else {
      console.log("not Empty")
    }
  }

  interface setItemVars {
    id: number;
    header: "name" | "props";
    value: string | Iitemprops;
  }
  const setItemValue = ({id, header, value}: setItemVars) => {
    let updatedList = itemList.map((item) => {
      if (item.id === id) {
        return {...item, [header]: value}
      }
      return item;
    });
    setItemList(updatedList);
  }

  const createItem = () => {
    setItemList((prev) => ([
      ...prev,
      {
        id: itemList.length,
        name: "",
        props: {}

      }
    ]));
  }

  return (
    <div className={`flex flex-col items-center container gap-2 lg:w-64`}>


      <input
        placeholder="New List Name..."
        value={listName}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setListName(e.target.value)}
        className="block w-full h-10 p-2 rounded outline-none bg-stone-700 placeholder:text-stone-500 focus:outline-stone-500" />
      {
        itemList.map((item, i) => {
          return (
            <div className={`${!active && "scale-0"}  flex flex-row justify-center gap-2`}>
              <input
                placeholder="New Item..."
                value={itemList[i].name}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoFocus
                onChange={(e) => setItemValue({ id: i, header: "name", value: e.target.value })}
                className="block w-full h-8 p-2 rounded-l-full outline-none bg-stone-700 placeholder:text-stone-500 focus:outline-stone-500" />
              <div
                className="h-8 rounded-r-full cursor-pointer bg-stone-600 aspect-square" />
            </div>
          )
        })
      }
      <div className={`${!active && "scale-0"}  flex flex-row justify-center gap-2`}>
        <input
          placeholder="New Item..."
          onClick={createItem}
          className="block w-full h-8 p-2 rounded-l-full outline-none bg-stone-700 placeholder:text-stone-500" />
        <div
          className="h-8 rounded-r-full cursor-pointer bg-stone-600 aspect-square" />
      </div>
      <p className={`${!active && "scale-0 p-0"} overflow-hidden cursor-pointer active:scale-90 w-full text-center p-2 rounded bg-pink-900`}>
        Add
      </p>
    </div>
  );
}
