export type Iitem = {
  id: number,
  name: string,
  completed: boolean,
  props: Iitemprops
}
export type Iitemprops = {
  details?: string,
  tags?: string[],
  date?: string,
  priority?: boolean
}

export type Ilist = {
  name: string,
  id: number,
  items: Iitem[]
}
