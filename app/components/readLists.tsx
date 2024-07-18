"use client";
import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Iitem, Iitemprops, Ilist} from "../utilities/constants";
import axios from "axios";

export default function ReadLists() {
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<Ilist[]>([])


  useEffect(() => {
    handleUpdate();
  }, [])

  // Handlers {{{
  const handleUpdate = () => {
    setLoading(true);
    axios.get("https://66953a884bd61d8314ca986c.mockapi.io/api/lists").then((res) => {
      setLists(res.data);
      setLoading(false);
    });
  }
  // }}}

  // Render {{{
  return (
    <div className="flex flex-col flex-wrap w-full md:flex-row md:justify-center gap-6">
    {lists.map((list, list_i) => {
      return (
        <div key={"list"+list_i}>
          <List list={list} />
        </div>
      )
    })}
    </div>
  );
  // }}}
}

// List component {{{
interface listVars {
  list: Ilist
}
export function List({list}: listVars) {
  const [listName, setListName] = useState(list.name);
  const [itemList, setItemList] = useState<Iitem[]>(list.items);
  const [tagsInput, setTagsInput] = useState<Record<number, string>>({});
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  // Handlers {{{
  const handleNameChange = (name: string) => {
    setListName(name);
  }

  const tagsEdit = (text: string, id: number) => {
    if (!text.split("").find((_) => _ === " ")) {
      setTagsInput((prev) => ({...prev, [id]: text}));
      return;
    }
    setTagsInput((prev) => ({...prev, [id]: ""}));

    const itemprops = itemList.find((item) => item.id === id)!.props;
    const left = text.split(" ")[0]
    const tags: string[] = itemprops.tags
      ? [...itemprops.tags, left]
      : [left]
    updateProps({id, header: "tags", value: tags});
  }

  const removeTag = (item_id: number, tag_id: number) => {
    const itemprops = itemList.find((item) => item.id === item_id)
    if (!itemprops)
      return;
    const tags = itemprops.props.tags;
    tags!.splice(tag_id, 1);
    updateProps({id: item_id, header: "tags", value: tags!});
  }

  const confirmProps = (item_id: number) => {
    const itemprops = itemList.find((item) => item.id === item_id)!.props;
    if (tagsInput[item_id] && tagsInput[item_id] !== "") {
      const left = tagsInput[item_id]
      const tags: string[] = itemprops.tags
        ? [...itemprops.tags, left]
        : [left]
      updateProps({id: item_id, header: "tags", value: tags});
      setTagsInput((prev) => ({...prev, [item_id]: ""}))
    }

    setOpenItems((prev) => ({...prev, [item_id]: false}));
  }

  const handleSend = () => {
    axios.put(`https://66953a884bd61d8314ca986c.mockapi.io/api/lists/${list.id}`, {
      name: listName,
      items: itemList
    });
  }

  const handleDelete = () => {
    axios.delete(`https://66953a884bd61d8314ca986c.mockapi.io/api/lists/${list.id}`).then(() => {
      window.location.reload();
    })
  }
  // }}}

  // Item actions {{{
  interface setItemVars {
    id: number;
    header: "name" | "completed" | "props";
    value: string | boolean | Iitemprops;
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

  interface updatePropsVars {
    id: number;
    header: keyof Iitemprops;
    value: string | string[] | boolean
  }
  const updateProps = ({id, header, value}: updatePropsVars) => {
    let updatedList = itemList.map((item) => {
      if (item.id === id) {
        if (value === "") {
          delete item.props[header];
          return {...item}
        }
        return {...item, props: {...item.props, [header]: value}}
      }
      return item;
    })
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
        completed: false,
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
      pointerEvents: "none",
      opacity: 0,
      height: "0px",
      padding: "0px",
      y: "-1rem"
    },
    visible: {
      opacity: 1,
      pointerEvents: "auto",
      height: "auto",
      y: "0rem",
      transition: {
        duration: 0.5,
        ease: [0.65, 0.05, 0.36, 1]
      }
    },
  }

  const detailsVariants = {
    hidden: {
      pointerEvents: "none",
      opacity: 0,
      height: "0px",
      padding: "0px",
    },
    visible: {
      pointerEvents: "auto",
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        ease: [0.65, 0.05, 0.36, 1]
      }
    }
  }
  // }}}

  // Render {{{
  return (
    <AnimatePresence>
      <div
        className={`flex flex-col w-full md:max-w-96 relative bg-stone-100 dark:border-none border-2 border-stone-300 shadow-xl text-black dark:text-white dark:bg-stone-900 p-3 rounded items-center container gap-2 overflow-hidden`}>

        <input
          placeholder="New List Name..."
          value={listName}
          onChange={(e) => handleNameChange(e.target.value)}
          className="block w-full p-2 overflow-hidden text-xl font-bold rounded outline-none bg-stone-200 dark:bg-stone-800 placeholder:text-stone-500 focus:outline-stone-500" />
        {
          itemList.map((item, i) => {
            return (
              <div key={i} className="flex flex-col w-full py-2 border-b-2 border-stone-300 dark:border-stone-800 gap-1">
                <div className={`flex relative flex-row justify-center items-center gap-1`}>
                  <input
                    type="checkbox"
                    checked={itemList[i].completed}
                    onChange={() => updateItem({id: item.id, header: "completed", value: !itemList[i].completed})}
                    className="h-4 border-[1px] border-pink-900 rounded appearance-none cursor-pointer aspect-square after:content-[''] after:rounded after:absolute after:bg-pink-600 after:-translate-y-[1px] after:-translate-x-[1px] after:h-4 after:opacity-0 checked:after:opacity-100 after:transition-all after:duration-200 after:aspect-square" />
                    {itemList[i].props.priority && (
                      <p className="ml-1 text-xl text-red-700">
                      !
                      </p>
                    )}
                  <input
                    placeholder="New Item..."
                    value={itemList[i].name}
                    autoFocus
                    onChange={(e) => updateItem({id: item.id, header: "name", value: e.target.value})}
                    className="block w-full h-8 p-2 bg-transparent outline-none peer placeholder:text-stone-500 focus:outline-none" />
                  <div className="w-0 peer-focus:w-full absolute bottom-0 left-0 h-[2px] duration-200 bg-stone-400 dark:bg-stone-500" />
                  <div className="relative flex items-center h-6 p-1 rounded-full cursor-pointer group hover:bg-transparent dark:hover:bg-transparent bg-stone-200 dark:bg-stone-700 aspect-square transition-all duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="size-6 stroke-black dark:stroke-white group-hover:stroke-none transition-all duration-150">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <div className="absolute right-0 z-10 flex flex-col gap-4 top-1/2 -translate-y-1/2 group-hover:scale-100 scale-0 transition-all duration-150 origin-right">
                      <p
                        onClick={() => setOpenItems((prev) => ({...prev, [itemList[i].id]: !openItems[itemList[i].id]}))}
                        className="p-1 px-2 text-lg text-center bg-blue-300 rounded shadow-md active:scale-90 dark:bg-cyan-800">
                        Properties
                      </p>
                      <p
                        onClick={() => deleteItem(item)}
                        className="p-1 px-2 text-lg text-center bg-red-300 rounded shadow-xl dark:bg-red-800 active:scale-90">
                        Delete
                      </p>
                    </div>
                  </div>
                </div>
                {itemList[i].props.date && (
                <p className="text-xs text-stone-500">
                  Due: {itemList[i].props.date}
                </p>
                )}
                {itemList[i].props.details && (
                  <p className="mb-1 text-xs text-stone-500">
                  {itemList[i].props.details}
                  </p>
                )}
                <div
                  className="flex flex-row flex-wrap w-full gap-2">
                  {itemList[i].props.tags?.map((tag, _i) => {
                    return (
                      <div
                        className="relative p-1 border-2 rounded group bg-stone-200 border-stone-300 dark:border-none dark:bg-stone-800 text-stone-500"
                        key={"tag" + _i}>
                        #{tag}
                        <div
                          onClick={() => removeTag(itemList[i].id, _i)}
                          className="absolute z-10 flex items-center justify-center h-6 bg-red-700 rounded-full opacity-50 cursor-pointer -top-3 -right-3 transition-all duration-150 group-hover:scale-100 scale-0 aspect-square">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} className="size-5 stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <motion.div
                  // @ts-ignore
                  variants={detailsVariants}
                  initial="hidden"
                  animate={openItems[itemList[i].id] === true ? "visible" : "hidden"}
                  className="flex flex-col rounded gap-1">

                  <label className="flex flex-row items-center gap-2">
                  Priority
                  <input
                    type="checkbox"
                    checked={itemList[i].props.priority}
                    onChange={() => updateProps({id: itemList[i].id, header:"priority", value: !itemList[i].props.priority})}
                    className="h-4 border-[1px] border-red-500 rounded appearance-none cursor-pointer aspect-square after:content-[''] after:rounded after:absolute after:bg-red-500 after:h-4 after:opacity-0 checked:after:opacity-100 after:transition-all after:duration-200 after:aspect-square" />
                  </label>
                  <label>
                    Details
                    <input
                      value={itemList[i].props.details}
                      placeholder="Additional details..."
                      onChange={(e) => updateProps({id: itemList[i].id, header: "details", value: e.target.value})}
                      className="block w-full h-8 p-2 rounded outline-none bg-stone-200 dark:bg-stone-800 peer placeholder:text-stone-500 focus:outline-none" />
                  </label>
                  <label>
                    Tags
                    <input
                      value={tagsInput[itemList[i].id]}
                      placeholder="Add multiple tags..."
                      onChange={(e) => tagsEdit(e.target.value, itemList[i].id)}
                      className="block w-full h-8 p-2 rounded outline-none bg-stone-200 dark:bg-stone-800 peer placeholder:text-stone-500 focus:outline-none" />
                  </label>
                  <label>
                    Due date
                    <input
                      value={itemList[i].props.date}
                      onChange={(e) => updateProps({id: itemList[i].id, header: "date", value: e.target.value})}
                      className="block w-full h-8 p-2 rounded outline-none bg-stone-200 dark:bg-stone-800 peer placeholder:text-stone-500 focus:outline-none"
                      type="date" />
                  </label>
                  <button
                    onClick={() => confirmProps(itemList[i].id)}
                    className="w-full p-1 mt-2 bg-green-300 rounded dark:bg-green-700">
                    Confirm properties
                  </button>
                </motion.div>
              </div>
            )
          })
        }
        <motion.div
            // @ts-ignore
            variants={buttonVariants}
            initial="hidden"
            animate={listName === "" ? "hidden" : "visible"}
          className="flex flex-col w-full gap-2">
          <input
            placeholder="New Item..."
            value={""}
            onClick={createItem}
            className="block w-full h-8 p-2 bg-transparent rounded-l-full outline-none cursor-pointer placeholder:text-stone-500" />
          <div className="flex flex-row gap-2">
          <button
            onClick={() => handleDelete()}
            className={`appearance-none overflow-hidden cursor-pointer active:scale-90 w-full text-center p-2 rounded bg-red-300 dark:bg-red-900`}>
            Delete
          </button>
          <button
            onClick={() => handleSend()}
            className={`appearance-none overflow-hidden cursor-pointer active:scale-90 w-full text-center p-2 rounded bg-pink-300 dark:bg-pink-900`}>
            Update
          </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
  // }}}
}
// }}}
