"use client";
import {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";

// TODO Animations for Params
// TODO Content checks
export default function NewList() {
  const [listName, setListName] = useState("");
  const [itemList, setItemList] = useState<Iitem[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [active, setActive] = useState(false)
  // TODO                              ^ read from storage

  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleNameChange = (name: string) => {
    if (name == "")
      setItemList([]);
    setListName(name);
  }

  // Item actions {{{
  interface setItemVars {
    id: number;
    header: "name" | "props";
    value: string | Iitemprops;
  }
  const updateItem = ({id, header, value}: setItemVars) => {
    let updatedList = itemList.map((item) => {
      if (item.id === id) {
        return {...item, [header]: value}
      }
      return item;
    });
    setItemList(updatedList);
  }

  const deleteItem = (item: Iitem) => {
    setItemList((prev) => prev.filter((_) => _ !== item))
  }

  const createItem = () => {
    console.log(itemList)
    setItemList((prev) => ([
      ...prev,
      {
        id: itemList.length === 0 ? 0 : itemList[itemList.length - 1].id + 1,
        name: "",
        props: {}

      }
    ]));
  }
  // }}}

  // Framer motion variants {{{
  const containerVariants = {
    hidden: {
      backgroundColor: "transparent"
    },
    visible: {
      backgroundColor: "#1c1917"
    }
  }
  const buttonVariants = {
    hidden: {
      opacity: 0,
      height: "0px",
      padding: "0px",
      y: "-1rem"
    },
    visible: {
      opacity: 1,
      y: "0rem",
      transition: {
        duration: 0.5,
        ease: [0.65, 0.05, 0.36, 1]
      }
    },
    new: {
      
    }
  }
  // }}}

  // Render {{{
  return (
    <motion.div 
      variants={containerVariants}
      animate={listName === "" ? "hidden" : "visible"}
      className={`flex flex-col bg-stone-900 p-3 rounded items-center container gap-2 lg:w-64`}>


    { /* TODO auto expand? */ }
      <input
        placeholder="New List Name..."
        value={listName}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => handleNameChange(e.target.value)}
        className="block w-full p-2 overflow-hidden text-xl font-bold rounded outline-none bg-stone-800 placeholder:text-stone-500 focus:outline-stone-500" />
      {
        itemList.map((item, i) => {
          return (
            <div key={i} className="flex flex-col w-full gap-2">
              <div className={`flex relative flex-row justify-center gap-2`}>
                <input
                  placeholder="New Item..."
                  value={itemList[i].name}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoFocus
                  onChange={(e) => updateItem({id: item.id, header: "name", value: e.target.value})}
                  className="block w-full h-8 p-2 bg-transparent outline-none peer placeholder:text-stone-500 focus:outline-none" />
                <div className="w-0 peer-focus:w-full absolute bottom-0 left-0 h-[2px] duration-200 bg-stone-500" />
                <div className="relative h-6 rounded-full cursor-pointer group hover:bg-transparent bg-stone-700 aspect-square">
                  <div className="absolute right-0 z-10 flex flex-col gap-1 top-1/2 -translate-y-1/2 group-hover:scale-100 scale-0">
                    <p
                      className="p-1 text-center rounded shadow-md active:scale-90 bg-cyan-800">
                      Details
                    </p>
                    <p 
                      onClick={() => deleteItem(item)}
                      className="p-1 text-center bg-red-800 rounded shadow-xl active:scale-90">
                      Delete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
      { /* TODO turn into div or p */ }
      <motion.input
        variants={buttonVariants}
        animate={listName === "" ? "hidden" : "visible"}
        placeholder="New Item..."
        value={""}
        onClick={createItem}
        className="block w-full h-8 p-2 bg-transparent rounded-l-full outline-none placeholder:text-stone-500" />
      <motion.p
        variants={buttonVariants}
        animate={listName === "" ? "hidden" : "visible"}
        className={`overflow-hidden cursor-pointer active:scale-90 w-full text-center p-2 rounded bg-pink-900`}>
        Add
      </motion.p>
    </motion.div>
  );
  // }}}
}
