import { nanoid } from "nanoid"
import * as AST from "../ast"
import { replaceFromLists } from "./replace"
import { getNodeById } from "../visit"
export const updateQuantifier = (
  ast: AST.Regex,
  selectedId: string,
  quantifier: AST.Quantifier | null
) => {
  let nextSelectedId = selectedId
  const { node, nodeList } = getNodeById(ast, selectedId)
  if (
    node.type === "character" &&
    node.kind === "string" &&
    node.value.length > 1
  ) {
    const groupNode: AST.GroupNode = {
      id: nanoid(),
      type: "group",
      kind: "nonCapturing",
      children: [node],
      quantifier,
    }
    nextSelectedId = groupNode.id
    replaceFromLists(nodeList, [node], [groupNode])
  } else if (node.type === "character" || node.type === "group") {
    node.quantifier = quantifier
  }
  return nextSelectedId
}

export const getQuantifierText = (quantifier: AST.Quantifier): string => {
  let { min, max } = quantifier
  let minText = `${min}`
  let maxText = `${max}`
  if (min === max) {
    return minText
  }
  if (max === Infinity) {
    maxText = "∞"
  }
  return minText + " - " + maxText
}
