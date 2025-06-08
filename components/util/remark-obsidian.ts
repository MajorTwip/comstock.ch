import { Plugin } from 'unified'
import { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { Text, Link } from 'mdast'
import { r } from 'framer-motion/dist/types.d-CtuPurYT'

interface RemarkObsidianOptions {
  imagesPath?: string
}

/**
 * Remark plugin to handle Obsidian-style markdown syntax
 * Features like [[wiki links]], ![[embeds]], and more
 * based on the blog https://www.neilmathew.co/posts/nextjs-blog-with-obsidian-as-cms
 */
const remarkObsidian: Plugin<[RemarkObsidianOptions?], Node> = (options = {}) => {
  const imagesPath = options.imagesPath || `/images/`
  return (tree) => {
    visit(tree, 'text', (node: any, index: number, parent: any) => {
      const value = node.value
      // Find text in double brackets
      const imageRegex = /!\[\[([^\]]+)\]\]/g
      if (imageRegex.test(value)) {
        console.log('Obsidian Image found:', node.value)
        // Replace with image node
        node.type = 'image'
        node.url = imagesPath + value.replace(imageRegex, '$1')
      }
    })
  }
}

export default remarkObsidian
