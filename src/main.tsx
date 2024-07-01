import "@logseq/libs";

async function determineBlockId(block_id?: string) {
  if (block_id) {
    return block_id
  }

  const block = await logseq.Editor.getCurrentBlock()
  if (block) {
    return block.uuid
  }

  const blocks = await logseq.Editor.getSelectedBlocks()
  if (blocks && blocks.length > 0) {
    return blocks[0].uuid
  }

  throw new Error("could not determine current block id")
}

async function toggleHeading(block_id?: string) {
  block_id = await determineBlockId(block_id)
  console.log(`toggle heading: ${block_id}`)

  const currentValue: boolean = await logseq.Editor.getBlockProperty(block_id, "heading")
  await logseq.Editor.upsertBlockProperty(block_id, "heading", !currentValue)
}

async function main() {
  const commandLabel = "Toggle Heading"
  logseq.Editor.registerSlashCommand(commandLabel, async () => { await toggleHeading() })

  logseq.App.registerCommandPalette(
    {
      key: "toggle-heading",
      label: commandLabel,
      keybinding: {
        mode: 'global',
        binding: 'mod+1',
      },
    },
    async () => { await toggleHeading()}
  )

  // No block context menu item until I'm confident Logseq will hand me the correct block.
}

logseq.ready(main).catch(console.error)
